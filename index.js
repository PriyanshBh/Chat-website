// nodeserver which will handle the socket io connections ye server alag website hai aur baaki sab alag website hai

const io = require('socket.io')(8000); // Create a Socket.IO server on port 8000

const user = {}; // Create an object to store user data (usernames)

io.on('connection', socket => { // Handle new socket connections
    socket.on('new-user-joined', username => { // Event triggered when a new user joins
        // console.log('New user joined', username); // Optional: Log a message
        user[socket.id] = username; // Store the user's username in the object
        socket.broadcast.emit('user-joined', username); // Notify other users that someone joined
    });

    socket.on('send', message => { // Event triggered when a user sends a message
        socket.broadcast.emit('recieve', { message: message, username: user[socket.id] }); // Send the message to other users
    });

    socket.on('disconnect', () => { // Event triggered when a user disconnects
        socket.broadcast.emit('left', user[socket.id]); // Notify other users that someone left
        delete user[socket.id]; // Remove the user's data from the object
    });
});
