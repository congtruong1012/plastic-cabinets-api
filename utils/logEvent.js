const fs = require("fs").promises;
const { format } = require("date-fns");
const path = require("path");

const now = format(new Date(), "dd-MM-yyyy");

const fileName = path.join(__dirname, "../logs", `app-${now}.log`);

const logEvent = async (msg) => {
  try {
    console.log("\x1b[36m", msg);
    fs.appendFile(fileName, msg);
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvent;
