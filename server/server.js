const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes');
const rooms = ['general', 'training', 'AFK'];
const cors = require('cors');


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);

const server = require('http').createServer(app);
const port = 4000;
const io = require('socket.io')(server,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET' , 'POST']
    }
});

const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/pfe",
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, () => {console.log("Mongoose is connected");}
);

server.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })