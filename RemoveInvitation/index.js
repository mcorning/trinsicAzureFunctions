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

  context.log('Deleting invitation');

  function respond(res) {
    context.res = {
      status: res._response.status,
      body: res.body,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async function deleteInvitation() {
    console.log('Deleting invitation for', connectionId);
    return await client.deleteConnection(connectionId);
  }

  respond(await deleteInvitation());
};
