var mongojs = require('mongojs');

var databaseUrl = 'cloud';
var collections = ['events', 'participants'];

var connect = mongojs(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;

module.exports = {
    connect: connect,
    ObjectId: ObjectId
};