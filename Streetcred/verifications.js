const ASSERT = require('assert');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const ACCESSTOK = 't2w1B4MJCJjFEWZPcw1Xsmbfca2qAQnzU-cp3_pdgZg';
const SUBKEY = 'a820c2f69495430cae43c66df163cdd1';
const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
  noRetryPolicy: true,
});

function check() {
  console.log('works');
}
const getPolicy = async function (policyId) {
  ASSERT.ok(policyId, 'You need to pass a policyId string to getPolicy()');

  console.log(`Enter getPolicy('${policyId}')...`);
  // if you forget to make your function async, you get this bizarre AF error:
  //       Exception: Worker was unable to load function Streetcred: 'SyntaxError: missing ) after argument list'
  //       Stack: C:\Users\mcorn\Documents\GitHub\azure\Streetcred\index.js:244
  //       respond(await execute(client.getVerificationPolicy(policyId)));
  //               ^^^^^
  let result = await client.getVerificationPolicy(policyId);
  console.log(`Leave getPolicy('${policyId}') with result:`);
  console.log(result);
  return result;
};
const getPolicyList = async function () {
  console.log(`Enter getPolicyList()...`);
  let result = await client.listVerificationPolicies();
  console.log(`Leave getPolicyList() with result:`);
  console.log(result);
  return result;
};

async function offerVerification(connectionId, policyId) {
  ASSERT.ok(
    connectionId,
    'You need to pass a separate connectionId string to sendVerificationFromPolicy()'
  );
  ASSERT.ok(
    policyId,
    'You need to pass a separate policyId string to sendVerificationFromPolicy()'
  );

  console.log(`Enter offerVerification('${connectionId}', '${policyId}')...`);
  // if you get the parameter order wrong, you will see this error:
  // ERROR { Error: {"error":"Object reference not set to an instance of an object.","errorType":"NullReferenceException"}
  let result = await client.sendVerificationFromPolicy(connectionId, policyId);

  console.log(
    `Leave offerVerification('${connectionId}', ' ${policyId}') with result:`
  );
  console.log(result);
  return result;
}

async function offerConnectionlessVerification(policyId) {
  ASSERT.ok(
    policyId,
    'You need to pass a separate policyId string to sendVerificationFromPolicy()'
  );

  console.log(`Enter offerConnectionlessVerification('${policyId}')...`);
  // if you get the parameter order wrong, you will see this error:
  // ERROR { Error: {"error":"Object reference not set to an instance of an object.","errorType":"NullReferenceException"}
  let result = await client.createVerificationFromPolicy(policyId);

  console.log(
    `Leave offerConnectionlessVerification( ' ${policyId}') with result:`
  );
  console.log(result);
  return result;
}

async function delVerification(verificationId) {
  ASSERT.ok(
    verificationId,
    'You need to pass a separate verificationId string to getVerification()'
  );

  console.log(`Enter getVerification('${verificationId}')...`);

  // if you get the parameter order wrong, you will see this error:
  // ERROR { Error: {"error":"Object reference not set to an instance of an object.","errorType":"NullReferenceException"}
  let results = await client.deleteVerification(verificationId);
  console.log(`Leave getVerification('${verificationId}') with result:`);

  console.log(results);
  return results;
}

async function getVerification(verificationId, allDetails = false) {
  ASSERT.ok(
    verificationId,
    'You need to pass a separate verificationId string to getVerification()'
  );

  console.log(`Enter getVerification('${verificationId}')...`);

  // if you get the parameter order wrong, you will see this error:
  // ERROR { Error: {"error":"Object reference not set to an instance of an object.","errorType":"NullReferenceException"}
  let results = await client.getVerification(verificationId);
  console.log('all results:');
  console.log(results);

  let result = allDetails
    ? results
    : {
        test: results.policy.name,
        isValid: results.isValid,
      };

  console.log(`Leave getVerification('${verificationId}') with result:`);

  console.log(result);
  return result;
}

async function listVerifications(connectionId, definitionId) {
  return await client.listVerificationsForConnection({
    AgencyServiceClientListVerificationsForConnectionOptionalParams: {
      connectionId: connectionId,
      definitionId: definitionId,
    },
  });
}
module.exports = {
  delVerification,
  getPolicy,
  getPolicyList,
  offerConnectionlessVerification,
  offerVerification,
  getVerification,
  listVerifications,
  check,
};
