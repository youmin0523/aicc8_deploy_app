const database = require('../database/database');

exports.deleteTasks = async (request, response) => {
  const itemId = request.params.itemId;
  // console.log(itemId);
  try {
    await database.pool.query('DELETE FROM tasks WHERE _id = $1', [itemId]);
    return response.status(200).json({ msg: 'Task Deleted Successfully' });
  } catch (error) {
    return response.status(500).json({ msg: `Delete Task Error: ${error}` });
  }
};
