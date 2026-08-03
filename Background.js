const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

const bg = new Image();
bg.src = "./public/images/bg2.png";

function resize() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;

    if (!bg.complete) return;

    bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);

    bgCtx.drawImage(
        bg,
        0,
        0,
        bgCanvas.width,
        bgCanvas.height
    );
}

bg.onload = resize;

window.addEventListener("resize", resize);

export { resize };