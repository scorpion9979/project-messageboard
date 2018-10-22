/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;

mongoose.connect(CONNECTION_STRING);

const Schema = mongoose.Schema;

// thread:
// board is post param
// _id, text, created_on, bumped_on, reported(boolean), delete_password, & replies(array)
const threadSchema = new Schema({
  text: {type: String, required: true},
  created_on: {type: String, required: false, default: () => new Date().toISOString()},
  bumped_on: {type: String, required: false, default: () => new Date().toISOString()},
  reported: {type: Boolean, required: false, default: false},
  delete_password: {type: String, required: true},
  replies: {type: [String], required: false, default: []},
});
const Thread = mongoose.model('Thread', threadSchema);

// thread reply:
// _id, text, created_on, delete_password, & reported
const replySchema = new Schema({
  text: {type: String, required: true},
  created_on: {type: String, required: false, default: () => new Date().toISOString()},
  delete_password: {type: String, required: true},
  reported: {type: Boolean, required: false, default: false},
});
const Reply = mongoose.model('Reply', replySchema);

module.exports = function(app) {

  app.route('/api/threads/:board');

  app.route('/api/replies/:board');

};
