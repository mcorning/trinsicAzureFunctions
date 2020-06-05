// debugging is buggy. do we need this in local.settings.json?     "languageWorkers:node:arguments": "--inspect=5858"
const ASSERT = require('assert');

const verifications = require('./verifications');
const messages = require('./messages');

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const ACCESSTOK = 't2w1B4MJCJjFEWZPcw1Xsmbfca2qAQnzU-cp3_pdgZg';
const SUBKEY = 'a820c2f69495430cae43c66df163cdd1';
const client = new AgencyServiceClient(new Credentials(ACCESSTOK, SUBKEY), {
  noRetryPolicy: true,
});

const CONN_ID = 'cb79ecf0-9f84-459a-b608-073a7ed90bac';

const VER_ID = 'cd6c88a2-51ba-4fae-afc0-93f7cd248722'; // Positive Test Result Verification
const POLICY_ID = '5d401288-4d61-4190-261a-08d7de69f4ca'; // Positive Test Result Policy
const VER_DEF_ID = '4a9b8374-86da-409d-2619-08d7de69f4ca'; // Positive Test Result Definition

// how do we set lint rules in AF? e.g., using an undeclared variable
let connectionId = '';
let policyId = '';
let verificationId = '';
let definitionId = '';

function listError(e) {
  console.log(e.message);
  console.log(e.stack);
}

module.exports = async function (context, req) {
  if (req.query.name || (req.body && req.body.name)) {
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

    const execute = async (functionName) => {
      let data;
      try {
        switch (functionName) {
          case 'msg':
            data = await messages.listMessages(connectionId);
            break;
          case 'pol':
            data = await verifications.getPolicy(policyId);
            break;
        }
        console.log('Data:');
        console.log(data);
        return data;
      } catch (e) {
        if (e instanceof ASSERT.AssertionError) {
          context.log.error(e.message);
          return { error: e.message };
        } else {
          return e;
        }
      }
    };

    //   listOrganizations();

    //   createVerificationPolicy();
    let functionName = req.query.name;
    switch (functionName) {
      // Verifcation Policy Section
      case 'pol':
      case 'polList':
      case 'offerProof':
        connectionId = req.query.connectionId
          ? req.query.connectionId
          : CONN_ID;
        policyId = req.query.policyId ? req.query.policyId : POLICY_ID;
        // if (policyId) {
        switch (functionName) {
          case 'pol':
            respond(await execute('pol'));
            break;
          case 'polList':
            context.log('Enter listVerificationPolicies()...');
            f = client.listVerificationPolicies();
            context.log('Leave listVerificationPolicies()...');
            break;

          case 'offerProof':
            break;
        }
        // and if you forget to await your async function, you will get this (more realistic error):
        // Warning: Unexpected call to 'log' on the context object after function execution has completed. Please check for asynchronous calls that are not awaited or calls to 'done' made before function execution completes. Function name: Streetcred. Invocation Id: 3a243fd8-0b84-49b8-9de0-385e8896d715. Learn more: https://go.microsoft.com/fwlink/?linkid=2097909
        // respond(
        //   // forget to await execute() and you won't see any reponse
        //   await execute(f)
        // );
        break;

      case 'msg':
        context.log('Enter listMessages()...');
        connectionId = req.query.connectionId
          ? req.query.connectionId
          : CONN_ID;
        respond(await execute('msg'));

        break;

      case 'conn':
        context.log('Enter getConnection()...');
        connectionId = req.query.connectionId
          ? req.query.connectionId
          : CONN_ID;
        if (connectionId) {
          respond(await execute(client.getConnection(connectionId)));
        } else {
          respond(
            'You need to pass a connectionId string to call client.getConnection()'
          );
        }
        context.log('Leaving getConnection()...');
        break;

      case 'ver':
        context.log('Enter getVerification()...');
        //*Payload:
        // Identifies an offered a proof request. Used to derefence it's proof results
        // verificationId: string;
        verificationId = req.query.verificationId
          ? req.query.verificationId
          : VER_ID;
        console.log('verificationId:', verificationId);
        respond(await execute(client.getVerification(verificationId)));

        context.log('Leave getVerification()...');
        break;

      case 'v4conn':
        context.log('Enter listVerificationsForConnection()...');
        //*Payload:
        // The optional connection identifier:
        // connectionId?: string;
        // The definition identifier:
        // definitionId?: string;
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
        console.log('connectionId:', connectionId);
        console.log('definitionId:', definitionId);
        respond(
          await execute(
            client.listVerificationsForConnection({
              connectionId: connectionId,
              definitionId: definitionId,
            })
          )
        );
        context.log('Leave listVerificationsForConnection()...');
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
    }

    function respond(response) {
      context.log('response:');
      if (response.error) {
        context.log.error(response);
      } else {
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
  }
};
