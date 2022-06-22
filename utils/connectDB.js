const mongoose = require("mongoose");

const conn = mongoose.createConnection(process.env.DB_URL);

conn.on("connected", function () {
  console.log(`Connected ${this.name}`);
});

conn.on("disconnected", function () {
  console.log(`Disconnected ${this.name}`);
});

conn.on("error", function (error) {
  console.log(`Error ${JSON.stringify(error)}`);
});

process.on("SIGINT", async () => {
  await conn.close();
  process.exit(0);
});

module.exports = conn;
