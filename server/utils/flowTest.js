module.exports = (req, res, next) => {
  if(process.env.NODE_ENV !== "test") {
  console.log('\n########## Flow Test ##########');
  console.log('-------------------------------');
  console.log(`URL    : ${JSON.stringify(req.originalUrl, null, 2)}`);
  console.log(`Method : ${JSON.stringify(req.method, null, 2)}`);
  // console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
  console.log(`Body   : ${JSON.stringify(req.body, null, 2)}`);
  console.log(`Cookies: ${JSON.stringify(req.cookies, null, 2)}`);
  console.log(`Params : ${JSON.stringify(req.params, null, 2)}`);
  console.log(`Query  : ${JSON.stringify(req.query, null, 2)}`);
  
  }

  return next();
};
