let video;
let videoSelect;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a dropdown for selecting video input
  videoSelect = createSelect();
  videoSelect.position(10, 10);
  videoSelect.option('Select camera');
  videoSelect.changed(changeCamera);

  // List available media devices
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        if (device.kind === 'videoinput') {
          videoSelect.option(device.label || `Camera ${videoSelect.child().length}`, device.deviceId);
        }
      });

      // Automatically try to set up the first camera if one is available
      if (videoSelect.child().length > 1) {
        videoSelect.selected(videoSelect.child()[1].value);
        setupCamera(videoSelect.value());
      }
    })
    .catch(error => {
      console.error('Error listing devices:', error);
    });
}

function draw() {
  background(0);
  if (video) {
    image(video, 0, 0, width, height);
  }
}

function setupCamera(deviceId) {
  if (video) {
    video.remove(); // Remove the existing video if it exists
  }

  let constraints = {
    video: {
      deviceId: { exact: deviceId } // Specify the device ID
    }
  };

  function handleSuccess(stream) {
    console.log('Camera is ready.');
    video = createCapture(stream);
    video.size(width, height);
    video.hide();
  }

  function handleError(error) {
    console.log('Error initializing the camera with constraints:', error);
    // Fallback to any available video device
    video = createCapture(VIDEO, () => {
      console.log('Fallback camera is ready.');
    });
    video.size(width, height);
    video.hide();
  }

  // Request camera access with the defined constraints
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
}

function changeCamera() {
  const deviceId = videoSelect.value();
  if (deviceId) {
    setupCamera(deviceId);
  }
}
