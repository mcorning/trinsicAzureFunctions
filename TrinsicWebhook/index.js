module.exports = async function (context, req) {
  context.log('Webhook processed a request:', req);
  context.log('context:', context);
  context.log('got webhook:', req);
  console.log('webhook payload:', req.body);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: '<h3>new connection notification</h3>',
  };
  console.log('new connection notification');
};
