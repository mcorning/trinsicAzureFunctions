module.exports = async function (context, req) {
  require('dotenv').config();
  const connId = 'cb79ecf0-9f84-459a-b608-073a7ed90bac';

  context.log('JavaScript HTTP trigger function processed a request.');
  if (req.query.connectionId || (req.body && req.body.connectionId)) {
    context.log('req:', req);

    const axios = require('axios');
    axios.defaults.headers.common['Authorization'] = process.env.ACCESSTOK;
    axios.defaults.headers.common['X-Streetcred-Subscription-Key'] =
      process.env.SUBKEY;

    const {
      AgencyServiceClient,
      Credentials,
    } = require('@streetcred.id/service-clients');
    const client = new AgencyServiceClient(
      new Credentials(process.env.ACCESSTOK, process.env.SUBKEY)
    );

    // let axiosResponse = await client.getMessage(connId);
    let axiosResponse = await client.listMessages(connId);

    context.log('result', axiosResponse);
    context.res = {
      status: 200,
      body: { messages: axiosResponse },

      headers: {
        'Content-Type': 'application/json',
      },
    };
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body',
    };
  }
};
