const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extends: true }));
app.use(express.json());

app.set('view engine', 'ejs')
app.set('views', __dirname + '/pages')

app.get('/', (req, res) => {
    res.render('login')
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

app.post('/chat', (req, res) => {
    const { username, room } = req.body;
    if(username.trim() && room.trim()){
        res.render('chat', { username, room })
    } else {
        res.redirect('/login')
    }
})


server.listen(port, () => {
    console.log(`server is listenig on ${port}`);
});


io.on('connection', socket => {
    socket.on('chooseRoom', data => {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('newuser', {name: data.name})
    })

    socket.on('msg', data => {
        socket.broadcast.to(data.room).emit('newmsg',{name: data.name,message: data.message})
    })
})