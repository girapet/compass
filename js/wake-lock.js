
const initialize = async (state) => {
  const permission = await navigator.permissions.query({ name: 'screen-wake-lock' });

  if (permission.state === 'denied') {
    return;
  }

  let wakeLock;

  const visibilityChangeHandler = async () => {
    if (document.visibilityState === 'visible') {
      if (!wakeLock) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
          wakeLock = undefined;
        });
      }
    }
    else {
      if (wakeLock) {
        wakeLock.release();
      }
    }
  };
  
  await visibilityChangeHandler();

  document.addEventListener('visibilitychange', visibilityChangeHandler);
}

export default { initialize };
