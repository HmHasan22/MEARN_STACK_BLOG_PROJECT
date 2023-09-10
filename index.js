const express = require('express');
const mongoose = require('mongoose');
const blogRoute = require('./routerHandler/blogRouteHandler');
const authRoute = require('./routerHandler/authRouteHandler');
const likeRoute = require('./routerHandler/likeRouteHandler');
const commentRoute = require('./routerHandler/commentRouteHandler');
const roleSeeder = require('./scripts/seed');
const errorHandler = require('./middleware/ErrorHandler');
require('dotenv').config();
const app = express();
app.use(express.json());
// database connection
mongoose
  .connect('mongodb://localhost/blogs')
  .then(() => {
    // console.log('Database connected');
  })
  .catch((err) => {
    console.log(err);
  });
app.use('/blogs', blogRoute);
app.use('/like-route/', likeRoute);
app.use('/comment', commentRoute);
app.use('/auth', authRoute);
app.get('/seed', roleSeeder);
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);
app.listen(8000, () => {
  console.log(`Server running on ${8000}`);
});
