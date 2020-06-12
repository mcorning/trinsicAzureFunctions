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

function check() {
  console.log('works');
}

const createCredential = async function () {
  console.log(`Enter createCredential()...`);
  let result = await client.createCredential({
    // ...but if you give values to the object, you raise{"error":"A storage error occurred during the wallet operation.","errorType":"WalletStorageException"}
    connectionInvitationParameters: {},
  });
  console.log(`...Leave createCredential()`);
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
      `...Leave createConnectionlessCredential('${credentialOfferParameters}') `
    );
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

const getCredential = async function (credentialId) {
  console.log(`Enter getCredential('${credentialId}')...`);
  ASSERT.ok(
    credentialId,
    'You need to pass a credentialId string to getCredential()'
  );
  try {
    let result = await client.getCredential(credentialId);
    console.log(`...Leave getCredential('${credentialId}') `);
    return result;
  } catch (error) {
    return { message: `${credentialId} not found or previously deleted` };
  }
};

const listCredentials = async function (connectionId, state, definitionId) {
  console.log(
    `Enter listCredentials('${connectionId}','${state}','${definitionId}')...`
  );
  let result = await client.listCredentials();
  console.log(
    `...Leave listCredentials('${connectionId}','${state}','${definitionId}') `
  );
  return result;
};

const listCredentialDefinitions = async function () {
  console.log(`Enter listCredentialDefinitions()...`);
  let result = await client.listCredentialDefinitions();
  console.log(`...Leave listCredentialDefinitions()`);
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
