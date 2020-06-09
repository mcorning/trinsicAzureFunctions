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

const createCredential = async function () {
  console.log(`Enter createCredential()...`);
  let result = await client.createCredential({
    // ...but if you give values to the object, you raise{"error":"A storage error occurred during the wallet operation.","errorType":"WalletStorageException"}
    connectionInvitationParameters: {},
  });
  console.log(`...Leave createCredential() with result:`);
  console.log(result);
  return result;
};

const createConnectionlessCredential = async function (
  credentialOfferParameters
) {
  console.log(`Enter createCredential('${credentialOfferParameters}')...`);
  let result = await client.createCredential({
    // ...but if you give values to the object, you raise{"error":"A storage error occurred during the wallet operation.","errorType":"WalletStorageException"}
    credentialOfferParameters,
  });
  console.log(
    `...Leave createCredential('${credentialOfferParameters}') with result:`
  );
  console.log(result);
  return result;
};

const deleteCredential = async function (credentialId) {
  console.log(`Enter deleteCredential('${credentialId}')...`);
  ASSERT.ok(
    credentialId,
    'You need to pass a connectionId string to deleteCredential()'
  );
  await client.revokeCredential(credentialId);
  console.log(
    `...Leave deleteCredential('${credentialId}') does not return a result:`
  );
};

const getCredential = async function (connectionId) {
  console.log(`Enter getCredential('${connectionId}')...`);
  ASSERT.ok(
    connectionId,
    'You need to pass a connectionId string to getCredential()'
  );
  try {
    let result = await client.getCredential(connectionId);
    console.log(`...Leave getCredential('${connectionId}') with result:`);
  } catch (error) {
    return { message: `${connectionId} not found or previously deleted` };
  }
};

const listCredentials = async function (connectionId, state, definitionId) {
  console.log(
    `Enter listCredentials('${connectionId}','${state}','${definitionId}')...`
  );
  let result = await client.listCredentials();
  console.log(`...Leave getMessage() with result:`);
  return result;
};

const purge = async (definitionId) => {
  await client.purgeCredentials(definitionId);
};

module.exports = {
  createCredential,
  createConnectionlessCredential,
  deleteCredential,
  getCredential,
  listCredentials,
  purge,
  check,
};
