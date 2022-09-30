const fs = require('fs').promises;
const { join } = require('path');

const path = '../talker.json';

const talkerJson = async () => {
  const json = '../talker.json';
  try {
    const result = await fs.readFile(join(__dirname, json), 'utf-8');
    return JSON.parse(result);
  } catch (error) {
    return [];
  }
};

const editTalkerJson = async (file) => {
  const newFile = JSON.stringify(file);
  await fs.writeFile(join(__dirname, path), newFile);
};

const getTalkers = async () => {
  const talkers = await talkerJson();
  return talkers;
};

const addTalker = async (talker) => {
  const file = await talkerJson();
  const newTalker = {
    id: file.length + 1,
    ...talker,
  };
  file.push(newTalker);
  editTalkerJson(file);
  return newTalker;
};

module.exports = {
  getTalkers,
  addTalker,
};
