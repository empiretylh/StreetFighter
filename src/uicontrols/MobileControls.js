import { mobileInput } from "../engine/MobileInput.js";

const controls = document.getElementById("mobile-controls");

const joystickBase = document.getElementById("joystick-base");
const joystickStick = document.getElementById("joystick-stick");

const btnPunch = document.getElementById("btn-punch");
const btnKick = document.getElementById("btn-kick");
const btnSpecial = document.getElementById("btn-special");

const cooldownText = btnSpecial.querySelector(".cooldown-number");
const specialLabel = btnSpecial.querySelector(".special-label");

let specialCooldown = false;
let dragging = false;

const CENTER = 70;
const MAX_DISTANCE = 45;

function updateJoystick(clientX, clientY) {

    const rect = joystickBase.getBoundingClientRect();

    let x = clientX - rect.left - CENTER;
    let y = clientY - rect.top - CENTER;

    const distance = Math.hypot(x, y);

    if (distance > MAX_DISTANCE) {
        x = x / distance * MAX_DISTANCE;
        y = y / distance * MAX_DISTANCE;
    }

    joystickStick.style.transform =
        `translate(${x}px, ${y}px)`;

    const deadzone = 0.3;

    const nx = x / MAX_DISTANCE;
    const ny = y / MAX_DISTANCE;

    mobileInput.left = nx < -deadzone;
    mobileInput.right = nx > deadzone;

    mobileInput.up = ny < -deadzone;
    mobileInput.down = ny > deadzone;
}

joystickBase.addEventListener("pointerdown", (e) => {

    dragging = true;
    joystickBase.setPointerCapture(e.pointerId);

    updateJoystick(e.clientX, e.clientY);

});

joystickBase.addEventListener("pointermove", (e) => {

    if (!dragging) return;

    updateJoystick(e.clientX, e.clientY);

});

joystickBase.addEventListener("pointerup", () => {

    dragging = false;

    joystickStick.style.transform = "translate(0px,0px)";

    mobileInput.left = false;
    mobileInput.right = false;
    mobileInput.up = false;
    mobileInput.down = false;

});




function bind(button, key) {

    button.addEventListener("pointerdown", () => {
        mobileInput[key] = true;
        button.classList.add("mobile-active");
    });

    function release(){
        mobileInput[key]=false;
        button.classList.remove("mobile-active");
    }

    button.addEventListener("pointerup",release);
    button.addEventListener("pointerleave",release);
    button.addEventListener("pointercancel",release);

}


export function startSpecialCooldown(){
    if(specialCooldown) return;

    specialCooldown = true;

    let cooldown = 3;
    
    specialLabel.style.display = "none";
    cooldownText.style.display = "block";
    cooldownText.innerText = cooldown;

    const timer = setInterval(()=>{

        cooldown--;
        cooldownText.innerText = cooldown;

        if(cooldown <= 0){

            clearInterval(timer);

            specialCooldown = false;

            cooldownText.style.display = "none";
            specialLabel.style.display = "block";
        }

    },1000);

}


function bindSpecial(button){

    button.addEventListener("pointerdown",()=>{

        if(specialCooldown) return;

        mobileInput.special = true;
        button.classList.add("mobile-active");

    });

    function release(){

        mobileInput.special = false;
        button.classList.remove("mobile-active");

    }

    button.addEventListener("pointerup",release);
    button.addEventListener("pointerleave",release);
    button.addEventListener("pointercancel",release);
}


export function initializeMobileControls() {
    console.log("Mobile controls");
    
    bind(btnPunch, "lightPunch");
    bind(btnKick, "lightKick");
    // bind(btnSpecial, "special");
    bindSpecial(btnSpecial);
}

export function showMobileControls() {
    controls.style.display = "flex";
}

export function hideMobileControls() {
    controls.style.display = "none";
}