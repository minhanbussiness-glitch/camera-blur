const video = document.getElementById("camera");

navigator.mediaDevices.getUserMedia({
video:true
})
.then(stream=>{
video.srcObject=stream;
});

const hands = new Hands({
locateFile:file=>{
return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}
});

hands.setOptions({
maxNumHands:1,
modelComplexity:1,
minDetectionConfidence:0.7,
minTrackingConfidence:0.7
});

hands.onResults(results=>{

if(results.multiHandLandmarks.length>0){

const hand = results.multiHandLandmarks[0];

const index = hand[8].y < hand[6].y;
const middle = hand[12].y < hand[10].y;
const ring = hand[16].y > hand[14].y;
const pinky = hand[20].y > hand[18].y;

if(index && middle && ring && pinky){
video.style.filter="blur(10px)";
}else{
video.style.filter="blur(0px)";
}

}else{
video.style.filter="blur(0px)";
}

});

const camera = new Camera(video,{
onFrame:async()=>{
await hands.send({image:video});
},
width:640,
height:480
});

camera.start();
