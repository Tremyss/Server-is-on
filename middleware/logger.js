const moment = require("moment");

// ! create middleware
const logger = (req, res, next) => {
    // * every time we run a request, this middleware will run. we have access to req and res and we can run any code we want
    // * lets log the url and date
    console.log(
      `${req.protocol}://${req.get("host")}${
        req.originalUrl
      }: ${moment().format()}`
    );
    console.log("hello");
    next();
};

module.exports = logger;