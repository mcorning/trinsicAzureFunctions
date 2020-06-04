// This code needs to run after the holder has presented their proof.
// Otherwise, the response will be null
module.exports = async function (context, req) {
  require('dotenv').config();

  context.log('JavaScript HTTP trigger function processed a request.');

  if (req.query.id || (req.body && req.body.id)) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const axios = require('axios');
    axios.defaults.headers.common['Authorization'] = process.env.ACCESSTOK;
    axios.defaults.headers.common['X-Streetcred-Subscription-Key'] =
      process.env.SUBKEY;

    let url = `/verifications/${req.query.id || req.body.id}`;
    context.log('url:', url);

    let axiosResponse = await axios({
      baseURL: 'https://api.streetcred.id/agency/v1',
      url: url,
      method: 'GET',
      withCredentials: true, // key parameter to get to the Streetcred server with my dev creds
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    context.log('result', axiosResponse.data.isValid);
    context.res = {
      status: 200,
      body: { credentialIsValid: axiosResponse.data.isValid },

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

// module.exports = async function (context, req) {
//   context.log('Get Proof Results');
//   context.log('req', req);
//   if (req.query.id || (req.body && req.body.id)) {
//     // context.log('req', req);
//     // const payload = req.body;

//     context.log('*************************************************');
//     context.log('Verification req.body:\n', payload);
//     context.log('*************************************************');

//     require('dotenv').config();
//     context.log('JavaScript HTTP trigger function processed a request.');
//     const axios = require('axios');
//     axios.defaults.headers.common['Authorization'] = process.env.ACCESSTOK;
//     axios.defaults.headers.common['X-Streetcred-Subscription-Key'] =
//       process.env.SUBKEY;
//     axios.defaults.headers.post['Content-Type'] = 'application/json';

//     const {
//       AgencyServiceClient,
//       Credentials,
//     } = require('@streetcred.id/service-clients');
//     const client = new AgencyServiceClient(
//       new Credentials(process.env.ACCESSTOK, process.env.SUBKEY)
//     );
//     // context.time('Issue credential ran in');

//     let axiosResponse = await axios({
//       baseURL: 'https://api.streetcred.id/agency/v1',
//       url: `/verifications/${req.query.id || req.body.id}`,
//       method: 'GET',
//       withCredentials: true, // key parameter to get to the Streetcred server with my dev creds
//       responseType: 'json',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       // .then((response) => {
//       //   const url = response.data.offerUrl;
//       //   test = url;
//       //   context.log('offerUrl from test:', test);
//       //   context.res = {
//       //     body: 'offerUrl:' + url,
//       //     headers: {
//       //       'Content-Type': 'text/html',
//       //     },
//       //   };
//       //   context.timeEnd('Issue credential ran in');
//       // })
//       .catch(function (error) {
//         context.log('******************** START CATCH ********************');
//         if (error.response) {
//           // The request was made and the server responded with a status code
//           // that falls out of the range of 2xx
//           context.log(error.response.data);
//           context.log(error.response.status);
//           context.log(error.response.headers);
//         } else if (error.request) {
//           // The request was made but no response was received
//           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//           // http.ClientRequest in node.js
//           context.log(error.request);
//         } else {
//           // Something happened in setting up the request that triggered an Error
//           context.log('Error', error.message);
//         }
//         context.log(error.config);

//         context.log('Error Config:\n', error.config);
//         context.log('\nError Message:', error.message, '\n');
//         context.log('******************** END CATCH ********************');
//         // context.timeEnd('Issue credential ran in');
//         context.res = { body: { offerUrl: '' } };
//       });
//     context.res = {
//       body: { credentialIsValid: axiosResponse.data.isValid },
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
//   } else {
//     context.res = {
//       body: { credentialIsValid: 'could not run for lack of req' },
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
//   }
//   // context.timeEnd('Issue credential ran in');
//   context.done();
// };
