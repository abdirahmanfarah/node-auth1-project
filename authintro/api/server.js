const express = require("express");

const session = require("express-session");

const KnexSessionStore = require('connect-session-knex')(session);

const dbConnection = require('../database/dbConfig.js');
const apiRouter = require("./api-router.js");

const configureMiddleware = require("./configure-middleware.js");


const server = express();

const sessionConfig = {
  name: "fubar",
  secret : process.env.SESSION_SECRET || "keep it safe, keep it secret",

  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false, 
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60000
  })
}
server.use(session(sessionConfig));
configureMiddleware(server);

server.use("/api", apiRouter);

server.get("/", (req, res) => {
  res.status(200).json({message: 'Server Running!'})
});

module.exports = server;