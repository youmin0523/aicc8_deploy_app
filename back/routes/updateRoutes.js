const router = require('express').Router();
const {
  updateCompletedTask,
  updateTask,
} = require('../controllers/updateTaskController');

router.patch('/update_completed_task', updateCompletedTask);
router.put('/update_task', updateTask);

module.exports = router;
