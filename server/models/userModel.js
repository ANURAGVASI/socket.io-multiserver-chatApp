
const mongoose = require('mongoose');
// intializing mongoose schema
const schema = mongoose.Schema;
//creating user schema
let user = new schema({
    username: String,
    email: String,
});
module.exports = mongoose.model('users',user);