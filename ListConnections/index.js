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

//      "route": "connections/list"
module.exports = async function (context) {
  context.log('Listing connections');
  console.log('query', context.req.query);
  let state = context.req.query.state;

  function respond(status, msg) {
    context.res = {
      status: status,
      body: msg,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async function listConnections() {
    console.log('Listing connections');
    let result = await client.listConnections({ state: state });
    return { count: result.length, connections: result };
  }

  respond(200, await listConnections());
};
