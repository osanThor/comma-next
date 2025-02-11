export function generateRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatPlayTime(milliseconds) {
  if (!milliseconds || isNaN(milliseconds)) {
    return "00:00:000";
  }
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = milliseconds % 1000;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${millis.toString().padStart(3, "0")}`;
}
