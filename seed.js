const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  await User.deleteMany({});
  await Task.deleteMany({});

  // User data
  const usersData = [
    {
      email: 'user1@tasklister.com',
      password: 'password1',
    },
    {
      email: 'user2@tasklister.com',
      password: 'password2',
    },
    {
      email: 'user3@tasklister.com',
      password: 'password3',
    },
  ];

  // Task data
  const tasksData = [
    {
      user: null,
      description: 'Buy groceries',
      completed: false,
    },
    {
      user: null,
      description: 'Finish project',
      completed: true,
    },
    {
      user: null,
      description: 'Walk the dog',
      completed: false,
    },
  ];

  // Create and save users
  const users = [];
  for (const userData of usersData) {
    const user = await User.create({ email: userData.email, password: userData.password });
    users.push(user);
  }

  
  // Assign tasks to users and save tasks
  for (let i = 0; i < tasksData.length; i++) {
    const taskData = tasksData[i];
    const user = users[i % users.length];
    const task = new Task({ ...taskData, user: user._id });
    await task.save();
  }

  console.log('Seed data created successfully');
  await mongoose.connection.close();
};

seedData().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
