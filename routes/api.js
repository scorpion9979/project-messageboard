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
var ObjectId = require('mongoose').ObjectId;
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;

mongoose.connect(CONNECTION_STRING);

const Schema = mongoose.Schema;

// thread:
// board is post param
// _id, text, created_on, bumped_on, reported(boolean), delete_password, & replies(array)
const threadSchema = new Schema({
  _id: {type: String, required: true},
  text: {type: String, required: true},
  created_on: {type: String, required: false, default: () => new Date().toISOString()},
  bumped_on: {type: String, required: false, default: () => new Date().toISOString()},
  reported: {type: Boolean, required: false, default: false},
  delete_password: {type: String, required: true},
  replies: {type: [Object], required: false, default: []},
});
const Thread = mongoose.model('Thread', threadSchema);

// thread reply:
// _id, text, created_on, delete_password, & reported
const replySchema = new Schema({
  _id: {type: String, required: true},
  text: {type: String, required: true},
  created_on: {type: String, required: false, default: () => new Date().toISOString()},
  delete_password: {type: String, required: true},
  reported: {type: Boolean, required: false, default: false},
});
const Reply = mongoose.model('Reply', replySchema);

module.exports = function(app) {

  app.route('/api/threads/:board')
     .post(function(req, res) {
       let board = req.params.board;
       let id = board === 'test' ? req.body._id : new ObjectId();
       let text = req.body.text;
       let delete_password = req.body.delete_password;
       let thread = new Thread({_id: id, text: text, delete_password: delete_password});
       thread.save(function(err, th) {
         if (err) {
           res.status(400)
              .send(err);
         } else {
           res.send(th);
         }
       });
     });

  app.route('/api/replies/:board')
     .post(function(req, res) {
       let board = req.params.board;
       let id = board === 'test' ? req.body._id : new ObjectId();
       let threadId = req.body.thread_id;
       let text = req.body.text;
       let delete_password = req.body.delete_password;
       Thread.findByIdAndUpdate(threadId, {new: true}, function(err, th) {
         if (err) {
           res.status(400)
              .send(err);
         } else {
          let reply = new Reply({_id: id, text: text, delete_password: delete_password});
          reply.save(function(err1, rep) {
            if (err1) {
              res.status(400)
                 .send(err1);
             } else {
               th.bumped_on = rep.created_on;
               th.replies.push(rep);
               th.save(function(err2, th1) {
                if (err2) {
                  res.status(400)
                     .send(err2);
                 } else {
                  res.send(th1);
                 }
               });
             }
           });
         }
       });
      });
};
