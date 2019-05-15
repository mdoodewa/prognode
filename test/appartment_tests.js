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
        .get('/api/appartments')
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
        .get('/api/appartments/1')
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
        .get('/api/appartments/1')
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
