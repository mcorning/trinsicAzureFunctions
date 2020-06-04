module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body:
        '<h1>Hello ' +
        (req.query.name || req.body.name) +
        '</h1>' +
        '<img src="https://qrcode.tec-it.com/API/QRCode?data=https://redir.streetcred.id/UfZTW4K4tmR9" />',
      headers: {
        'Content-Type': 'text/html',
      },
    };
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body',
    };
  }
};
