"use strict";
let hamburgerButton = document.querySelector("header nav #hamburger");
let listOfNavs = document.querySelector("header nav ul");
let navLinks = listOfNavs.querySelectorAll("li a");
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", () => {
        if (listOfNavs.classList.contains("active")) {
            listOfNavs.classList.remove("active");
            listOfNavs.classList.add("inactive");
            document.body.style["overflowY"] = "unset";
        }
    });
}
hamburgerButton.addEventListener("click", () => {
    if (listOfNavs.classList.contains("active")) {
        listOfNavs.classList.remove("active");
        listOfNavs.classList.add("inactive");
        document.body.style["overflowY"] = "unset";
    }
    else {
        listOfNavs.classList.add("active");
        listOfNavs.classList.remove("inactive");
        document.body.style["overflowY"] = "hidden";
    }
});
