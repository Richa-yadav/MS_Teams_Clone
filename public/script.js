// const Peer = require("peerjs");

const socket = io('/');

const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});


let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);


    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) =>{
        socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })
        connectToNewUser(userId, stream);
    })
})


peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);

})


// socket.on('user-connected', (userId) =>{
//     // socket.on('join-room', (roomId) => {
//     //     socket.join(roomId);
//     //     socket.to(roomId).broadcast.emit('user-connected');
//     // })
//     socket.on('join-room', (roomId, userId) => {
//         socket.join(roomId);
//         socket.to(roomId).broadcast.emit('user-connected', userId);
//     })
//     connectToNewUser(userId, stream);
// })

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play()
    })
    videoGrid.append(video);
}