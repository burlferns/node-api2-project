const express = require("express");

const postsRouter = require("../posts/posts-router"); 

const server = express();

// This enables json data to be sent and received by the server
server.use(express.json());

server.use("/api/posts", postsRouter); 

module.exports = server; 
