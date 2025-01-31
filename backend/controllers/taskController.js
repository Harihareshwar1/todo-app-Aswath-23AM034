const Task = require('../models/Task');

// Get tasks for a user
exports.getTasks = async (req, res) => {
    try {
        const { userEmail } = req.params;
        const tasks = await Task.find({ userEmail, completed: false }).sort({ order: 1 });
        const completedTasks = await Task.find({ userEmail, completed: true }).sort({ order: 1 });
        res.json({ tasks, completedTasks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};

// Add a new task
exports.addTask = async (req, res) => {
    try {
        const { userEmail, title, deadline } = req.body;
        const count = await Task.countDocuments({ userEmail });
        const task = new Task({ 
            userEmail, 
            title, 
            deadline: new Date(deadline), // Convert to Date object
            order: count + 1 
        });
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error adding task", error });
    }
};

// Update a task's due date
exports.updateDueDate = async (req, res) => {
    try {
        const { taskId, deadline } = req.body;
        await Task.findByIdAndUpdate(taskId, { deadline: new Date(deadline) });
        res.json({ message: "Task due date updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating due date", error });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
};

// Move task up/down
exports.updateTaskOrder = async (req, res) => {
    try {
        const { userEmail, taskId, direction } = req.body;
        const tasks = await Task.find({ userEmail }).sort({ order: 1 });
        const index = tasks.findIndex(task => task._id.toString() === taskId);
        if (index === -1) return res.status(404).json({ message: "Task not found" });

        let swapIndex;
        if (direction === "up" && index > 0) {
            swapIndex = index - 1;
        } else if (direction === "down" && index < tasks.length - 1) {
            swapIndex = index + 1;
        } else {
            return res.status(400).json({ message: "Cannot move task in this direction" });
        }

        // Swap order values
        const tempOrder = tasks[index].order;
        tasks[index].order = tasks[swapIndex].order;
        tasks[swapIndex].order = tempOrder;

        await tasks[index].save();
        await tasks[swapIndex].save();

        res.json({ message: "Task order updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating task order", error });
    }
};

// Mark task as completed
exports.completeTask = async (req, res) => {
    try {
        const { taskId } = req.body;
        await Task.findByIdAndUpdate(taskId, { completed: true });
        res.json({ message: "Task marked as completed" });
    } catch (error) {
        res.status(500).json({ message: "Error marking task as completed", error });
    }
};
