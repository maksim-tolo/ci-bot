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
    session.userData.profile.ciService.getServerInfo().then(() => {
      session.send('Ok! I connected!');
    }).catch(() => {
      session.send("Sorry, I can't connect :(");
    });
  }
]);

bot.dialog('/configure-jenkins', [
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

bot.dialog('/manage-jenkins', [
  function (session, args, next) {
    builder.Prompts.choice(session, 'What can I do for you?', ['Show server info', 'Show build info']);
  },
  function (session, results) {
    switch (results.repsonse.entity) {
      case 'Show server info':
        session.userData.profile.jenkinsService.getServerInfo().then(data => {
          session.send(data);
        });
        break;
      case 'Show build info':
        session.userData.profile.jenkinsService.getBuildInfo().then(data => {
          session.send(data);
        });
        break;
      default:
        break;
    }
  }
]);
