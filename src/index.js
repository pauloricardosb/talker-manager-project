const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const { getTalkers, addTalker } = require('./helpers/talkers');
const validation = require('./middlewares/validation');
const tokenGenerator = require('./helpers/token');
const ageValid = require('./middlewares/talkersValidation/age');
const nameValid = require('./middlewares/talkersValidation/name');
const rateValid = require('./middlewares/talkersValidation/rate');
const talkValid = require('./middlewares/talkersValidation/talk');
const tokenValid = require('./middlewares/talkersValidation/token');
const watchedAtValid = require('./middlewares/talkersValidation/watchedAt');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// Rota GET para talker

app.get('/talker', async (_req, res) => {
  const response = await getTalkers();
  res.status(200).json(response);
});

// Rota GET para talker:id

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const response = await fs
    .readFile('src/talker.json');
  const talker = JSON
    .parse(response)
    .find((person) => person.id === Number(id));

  if (!talker) {
 res
  .status(404)
  .json({
    message: 'Pessoa palestrante não encontrada',
  }); 
} else {
  res
    .status(200)
    .json(talker);
}
});

// Rota POST para Login

app.post('/login', validation, async (_req, res) => {
  const token = tokenGenerator.token();
  return res.status(200).json({ token });
});

// Rota POST para Talker

app.post('/talker', 
  tokenValid,
  nameValid,
  ageValid, 
  talkValid,
  watchedAtValid,
  rateValid, async (req, res) => {
  const talker = req.body;
  const response = await addTalker(talker);
  res.status(201).json(response);
});

// Rota PUT para Talker

app.put('/talker/:id',
tokenValid,
nameValid,
ageValid, 
talkValid,
watchedAtValid,
rateValid,
async (req, res) => {
  const { id } = req.params;
  const allTalkers = await getTalkers();
  const getTalker = allTalkers.find((person) => person.id === Number(id));
  const index = allTalkers.indexOf(getTalker);
  const newTalker = { id: Number(id), ...req.body };
  allTalkers[index] = newTalker;
  await fs.writeFile('src/talker.json', JSON.stringify(allTalkers));
  return res.status(200).json(newTalker);
});

// Rota DELETE para Talker

app.delete('/talker/:id', tokenValid,
async (req, res) => {
  const { id } = req.params;
  const allTalkers = await getTalkers();
  const getTalker = allTalkers.filter((person) => person.id !== Number(id));
  await fs.writeFile('src/talker.json', JSON.stringify(getTalker));
  res.status(204).json(getTalker);
});
