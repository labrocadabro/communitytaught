const copyBtn = document.getElementById("copyLink");

copyBtn.addEventListener("click", async () => {
    try{

        const timestamp = Math.floor(player.playerInfo.currentTime) || 0;
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
        copyBtn.innerHTML = "Copied!";

        // reset button text after 3 seconds
        setTimeout(() => {
            copyBtn.innerHTML = "Copy link at current time";
        }, 2000);
    }catch(err){
        console.error('Failed to copy: ', err);
    }
 
});
