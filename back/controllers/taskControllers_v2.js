const database = require('../database/database');
const { v4: uuidv4 } = require('uuid');

// //* [Mentor's Encyclopedia: taskControllers_v2 (Backend)]
// //* 1. 데이터 소스 (Data Source): PostgreSQL DB ('tasks' - V1용, 'tasks_v2' - V2용).
// //* 2. 런타임 환경 (Runtime): Node.js + Express (Back-end)
// //* 3. 핵심 기술 (Core Tech): UUID v4 고유 아이디 생성, UNION ALL 데이터 결합.
// //* 4. 구현 원리:
// //*    - // //! [Original Logic] 새로운 기능(V2)을 만들 때 기존 기능(V1)의 API를 완전히 새로 만들어야 했음.
// //*    - // //* [Modified Logic] '하이브리드 아키텍처'를 채택하여, V1과 V2 데이터를 동시에 관리하는 중복 로직 구현(v2.97).

// //* [Added Code] 작업 이력 기록 함수 (Audit Log)
const MAX_Retries = 3;

// //* [Added Code] 작업 이력 기록 함수 (Audit Log)
const logTaskChange = async (taskId, type, message) => {
  try {
    const _id = uuidv4();
    await database.pool.query(
      `INSERT INTO task_logs (_id, taskId, changeType, logMessage) VALUES ($1, $2, $3, $4)`,
      [_id, taskId, type, message],
    );
  } catch (err) {
    // 로깅 실패가 메인 트랜잭션을 방해하지 않도록 에러를 삼키고 콘솔에만 기록
    console.error('Audit Logging skipped:', err.message);
  }
};

// //* [Modified Code] V1+V2 통합 조회

exports.getTasksV2 = async (request, response) => {
  const userId = request.params.userId;
  try {
    // //* [Modified Code] 마감일순(due_date ASC)에서 생성일 최신순(created_at DESC)으로 정렬 기준 변경
    const query = `
      SELECT * FROM (
        SELECT t._id, t.title, t.description, t.due_date, t.iscompleted, t.isimportant, t.categoryid, t.userid, t.created_at, t.updated_at, 
               c.name as categoryname, c.color as categorycolor 
        FROM tasks_v2 t
        LEFT JOIN categories c ON t.categoryid = c._id
        WHERE t.userid = $1
        UNION ALL
        SELECT _id, title, description, date::timestamp as due_date, iscompleted, isimportant, NULL as categoryid, userid, created_at, updated_at, 
               'V1 Task' as categoryname, '#888888' as categorycolor 
        FROM tasks
        WHERE userid = $1
      ) combined
      ORDER BY created_at DESC
    `;
    const result = await database.pool.query(query, [userId]);
    return response.status(200).json(result.rows);
  } catch (err) {
    return response.status(500).json({ msg: 'Get Tasks Failed' });
  }
};

