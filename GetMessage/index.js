// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const config = require('../config.json');
const SUBKEY = config.SUBKEY;

// "route": "message"
module.exports = async function (context, req) {
  const { field, messageId } = req.query
  context.log.warn('Organization:', field);
  const ACCESSTOK = config[field];
  context.log.warn('Organization:', ACCESSTOK);

  const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
    noRetryPolicy: true,
  });

  let f = field ? 0 : 1
  let c = messageId ? 0 : 2
  let a = ACCESSTOK ? 0 : 4
  let x = f + c + a
  console.log('bit mask', x);
  if (x) {
    let msg
    switch (x) {
      case 6:
        msg = `Provide a valid field argument (${field} is invalid) to get to your Trinsic Organiztion. And provide a messageId, as well.`
        break;
      case 7:
      case 3:
        msg = `Provide a valid field argument to get to your Trinsic Organiztion. And provide a messageId, as well.`
        break;
      case 4:
        msg = `Provide a valid field argument (${field} is invalid) to get to your Trinsic Organiztion.`
        break;
      case 5:
      case 1:
        msg = `Provide a valid field argument to get to your Trinsic Organiztion.`
        break;
      case 2:
        msg = "Provide a messageId."
        break;
      default:
        msg = "unknown case of failure"

    }
    respond(400, msg);
  } else {
    respond(200, await client.getMessage(messageId));
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
