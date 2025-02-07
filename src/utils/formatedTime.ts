function formatedTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000); // 총 초
  const hours = Math.floor(totalSeconds / 3600); // 시간
  const minutes = Math.floor((totalSeconds % 3600) / 60); // 분
  const seconds = totalSeconds % 60; // 초
  const millis = Math.floor(milliseconds % 1000); // 밀리초

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}:${String(millis).padStart(3, "0")}`;
}

export default formatedTime;
