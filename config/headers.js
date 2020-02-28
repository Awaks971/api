/**
 * Set `options` headers for GraphQL.
 * Access-Control-Allow-Origin: *
 * Access-Control-Allow-Methods: `GET, PUT, POST, DELETE, OPTIONS`
 * Send status code 200 if OPTIONS method is used
 */

function setHeaders(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  //intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    //respond with 200
    res.sendStatus(200);
  } else {
    //move on
    next();
  }
}

module.exports = setHeaders;
