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
  replies: {type: [replySchema], required: false, default: []},
});
const Thread = mongoose.model('Thread', threadSchema);

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
     })
     .delete(function(req, res) {
       let delete_password = req.body.delete_password;
       let threadId = req.body.thread_id;
       Thread.findByIdAndUpdate(threadId, {new: true}, function(err, th) {
        if (err) {
          res.status(400)
             .send(err);
        } else if (delete_password === th.delete_password) {
          th.text = '[deleted]';
          th.save();
          res.send('success');
        } else {
          res.status(400)
             .send('incorrect password');
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
          th.bumped_on = reply.created_on;
          th.replies.push(reply);
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
      })
      .delete(function(req, res) {
        let delete_password = req.body.delete_password;
        let threadId = req.body.thread_id;
        let replyId = req.body.reply_id;
        Thread.findByIdAndUpdate(threadId, {new: true}, function(err, th) {
         if (err) {
           res.status(400)
              .send(err);
         } else {
          let rep = th.replies.id(replyId);
          if (delete_password === rep.delete_password) {
            rep.text = '[deleted]';
            th.save();
            res.send('success');
          } else {
            res.status(400)
               .send('incorrect password');
          }
         }
        });
      });
};
