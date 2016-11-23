const express = require('express');
const builder = require('botbuilder');
const JenkinsService = require('./jenkins.stub');

const app = express();
const PORT = process.env.PORT || 3000;

const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(connector);
const intents = new builder.IntentDialog();

app.post('/api/messages', connector.listen());

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

function isJenkinsConfigured(profile) {
  return profile && profile.username && profile.password && profile.url;
}

function setCiService(session) {
  const {username, password, url} = session.dialogData.profile;

  session.dialogData.profile.ciService = new JenkinsService({username, password, url});
}

bot.dialog('/', intents);

intents.onDefault([
  function (session, args, next) {
    if (!isJenkinsConfigured(session.userData.profile)) {
      session.send('Hello, dear friend!');
      session.beginDialog('/configure-jenkins', session.userData.profile);
    } else {
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
    }).catch(() => {
      session.send("Sorry, I can't connect :(");
    });
  }
]);

intents.dialog('/configure-jenkins', [
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

        setCiService(session);
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);

intents.matches(/^build/i, [
  function (session) {
    if (!isJenkinsConfigured(session.userData.profile)) {

    } else {
      session.beginDialog('/configure-jenkins', session.userData.profile);
    }
  }
]);

intents.dialog('/manage-jenkins', [
  function (session, args, next) {

  }
]);