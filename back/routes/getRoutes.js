const router = require('express').Router();
const { getTasks } = require('../controllers/getControllers');

// :userId -> 정해지지 않은 문자열을 params에 전달한다.
router.get('/get_tasks/:userId', getTasks);

module.exports = router;
