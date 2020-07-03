// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const config = require('../config.json');
const ACCESSTOK = config.ACCESSTOK;
const SUBKEY = config.SUBKEY;
const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
  noRetryPolicy: true,
});

module.exports = async function (context) {
  const connectionId = context.req.query.connectionId;
  context.log('Getting connectionId', connectionId);

  function respond(status, msg) {
    context.res = {
      status: status,
      body: msg,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async function getConnection() {
    console.log('creating connection');
    let result = await client.getConnection(connectionId);
    return { connectionId: result.connectionId, state: result.state };
  }

  respond(200, await getConnection());
};
