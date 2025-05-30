const formatTime = function (timeStr) {
  const minutes = Math.floor(timeStr / 60) || 0
  let seconds = Math.round(timeStr - minutes * 60)
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

export { formatTime }
