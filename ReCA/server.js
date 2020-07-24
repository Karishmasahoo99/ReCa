const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const formatMessages=require('./utils/messages')
const formatMessage = require('./utils/messages')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')))
const botName='ChatCord Bot '

//Run when client connect
io.on('connection',socket=>{
    socket.emit('message',formatMessage(botName,'Welcome to ChatCord'))

    //Broadcast when a user connects
    socket.broadcast.emit('message',formatMessage(botName,'A user has joined the chart'))
    
    //Run when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botName,'A user has left the chat'))
    })

    //Listen for chatmessage
    socket.on('chatMessage',msg=>{
        io.emit('message',formatMessage('User ',msg))
    })
})

const PORT=3000||process.env.PORT
server.listen(PORT,()=>console.log(`Server started at PORT ${PORT}`))
