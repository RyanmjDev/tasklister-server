
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Task = require('../models/Task');

// Get all tasks
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ completed: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a task
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { description } = req.body;
  try {
    const newTask = new Task({
      description,
      user: req.user.id,
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update a task
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title, description, completed } = req.body;
  const updatedTask = { title, description, completed };

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updatedTask },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a task
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const task = await Task.findOneAndRemove({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
