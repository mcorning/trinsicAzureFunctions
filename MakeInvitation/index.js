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

module.exports = async function (context) {
  const connectionId = context.req.query.id;

  context.log('Making invitation');

  function respond(status, msg) {
    context.res = {
      status: status,
      body: msg,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async function makeInvitation() {
    console.log('Creating invitation for', connectionId);
    let result = await client.createConnection({
      connectionInvitationParameters: {
        connectionId: connectionId,
        multiParty: true,
        name: connectionId,
      },
    });
    return { connectionId: result.connectionId, url: result.invitationUrl };
  }

  respond(200, await makeInvitation());
};
