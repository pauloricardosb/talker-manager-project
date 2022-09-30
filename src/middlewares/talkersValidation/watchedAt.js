const watchedAtValid = (req, res, next) => {
  const { watchedAt } = req.body.talk;

  if (!watchedAt) {
     return res
    .status(400)
    .json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  const dateRegex = /^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$/g;

  if (!dateRegex
      .test(watchedAt)) {
    return res
      .status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

module.exports = watchedAtValid;