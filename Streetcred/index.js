// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');

const verifications = require('./verifications');
const messages = require('./messages');
const connections = require('./connections');
const credentials = require('./credentials');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const ACCESSTOK = 't2w1B4MJCJjFEWZPcw1Xsmbfca2qAQnzU-cp3_pdgZg';
const SUBKEY = 'a820c2f69495430cae43c66df163cdd1';
const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
  noRetryPolicy: true,
});

const CONN_ID = '';
const PERS_CRED_ID = 'N4dqaFJG3qu2P5A7xKEKrB:3:CL:107380:default'; // Personal Credential Definition
const POLICY_ID = '4543223c-8710-4731-a27b-08d807eddf00'; // From Safe Place Verification Policy

const VER_ID = 'e7e5ce0d-c50f-4e2e-a785-0a597b4a42fb'; // Negative Test Result Verification
const VER_DEF_ID = '4a9b8374-86da-409d-2619-08d7de69f4ca'; // Positive Test Result Definition
const MSG_ID = '846390b7-72b3-4454-9110-c0eeaa022623';
const STATE = 'Offered';

// how do we set lint rules in AF? e.g., using an undeclared variable
let connectionId = '';
let credentialId = '';
let policyId = '';
let verificationId = '';
let definitionId = '';
let state = '';
let ct = 0;
let allDetails = false;

function listError(e) {
  console.log(e.message);
  console.log(e.stack);
}

