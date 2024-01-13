const goToTimeBtns = document.querySelectorAll(".goToTime");

function formatTimestamp(timeRemaining) {
  // convert seconds to hh:mm:ss
  const hours = Math.floor(timeRemaining / (60 * 60));
  const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const padZeros = (num) => num.toString().padStart(2, "0");

  // Sheds "HH:" when duration is under 1 hour (3600 seconds)
  if (timeRemaining >= 3600) {
    return `${padZeros(hours)}:${padZeros(minutes)}:${padZeros(seconds)}`;
  }
  return `${padZeros(minutes)}:${padZeros(seconds)}`;
}

goToTimeBtns.forEach((btn) => {
  // add space after so that it looks even like 3:00__ vs 30:00_ vs 3:00:00
  btn.innerHTML = `${formatTimestamp(btn.dataset.time)} - ${btn.dataset.title}`;
  btn.addEventListener("click", () => {
    if (!player) return;

    if (
      btn.dataset.time &&
      typeof Number(btn.dataset.time) === "number" &&
      Number(btn.dataset.time) > 0
    ) {
      player.seekTo(btn.dataset.time);
    }
  });
});
