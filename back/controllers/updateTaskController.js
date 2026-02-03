const database = require('../database/database');

exports.updateCompletedTask = async (request, response) => {
  const { isCompleted, itemId } = request.body;

  // console.log(isCompleted, itemId);
  try {
    await database.pool.query(
      'UPDATE tasks SET isCompleted = $1 WHERE _id = $2',
      [isCompleted, itemId],
    );
    return response
      .status(200)
      .json({ msg: 'Update Completed Task Successfully' });
  } catch (error) {
    return response
      .status(500)
      .json({ msg: 'Update Completed Task Failed: ', error });
  }
};
