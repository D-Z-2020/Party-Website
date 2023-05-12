const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const Room = require('../Room')
const User = require('../User')
const bcryptjs = require("bcryptjs")

// initialize variables
let user1;
let user2;
let user3;
let mongodb;
let hashedPassword1;
let hashedPassword2;
let hashedPassword3;

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

// testing for User schema

it('get users', async () => {
    const allUsers = await User.find({});
    expect(allUsers.length).toBe(3)
})

it('get user', async () => {
    const aUser = await User.findOne({ _id: new mongoose.Types.ObjectId('000000000000000000000001') });
    expect(aUser._id).toEqual(new mongoose.Types.ObjectId('000000000000000000000001'))
})

it('user info', async () => {
    const allUsers = await User.find({});
    expect(allUsers[0].name).toBe("1");
    expect(allUsers[1].name).toBe("2");
    expect(allUsers[2].name).toBe("3");

    expect(allUsers[0].password).toBe(hashedPassword1);
    expect(allUsers[1].password).toBe(hashedPassword2);
    expect(allUsers[2].password).toBe(hashedPassword3);

    expect(allUsers[0].roomId).toBe('000000000000000000000010');
    expect(allUsers[1].roomId).toBe('000000000000000000000011');
    expect(allUsers[2].roomId).toBe(null);

    expect(allUsers[0]._id).toEqual(new mongoose.Types.ObjectId('000000000000000000000001'));
    expect(allUsers[1]._id).toEqual(new mongoose.Types.ObjectId('000000000000000000000002'));
    expect(allUsers[2]._id).toEqual(new mongoose.Types.ObjectId('000000000000000000000003'));
})

it('adds user success', async () => {
    const user = new User({
        name: '4',
        password: '$2a$10$hUUmRQS9nSD8ENQsqp2Iz.R6Kj7wTmERjMNyTq8T0lVvM6a4wZgoi',
    });

    await user.save();

    const userFromDatabase = await User.findOne({ name: '4' });
    expect(userFromDatabase.roomId).toBe(null);
    expect(userFromDatabase.name).toBe('4');
    expect(userFromDatabase.password).toBe('$2a$10$hUUmRQS9nSD8ENQsqp2Iz.R6Kj7wTmERjMNyTq8T0lVvM6a4wZgoi');
});


it('add user with no name fail', async () => {
    const user = new User({
        password: '$2a$10$hUUmRQS9nSD8ENQsqp2Iz.a2Kj7wTmERjMNyTq8T0lVvM6a4wZgoi',
    });
    return expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
});

it('add room with duplicate name fail', async () => {
    const user = new User({
        name: "1",
        password: '$2a$10$hUUmRQS9nSD8ENQsqp2Iz.a2Kj7wTmERjMNyTq8T0lVvM6a4wZgoi',
    });
    return expect(user.save()).rejects.toThrow(mongoose.Error.MongoServerError);
});


// testing for Room schema
it('get rooms', async () => {
    const allRooms = await Room.find({});
    expect(allRooms.length).toBe(2)
})

it('get room', async () => {
    const aRoom = await Room.findOne({ _id: new mongoose.Types.ObjectId('000000000000000000000010') });
    expect(aRoom._id).toEqual(new mongoose.Types.ObjectId('000000000000000000000010'))
})

it('room info', async () => {
    const allRooms = await Room.find({});
    expect(allRooms[0].hostUser).toBe("1");
    expect(allRooms[1].hostUser).toBe("2");

    expect(allRooms[0].queue).toEqual([]);
    expect(allRooms[1].queue).toEqual([]);

    expect(allRooms[0].links).toEqual([]);
    expect(allRooms[1].links).toEqual(["www.google.com"]);

    expect(allRooms[0].partyName).toBe("My Party");
    expect(allRooms[1].partyName).toBe("My Party");

    expect(allRooms[0].location).toBe("not specificed");
    expect(allRooms[1].location).toBe("NZ");

    expect(allRooms[0].code).toBe("1000");
    expect(allRooms[1].code).toBe("1001");

    expect(allRooms[0].date).toBe("2023-05-11 08:56");
    expect(allRooms[1].date).toBe("2023-05-10 02:56");

    expect(allRooms[0]._id).toEqual(new mongoose.Types.ObjectId('000000000000000000000010'));
    expect(allRooms[1]._id).toEqual(new mongoose.Types.ObjectId('000000000000000000000011'));
})

it('adds room success', async () => {
    const room = new Room({
        hostUser: '3',
        code: "1002"
    });

    await room.save();

    const roomFromDatabase = await Room.findOne({ hostUser: '3' });
    expect(roomFromDatabase.queue).toEqual([]);
    expect(roomFromDatabase.links).toEqual([]);
    expect(roomFromDatabase.partyName).toBe("My Party");
    expect(roomFromDatabase.location).toBe("Not specified");
    expect(roomFromDatabase.code).toBe("1002");
});

it('add room with no host fail', async () => {
    const room = new Room({
        code: '1003'
    });
    return expect(room.save()).rejects.toThrow(mongoose.Error.ValidationError);
});

it('add room with no code fail', async () => {
    const room = new Room({
        hostUser: '3'
    });
    return expect(room.save()).rejects.toThrow(mongoose.Error.ValidationError);
});

it('add room with duplicate host fail', async () => {
    const room = new Room({
        hostUser: '1',
        code: "1002"
    });
    return expect(room.save()).rejects.toThrow(mongoose.Error.MongoServerError);
});

it('add room with duplicate code fail', async () => {
    const room = new Room({
        hostUser: '3',
        code: "1001"
    });
    return expect(room.save()).rejects.toThrow(mongoose.Error.MongoServerError);
});