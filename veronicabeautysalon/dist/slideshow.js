"use strict";
let slideshow = document.querySelector("#slideshow");
let elements = slideshow === null || slideshow === void 0 ? void 0 : slideshow.querySelectorAll(".slideshow-element");
let animationTime = 1;
let visibleCount = 4 < elements.length ? 4 : elements.length;
let pointers = [];
for (let i = 0; i < elements.length; i++)
    pointers.push(i);
let ShiftArrayLeft = (array) => {
    let first = array[0];
    for (let i = 0; i < array.length; i++)
        array[i] = array[i + 1];
    array[array.length - 1] = first;
};
let ShiftArrayRight = (array) => {
    let last = array[array.length - 1];
    for (let i = array.length - 2; i >= 0; i--)
        array[i + 1] = array[i];
    array[0] = last;
};
let ResetAnim = () => {
    console.log("WOrks");
    for (let i = visibleCount; i < visibleCount + 1; i++) {
        if (i == 5)
            elements[pointers[i]].style.removeProperty("display");
        elements[pointers[i]].classList.remove(`slideshow-position${pointers[i]}`);
        elements[pointers[i]].classList.add(`slideshow-position${pointers[i - 1]}`);
    }
    ShiftArrayLeft(pointers);
};
let Initiate = () => {
    for (let i = 0; i < visibleCount; i++) {
        elements[i].classList.add(`slideshow-position${i}`);
    }
    for (let i = visibleCount; i < (elements === null || elements === void 0 ? void 0 : elements.length); i++) {
        elements[i].style["display"] = "none";
    }
};
setInterval(ResetAnim, animationTime);
