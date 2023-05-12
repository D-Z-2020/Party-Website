const express = require('express')
const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const mongoose = require('mongoose')
const Room = require('../../model/Room')
const User = require('../../model/User')
const bcryptjs = require("bcryptjs")
const dotenv = require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser');
const userAuthenticate = require('../../middleware/userAuthenticate')

// initialize variables
let user1;
let user2;
let user3;
let mongodb;
let hashedPassword1;
let hashedPassword2;
let hashedPassword3;
const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/clientCredentialsFlow', require('../clientCredentialsFlow'))
app.use('/userLogin', require('../userLogin'))
app.use('/room', userAuthenticate, require('../room'))
app.use('/updateQueue', userAuthenticate, require('../updateQueue'))
app.use('/updateLinks', userAuthenticate, require("../updateLinks"))
app.use('/joinRoom', userAuthenticate, require('../joinRoom'))
app.use("/changeSetting", userAuthenticate, require('../changeSetting'))
app.use("/getRoomInfo", userAuthenticate, require('../getRoomInfo'))
app.use("/userRoom", userAuthenticate, require('../userRoom'))
app.use("/dismissRoom", userAuthenticate, require('../dismissRoom'))
app.use("/leaveRoom", userAuthenticate, require('../leaveRoom'))

const room1 = {
    _id: new mongoose.Types.ObjectId('000000000000000000000010'),
    hostUser: "1",
    queue: [],
    links: [],
    partyName: "My Party",
    location: "not specificed",
    code: "1000",
    date: "2023-05-11 08:56",
    __v: 0
}

const room2 = {
    _id: new mongoose.Types.ObjectId('000000000000000000000011'),
    hostUser: "2",
    queue: [],
    links: ["www.google.com"],
    partyName: "My Party",
    location: "NZ",
    code: "1001",
    date: "2023-05-10 02:56",
    __v: 0
}

// Setup and teardown
beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    await mongoose.connect(mongodb.getUri(), { useNewUrlParser: true });

    hashedPassword1 = await bcryptjs.hash("1", 10)
    hashedPassword2 = await bcryptjs.hash("2", 10)
    hashedPassword3 = await bcryptjs.hash("3", 10)

    user1 = {
        _id: new mongoose.Types.ObjectId('000000000000000000000001'),
        name: "1",
        password: hashedPassword1,
        roomId: '000000000000000000000010',
        __v: 0
    };

    user2 = {
        _id: new mongoose.Types.ObjectId('000000000000000000000002'),
        name: "2",
        password: hashedPassword2,
        roomId: "000000000000000000000011",
        __v: 0
    };

    user3 = {
        _id: new mongoose.Types.ObjectId('000000000000000000000003'),
        name: "3",
        password: hashedPassword3,
        roomId: null,
        __v: 0
    };
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    await User.insertMany([user1, user2, user3]);
    await Room.insertMany([room1, room2]);

    // ensure indexes to enforce uniqueness
    await Room.ensureIndexes();
    await User.ensureIndexes();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
});


describe('GET /clientCredentialsFlow', () => {
    // testing that client credential flow endpoint can return accessToken and expiresIn
    it('Spotify client credential flow', (done) => {
        request(app)
            .get('/clientCredentialsFlow')
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                const tokenInfo = res.body;
                expect(tokenInfo).toBeTruthy();
                expect(tokenInfo.accessToken).toBeTruthy();
                expect(tokenInfo.expiresIn).toBeTruthy();
                return done();
            });
    });
});

