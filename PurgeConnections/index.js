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
  context.log('Purging connections');

  function respond(status, msg) {
    context.res = {
      status: status,
      body: msg,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async function purgeConnections() {
    let conns = await client.listConnections();
    let x = 0;
    deleted = [];
    console.log(`Purging ${conns.length} connections`);
    try {
      conns.map((v, x) => {
        // if (x < 10) {
        deleted.push(v.connectionId);
        deleteConn(v.connectionId);
        // }
      });
    } catch (error) {
      console.error(error);
    }
    return { count: deleted.length, deleted: deleted };
  }

  function deleteConn(id) {
    try {
      console.log(`deleting connection ${id} ...`);
      client.deleteConnection(id);
    } catch (error) {
      console.error('Error in deleteConn', error);
    }
  }

  respond(200, await purgeConnections());
};
