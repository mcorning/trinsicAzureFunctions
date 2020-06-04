module.exports = async function (context, req) {
  let test = true;
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
  console.time('Issue credential ran in');
  const payload = req.body;

  console.log('*************************************************');
  console.log('Credential req.body:\n', payload);
  // console.log('Request body when testing with swagger:');
  // console.log(JSON.stringify(payload));
  console.log('*************************************************');

  let axiosResponse = await axios({
    baseURL: 'https://api.streetcred.id/agency/v1',
    url: '/credentials',
    method: 'POST',
    data: payload,
    withCredentials: true, // key parameter to get to the Streetcred server with my dev creds
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    // .then((response) => {
    //   const url = response.data.offerUrl;
    //   test = url;
    //   console.log('offerUrl from test:', test);
    //   context.res = {
    //     body: 'offerUrl:' + url,
    //     headers: {
    //       'Content-Type': 'text/html',
    //     },
    //   };
    //   console.timeEnd('Issue credential ran in');
    // })
    .catch(function (error) {
      console.log('******************** START CATCH ********************');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);

      console.log('Error Config:\n', error.config);
      console.log('\nError Message:', error.message, '\n');
      console.log('******************** END CATCH ********************');
      console.timeEnd('Issue credential ran in');
      context.res = { body: { offerUrl: '' } };
    });
  context.res = {
    body: { offerUrl: axiosResponse.data.offerUrl },
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.timeEnd('Issue credential ran in');
  context.done();
};
