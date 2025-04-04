export async function checkCameraPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});

    stream.getTracks().forEach(track => track.stop());

    return true;
  } catch (e) {
    return false;
  }
}
