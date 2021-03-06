const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users')
const formatMessage = require('./utils/messages')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')))
const botName='ChatCord Bot '

//Run when client connect
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);

        socket.emit('message',formatMessage(botName,'Welcome to ChatCord'))

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${username} has joined the chart`))
        
        //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })

    //Listen for chatmessage
    socket.on('chatMessage',msg=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })
    
    //Run when client disconnects
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
        }
        //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })
})

const PORT=3000||process.env.PORT
server.listen(PORT,()=>console.log(`Server started at PORT ${PORT}`))
