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
async function getPolicy(context, req, POLICY_ID) {
  policyId = req.query.policyId ? req.query.policyId : POLICY_ID;
  context.log(`Enter getVerificationPolicy('${policyId}')...`);
  // if you forget to make your function async, you get this bizarre AF error:
  //       Exception: Worker was unable to load function Streetcred: 'SyntaxError: missing ) after argument list'
  //       Stack: C:\Users\mcorn\Documents\GitHub\azure\Streetcred\index.js:244
  //       respond(await execute(client.getVerificationPolicy(policyId)));
  //               ^^^^^
  let result = await client.getVerificationPolicy(policyId);
  context.log(`Leave getVerificationPolicy('${policyId}')...`);
  console.log(result);
  return result;
}
module.exports = {
  getPolicy,
  check,
};
