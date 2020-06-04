require('dotenv').config();

const {
  AgencyServiceClient,
  Credentials,
} = require('@streetcred.id/service-clients');
const client = new AgencyServiceClient(
  new Credentials(process.env.ACCESSTOK, process.env.SUBKEY)
);

const createConnectionInvitation = async () => {
  var invitation = await client.createConnection({
    connectionInvitationParameters: {
      multiParty: true,
      connectionId: 'mcorning',
    },
  });
  console.log(invitation);
};

createConnectionInvitation();
