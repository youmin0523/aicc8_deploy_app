const database = require('../database/database');
const { v4: uuidv4 } = require('uuid');

// 1. 카테고리 목록 조회
exports.getCategories = async (request, response) => {
  const userId = request.params.userId;
  try {
    const result = await database.pool.query(
      'SELECT * FROM categories WHERE userid = $1 ORDER BY created_at ASC',
      [userId],
    );
    return response.status(200).json(result.rows);
  } catch (error) {
    console.error('[BACKEND ERROR] Get Categories:', error);
    return response
      .status(500)
      .json({ msg: `카테고리 조회 중 오류가 발생했습니다: ${error.message}` });
  }
};

// 2. 카테고리 생성
exports.postCategory = async (request, response) => {
  const _id = uuidv4();
  const { name, color, userId } = request.body;

  try {
    await database.pool.query(
      'INSERT INTO categories (_id, name, color, userid) VALUES ($1, $2, $3, $4)',
      [_id, name, color, userId],
    );
    return response
      .status(201)
      .json({ msg: '카테고리가 생성되었습니다.', categoryId: _id });
  } catch (error) {
    console.error('[BACKEND ERROR] Post Category:', error);
    return response
      .status(500)
      .json({ msg: `카테고리 생성 실패: ${error.message}` });
  }
};

// 3. 카테고리 수정
exports.updateCategory = async (request, response) => {
  const { _id, name, color } = request.body;

  try {
    await database.pool.query(
      'UPDATE categories SET name = $1, color = $2 WHERE _id = $3',
      [name, color, _id],
    );
    return response.status(200).json({ msg: 'Category Updated Successfully' });
  } catch (error) {
    return response
      .status(500)
      .json({ msg: `Update Category Failed: ${error}` });
  }
};

// 4. 카테고리 삭제
exports.deleteCategory = async (request, response) => {
  const itemId = request.params.itemId;

  try {
    await database.pool.query('DELETE FROM categories WHERE _id = $1', [
      itemId,
    ]);
    return response.status(200).json({ msg: 'Category Deleted Successfully' });
  } catch (error) {
    return response
      .status(500)
      .json({ msg: `Delete Category Failed: ${error}` });
  }
};
