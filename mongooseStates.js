const mongoose = require('mongoose');

const mongooseStates = () => {
  mongoose.connection.on('connecting', () => {
    console.log(
      `connecting. readyState status is ${mongoose.connection.readyState}`
    );
  });
  mongoose.connection.on('disconnecting', () => {
    console.log(
      `Disconnecting. readyState status is ${mongoose.connection.readyState}`
    );
  });
  mongoose.connection.on('disconnected', () => {
    console.log(
      `Disconnected. readyState status is ${mongoose.connection.readyState}`
    );
  });
  mongoose.connection.on('connected', () => {
    console.log(
      `connected. readyState status is ${mongoose.connection.readyState}`
    );
  });
};

module.exports = { mongooseStates };
