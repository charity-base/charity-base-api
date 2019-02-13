// const fs = require('fs')
const bunyan = require('bunyan')

// const LOGS_DIR = './logs'

// try {
//   fs.mkdirSync(LOGS_DIR)
// } catch (e) {}

const log = bunyan.createLogger({
  name: 'main',
  streams: [
    {
      level: 'debug',
      stream: process.stdout
    },
    // {
    //   level: 'info',
    //   type: 'rotating-file',
    //   path: `${LOGS_DIR}/main.log`,
    //   period: '1d',
    //   count: 10,
    // },
    // {
    //   level: 'error',
    //   type: 'rotating-file',
    //   path: `${LOGS_DIR}/error.log`,
    //   period: '1d',
    //   count: 10,
    // },
  ],
  // level: <level name or number>,      // Optional, see "Levels" section 
  // serializers: <serializers mapping>, // Optional, see "Serializers" section 
  // src: <boolean>,                     // Optional, see "src" section 
  // foo: 'bar',
})

module.exports = log
