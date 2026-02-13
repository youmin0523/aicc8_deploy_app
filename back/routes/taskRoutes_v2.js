const router = require('express').Router();
const taskControllers = require('../controllers/taskControllers_v2');

router.get('/get_tasks_v2/:userId', taskControllers.getTasksV2);
router.post('/post_task_v2', taskControllers.postTaskV2);
router.put('/update_task_v2', taskControllers.updateTaskV2);
router.patch(
  '/update_completed_task_v2',
  taskControllers.updateCompletedTaskV2,
);
router.delete('/delete_task_v2/:itemId', taskControllers.deleteTaskV2);
router.get('/get_task_history_v2/:taskId', taskControllers.getTaskHistoryV2);

module.exports = router;
