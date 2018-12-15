const expect = require('expect'),
    request = require('supertest'),
    {app} = require('../app'),
    {User} = require('../api/models/UserModel'),
    {users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
describe('#users', () => {
    describe('#post user', () => {
        it('should add a new user', (done) => {
            let firstname = "Patrick",
                lastname = "Vieira",
                email = "patrick@dev.com"
                password = "captain";

            request(app)
            .post('/api/users/register')
            .send({firstname, lastname, email, password})
            .expect(200)
            .expect(res => {
                expect(res.header['auth']).toBeTruthy();
                expect(res.body.user).toBeTruthy();
                expect(res.body.user.email).toEqual(email);
            })
            .end(err => {
                if(err){
                    return done(err)
                }
                done();
            });
        });
    });
});