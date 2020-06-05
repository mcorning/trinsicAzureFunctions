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

const createConnection = async function () {
  console.log(`Enter createConnection()...`);
  // signature:     createConnection(options?: Models.AgencyServiceClientCreateConnectionOptionalParams): Promise<Models.CreateConnectionResponse>;
  // drill into the options interface to see:
  //export interface AgencyServiceClientCreateConnectionOptionalParams extends msRest.RequestOptionsBase {
  /**
   * Connection invitation parameters
   */
  //     connectionInvitationParameters?: ConnectionInvitationParameters;
  // }
  // Drill down into that next interface and you see:
  // export interface ConnectionInvitationParameters {
  /**
   * Unique connection identifier. If not specified, a random one will be generated.
   */
  // connectionId?: string;
  /**
   * If set to 'true', the invitation can be used by multiple parties and will always have the
   * status set to 'Invited'.
   * When a party accepts this invitation, a new connection record with a unique identifier will be
   * created.
   *
   * Default value is 'false'.
   */
  // multiParty?: boolean;
  /**
   * Name that can be used as organization name
   *
   * Default value is 'null'.
   */
  // name?: string;
  // }
  // so, use connectionInvitationParameters as the names parameter...
  let result = await client.createConnection({
    // ...but if you give values to the object, you raise{"error":"A storage error occurred during the wallet operation.","errorType":"WalletStorageException"}
    connectionInvitationParameters: {},
  });
  console.log(`...Leave createConnection() with result:`);
  console.log(result);
  return result;
};

const deleteConnection = async function (connectionId) {
  console.log(`Enter deleteConnection('${connectionId}')...`);
  ASSERT.ok(
    connectionId,
    'You need to pass a connectionId string to deleteConnection()'
  );
  await client.deleteConnection(connectionId);
  console.log(
    `...Leave deleteConnection('${connectionId}') does not return a result:`
  );
};

const getConnection = async function (connectionId) {
  console.log(`Enter getConnection('${connectionId}')...`);
  ASSERT.ok(
    connectionId,
    'You need to pass a connectionId string to getConnection()'
  );
  try {
    let result = await client.getConnection(connectionId);
    console.log(`...Leave getConnection('${connectionId}') with result:`);
    return result;
  } catch (error) {
    return { message: `${connectionId} not found or previously deleted` };
  }
};

const listConnections = async function () {
  console.log(`Enter listConnections()...`);
  let result = await client.listConnections();
  console.log(`...Leave getMessage() with result:`);
  console.log(result);
  return result;
};

module.exports = {
  createConnection,
  deleteConnection,
  getConnection,
  listConnections,
  check,
};
