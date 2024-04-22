let video;
let videoSelect;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a dropdown for selecting video input
  videoSelect = createSelect();
  videoSelect.position(10, 10);
  videoSelect.option('Select camera'); // Placeholder for non-selection
  videoSelect.changed(changeCamera);

  // List available media devices and populate the dropdown
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        if (device.kind === 'videoinput') {
          videoSelect.option(device.label || `Camera ${videoSelect.child().length}`, device.deviceId);
        }
      });
    })
    .catch(error => {
      console.error('Error listing devices:', error);
    });
}

function draw() {
  background(0);
  if (video) {
    image(video, 0, 0, width, height); // Draw the video to the canvas
  }
}

function setupCamera(deviceId) {
  if (video) {
    video.remove(); // Remove the existing video capture if it exists
  }

  // Define constraints for the video stream
  let constraints = {
    video: {
      deviceId: { exact: deviceId }
    }
  };

  // Use p5's createCapture to handle the video stream
  video = createCapture(constraints, function(stream) {
    console.log('Camera is ready.');
    video.size(width, height);
    video.hide(); // Hide the HTML element to only display video on canvas
  });

  video.on('error', function(err) {
    console.error('Failed to get video:', err);
    video = null; // Nullify video variable on error
  });
}

function changeCamera() {
  let deviceId = videoSelect.value();
  if (deviceId !== 'Select camera') {
    setupCamera(deviceId);
  } else {
    if (video) {
      video.remove(); // Remove the current video if 'Select camera' is chosen
      video = null;
    }
    console.log('No camera selected');
  }
}
