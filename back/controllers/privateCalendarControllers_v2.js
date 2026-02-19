const database = require('../database/database');
const { v4: uuidv4 } = require('uuid');

// //* [Mentor's Insight: Private Calendar Controllers]
// //* 본 컨트롤러는 개인의 지극히 사적인 데이터(일기, 습관)를 다룹니다.
// //* 보안과 데이터 무결성이 최우선이며, 특히 습관의 경우 날짜 기반의 로그 관리가 핵심입니다.

// --- 1. Diary 관련 로직 ---

/**
 * 특정 날짜의 다이어리 조회 (또는 생성/수정용 Upsert)
 */
exports.getDiaryByDate = async (req, res) => {
  const { userId, date } = req.query; // date: 'YYYY-MM-DD'
  try {
    const query = `SELECT * FROM private_diaries WHERE userId = $1 AND entry_date = $2::DATE`;
    const result = await database.pool.query(query, [userId, date]);
    return res.status(200).json(result.rows[0] || null);
  } catch (err) {
    console.error('Get Diary Error:', err);
    return res
      .status(500)
      .json({ msg: '다이어리 조회 실패', error: err.message });
  }
};

/**
 * 다이어리 저장 (Upsert 로직)
 */
exports.saveDiary = async (req, res) => {
  const { _id, userId, entry_date, content, images } = req.body;
  try {
    // ID가 없으면 신규 생성, 있으면 업데이트
    let query;
    let params;

    if (_id) {
      query = `
                UPDATE private_diaries 
                SET content = $1, images = $2, updated_at = CURRENT_TIMESTAMP 
                WHERE _id = $3 AND userId = $4
            `;
      params = [content, JSON.stringify(images), _id, userId];
      await database.pool.query(query, params);
      return res.status(200).json({ msg: '다이어리 수정 완료', id: _id });
    } else {
      const newId = uuidv4();
      query = `
                INSERT INTO private_diaries (_id, userId, entry_date, content, images) 
                VALUES ($1, $2, $3, $4, $5)
            `;
      params = [newId, userId, entry_date, content, JSON.stringify(images)];
      await database.pool.query(query, params);
      return res.status(201).json({ msg: '다이어리 생성 완료', id: newId });
    }
  } catch (err) {
    console.error('Save Diary Error:', err);
    return res.status(500).json({ msg: '다이어리 저장 실패' });
  }
};

// --- 2. Habit 관련 로직 ---

/**
 * 사용자의 모든 습관 조회 (+ 오늘 달성 여부 포함)
 */
exports.getHabits = async (req, res) => {
  const { userId, date } = req.query; // date: 오늘 날짜 기준
  try {
    const query = `
            SELECT h.*, 
            (SELECT is_completed FROM private_habit_logs l WHERE l.habitId = h._id AND l.check_date = $2::DATE) as is_completed
            FROM private_habits h 
            WHERE h.userId = $1 AND h.is_active = true
            ORDER BY h.created_at ASC
        `;
    const result = await database.pool.query(query, [userId, date]);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Get Habits Error:', err);
    return res
      .status(500)
      .json({ msg: '습관 리스트 조회 실패', error: err.message });
  }
};

/**
 * 신규 습관 등록
 */
exports.postHabit = async (req, res) => {
  const {
    userId,
    habit_name,
    start_time,
    end_time,
    repeat_type,
    repeat_days,
    goal_start_date,
    goal_end_date,
    reminder_time,
  } = req.body;
  const _id = uuidv4();
  try {
    const query = `
            INSERT INTO private_habits (
                _id, userId, habit_name, start_time, end_time, 
                repeat_type, repeat_days, goal_start_date, goal_end_date, reminder_time
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
    await database.pool.query(query, [
      _id,
      userId,
      habit_name,
      start_time,
      end_time,
      repeat_type,
      repeat_days,
      goal_start_date,
      goal_end_date,
      reminder_time,
    ]);
    return res.status(201).json({ msg: '습관 등록 완료', id: _id });
  } catch (err) {
    console.error('Post Habit Error:', err);
    return res.status(500).json({ msg: '습관 등록 실패' });
  }
};

/**
 * 습관 달성 체크/취소
 */
exports.toggleHabitCheck = async (req, res) => {
  const { habitId, date, isCompleted } = req.body;
  try {
    if (isCompleted) {
      const _id = uuidv4();
      const query = `
                INSERT INTO private_habit_logs (_id, habitId, check_date, is_completed) 
                VALUES ($1, $2, $3, true)
                ON CONFLICT (habitId, check_date) DO NOTHING
            `;
      await database.pool.query(query, [_id, habitId, date]);
    } else {
      const query = `DELETE FROM private_habit_logs WHERE habitId = $1 AND check_date = $2`;
      await database.pool.query(query, [habitId, date]);
    }
    return res.status(200).json({ msg: '습관 상태 변경 완료' });
  } catch (err) {
    return res.status(500).json({ msg: '습관 상태 변경 실패' });
  }
};

// --- 3. Schedule 관련 로직 ---

/**
 * 사용자의 모든 일정 조회
 */
exports.getSchedules = async (req, res) => {
  const { userId } = req.query;
  try {
    const query = `
            SELECT * FROM private_schedules 
            WHERE userId = $1 
            ORDER BY start_date ASC
        `;
    const result = await database.pool.query(query, [userId]);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Get Schedules Error:', err);
    return res
      .status(500)
      .json({ msg: '일정 목록 조회 실패', error: err.message });
  }
};

/**
 * 신규 일정 등록
 */
exports.postSchedule = async (req, res) => {
  const {
    userId,
    title,
    start_date,
    end_date,
    is_anniversary,
    repeat_type,
    place,
    description,
    attachments,
  } = req.body;
  const _id = uuidv4();
  try {
    const query = `
            INSERT INTO private_schedules (
                _id, userId, title, start_date, end_date, 
                is_anniversary, repeat_type, place, description, attachments
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
    await database.pool.query(query, [
      _id,
      userId,
      title,
      start_date,
      end_date,
      is_anniversary,
      repeat_type,
      place,
      description,
      JSON.stringify(attachments || []),
    ]);
    return res.status(201).json({ msg: '일정 등록 완료', id: _id });
  } catch (err) {
    console.error('Post Schedule Error:', err);
    return res.status(500).json({ msg: '일정 등록 실패' });
  }
};
