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
const getLastMessage = async function (connectionId) {
  console.log(`Enter getLastMessage('${connectionId}')...`);
  ASSERT.ok(
    connectionId,
    'You need to pass a connectionId string to listMessages()'
  );
  let results = await client.listMessages(connectionId);
  let result = results[results.length - 1];

  console.log(`Leave getLastMessage('${connectionId}')...`);
  console.log('...result:');
  console.log(result);
  return result;
};
const sendMessage = async function (connectionId) {
  let message = 'You may have been exposed to COVID-19.';
  console.log(`Enter sendMessage('${connectionId}')...`);
  ASSERT.ok(
    connectionId,
    'You need to pass a connectionId string to sendMessage()'
  );
  await client.sendMessage({
    // if you get this options name wrong, you will see this (most unhelpful) error:
    //{ Error: {"error":"Message parameters must be specified (Parameter 'parameters')","errorType":"ArgumentNullException"}
    // Heuristically I found the option object's name in the base type of the options parameter in the sendMessage() signature
    basicMessageParameters: {
      connectionId: connectionId,
      text: message,
    },
  });
  console.log(`Leave sendMessage('${connectionId}')...`);

  return result;
};

const getMessage = async function (messageId) {
  console.log(`Enter getMessage('${messageId}')...`);
  ASSERT.ok(messageId, 'You need to pass a messageId string to getMessage()');
  let result = await client.getMessage(messageId);
  console.log(`Leave getMessage('${messageId}')...`);
  console.log('...result:');
  console.log(result);
  return result;
};

module.exports = {
  listMessages,
  getLastMessage,
  sendMessage,
  getMessage,
  check,
};
