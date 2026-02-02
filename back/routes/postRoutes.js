const router = require('express').Router();
const { postTask } = require('../controllers/postTaskController');

router.post('/post_task', postTask);

module.exports = router;
