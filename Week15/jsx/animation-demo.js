import { Timeline, Animation } from "./animation.js"
import { ease, linear, easeIn, easeOut } from "./ease.js"

let tl = new Timeline();
tl.start();

tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 500, 2000, ease, 0, v => `translateX(${v}px)`));
document.getElementById("el2").style.transition = "2s ease";
document.getElementById("el2").style.transform = "translateX(500px)";

document.getElementById("pause").addEventListener("click", () => {
    tl.pause();
})
document.getElementById("resume").addEventListener("click", () => {
    tl.resume();
})