const jwt = require('jsonwebtoken');
const database = require('../datalayer/mssql.dao');
const assert = require('assert');
const logger = require('../config/appconfig').logger;

//Creating validator for later use
const phoneValidator = new RegExp('^06(| |-)[0-9]{8}$');
const emailValidator = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");


module.exports = {

    registerUser: (req, res, next) => {
        console.log("registerUser aangeroepen");

        // Get user info from the req.body
        const user = req.body;
        const firstName = req.body.FirstName;
        const lastName = req.body.LastName;
        const streetAddress = req.body.StreetAddress;
        const postalCode = req.body.PostalCode;
        const city = req.body.City;
        const dateOfBirth = req.body.DateOfBirth;
        const phoneNumber = req.body.PhoneNumber;
        const emailAddress = req.body.EmailAddress;
        const password = req.body.Password;

        // Verify correct fields are filled
        try {
            assert(firstName, 'Please fill in a first name.');
            assert(lastName, 'Please fill in a last name.');
            assert(streetAddress, 'Please fill in a street address.');
            assert(postalCode, 'Please fill in a postalcode.');
            assert(city, 'Please fill in a city.');
            assert(dateOfBirth, 'Please fill in your date of birth.');
            assert(phoneNumber, 'Please fill in a phonenumber.');
            assert(emailAddress, 'Please fill in a emailaddress.');
            assert(password, 'Please fill in a password.');

            // Add validators to certain fields
            assert(phoneValidator.test(phoneNumber), 'A valid phoneNumber is required.');
            assert(emailValidator.test(emailAddress), 'A valid address is required.');
            

          } catch (ex) {
            const errorObject = {
              message: 'Validation fails: ' + ex.toString(),
              code: 500
            }
            return next(errorObject)
          }

        const query = `INSERT INTO DBUser VALUES ( '${user.FirstName}', '${user.LastName}', '${user.StreetAddress}', '${user.PostalCode}', '${user.City}', '${user.DateOfBirth}', '${user.PhoneNumber}', '${user.EmailAddress}', '${user.Password}' );`+
        `SELECT * FROM DBUser WHERE UserId = SCOPE_IDENTITY()`;


        // Run query and return result

        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
              const errorObject = {
                message: 'Er ging iets mis in de database.',
                code: 500
              }
              next(errorObject)
            }
            if (rows) {
              res.status(200).json({ result: rows})
            }
          })
    },

    loginUser: (req, res, next) => {

        console.log("loginUser aangeroepen");
        
        // get user information from req.body
        const user = req.body;
        const email = req.body.EmailAddress;
        const password = req.body.Password;

        try{
          assert(email, 'Please fill in a emailaddress.');
          assert(password, 'Please fill in a password.');

          assert(emailValidator.test(email), 'A valid address is required.');
        } catch (ex) {
          const errorObject = {
            message: 'Validation fails: ' + ex.toString(),
            code: 500
          }
          return next(errorObject)
        }

        // SELECT query for database
        const query = `SELECT Password, UserId FROM [DBUser] WHERE EmailAddress='${user.EmailAddress}'`;

        // Run query and return result
        database.executeQuery(query, (err, rows) => {
          // Handle error or result
          if (err) {
            const errorObject = {
              message: 'Er ging iets mis in de database.',
              code: 500
            }
            next(errorObject)
          }
          if (rows) {
            if (rows.length === 0 || req.body.Password !== rows[0].Password) {
              const errorObject = {
                message: 'Geen toegang: email bestaat niet of password is niet correct!',
                code: 412
              }
              next(errorObject)
            } else {
    
            console.log('Password match, user logged id');
            console.log(rows.recordset)

              // Create payload which we put in the token
              // When verifing we can extract the payload from the token
              const payload = {
                UserId: rows[0].UserId
              }
              jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60*60 }, (err, token) => {
                if (err) {
                  const errorObject = {
                    message: 'Kon geen JWT genereren.',
                    code: 500
                  }
                  next(errorObject)
                }
                if (token) {
                  res.status(200).json({token: token})
                }
              })
            }
          }
        })
      },

      validateToken: (req, res, next) => {
        logger.info('validateToken aangeroepen')
        // logger.debug(req.headers)
        const authHeader = req.headers.authorization
        if (!authHeader) {
          errorObject = {
            message: 'Authorization header missing!',
            code: 401
          }
          logger.warn('Validate token failed: ', errorObject.message)
          return next(errorObject)
        }
        
        const token = authHeader;
        console.log("TOKEN: " + token);
        
        // Verify if token was correct

        jwt.verify(token, 'secretkey', (err, payload) => {
          if (err) {
            errorObject = {
              message: 'not authorized',
              code: 401
            }
            console.log('Validate token failed: '+ errorObject.message)
            next(errorObject)
          }
          logger.trace('payload', payload)

          if (payload.data && payload.data.UserId) {
            console.log('token is valid', payload)
            // User heeft toegang. Voeg UserId uit payload toe aan
            // request, voor ieder volgend endpoint.
            req.userId = payload.data.UserId
            next()
          } else {
            errorObject = {
              message: 'UserId is missing!',
              code: 401
            }
            logger.warn('Validate token failed: ', errorObject.message)
            next(errorObject)
          }
        })
      },

}