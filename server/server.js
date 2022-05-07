const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes');
const rooms = ['general', 'training', 'AFK'];
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const User = require('./models/User');


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

app.get('/rooms', (req, res) => {
  res.json(rooms)
})

async function getLastMsg(room){
  let roomMsg = await Message.aggregate([
    {$match: {to: room}},
    {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
  ])
  return roomMsg
}

function sortMsgByDate(msg){
  return msg.sort((a,b) => {
    let date1 = a._id.split('/')
    let date2 = b._id.split('/')

    date1 = date1[2] + date1[0] + date1[1]
    date2 = date2[2] + date2[0] + date2[1]

    return date1<date2 ? -1 : 1
  })
}


io.on('connection',(socket) => {

  socket.on('new-user', async() => {
    const members = await User.find()
    io.emit('new-user', members)
    
  })

  socket.on('join-room', async (room) => {
    socket.join(room)
    let roomMessages = await getLastMsg(room)
    roomMessages = sortMsgByDate(roomMessages)
    socket.emit('room-messages', roomMessages)
  })

  socket.on('message-room', async(room, content, sender, time, date) => {
    console.log('new message:', content);
    const newMessage = await Message.create({content, from: sender, time, date, to: room})
    let roomMessages = await getLastMsg(room)
    roomMessages = sortMsgByDate(roomMessages)
    io.to(room).emit('room-messages', roomMessages)
    socket.broadcast.emit('notification', room)
  })

  app.delete('/logout', async(req, res) => {
    try {
      const {_id, newMessage} = req.body
      const user = await User.findById(_id)
      user.status = 'offline'
      user.newMessage = newMessage
      await user.save()
      
      const members = await User.find()
      socket.broadcast.emit('new-user', members)
      res.status(200).send()
    } catch (error) {
      console.log(error)
      res.status(400).send()
    }
    
  })
  
})


mongoose.connect("mongodb://127.0.0.1:27017/pfe",
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, () => {console.log("Mongoose is connected");}
);

server.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })