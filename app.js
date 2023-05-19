const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const routes = require('./routes/index');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.log(err));


app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport); 

// Routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send("The Server is running");
})

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
