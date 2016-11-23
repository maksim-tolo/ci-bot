const express = require('express');
const builder = require('botbuilder');
const JenkinsService = require('./jenkins.stub');

const app = express();
const PORT = process.env.PORT || 3000;

const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(connector);

app.post('/api/messages', connector.listen());

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

function checkSession(profile) {
    console.log('OKKKKKKKKKKKK');
    return profile && profile.username && profile.password && profile.url;
}


bot.dialog('/', [
    function (session, args, next) {
        console.log('>>>>>>>>>>>>>>>', session.userData.profile);
        if (!checkSession(session.userData.profile)) {
            session.send('Hello, dear friend!');
            session.beginDialog('/ensure-jenkins-profile', session.userData.profile);
        } else {
            console.log('NEXT', next);
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.userData.profile = results.response;
        }
        const { username, password, url } = session.userData.profile;
        const jenkinsService = new JenkinsService({ username, password, url });
        jenkinsService.getServerInfo().then(() => {
            session.send('Ok! I connected!');
        }, () => {
            session.send("Sorry, I can't connect :(");
        });
    }
]);
bot.dialog('/ensure-jenkins-profile', [
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
