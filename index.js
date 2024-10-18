require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require('socket.io');
const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const groupChatRoutes = require("./routes/groupChatRoutes");

const { createSocketServer } = require("./socket/socketServer");

const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGO_URI; // Define MONGO_URI from environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Register the routes
app.use("/api/auth", authRoutes);
app.use("/api/invite-friend", friendInvitationRoutes);
app.use("/api/group-chat", groupChatRoutes);

const server = http.createServer(app);

// socket connection
createSocketServer(server);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`DB Conected and SERVER STARTED ON ${PORT}.....!`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed. Server not started.");
    console.error(err);
  });
  const io = new Server(server, {
    transports: ['polling'] // Force the use of long polling
  });
  app.get('/', (req, res) => {
    res.send('Hello from Express and Socket.IO');
  });
  