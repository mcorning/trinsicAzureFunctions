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
const listMessages = async function (connectionId) {
  console.log(`Enter listMessages('${connectionId}')...`);
  ASSERT.ok(
    connectionId,
    'You need to pass a connectionId string to listMessages()'
  );
  let result = await client.listMessages(connectionId);
  console.log(`Leave listMessages('${connectionId}')...`);
  console.log('...result:');
  console.log(result);
  return result;
};

module.exports = {
  listMessages,
  check,
};
