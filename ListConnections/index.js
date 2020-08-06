// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const config = require('../config.json');
const SUBKEY = config.SUBKEY;

//      "route": "connections/list"
module.exports = async function (context, req) {
  const { field, state, multiParty } = req.query
  context.log.warn('Organization:', field);
  const ACCESSTOK = config[field];
  context.log.warn('Organization:', ACCESSTOK);

  const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
    noRetryPolicy: true,
  });

  let msg
  let a = field ? 0 : 1
  let b = ACCESSTOK ? 0 : 2
  let x = a + b
  console.log('bit mask', x);
  if (x) {
    switch (x) {
      case 2:
        msg = `Provide a valid field argument (${field} is invalid) to get to your Trinsic Organiztion.`
        break;

      default:
        msg = `Provide a valid field argument to get to your Trinsic Organiztion.`

    }
    //= (field && !ACCESSTOK) ? `And ensure ACCESSTOK based on field, ${field}, is correct.` :      (`Missing arg(s) ${!field ? 'field' : !connectionId ? 'connectionId'}. `)
    respond(400, msg);
  } else {
    respond(200, await listConnections());
  }

  async function listConnections() {
    console.log('Listing connections');
    let result = await client.listConnections({ state: multiParty ? "Invited" : state });
    if (multiParty) {
      result = result.filter(v => v.multiParty == true)
    }
    return { count: result.length, connections: result };
  }

  function respond(status, msg) {
    context.res = {
      status: status,
      body: msg,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }




};
