import dom from './dom.js';

const videoOptions = {
  video: { 
    facingMode: { exact: 'environment' },
    width: { ideal: window.innerHeight },
    height: { ideal: window.innerWidth }
  }
};

const getVideoStream = async () => {
  let stream;

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

  let stream = await getVideoStream();

  if (!stream) {
    return 'No front-facing camera available';
  }

  const $videoContainer = dom.get('video-container');
  let $video;

  const visibilityChangeHandler = async () => {
    if (document.visibilityState === 'visible') {
      if (!$video) {
        if (!stream) {
          stream = await getVideoStream();
        }

        $video = dom.create('video', { 
          autoplay: true,
          mute: true
        });
        dom.add($videoContainer, $video);
        $video.srcObject = stream;
      }
    }
    else {
      if ($video) {
        $video.srcObject.getTracks().forEach((t) => t.stop());
        $video.remove();
        $video = undefined;
        stream = undefined;
      }
    }
  };

  await visibilityChangeHandler();

  dom.on(document, 'visibilitychange', visibilityChangeHandler);
};

export default { initialize };
