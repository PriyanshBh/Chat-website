// Create a socket connection to the server
const socket = io("http://localhost:8000", { transports: ["websocket"] });

// Get references to HTML elements
const form = document.getElementById('send-container');             // Form for sending messages
const messageInput = document.getElementById('messageinp');         // Input field for messages
const messageContainer = document.querySelector('.container');      // Container for displaying messages

// Create an audio element for notifications
var audio = new Audio("ping.mp3");

// Listen for form submission (when the user sends a message)
form.addEventListener('submit', (e) => {
    e.preventDefault();                                             // Prevent the default form submission behavior
    const message = messageInput.value;                             // Get the message from the input field
    append(`you: ${message}`, 'right');                             // Display the user's message on the right
    socket.emit('send', message);                                   // Send the message to the server via socket.io
    messageInput.value = '';                                        // Clear the input field after sending
});

// Function to append messages to the message container
const append = (message, position) => {
    const messageElement = document.createElement('div');           // Create a new message element
    messageElement.innerText = message;                             // Set the message text
    messageElement.classList.add('message');                        // Add the 'message' class to the element
    messageElement.classList.add(position);                         // Add the specified position class (left or right)
    messageContainer.append(messageElement);                        // Add the message element to the container

    // Scroll the message container to the bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (position == 'left') {
        audio.play();                                               // Play a notification sound for incoming messages
        console.log("Playing audio for user join");                 // Debugging log (optional)
    }
};

// Prompt the user to enter their name and send it to the server
const username = prompt("Enter your name to join");
socket.emit('new-user-joined', username);

// Listen for the 'user-joined' event and display a message
socket.on('user-joined', username => {
    append(`${username} joined the chat`, `left`);
});

// Listen for the 'recieve' event (a received message) and display it
socket.on('recieve', data => {
    append(`${data.username} : ${data.message} `, `left`);
});

// Listen for the 'left' event (user leaving) and display a message
socket.on('left', username => {
    append(`${username} : Left the chat `, `left`);
});
