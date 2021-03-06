// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const config = require('../config.json');
const ACCESSTOK = config.ACCESSTOK_SOTERIA_LAB;
const SUBKEY = config.SUBKEY;
const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
  noRetryPolicy: true,
});

// "route": "messages"
module.exports = async function (context, req) {
  context.log('ACCESS_TOKEN:', ACCESSTOK);
  context.log('Sending message with parameters:');
  context.log(req.body);

  function respond(status, msg) {
    context.res = {
      status: status,
      body: msg,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  try {
    let x = await client.sendMessage({
      basicMessageParameters: req.body,
    });
    context.log.info('Successfully sent message');
    respond(200, x);
  } catch (error) {
    context.log.error('ooops', error.message);

    respond(error.statusCode, error);
  }
};
