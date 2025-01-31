const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/:userEmail', taskController.getTasks);
router.post('/', taskController.addTask);
router.delete('/:id', taskController.deleteTask);
router.put('/reorder', taskController.updateTaskOrder);
router.put('/complete', taskController.completeTask);
router.put('/updateDueDate', taskController.updateDueDate); // New route

module.exports = router;
