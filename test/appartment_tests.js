const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const server = require('../app');

chai.should();
chai.use(chaiHttp);

const authorizationHeader = 'Authorization';
let faketoken = 0;
let token;

before(() => {
    console.log('-before: get valid token')
    const payload = {
        UserId : 13
    }
    jwt.sign({ data : payload}, 'secretkey', { expiresIn: 2 * 60}, (err, result)=>{
        if(result){
            token = result
        }
    })
})

beforeEach(() => {
    console.log('- beforeEach')
})

describe('Appartments get',() => {
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .get('/api/appartments')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return all appartments', done =>{
        chai.request(server)
        .get('/api/appartments')
        .set('Authorization', token)
        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })
})

describe('Appartments post',()=>{
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .post('/api/appartments')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return a valid id when posting a valid object', done => {
        chai.request(server)
        .post('/api/appartments')
        .set('Authorization', token)
        .send({
            Description : 'beschrijving',
            StreetAddress : 'straatnaam',
            PostalCode : '4823KK',
            City : 'breda',
            UserId : '1'
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');

            const result = res.body.result;
            result.should.be.an('array').that.has.length(1);
            const appartment = result[0];
            appartment.should.have.property('ApartmentId')
            appartment.should.have.property('Description').equals('beschrijving')
            appartment.should.have.property('StreetAddress').equals('straatnaam')
            appartment.should.have.property('PostalCode').equals('4823KK')
            appartment.should.have.property('City').equals('breda')
            appartment.should.have.property('UserId').equals(1)

            done()
        })
    })
})

describe('Appartments GET by id', ()=>{
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .get('/api/appartments/1')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return the correct appartment when using an existing appartmentId', (done) =>{
        chai.request(server)
        .get('/api/appartments/1')
        .set('Authorization', token)
        .end((err,res) => {
            res.should.have.status(200)
            done()
        })
    })

    it('should return an error when using an non-existing appartmentId', (done) => {
        chai.request(server)
        .get('/api/appartments/999')
        .set('Authorization', token)
        .end((err,res) => {
            res.should.have.status(404)
            done()
        })
    })
})

describe('Appartments PUT by id', () => {
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .put('/api/appartments/1')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return a appartment with ID when posting a valid object', (done) =>{
        chai.request(server)
        .put('/api/appartments/2')
        .set('Authorization', token)
        .send({
            Description : 'beschrijving',
            StreetAddress : 'straatnaam',
            PostalCode : '4823KK',
            City : 'breda',
            UserId : '1'
        })
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');

            const result = res.body.result;
            result.should.be.an('array').that.has.length(1);
            const appartment = result[0];
            appartment.should.have.property('ApartmentId')
            appartment.should.have.property('Description').equals('beschrijving')
            appartment.should.have.property('StreetAddress').equals('straatnaam')
            appartment.should.have.property('PostalCode').equals('4823KK')
            appartment.should.have.property('City').equals('breda')
            appartment.should.have.property('UserId').equals(1)
            done()
        })
    })
})

describe('appartement DELETE by id', ()=>{
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .delete('/api/appartments/1')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return the removed appartement when provided with a valid appartmentId',(done) =>{
        chai.request(server)
        .get('/api/appartments/15')
        .set('Authorization', token)
        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })

    it('should throw an error when provided with an invalid appartmentId',(done)=>{
        chai.request(server)
        .get('/api/appartments/666')
        .set('Authorization', token)
        .end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe('POST reservation on appartmentId', ()=>{
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .post('/api/appartments/1/reservations')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return a valid id when provided with valid information', (done)=>{
        chai.request(server)
        .post('/api/appartments/1/reservations')
        .set('Authorization', token)
        .send({
            "StartDate" : "2018-05-05",
	        "EndDate" : "2018-06-05",
	        "Status" : "accepted",
	        "UserId" : "1"
        })
        .end((err,res)=>{
            res.should.have.status(200)
            res.should.be.a('object')

            const result = res.body.result;
            result.should.be.an('array').that.has.length(1);
            const reservation = result[0];

            reservation.should.have.property('ReservationId')
            reservation.should.have.property('StartDate')
            reservation.should.have.property('EndDate')
            reservation.should.have.property('Status').equals('accepted')
            reservation.should.have.property('UserId').equals(1)
            done()
            })
    })

})

describe('Get all reservations by appartmentID', ()=>{
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .get('/api/appartments/1/reservations')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return a list of appartments when provided with a valid appartmentId', (done)=>{
        chai.request(server)
        .get('/api/appartments/1/reservations')
        .set('Authorization', token)
        .end((err, res)=> {
            res.should.have.status(200)
            done()
        })
    })

    it('should throw an error when provided with a invalid appartmentId', (done)=>{
        chai.request(server)
        .get('/api/appartments/66/reservations')
        .set('Authorization', token)
        .end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe('Get a reservation by id', ()=>{
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .get('/api/appartments/1/reservations/1')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return a valid object when provided with a valid reservation id',(done)=>{
        chai.request(server)
        .get('/api/appartments/1/reservations/1')
        .set('Authorization', token)
        .end((err, res)=>{
            res.should.have.status(200)
            done()
        })
    })

    it('should throw an error when provided with aan invalid reservation id', (done)=>{
        chai.request(server)
        .get('/api/appartments/1/reservations/80')
        .set('Authorization', token)
        .end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe('PUT update a reservation',()=>{
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .put('/api/appartments/1/reservations/1')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return a valid id when posting correct information',(done)=>{
        chai.request(server)
        .put('/api/appartments/1/reservations/1')
        .set('Authorization', token)
        .send({
            StartDate : "2018-05-05",
	        EndDate : "2018-06-05",
	        Status : "accepted",
	        UserId : "1"
        })
        .end((err,res)=>{
            res.should.have.status(200)
            res.should.be.a('object')
            done()
        })
    })
})

describe('DELETE a reservation by id',()=>{
    it('should throw an error when using an invalid JWT token', (done) =>{
        chai.request(server)
        .delete('/api/appartments/1/reservations/1')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return the removed reservation when provided with a valid appartmentId',(done) =>{
        chai.request(server)
        .get('/api/appartments/1/reservations/1')
        .set('Authorization', token)
        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })

    it('should throw an error when provided with an invalid appartmentId',(done)=>{
        chai.request(server)
        .get('/api/appartments/666/reservations/1')
        .set('Authorization', token)
        .end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })

    it('should throw an error when provided with an invalid reservatonId', (done)=>{
        chai.request(server)
        .get('/api/appartments/1/reservations/500')
        .set('Authorization', token)
        .end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
})
