const router = require('express').Router();
const categoryControllers = require('../controllers/categoryControllers_v2');

router.get('/get_categories/:userId', categoryControllers.getCategories);
router.post('/post_category', categoryControllers.postCategory);
router.put('/update_category', categoryControllers.updateCategory);
router.delete('/delete_category/:itemId', categoryControllers.deleteCategory);

module.exports = router;
