const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'static')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
