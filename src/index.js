const express = require('express');
const builder = require('botbuilder');

const app = express();
const PORT = process.env.PORT || 3000;

const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(connector);

app.post('/api/messages', connector.listen());

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));


bot.dialog('/', [
    function (session) {
        session.send('Hello, dear friend!');
        session.beginDialog('/ensureJenkinsProfile', session.userData);
    },
    function (session, results) {
        session.userData.profile = results.response;
        session.send('Hello %(username)s! It is your password - %(password)s! Ha-ha! Url - %(url)s', session.userData.profile);
    }
]);
bot.dialog('/ensureJenkinsProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.url) {
            builder.Prompts.text(session, 'Please, enter Jenkins url?');
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.url = results.response;
        }
        if (!session.dialogData.profile.username) {
            builder.Prompts.text(session, 'Please, enter your username for Jenkins?');
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.username = results.response;
        }
        if (!session.dialogData.profile.password) {
            builder.Prompts.text(session, 'Please, enter the password.');
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.password = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);