module.exports = async function (context, req) {
  //
  // STEP 3: return results from streetcred API to client
  //
  function respond(response) {
    if (response) {
      context.log('response:');
      context.log(response);
    }
    context.res = {
      status: 200,
      body: { response: response },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  if (req.body) {
    if (req.body.credential) {
      data = await credentials.createConnectionlessCredential(
        req.body.credential
      );
      respond(data);
    }
  }

  if (req.query.name) {
    const listOrganizations = async () => {
      var result = await client.listTenants().catch((e) => console.log(e));

      console.timeEnd('listOrganizations() ran in');
      console.log();
    };

    const createVerificationPolicy = async () => {
      console.log('\tcreateVerificationPolicy');
      console.time('createVerificationPolicy() ran in');

      var response = await client
        .createVerificationPolicy({
          verificationPolicyParameters: {
            name: 'verification-name',
            version: '1.0',
            attributes: [
              {
                policyName: 'proof of valid id',
                attributeNames: ['first name', 'last name', 'address'],
              },
            ],
            predicates: [
              {
                policyName: 'must be over 21',
                attributeName: 'age',
                predicateType: '>',
                predicateValue: 21,
                restrictions: [
                  {
                    schemaName: 'government id',
                  },
                ],
              },
            ],
          },
        })
        .catch((e) => listError(e));
      console.timeEnd('createVerificationPolicy() ran in');
      console.log();

      console.time('getVerificationPolicy() ran in');

      var policy = await client.getVerificationPolicy(response.policyId);
      console.log('getVerificationPolicy results:\t', policy);

      console.timeEnd('getVerificationPolicy() ran in');
      console.log('\n');
    };

    //
    // STEP 1: get arguments ready for specific API calls
    //
    let functionName = req.query.name;
    console.log(`preparing to call execute('${functionName}')`);
    switch (functionName) {
      // Connections Section
      case 'connGet':
      case 'connDel':
        connectionId = req.query.connectionId
          ? req.query.connectionId
          : CONN_ID;
        respond(await execute(functionName));
        break;
      case 'connList':
      case 'connAdd':
      case 'connDelAllInv':
        respond(await execute(functionName));
        break;

      // Credential Section
      case 'credDel':
        credentialId = req.query.credentialId;
        respond(await execute(functionName));
        break;
      case 'credDelAllOffers':
        credentialId = req.query.credentialId;
        respond(await execute(functionName));
        break;
      case 'credList':
        connectionId = req.query.connectionId
          ? req.query.connectionId
          : CONN_ID
          ? CONN_ID
          : '';
        definitionId = req.query.definitionId
          ? req.query.definitionId
          : VER_DEF_ID
          ? VER_DEF_ID
          : '';
        state = req.query.state ? req.query.state : STATE ? STATE : '';
        respond(await execute(functionName));
        break;

      // Verifcation/Policy Section
      case 'pol':
      case 'polList':
      case 'proofOffer':
        connectionId = req.query.connectionId
          ? req.query.connectionId
          : CONN_ID
          ? CONN_ID
          : '';
        policyId = req.query.policyId ? req.query.policyId : POLICY_ID;

        console.log('executing ', functionName);
        // forget to await execute() and you won't see any reponse
        respond(await execute(functionName));
        break;
      case 'proofOfferNoConn':
        policyId = req.query.policyId ? req.query.policyId : POLICY_ID;
        respond(await execute(functionName));
        break;

      // Messaging  Section
      case 'msg':
      case 'msgList':
      case 'msgLast':
      case 'msgSend':
        switch (functionName) {
          case 'msg':
            messageId = req.query.messageId ? req.query.messageId : MSG_ID;

          default:
            connectionId = req.query.connectionId
              ? req.query.connectionId
              : CONN_ID;
            break;
        }

        respond(await execute(functionName));

        break;

      case 'ver':
        verificationId = req.query.verificationId
          ? req.query.verificationId
          : VER_ID;
        allDetails = req.query.allDetails; //? req.query.allDetails : allDetails;

        console.log('verificationId:', verificationId);
        respond(await execute(functionName));
        break;
      case 'verDelAll':
        connectionId = req.query.connectionId
          ? req.query.connectionId
          : CONN_ID;
        respond(await execute(functionName));
        break;

      case 'ver4conn':
        connectionId = req.query.connectionId
          ? req.query.connectionId
          : CONN_ID
          ? CONN_ID
          : '';
        definitionId = req.query.definitionId
          ? req.query.definitionId
          : VER_DEF_ID
          ? VER_DEF_ID
          : '';
        respond(await execute(functionName));
        break;

      case 'invite':
        const invitation = await client.createConnection({
          connectionInvitationParameters: {},
        });
        console.log(invitation);
        respond({
          redirectUrl: invitation.invitationUrl,
          connectionId: invitation.connectionId,
        });

        break;
      default:
        console.log('Cannot handle ', functionName);
    }

    //
    // STEP 2: pass arguments to API call in type wrapper
    //
    async function execute(functionName) {
      let data;
      console.log(`entering execute('${functionName}')`);
      try {
        switch (functionName) {
          case 'connAdd':
            data = await connections.createConnection();
            break;
          case 'connDel':
            data = await connections.deleteConnection(connectionId);
            break;
          case 'connDelAllInv':
            data = await connections.deleteAllInvitations();
            break;
          case 'connGet':
            data = await connections.getConnection(connectionId);
            break;
          case 'connList':
            data = await connections.listConnections();
            break;

          case 'credDel':
            data = await credentials.deleteCredential(credentialId);
            break;
          case 'credDelAllOffers':
            connectionId = '';
            state = 'offered';
            definitionId = '';
            data = await credentials.listCredentials(
              connectionId,
              state,
              definitionId
            );
            ct = data.length;

            data.forEach(async function (credential) {
              await credentials.deleteCredential(credential.credentialId);
            });
            data = `Deleted all ${ct} offered credentials `;
            await credentials.purge(definitionId);
            break;
          case 'credList':
            data = await credentials.listCredentials(
              connectionId,
              state,
              definitionId
            );
            break;

          case 'msg':
            data = await messages.getMessage(messageId);
            break;
          case 'msgSend':
            data = await messages.sendMessage(connectionId);
            break;
          case 'msgList':
            data = await messages.listMessages(connectionId);
            break;
          case 'msgLast':
            data = await messages.getLastMessage(connectionId);
            break;

          case 'pol':
            data = await verifications.getPolicy(policyId);
            break;
          case 'polList':
            data = await verifications.getPolicyList();
            break;
          case 'proofOffer':
            data = await verifications.offerVerification(
              connectionId,
              policyId
            );
            break;
          case 'proofOfferNoConn':
            data = await verifications.offerConnectionlessVerification(
              policyId
            );
            break;
          case 'ver':
            data = await verifications.getVerification(
              verificationId,
              allDetails
            );
            break;
          case 'ver4conn':
            data = await verifications.listVerifications(
              connectionId,
              definitionId
            );
            break;
          case 'verDelAll':
            data = await verifications.listVerifications(connectionId);
            ct = data.length;
            data.forEach(async function (verification) {
              await verifications.delVerification(verification.verificationId);
            });
            data = `Deleted all ${ct} verifications for ${connectionId}`;
            break;

          default:
            console.log('Cannot handle ', functionName);
        }
        console.log('execute() returns:');
        context.log.info(data);
        //return results to Step 1 so it can pass them on to Step 3
        return data;
      } catch (e) {
        if (e instanceof ASSERT.AssertionError) {
          context.log.error(e.message);
          return { error: e.message };
        } else {
          context.log.error(e.message);
          return e;
        }
      }
    }
  }
};
