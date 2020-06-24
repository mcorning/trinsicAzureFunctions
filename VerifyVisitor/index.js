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

module.exports = async function (context, req) {
  context.log('Verifying Visitor');

  let payload = {
    name: 'Visitor risk',
    version: '1.0',
    attributes: [
      {
        policyName: 'Personal',
        attributeNames: ['age', 'zipcode', 'symptomsScore'],
        restrictions: null,
      },
      {
        policyName: 'Negative Test Results',
        attributeNames: ['negativeResult', 'testDate'],
        restrictions: null,
      },
      {
        policyName: 'Positive Test Results',
        attributeNames: ['positiveResult', 'testDate'],
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
};
