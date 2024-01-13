// const copyBtn = document.getElementById("copyLink");
const copyLinkTimestampBtn = document.querySelectorAll(".copyLinkTimestamp");

async function copyLink(time) {
  try {
    const timestamp = Math.floor(time) || 0;
    const url = window.location.href;
    let link = url;
    if (!url.includes("?")) {
      link += `?t=${timestamp}`;
    } else if (url.includes("t=")) {
      link = url.replace(/t=\d+/, `t=${timestamp}`);
    } else {
      // this is for the case where there are other query strings
      link += `&t=${timestamp}`;
    }
    await navigator.clipboard.writeText(link);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

// copyBtn.addEventListener("click", async () => {
//   try {
//     await copyLink(player.playerInfo.currentTime || 0);
//     copyBtn.innerHTML = "Copied!";

//     // reset button text after 3 seconds
//     setTimeout(() => {
//       copyBtn.innerHTML = "Copy link at current time";
//     }, 2000);
//   } catch (err) {
//     console.error("Failed to copy: ", err);
//   }
// });

copyLinkTimestampBtn.forEach((btn) => {
  // add icon to button
  btn.innerHTML = `<i class="fas fa-link"></i>`;

  btn.addEventListener("click", async () => {
    try {
      const timestamp = btn.dataset.time;
      await copyLink(timestamp);

      // change the icon to a checkmark
      btn.innerHTML = `<i class="fas fa-check"></i>`;

      // reset button text after 3 seconds
      setTimeout(() => {
        btn.innerHTML = `<i class="fas fa-link"></i>`;
      }, 1000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });
});
