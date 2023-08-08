import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors({ origin: '*' }));
const server = require('http').createServer(app);

app.get('/', (req, res) => {
  res.send(`<h1>Hello World</h1>`);
});

server.listen(8000, () => {
  console.log('listening on *:8000');
});