describe('POST /userLogin', () => {
    it('user login success', (done) => {
        request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body).toBeTruthy();
                expect(res.body.token).toBeTruthy();
                return done();
            });
    });

    it('user login fail, name does not exist', (done) => {
        request(app)
            .post('/userLogin')
            .send({
                name: "5",
                password: "1"
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('user login fail, invalid password', (done) => {
        request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "2"
            })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('GET /room', () => {
    let token_user3;
    let token_user1;

    beforeAll(async () => {
        const res = await request(app)
            .post('/userLogin')
            .send({
                name: "3",
                password: "3"
            })
            .expect(200)

        token_user3 = res.body.token

        const res2 = await request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
        token_user1 = res2.body.token
    });

    it('create room for host', (done) => {
        request(app)
            .get('/room')
            .set('x-access-token', token_user3)
            .send()
            .expect(201)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body).toBeTruthy();
                expect(res.body.queue).toEqual([]);
                expect(res.body.links).toEqual([]);
                expect(res.body.hostUser).toBe("3");
                expect(res.body.partyName).toBe("My Party");
                expect(res.body.location).toBe("Not specified");
                expect(res.body.code).toBe("1002");
                return done();
            });
    });

    it('restore room for host', (done) => {
        request(app)
            .get('/room')
            .set('x-access-token', token_user1)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body).toBeTruthy();
                expect(res.body.queue).toEqual([]);
                expect(res.body.links).toEqual([]);
                expect(res.body.hostUser).toBe("1");
                expect(res.body.partyName).toBe('My Party');
                expect(res.body.location).toBe("not specificed");
                expect(res.body.code).toBe("1000");
                expect(res.body.date).toBe('2023-05-11 08:56');
                return done();
            });
    });

    it('access denied for unauthenticated user', (done) => {
        request(app)
            .get('/room')
            .set('x-access-token', "wrong token")
            .send()
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('POST /updateQueue', () => {
    let token_user1;

    beforeAll(async () => {
        const res = await request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
        token_user1 = res.body.token
    });

    it('add track', (done) => {
        request(app)
            .post('/updateQueue')
            .set('x-access-token', token_user1)
            .send({
                roomId: '000000000000000000000010',
                updatedQueue: ['new track']
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('access denied for unauthenticated user', (done) => {
        request(app)
            .post('/updateQueue')
            .set('x-access-token', "wrong token")
            .send({
                roomId: '000000000000000000000010',
                updatedQueue: ['new track']
            })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('POST /updateLinks', () => {
    let token_user1;

    beforeAll(async () => {
        const res = await request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
        token_user1 = res.body.token
    });

    it('add link', (done) => {
        request(app)
            .post('/updateLinks')
            .set('x-access-token', token_user1)
            .send({
                roomId: '000000000000000000000010',
                updatedLinks: ['link1', 'link2']
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('access denied for unauthenticated user', (done) => {
        request(app)
            .post('/updateLinks')
            .set('x-access-token', "wrong token")
            .send({
                roomId: '000000000000000000000010',
                updatedLinks: ['link1', 'link2']
            })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('POST /joinRoom', () => {
    let token_user3;
    let token_user1;

    beforeAll(async () => {
        const res = await request(app)
            .post('/userLogin')
            .send({
                name: "3",
                password: "3"
            })
            .expect(200)

        token_user3 = res.body.token

        const res2 = await request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
        token_user1 = res2.body.token
    });

    it('normal join', (done) => {
        request(app)
            .post('/joinRoom')
            .set('x-access-token', token_user3)
            .send({
                code: "1000"
            })
            .expect(201)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('host join prev room', (done) => {
        request(app)
            .post('/joinRoom')
            .set('x-access-token', token_user1)
            .send({
                code: "1000"
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('host join new room', (done) => {
        request(app)
            .post('/joinRoom')
            .set('x-access-token', token_user1)
            .send({
                code: "1001"
            })
            .expect(202)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('wrong room code', (done) => {
        request(app)
            .post('/joinRoom')
            .set('x-access-token', token_user1)
            .send({
                code: "99"
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });


    it('access denied for unauthenticated user', (done) => {
        request(app)
            .post('/joinRoom')
            .set('x-access-token', "wrong token")
            .send()
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('POST /changeSetting', () => {
    let token_user1;

    beforeAll(async () => {
        const res = await request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
        token_user1 = res.body.token
    });

    it('change setting', (done) => {
        request(app)
            .post('/changeSetting')
            .set('x-access-token', token_user1)
            .send({
                roomId: '000000000000000000000010',
                partyName: 'new party name',
                location: 'new location',
                date: 'new date'
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('access denied for unauthenticated user', (done) => {
        request(app)
            .post('/changeSetting')
            .set('x-access-token', "wrong token")
            .send({
                partyName: 'new party name',
                location: 'new location',
                date: 'new date'
            })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('GET /getRoomInfo', () => {
    let token_user1;

    beforeAll(async () => {
        const res2 = await request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
        token_user1 = res2.body.token
    });

    it('get room information', (done) => {
        request(app)
            .get('/getRoomInfo')
            .set('x-access-token', token_user1)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body).toBeTruthy();
                expect(res.body._id).toBe('000000000000000000000010');
                expect(res.body.queue).toEqual([]);
                expect(res.body.links).toEqual([]);
                expect(res.body.hostUser).toBe("1");
                expect(res.body.partyName).toBe("My Party");
                expect(res.body.location).toBe("not specificed");
                expect(res.body.code).toBe("1000");
                return done();
            });
    });

    it('access denied for unauthenticated user', (done) => {
        request(app)
            .get('/getRoomInfo')
            .set('x-access-token', "wrong token")
            .send()
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('GET /userRoom', () => {
    let token_user3;
    let token_user1;

    beforeAll(async () => {
        const res = await request(app)
            .post('/userLogin')
            .send({
                name: "3",
                password: "3"
            })
            .expect(200)

        token_user3 = res.body.token

        const res2 = await request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
        token_user1 = res2.body.token
    });

    it('get host room code', (done) => {
        request(app)
            .get('/userRoom')
            .set('x-access-token', token_user1)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body).toBeTruthy();
                expect(res.body).toBe('1000');
                return done();
            });
    });

    it('get room code for user with no room', (done) => {
        request(app)
            .get('/userRoom')
            .set('x-access-token', token_user3)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body).toBeFalsy();
                return done();
            });
    });

    it('access denied for unauthenticated user', (done) => {
        request(app)
            .get('/userRoom')
            .set('x-access-token', "wrong token")
            .send()
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('GET /dismissRoom', () => {
    let token_user3;
    let token_user1;

    beforeAll(async () => {
        const res = await request(app)
            .post('/userLogin')
            .send({
                name: "3",
                password: "3"
            })
            .expect(200)

        token_user3 = res.body.token

        const res2 = await request(app)
            .post('/userLogin')
            .send({
                name: "1",
                password: "1"
            })
            .expect(200)
        token_user1 = res2.body.token
    });

    it('host dismiss the room', (done) => {
        request(app)
            .get('/dismissRoom')
            .set('x-access-token', token_user1)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('guest dismiss the room fail', (done) => {
        request(app)
            .get('/dismissRoom')
            .set('x-access-token', token_user3)
            .send()
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('access denied for unauthenticated user', (done) => {
        request(app)
            .get('/dismissRoom')
            .set('x-access-token', "wrong token")
            .send()
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('GET /leaveRoom', () => {
    let token_user3;

    beforeAll(async () => {
        const res = await request(app)
            .post('/userLogin')
            .send({
                name: "3",
                password: "3"
            })
            .expect(200)

        token_user3 = res.body.token

        await request(app)
            .post('/joinRoom')
            .set('x-access-token', token_user3)
            .send({
                code: "1000"
            })
            .expect(201);
    });

    it('guest leave the room', (done) => {
        request(app)
            .get('/leaveRoom')
            .set('x-access-token', token_user3)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('access denied for unauthenticated user', (done) => {
        request(app)
            .get('/leaveRoom')
            .set('x-access-token', "wrong token")
            .send()
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});




