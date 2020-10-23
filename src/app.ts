import express from 'express';

const app = express();

app.get('/hello', (_, res: express.Response) => {
  res.send('World');
});

app.listen(8888, (): void => {
  console.log('Server is running!');
});
