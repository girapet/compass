
const videoOptions = {
  video: { 
    facingMode: { exact: 'environment' },
    width: { ideal: window.innerHeight },
    height: { ideal: window.innerWidth }
  }
};

const getVideoStream = async () => {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(videoOptions);
  }
  catch {}

  return stream;
};

const initialize = async () => {
  if (!navigator.mediaDevices) {
    return 'No camera available';
  }

  const permission = await navigator.permissions.query({ name: 'camera' });

  if (permission.state === 'denied') {
    return 'Permission to use this device\'s camera was denied';
  }

  const stream = await getVideoStream();

  if (!stream) {
    return 'No front-facing camera available';
  }

  const $video = document.querySelector('video');
  $video.srcObject = stream;

  const visibilityChangeHandler = async () => {
    if (document.visibilityState === 'visible') {
      $video.srcObject = await getVideoStream();
    }
    else {
      if ($video.srcObject) {
        $video.srcObject.getTracks().forEach((t) => t.stop());
        $video.srcObject = null;
      }
    }
  };

  document.addEventListener('visibilitychange', visibilityChangeHandler);
};

export default { initialize };
