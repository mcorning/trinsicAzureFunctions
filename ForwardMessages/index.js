// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const config = require('../config.json');
const { flattenDiagnosticMessageText } = require('typescript');
const ACCESSTOK = config.ACCESSTOK_SOTERIA_LAB;
const SUBKEY = config.SUBKEY;
const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
  noRetryPolicy: true,
});

// "route": "messages/fprward"
module.exports = async function (context, req) {
  roomId = req.query.connectionId;
  context.log('Listing messages for:', roomId);

  function respond(status, msg) {
    context.res = {
      status: status,
      body: msg,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
  let alerted = [];

  function filter(message) {
    let m = JSON.parse(message.text);
    console.log('On', m.sender);
    // only one visitor alert per visitor
    let dupe = alerted.includes(m.sender);
    if (!m.sender || dupe || m.type.toLowerCase() != 'check-in') {
      console.info(`${m.sender} skipped dupe? ${dupe} type: ${m.type}`);
      return;
    }

    alerted.push(m.sender);

    forward(m);
  }

  function forward(m) {
    let t = JSON.stringify({
      sender: roomId,
      alert: m.text,
      type: m.type,
    });

    let msg = { connectionId: m.sender, text: t };
    console.info('Alert:', msg);
    return send(msg);
  }

  async function send(msg) {
    await client
      .sendMessage({
        basicMessageParameters: msg,
      })
      .catch((e) => console.error('Error in client.sendMessge()', e));
    return msg.connectionId;
  }

  async function map(results) {
    return results.map((m) => filter(m));
  }

  console.log('**************************************');
  let results = await client.listMessages(roomId);
  console.log('**************************************');

  console.log('=======================================');
  await map(results);
  console.log('=======================================');

  console.log(`Alerted ${alerted.length} Visitors: ${alerted}`);

  respond(200, { ct: alerted.length, alerts: alerted });
};
