const imageUpload = document.getElementById('inputImage')

var myarr = [];
var images = [];

//face detection

Promise.all([
   faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
   faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
   faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(console.log("done loading"))

async function addTo() {

   const img = await faceapi.bufferToImage(imageUpload.files[0])
   const currImgDet = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

//detecting face one by one and calculating the match value

   var maxnum = 1;
   for (let i = 0; i < images.length; i++) {
      const bestMatch = images[i].findBestMatch(currImgDet.descriptor)._distance;
      console.log(bestMatch);
      if (bestMatch<maxnum) maxnum = bestMatch;
   }
   if (maxnum > 0.6 || images.length===0) {
// if condition gets executed when the input picture doesnt already exits 
      const faceMatcher = new faceapi.FaceMatcher(currImgDet);
      images.push(faceMatcher);
      myarr.push(img);
      console.log(myarr);
      console.log(images);
   } else {

// else condition gets executed when, duplicate picture is detected 

      console.log("duplicate image not accepted");
   }
}

//winner declaration date can be changed according to need

var countDownDate = new Date("June 10, 2022 16:00:00").getTime();

var x = setInterval(function () 
{

   var now = new Date().getTime();

   var timeleft = countDownDate - now;

   var days = Math.floor(timeleft  / (1000 * 60 * 60 * 24));
   var hours = Math.floor((timeleft  % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
   var minutes = Math.floor((timeleft  % (1000 * 60 * 60)) / (1000 * 60));
   var seconds = Math.floor((timeleft  % (1000 * 60)) / 1000);

//displaying the timer

   document.getElementById("timeleft").innerHTML = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s " + "left";

if (timeleft  < 0) 
      {
      clearInterval(x);
      //selecting a random winner  
      function getRandomItem(arr) 
      {
         const randomIndex = Math.floor(Math.random() * arr.length);
         const item = arr[randomIndex];
         return item;
      }
      const result = getRandomItem(myarr);
      document.querySelector("#sourceImage").src = result.src;
      document.getElementById("timeleft").innerHTML="";

//displaying claim prize button

      var tag = document.createElement("button");
      var text = document.createTextNode("Contact us to claim your lottery money for further verification");
      tag.appendChild(text);
      var element = document.getElementById("claimprize");
      element.appendChild(tag);
      var newelement = document.querySelector("button");
      newelement.setAttribute("type", "submit");
      }
}
, 1000);

