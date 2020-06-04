//
//

module.exports = async function (context, req) {
  context.log('OfferProof');
  const payload = req.body;

  context.log('*************************************************');
  context.log('Credential req.body:\n', payload);
  context.log('*************************************************');

  require('dotenv').config();
  context.log('JavaScript HTTP trigger function processed a request.');
  const axios = require('axios');
  axios.defaults.headers.common['Authorization'] = process.env.ACCESSTOK;
  axios.defaults.headers.common['X-Streetcred-Subscription-Key'] =
    process.env.SUBKEY;
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  const {
    AgencyServiceClient,
    Credentials,
  } = require('@streetcred.id/service-clients');
  const client = new AgencyServiceClient(
    new Credentials(process.env.ACCESSTOK, process.env.SUBKEY)
  );
  let axiosResponse = await axios({
    baseURL: 'https://api.streetcred.id/agency/v1',
    url: `/verifications/policy/${payload.policyId}/connections/${payload.connectionId}`,
    method: 'PUT',
    withCredentials: true, // key parameter to get to the Streetcred server with my dev creds
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(function (error) {
    context.log('******************** START CATCH ********************');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      context.log(error.response.data);
      context.log(error.response.status);
      context.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      context.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      context.log('Error', error.message);
    }
    context.log(error.config);

    context.log('Error Config:\n', error.config);
    context.log('\nError Message:', error.message, '\n');
    context.log('******************** END CATCH ********************');
    // console.timeEnd('Issue credential ran in');
    context.res = { body: { offerUrl: '' } };
  });
  context.log('response', axiosResponse.data);
  context.res = {
    body: axiosResponse.data,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // console.timeEnd('Issue credential ran in');
  context.done();
};
