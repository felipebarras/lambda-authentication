// criação de um index extremamente básico somente para boas práticas
// const express = require('express');
// const app = express();
// const routes = require('./routes');

// require('dotenv').config(); // uso para arquivo ENV, se necessário

// app.use(express.json());
// app.use('/', routes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

exports.handler = async (event) => {
  console.log(event);
  return 'Hello from Lambda!';
};
