module.exports = {
    logger: require('tracer').colorConsole({
      format: [
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
        {
          error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})' // error format
        }
      ],
      dateformat: 'HH:MM:ss.L',
      preprocess: function(data) {
        data.title = data.title.toUpperCase()
      },
      level: process.env.LOG_LEVEL || 'trace'
    }),
  
    dbconfig: {
      user: process.env.DB_User || 'sa',
      password: 'test',
      server: '127.0.0.1',
      database: 'Prog4-Eindopdracht1',
      port: 1433,
      driver: 'msnodesql',
      connectionTimeout: 1500,
      options: {
        // 'true' if you're on Windows Azure
        encrypt: false
      }
    }
  }