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
    context.log(response.verificationId, response.verificationRequestUrl);
  }
  context.res = {
    status: 200,
    body: { url: response.verificationRequestUrl, id: response.verificationId },
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let tries = 10;
  let id = setInterval(() => {
    console.log(tries == 3 ? 'Waiting for response...' : '...still waiting');
    tries--;
    if (tries == 0) {
      clearInterval(id);
      console.log('No response. Try later.');
    }
    getResults();
  }, 6000);

  async function getResults() {
    console.log('checking');
    let results = await client.getVerification(response.verificationId);
    if (results.state == 'Accepted') {
      clearInterval(id);
      console.log(
        'Results for verificationId:',
        results.verificationId,
        'isValid:',
        results.isValid
      );
      let isValid = results.isValid ? results.isValid : true;
      console.log(results.proof);
      console.log(
        isValid && isSafe(results.proof)
          ? 'Visitor is safe to enter.'
          : 'Sorry, come back later...'
      );
    }
  }
  async function isSafe(proof) {
    let isSafe =
      THRESHOLD >= proof.Personal.attributes.symptomsScore &&
      SAFE_ZIPS.includes(proof.Personal.attributes.zipcode);
    console.log(isSafe ? 'safe' : 'unsafe');
    return isSafe;
  }
};
