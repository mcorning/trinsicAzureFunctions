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
  let result;
  console.log(
    `Enter createConnectionlessCredential('${credentialOfferParameters}')...`
  );
  try {
    // we raised a 500 error NullReferenceException when we the creddef string ended in 'default' (no error when the only thing changed was using "string" instead)
    result = await client.createCredential({
      // ...but if you give values to the object, you raise{"error":"A storage error occurred during the wallet operation.","errorType":"WalletStorageException"}
      credentialOfferParameters,
    });
    console.log(
      `...Leave createConnectionlessCredential('${credentialOfferParameters}') with result:`
    );
    console.log(result);
  } catch (error) {
    console.log(error);
    result = error;
  }
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
  console.log(`...Leave listCredentials() with result:`);
  return result;
};
const listCredentialDefinitions = async function () {
  console.log(`Enter listCredentialDefinitions()...`);
  let result = await client.listCredentialDefinitions();
  console.log(`...Leave listCredentialDefinitions() with result:`);
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
  listCredentialDefinitions,
  purge,
  check,
};
