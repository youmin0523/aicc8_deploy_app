const express = require('express');
const router = express.Router();
const privateCalendarController = require('../controllers/privateCalendarControllers_v2');

// //* [Private Calendar API Spec]

// 1. 다이어리 관련
router.get('/api/v2/private/diary', privateCalendarController.getDiaryByDate);
router.post('/api/v2/private/diary', privateCalendarController.saveDiary);

// 2. 습관 관련
router.get('/api/v2/private/habits', privateCalendarController.getHabits);
router.post('/api/v2/private/habits', privateCalendarController.postHabit);
router.post(
  '/api/v2/private/habits/toggle',
  privateCalendarController.toggleHabitCheck,
);

// 3. 일정 관련
router.get('/api/v2/private/schedules', privateCalendarController.getSchedules);
router.post(
  '/api/v2/private/schedules',
  privateCalendarController.postSchedule,
);

module.exports = router;
