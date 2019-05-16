const database = require('../datalayer/mssql.dao');
const logger = require('../config/appconfig').logger;
const assert = require('assert');

module.exports = {

    getAllAppartments: (req, res, next) => {
        logger.trace('User')
        
        console.log("Get /api/appartments aangeroepen");


        const query = 
        'select a.*, u.firstname, u.lastname, r.startdate, r.enddate, r.status from apartment as a join dbuser as u on u.userid = a.userid join reservation as r on r.apartmentid = a.apartmentid';        ;
        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }
            if(rows){
                res.status(200).json({result: rows})
            }
        })
    },

    createAppartment: (req, res, next) => {
        console.log("POST /api/appartments aangeroepen");

        const appartment = req.body;
        const description = req.body.Description;
        const streetAddress = req.body.StreetAddress;
        const postalCode = req.body.PostalCode;
        const city = req.body.City;
        const userId = req.body.UserId;

        try{

        assert(description, 'Please fill in a description');
        assert(streetAddress, 'Please fill in a street address');
        assert(postalCode, 'Please fill in a postalcode');
        assert(city, 'Please fill in a city');
        assert(userId, 'Please fill in a user id');
        } catch(ex){
            const errorObject = {
                message : ex.toString(),
                code : 500
            }
            return next(errorObject);
        }

        
        const query = `INSERT INTO Apartment VALUES('${appartment.Description}', '${appartment.StreetAddress}', '${appartment.PostalCode}', '${appartment.City}', ${appartment.UserId} );`+
        "SELECT * FROM Apartment WHERE ApartmentId = SCOPE_IDENTITY() ";

        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }if(rows){
                res.status(200).json({result: rows});

            }
        })
    },

    getAppartment: (req, res ,next) => {
        console.log("GET /api/appartments/:id aangeroepen");

        const id = req.params.id;
        const query = `SELECT * FROM Apartment WHERE Apartment.ApartmentId=${id}`;

        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }            
            if(rows.length === 0){
                // Query when through but could not find appartment with id and userId
                const msg = 'Appartment not found or you have no acces to this appartment';
                logger.trace(msg);
                res.status(404).send({
                    "message" : "Niet gevonden (appartmentId bestaat niet)",
                    "DateTime" : Date
                })
            }if(rows.length !== 0){
                res.status(200).json({result: rows});
            }
        });

        console.log(query);

    },

    updateAppartment: (req, res, next) => {

        console.log("PUT /api/appartments/:id aangeroepen");

        const appartment = req.body;
        const id = req.params.id;
        const userId = req.userId;
        const description = req.body.Description;
        const streetAddress = req.body.StreetAddress;
        const postalCode = req.body.PostalCode;
        const city = req.body.City;

        try{

        assert(description, 'Please fill in a description');
        assert(streetAddress, 'Please fill in a street address');
        assert(postalCode, 'Please fill in a postalcode');
        assert(city, 'Please fill in a city');
        assert(userId, 'Please fill in a user id');
        } catch(ex){
            const errorObject = {
                message : ex.toString(),
                code : 500
            }
            return next(errorObject);
        }

        const query = `UPDATE Apartment SET Apartment.Description = '${appartment.Description}', Apartment.StreetAddress = '${appartment.StreetAddress}', Apartment.PostalCode = '${appartment.PostalCode}', Apartment.City = '${appartment.City}' WHERE Apartment.ApartmentId = ${id} AND UserId=${userId};`+
        `SELECT * FROM Apartment WHERE ApartmentId =${id}`;

        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }if(rows){ 
                res.status(200).json({result: rows});
            }
        }
        )
    },

    deleteAppartment: (req, res, next) => {
        
        console.log("DELETE /api/appartments/:id aangeroepen");

        const userId = req.userId;
        const id = req.params.id;

        const query = `DELETE FROM Apartment WHERE Apartment.ApartmentId=${id} AND UserId=${userId}`;

        database.executeQuery(query, (err, rows) => {
        // handle result or error
            if(err){
                logger.trace('Could not delete appartment: '+err);
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }if(rows){
                if(rows.rowsAffected[0] === 0){
                    // Query when through but could not find appartment with id and userId
                    const msg = 'Appartment not found or you have no acces to this appartment';
                    logger.trace(msg);
                    res.status(404).send({
                    "message" : "Niet gevonden (appartmentId bestaat niet)",
                    "DateTime" : Date
                })
                    next(errorObject);
                }else{
                res.status(200).json({result : rows});
            }
        }
        })
    },

    createReservation: (req, res, next) => {

        const id = req.params.id;
        const userId = req.body.UserId;
        const reservation = req.body;
        const startDate = req.body.StartDate
        const endDate = req.body.EndDate
        const status = req.body.Status

        try{

            assert(startDate, 'Please fill in a start date');
            assert(endDate, 'Please fill in a end date');
            assert(status, 'Please fill in a status');
            assert(userId, 'Please fill in a user id')
            } catch(ex){
                const errorObject = {
                    message : ex.toString(),
                    code : 500
                }
                return next(errorObject);
            }



        const query = `INSERT INTO Reservation VALUES(${id}, '${reservation.StartDate}', '${reservation.EndDate}', '${reservation.Status}', ${reservation.UserId});`+
        `SELECT * FROM Reservation WHERE ReservationId = SCOPE_IDENTITY()`;

        console.log("POST /api/appartments/:id/reservations");

        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({result: rows});
            }
        })
    },

    getAllReservationsByAppartment: (req, res, next) => {

        console.log("GET /api/appartments/:id/reservations");

        const id = req.params.id;
        query = `SELECT * FROM Reservation WHERE Reservation.ApartmentId = ${id};`;
        // handle result or error
        database.executeQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }if(rows.length === 0){
                // Query when through but could not find appartment with id
                const msg = 'Appartment not found';
                logger.trace(msg);
                res.status(404).send({
                    "message" : "Niet gevonden (appartmentId bestaat niet)",
                    "DateTime" : Date
                })
            }if(rows.length !== 0){
                res.status(200).json({result: rows});
            }
        
        })
    },

    getReservationByAppartment: (req, res, next) => {

        console.log("GET /api/appartments/:id/reservations/:rid");

        const id = req.params.id;
        const rid = req.params.rid;

        const query = `SELECT * FROM Reservation WHERE Reservation.ApartmentId = ${id} AND Reservation.ReservationId = ${rid};`;

        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }if(rows.length === 0){
                // Query when through but could not find appartment with id or reservation id
                const msg = 'Appartment or Reservation was not found';
                logger.trace(msg);
                res.status(404).send({
                    "message" : "Niet gevonden (appartmentId bestaat niet)",
                    "DateTime" : Date
                })
            }if(rows.length !== 0){
                res.status(200).json({result: rows});
            }
        })        
    },

    updateReservationStatus: (req, res, next) => 
    {
        console.log("PUT /api/appartments/:id/reservations/:rid");

        const id = req.params.id;
        const rid = req.params.rid;
        const Registration = req.body;
        const userId = req.userId;

        const query = `UPDATE Reservation SET Reservation.Status = '${Registration.Status}' WHERE Reservation.reservationId=${rid} AND Reservation.ApartmentId=${id} AND UserId=${userId};`+
        `SELECT * FROM Reservation WHERE ReservationId = ${rid}`;

        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }if(rows){
                if(rows.length === 0){
                    // Query when through but could not find appartment with id and userId
                    const msg = 'Appartment not found or you have no acces to this appartment';
                    logger.trace(msg);
                    const errorObject = {
                        message: msg,
                        code: 401
                    }
                    next(errorObject);
            }else{
                res.status(200).json({result: rows});
            }
        }
        })
    },

    deleteReservationByAppartment:  (req, res, next) => {

        console.log("DELETE /api/appartments/:id/reservations/:rid");

        const id = req.params.id;
        const rid = req.params.rid;
        const userId = req.userId
        
        const query = `DELETE FROM Reservation WHERE Reservation.reservationId = ${rid} AND Reservation.apartmentId = ${id} AND UserId = ${userId}`;

        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }if(rows){
                if(rows.rowsAffected[0] === 0){
                    // Query when through but could not find appartment with id and userId
                    const msg = 'Appartment not found or you have no acces to this appartment';
                    logger.trace(msg);
                    const errorObject = {
                        message: msg,
                        code: 401
                    }
                    next(errorObject);
            }else{
                res.status(200).json({});
            }
        }
        })

    }
}