const express = require('express');
const app = express();

app.use(express.static('public'));

const port = process.env.PORT || 4040;

app.listen(port, () => console.log('running on port: ', port));
