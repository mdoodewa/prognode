const database = require('../datalayer/mssql.dao');
const logger = require('../datalayer/mssql.dao');

module.exports = {

    getAllAppartments: (req, res, next) => {
        logger.trace('User')
        
        console.log("Get /api/appartments aangeroepen");


        const query = "SELECT * FROM Apartment INNER JOIN ";
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
                res.status(200).json(rows)
            }
        })
    },

    createAppartment: (req, res, next) => {
        console.log("POST /api/appartments aangeroepen");

        const appartment = req.body;
        const query = `INSERT INTO Apartment VALUES('${appartment.Description}', '${appartment.StreetAddress}', '${appartment.PostalCode}', '${appartment.City}', ${appartment.UserId} )`;

        database.executeQuery(query, (err, rows) => {
            // handle result or error
            if(err){
                const errorObject = {
                    message: 'Er is iets misgegaan',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({result: 200});
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
            if(rows){
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

        const query = `UPDATE Apartment SET Apartment.Description = '${appartment.Description}', Apartment.StreetAddress = '${appartment.StreetAddress}', Apartment.PostalCode = '${appartment.PostalCode}', Apartment.City = '${appartment.City}' WHERE Apartment.ApartmentId = ${id} AND UserId=${userId};`;

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
                res.status(200).json({result: appartment});
            }
        }
        })
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
                    const errorObject = {
                        message: msg,
                        code: 401
                    }
                    next(errorObject);
                }else{
                res.status(200).json({result : rows});
            }
        }
        })
    },

    createReservation: (req, res, next) => {

        const id = req.params.id;
        const reservation = req.body;

        const query = `INSERT INTO Reservation VALUES(${id}, '${reservation.StartDate}', '${reservation.EndDate}', '${reservation.Status}', ${reservation.UserId});`;

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
                res.status(200).json({});
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
            }else{
                res.status(200).json({Result: rows});
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
            }else{
                res.status(200).json({Result: rows});
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

        const query = `UPDATE Reservation SET Reservation.Status = '${Registration.Status}' WHERE Reservation.reservationId=${rid} AND Reservation.ApartmentId=${id} AND UserId=${userId};`;

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
            }          
            else{
                res.status(200).json({});
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