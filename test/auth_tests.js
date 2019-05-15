const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const server = require('../app');

chai.should();
chai.use(chaiHttp);

let validToken;

describe('Registration,',()=>{
    it('should return an error on GET request', (done) =>{
        chai.request(server)
        .get('/api/register')
        .end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })

    it('should throw an error when the user already exists', (done) =>{
        chai.request(server)
        .post('/api/register')
        .send({
            FirstName : "test",
	        LastName : "Doodewaard",
	        StreetAddress : "test",
	        PostalCode : "4823 KK",
	        City : "test",
	        DateOfBirth : "1998-07-07",
	        PhoneNumber : "0642890127",
	        EmailAddress: "test.test@test.4",
	        Password : "test123"
        })
        .end((err,res)=>{
            res.should.have.status(500)
            done()
        })
    })

    // it('should return a valid ID when posting a valid object',(done)=>{
    //     chai.request(server)
    //     .post('/api/register')
    //     .send({
    //         FirstName : "test",
	//         LastName : "Doodewaard",
	//         StreetAddress : "test",
	//         PostalCode : "4823 KK",
	//         City : "test",
	//         DateOfBirth : "1998-07-07",
	//         PhoneNumber : "0642890127",
	//         EmailAddress: "test.test@test.11",
	//         Password : "test123"
    //     })
    //     .end((err,res)=>{
    //         res.should.have.status(200)
    //         const result = res.body.result
    //         result.should.be.an('array').that.has.length(1);
    //         const user = result[0];
    //         user.should.have.property('UserId')
    //         user.should.have.property('FirstName').that.is.a('string')
    //         user.should.have.property('LastName').that.is.a('string')
    //         user.should.have.property('StreetAddress').equals('test')
    //         user.should.have.property('PostalCode').equals('4823 KK')
    //         user.should.have.property('City').that.is.a('string')
    //         user.should.have.property('DateOfBirth')
    //         user.should.have.property('PhoneNumber').equals('0642890127')
    //         user.should.have.property('EmailAddress').equals('test.test@test.11')
    //         user.should.have.property('Password').equals('test123')
    //         done()
    //     })
    // })
})

describe('Login', ()=>{
    it('should return a token when providing valid information', (done) =>{
        chai.request(server)
        .post('/api/login')
        .send({
            EmailAddress : "p.hansen@avans.nl",
	        Password : "secret"
        })
        .end((err,res)=>{
            res.should.have.status(200)
            const result = res.body
            result.should.have.property('token').which.is.an('string')
            validToken = res.body.validToken
            done()
        })
    })

    it('should throw an error when email does not exist', (done) =>{
        chai.request(server)
        .post('/api/login')
        .send({
            EmailAddress : "p.hansen@avans",
            Password : "secret"
        })
        .end((err,res)=>{
            res.should.have.status(412)
            done()
        })
    })

    it('should throw an error when email exists but password is invalid', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                EmailAddress : "p.hansen@avans.nl",
                Password : "123"
            })
            .end((err,res)=>{
                res.should.have.status(412)
                done()
            })
        })

})