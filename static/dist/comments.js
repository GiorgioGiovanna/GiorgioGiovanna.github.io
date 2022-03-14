"use strict";
const commentBubbles = document.querySelectorAll(".comment-bubble");
const shiftDelay = 7; //seconds
let activeIndex = 1;
SetStartPositions();
function SetStartPositions() {
    for (let i = 0; i < 4; i++) {
        commentBubbles[i].classList.add(`comment-bubble${i - 1}`);
        if (i === 1) {
            SetActive(i, true);
        }
    }
    for (let i = 4; i < commentBubbles.length; i++) {
        commentBubbles[i].style["display"] = "none";
    }
}
let cancelID = setInterval(Shift, shiftDelay * 1000);
function c() {
    clearInterval(cancelID);
}
function Shift() {
    let setPos = -2;
    let overflowProt;
    console.log(activeIndex);
    if (activeIndex === 0) {
        setPos = -1;
        commentBubbles[commentBubbles.length - 1].className = `comment-bubble comment-bubble${-2}`;
        for (let i = 0; i < 3; i++) {
            commentBubbles[i].className = `comment-bubble comment-bubble${setPos}`;
            setPos += 1;
        }
    }
    else {
        for (let i = activeIndex - 1; i <= activeIndex + 2; i++) {
            overflowProt = i > commentBubbles.length - 1 ? i - commentBubbles.length : i;
            commentBubbles[overflowProt].className = `comment-bubble comment-bubble${setPos}`;
            setPos += 1;
        }
    }
    SetActive(activeIndex, false);
    SetActive(activeIndex + 2 > commentBubbles.length ? activeIndex - commentBubbles.length + 1 : activeIndex + 1, true);
    //Apends a new comment to the end
    let appendedCommentIndex = activeIndex + 2 < commentBubbles.length ? activeIndex + 2 : activeIndex + 2 - commentBubbles.length;
    commentBubbles[appendedCommentIndex].style["display"] = "block";
    commentBubbles[appendedCommentIndex].className = `comment-bubble comment-bubble2`;
}
function SetActive(index, activate) {
    // console.log(`${index} set to ${activate? "active":"inactive"}`);
    if (activate)
        activeIndex = index;
    ToggleOverlay(commentBubbles[index], !activate);
}
function ToggleOverlay(element, turnON) {
    let overlay = element.querySelector(".overlay");
    if (turnON) {
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("invisible");
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.add("visible");
        return;
    }
    overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("visible");
    overlay === null || overlay === void 0 ? void 0 : overlay.classList.add("invisible");
}
