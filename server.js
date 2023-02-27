const express = require('express');
const {db} = require('./db');

const usersRouter = require('./routes/users');
const showsRouter = require('./routes/shows');

const app = express();

app.use(express.json());
app.use('/users', usersRouter);
app.use('/shows', showsRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
})
