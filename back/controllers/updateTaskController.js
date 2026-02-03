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

exports.updateTask = async (request, response) => {
  const { title, description, date, isCompleted, isImportant, _id } =
    request.body;
  // console.log(title, description, date, isCompleted, isImportant, _id);
  try {
    await database.pool.query(
      'UPDATE tasks SET title=$1, description=$2, date=$3, isCompleted=$4, isImportant=$5 WHERE _id = $6',
      [title, description, date, isCompleted, isImportant, _id],
    );
    return response.status(200).json({ msg: 'Task Updated Successfully' });
  } catch (error) {
    return response.status(500).json({ msg: 'Task Update Failed: ', error });
  }
};
