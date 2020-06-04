module.exports = function (context, req) {
  context.log(
    'JavaScript HTTP trigger function processed a request from',
    req.query.name
  );

  let res = {
    body:
      '<img src="https://qrcode.tec-it.com/API/QRCode?data=https://redir.streetcred.id/UfZTW4K4tmR9" />',
    headers: {
      'Content-Type': 'text/html',
    },
  };
  context.done(null, res);
};
