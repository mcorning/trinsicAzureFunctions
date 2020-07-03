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

module.exports = async function (context, req) {
  let connectionId = req.query.connectionId;
  if (connectionId) {
    context.log('Verifying Occupant', req.query.connectionId);

    let payload = {
      name: 'WARNING: You may have been exposed to COVID',
      version: '1.0',
      attributes: [
        {
          policyName: 'Negative Test Results',
          attributeNames: ['negativeResult', 'testDate'],
          restrictions: null,
        },
      ],
      predicates: [],
      revocationRequirement: null,
    };
    let response = await client.sendVerificationFromParameters(connectionId, {
      verificationPolicyParameters: payload,
    });

    if (response) {
      context.log('response:');
      context.log(
        response.verificationId,
        response.verificationRequestUrl,
        response.verificationRequestData
      );
    }
    context.res = {
      status: 200,
      body: {
        url: response.verificationRequestUrl,
        id: response.verificationId,
        data: response.verificationRequestData,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
