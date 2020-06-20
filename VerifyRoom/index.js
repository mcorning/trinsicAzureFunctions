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

const THRESHOLD = 4;

module.exports = async function (context, req) {
  context.log('Verifying Room');

  let payload = {
    name: 'Room risk',
    version: '1.0',
    attributes: [
      {
        policyName: 'Threshold',
        attributeNames: ['riskThreshold'],
        restrictions: null,
      },
    ],
    predicates: [],
    revocationRequirement: null,
  };
  let response = await client.createVerificationFromParameters({
    verificationPolicyParameters: payload,
  });

  if (response) {
    context.log('response:');
    context.log(response.verificationId, response.verificationRequestUrl);
  }
  context.res = {
    status: 200,
    body: { url: response.verificationRequestUrl, id: response.verificationId },
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
