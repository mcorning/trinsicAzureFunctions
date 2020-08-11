// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const config = require('../config.json');
const SUBKEY = config.SUBKEY;

// "route": "connection"
module.exports = async function (context, req) {
  const { field, connectionId, state } = req.query;
  context.log.warn('Organization:', field);
  const ACCESSTOK = config[field];
  context.log.warn('Organization:', ACCESSTOK);

  const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
    noRetryPolicy: true,
  });

  let f = field ? 0 : 1;
  let c = connectionId ? 0 : 2;
  let a = ACCESSTOK ? 0 : 4;
  let x = f + c + a;
  console.log('bit mask', x);
  if (x) {
    let msg;
    switch (x) {
      case 7:
      case 6:
      case 3:
        msg = `Provide a valid field argument (${field} is invalid) to get to your Trinsic Organiztion. And provide a connectionId, as well.`;
        break;
      case 4:
        msg = `Provide a valid field argument to get to your Trinsic Organiztion.`;
        break;
      case 5:
      case 1:
        msg = `Provide a valid field argument (${field} is invalid) to get to your Trinsic Organiztion.`;
        break;
      case 2:
        msg = 'Provide a connectionId.';
        break;
      default:
        msg = 'unknown case of failure';
    }
    respond(400, msg);
  } else {
    try {
      console.log('creating connection');
      let result = await client.getConnection(connectionId);
      respond(200, {
        connectionId: result.connectionId,
        state: result.state,
      });
    } catch (error) {
      respond(error.statusCode, error.message);
    }
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
