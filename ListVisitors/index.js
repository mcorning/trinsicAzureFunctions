// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');
const D = require('atob'); // for Decoding Base64 strings

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const config = require('../config.json');
const SUBKEY = config.SUBKEY;

//      "route": "connections/list/visitors"
module.exports = async function (context, req) {
  const { field, phones } = req.body;
  const ACCESSTOK = config[field];
  const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
    noRetryPolicy: true,
  });

  respond(200, await listConnections());

  async function listConnections() {
    let result = await client.listConnections({ state: 'Invited' });
    let visitors = new Map()
    let allVisitors =
      result.filter(v => phones.includes(nameFrom(v.invitation)))
        .map(v => {
          let name = nameFrom(v.invitation)
          let o = {}
          o['connectionId'] = v.connectionId
          o['date'] = v.createdAtUtc
          if (!visitors.has(name)) visitors.set(name, o)
        })

    return { count: visitors.size, visitors: Array.from(visitors) };
  }

  function nameFrom(base64) {
    let decoded = '';
    let x = base64.length % 4;
    let name = null;
    if (x != 0) {
      base64 = base64.slice(0, base64.length - x);
    }
    try {
      decoded = D.atob(base64);
    } catch (error) {
      context.log.error('decode error:', error.message);
    }
    if (decoded) {
      try {
        // strip off any decoded text after the JSON
        name = JSON.parse(decoded.slice(0, decoded.lastIndexOf('}') + 1)).label;
      } catch (error) {
        context.log('---------------------------');
        context.log.error('Bad decoded due to:', error.message);
        context.log.error(decoded);
        decoded = error.message;
        context.log('---------------------------');
      }
    }
    return name;
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
