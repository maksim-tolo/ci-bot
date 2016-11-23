const express = require('express');
const builder = require('botbuilder');

const app = express();
const PORT = process.env.PORT || 3000;

const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(connector);

bot.dialog('/', (session) => {
  session.send(session.message.text.split('').reverse().join(''));
});

app.post('/api/messages', connector.listen());

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
