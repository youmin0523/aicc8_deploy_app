const router = require('express').Router();
const { updateCompletedTask } = require('../controllers/updateTaskController');

router.patch('/update_completed_task', updateCompletedTask);

module.exports = router;
