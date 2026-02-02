const database = require('../database/database');

exports.getTasks = async (request, response) => {
  const userId = request.params.userId;
  // console.log(userId);
  try {
    const result = await database.pool.query(
      'SELECT * FROM tasks WHERE userId = $1 ORDER BY created_at DESC',
      [userId],
    );
    return response.status(200).json(result.rows);
  } catch (error) {
    return response.status(500).json({ message: `Get tasks Error: ${error}` });
  }
};
