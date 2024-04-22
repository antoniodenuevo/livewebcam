let video;

function setup() {
  // Create a canvas that matches the window size
  createCanvas(windowWidth, windowHeight);

  // List available media devices
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      let videoSources = devices.filter(device => device.kind === 'videoinput');
      
      console.log('Available video input devices:');
      videoSources.forEach((device, index) => {
        console.log(`${index}: ${device.label} (Device ID: ${device.deviceId})`);
      });

      if (videoSources.length > 0) {
        // Choose the camera by specifying the index
        let cameraIndex = 0; // Change this index to select a different camera
        const constraints = {
          video: {
            deviceId: { exact: videoSources[cameraIndex].deviceId }
          }
        };
        video = createCapture(constraints, () => {
          console.log('Camera is ready.');
        });
        video.size(width, height);
        video.hide();
      } else {
        console.log('No videoinput devices found.');
      }
    })
    .catch(error => {
      console.error('Error accessing media devices:', error);
    });
}

function draw() {
  background(0);
  if (video) {
    // Display the video full screen
    image(video, 0, 0, width, height);
  }
}
