const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    deadline: { type: Date, required: true },
    order: { type: Number, required: true },
    completed: { type: Boolean, default: false } // New field for completed tasks
});

module.exports = mongoose.model('Task', taskSchema);
