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
  console.log(`Enter getVerificationPolicy('${policyId}')...`);
  ASSERT.ok(policyId, 'You need to pass a policyId string to getPolicy()');
  // if you forget to make your function async, you get this bizarre AF error:
  //       Exception: Worker was unable to load function Streetcred: 'SyntaxError: missing ) after argument list'
  //       Stack: C:\Users\mcorn\Documents\GitHub\azure\Streetcred\index.js:244
  //       respond(await execute(client.getVerificationPolicy(policyId)));
  //               ^^^^^
  let result = await client.getVerificationPolicy(policyId);
  console.log(`Leave getVerificationPolicy('${policyId}')...`);
  console.log('result:');
  console.log(result);
  return result;
};

async function offerVerification() {
  console.log('connectionId:', connectionId, 'policyId:', policyId);
  // if you get the parameter order wrong, you will see this error:
  // ERROR { Error: {"error":"Object reference not set to an instance of an object.","errorType":"NullReferenceException"}
  let result = await client.sendVerificationFromPolicy(connectionId, policyId);

  console.log(`Leave getVerificationPolicy('${policyId}')...`);
  console.log(result);
}
module.exports = {
  getPolicy,
  check,
};
