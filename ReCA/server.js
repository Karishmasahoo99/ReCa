const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')))

//Run when client connect
io.on('connection',socket=>{
    socket.emit('message','Welcome to ChatCord')

    //Broadcast when a user connects
    socket.broadcast.emit('message','A user has joined the chart')
    
    //Run when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message','A user has left the chat')
    })

    //Listen for chatmessage
    socket.on('chatMessage',msg=>{
        io.emit('message',msg)
    })
})

const PORT=3000||process.env.PORT
server.listen(PORT,()=>console.log(`Server started at PORT ${PORT}`))