exports.postTaskV2 = async (request, response) => {
  const {
    title,
    description,
    due_date,
    isCompleted,
    isImportant,
    categoryId,
    userId,
  } = request.body;
  const _id = uuidv4();
  try {
    const formattedDate = due_date.replace('T', ' ');
    const query = `
      INSERT INTO tasks_v2 (_id, title, description, due_date, iscompleted, isimportant, categoryid, userid) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await database.pool.query(query, [
      _id,
      title,
      description,
      formattedDate,
      isCompleted,
      isImportant,
      categoryId,
      userId,
    ]);

    // //* [Added Code] 생성 이력 기록
    await logTaskChange(_id, 'CREATE', 'New mission initialized');

    return response.status(201).json({ msg: 'V2 생성 완료', id: _id });
  } catch (err) {
    return response.status(500).json({ msg: 'Create Failed' });
  }
};

// //* [Modified Code] V1 -> V2 자동 승격(Migration) 로직 포함
exports.updateTaskV2 = async (request, response) => {
  const {
    _id,
    title,
    description,
    due_date,
    isCompleted,
    isImportant,
    categoryId,
  } = request.body;
  const formattedDate = due_date.replace('T', ' ');

  try {
    const oldTaskRes = await database.pool.query(
      'SELECT * FROM tasks_v2 WHERE _id = $1',
      [_id],
    );
    const oldTask = oldTaskRes.rows[0];

    const v2Res = await database.pool.query(
      `UPDATE tasks_v2 SET title=$1, description=$2, due_date=$3, iscompleted=$4, isimportant=$5, categoryid=$6 WHERE _id=$7`,
      [
        title,
        description,
        formattedDate,
        isCompleted,
        isImportant,
        categoryId,
        _id,
      ],
    );

    if (v2Res.rowCount > 0 && oldTask) {
      // //* [Added Code] 변경 사항 감지 및 로깅
      const changes = [];
      if (oldTask.title !== title)
        changes.push(`Title: "${oldTask.title}" -> "${title}"`);
      if (oldTask.description !== description)
        changes.push('Description modified');
      if (oldTask.isimportant !== isImportant)
        changes.push(
          isImportant ? 'Marked as Important' : 'Unmarked Important',
        );
      if (oldTask.iscompleted !== isCompleted)
        changes.push(
          isCompleted ? 'Mission Accomplished' : 'Mission Re-opened',
        );

      if (changes.length > 0) {
        await logTaskChange(_id, 'UPDATE', changes.join(' | '));
      }
    }

    if (v2Res.rowCount === 0) {
      if (categoryId) {
        // //* [Modified Code] 카테고리가 부여되면 V1을 삭제하고 V2로 이관한다.
        const v1User = await database.pool.query(
          'SELECT userid FROM tasks WHERE _id = $1',
          [_id],
        );
        if (v1User.rows.length > 0) {
          const userId = v1User.rows[0].userid;
          await database.pool.query('DELETE FROM tasks WHERE _id = $1', [_id]);
          await database.pool.query(
            `INSERT INTO tasks_v2 (_id, title, description, due_date, iscompleted, isimportant, categoryid, userid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              _id,
              title,
              description,
              formattedDate,
              isCompleted,
              isImportant,
              categoryId,
              userId,
            ],
          );
          await logTaskChange(
            _id,
            'UPGRADE',
            'Task upgraded from V1 to V2 with category assignment',
          );
          return response.status(200).json({ msg: 'Upgraded to V2' });
        }
      } else {
        await database.pool.query(
          `UPDATE tasks SET title=$1, description=$2, date=$3, iscompleted=$4, isimportant=$5 WHERE _id=$6`,
          [
            title,
            description,
            due_date.split('T')[0],
            isCompleted,
            isImportant,
            _id,
          ],
        );
      }
    }
    return response.status(200).json({ msg: 'Update Done' });
  } catch (err) {
    return response.status(500).json({ msg: 'Update Failed' });
  }
};

exports.deleteTaskV2 = async (request, response) => {
  const itemId = request.params.itemId;
  try {
    const resV2 = await database.pool.query(
      'DELETE FROM tasks_v2 WHERE _id = $1',
      [itemId],
    );
    if (resV2.rowCount === 0)
      await database.pool.query('DELETE FROM tasks WHERE _id = $1', [itemId]);
    return response.status(200).json({ msg: 'Delete Done' });
  } catch (err) {
    return response.status(500).json({ msg: 'Delete Failed' });
  }
};

exports.updateCompletedTaskV2 = async (request, response) => {
  const { itemId, isCompleted } = request.body;
  try {
    const resV2 = await database.pool.query(
      'UPDATE tasks_v2 SET iscompleted = $1 WHERE _id = $2',
      [isCompleted, itemId],
    );
    if (resV2.rowCount > 0) {
      /* await logTaskChange(
        itemId,
        'STATUS',
        isCompleted ? 'Marked as Done (Orb/Panel)' : 'Returned to Pending',
      ); */
    } else {
      // V2에 없으면 V1 업데이트 시도 (Fall-back)
      const resV1 = await database.pool.query(
        'UPDATE tasks SET iscompleted = $1 WHERE _id = $2',
        [isCompleted, itemId],
      );
      if (resV1.rowCount === 0) {
        console.warn(`Task ${itemId} not found in V1 or V2`);
        return response.status(404).json({ msg: 'Task Not Found' });
      }
    }

    return response.status(200).json({ msg: 'Status Fixed' });
  } catch (err) {
    console.error('Update Completed Status Error:', err);
    return response.status(500).json({ msg: 'Fix Failed', error: err.message });
  }
};

exports.getTaskHistoryV2 = async (request, response) => {
  const taskId = request.params.taskId;
  try {
    const result = await database.pool.query(
      'SELECT * FROM task_logs WHERE taskId = $1 ORDER BY updated_at DESC',
      [taskId],
    );
    return response.status(200).json(result.rows);
  } catch (err) {
    return response.status(500).json({ msg: 'Get History Failed' });
  }
};
