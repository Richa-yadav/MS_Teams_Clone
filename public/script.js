// const Peer = require("peerjs");
// const { text } = require("express");

const socket = io('/');

const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

var currentPeer;

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);


    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
            currentPeer = call.peerConnection
        })
    })
    socket.on("user-connected", (userId)=> {
        console.log("A new user just joined!");
        setTimeout(function(){
            connectToNewUser(userId,stream);
        },5000)
    })
        
    let text = $('input')

    $('html').keydown((e) => {
        if(e.which == 13 && text.val().length !==0 ) {
            // console.log(text.val())
            socket.emit('message', text.val());
            text.val('')
        }
    })

    socket.on('createMessage', message => {
        console.log("creates messages", message);
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom()
    })
})


peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);

})



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
        currentPeer = call.peerConnection
    })
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play()
    })
    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


//mutes the audio
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>`

    document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`

    document.querySelector('.main_mute_button').innerHTML = html;
}

// stops the video
const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }
  
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}

// for screen sharing
const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: true
        },
        audio: {
            echoCancelation: true,
            noiseSuppression: true
        }
    }).then((stream)=> {
        let videoTrack = stream.getVideoTracks()[0];
        videoTrack.onended = function(){
            stopScreenShare();
        }
        let sender = currentPeer.getSenders().find(function(s) {
            setShareScreen()
            return s.track.kind == videoTrack.kind
        })
        sender.replaceTrack(videoTrack)
    }).catch((err) => {
        console.log("unable to get display media" + err)
    })
}

const setShareScreen = () => {
    const html = `
      <i style="color:rgb(255, 231, 71);" class="fab fa-creative-commons-share"></i>
      <span style="color:rgb(255, 231, 71);">Share Screen</span>
    `
    document.querySelector('.main_share_button').innerHTML = html;
  }
  
const stopScreenShare = () =>   {
    let videoTrack = myVideoStream.getVideoTracks()[0];
    var sender = currentPeer.getSenders().find(function(s) {
        return s.track.kind == videoTrack.kind;
    })
    sender.replaceTrack(videoTrack)
    
    const html = `
    <i class="fab fa-creative-commons-share"></i>
    <span>Share Screen</span>
    `
    document.querySelector('.main_share_button').innerHTML = html;
}

//leave meeting
document.querySelector('.main_leave_button').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the video conference?');
    if (leaveRoom) {
    //   window.location = 'https://www.google.com';
        window.location = 'leave_meeting/home.html';
        // window.location = close(); //some landing page needed.
    } else {
    }
});

// hand raise
// const raiseHand = () => {
//     const enabled = myVideoStream.getVideoTracks()[0].enabled;
//     if (enabled) {
//       myVideoStream.getVideoTracks()[0].enabled = false;
//       setRaiseHand()
//     } else {
//       setDownHand()
//       myVideoStream.getVideoTracks()[0].enabled = true;
//     }
// }

// const setRaiseHand = () => {
//     const html = `
//       <i class="fas fa-hand-paper"></i>
//       <span>Hand</span>
//     `
//     document.querySelector('.main_hand_button').innerHTML = html;
//   }
  
// const setDownHand = () => {
//     const html = `
//     <i class="stop fas fa-hand-paper-slash"></i>
//     `
//     document.querySelector('.main_hand_button').innerHTML = html;
// }

// document.getElementById('#chat_message').emojioneArea({
//     pickerPosition: "right"
// });

