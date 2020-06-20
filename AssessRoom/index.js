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

module.exports = async function (context, req) {
  context.log('Assessing Room');
  console.log('ID', req.query ? req.query.id : 'oops');

  async function go() {
    let tries = 10;
    let id = setInterval(async () => {
      console.log(tries == 9 ? 'Waiting for response...' : '...still waiting');
      tries--;
      if (tries == 0) {
        clearInterval(id);
        respond(204, 'No response. Try later.');
        // respond('No response. Try later.');
      }
      await getResults(req.query.id);
    }, 6000);
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

  async function getResults(verificationId) {
    console.log(verificationId);
    console.log('checking');
    let results = await client.getVerification(verificationId);
    // if (results.state == 'Accepted') {
    //   clearInterval(id);
    console.log(
      'Results for verificationId:',
      results.verificationId,
      'isValid:',
      results.isValid
    );
    proof = results.proof.Threshold;
    console.log('Proof:', proof.name, proof.value);
    // }
    return { property: proof.name, value: proof.value };
  }

  respond(200, await getResults(req.query.id));
};
