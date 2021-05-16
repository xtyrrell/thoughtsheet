module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      // See https://docs.mongodb.com/drivers/node/current/compatibility/ for
      // versions compatible with the Node.js driver we're using in package.json
      version: '4.4.5',
      skipMD5: true
    },
    autoStart: false,
    instance: {
      dbName: "test"
    }
    // Or leave instance blank to have dbs be dynamic, like so
    // instance: {}
  }
};
