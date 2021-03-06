const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const server = require('../app');

chai.should();
chai.use(chaiHttp);

const authorizationHeader = 'Authorization';
let token

before(() => {
    console.log('-before: get valid token')
    const payload = {
        UserId : 13
    }
    jwt.sign({ data : payload}, 'secretkey', { expiresIn: 2 * 60}, (err, result)=>{
        if(result){
            token = result
            console.log(token);
        }
    })
})

beforeEach(() => {
    console.log('- beforeEach')
})

describe('Appartments post',()=>{
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
            res.should.have.status(200)
        })
    })
})
