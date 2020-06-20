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

const SAFE_ZIPS = ['97759'];
const THRESHOLD = 5;
let proof = {};

module.exports = async function (context) {
  context.log('Making connection');

  function respond(status, msg) {
    context.res = {
      status: status,
      body: msg,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async function makeConnections() {
    console.log('creating connection');
    let result = await client.createConnection({
      connectionInvitationParameters: {
        multiParty: false,
        name: 'somebody',
      },
    });
    return { connectionId: result.connectionId, url: result.invitationUrl };
  }

  respond(200, await makeConnections());
};
