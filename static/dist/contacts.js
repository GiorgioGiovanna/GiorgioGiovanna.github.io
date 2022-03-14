"use strict";
let contactsContainer = document.getElementById("contacts");
let CloseOverlayEvent = function () {
    CloseOverlay();
    HideContacts();
};
let RevealContacts = function () {
    Overlay();
    contactsContainer.className = "centered-fix visible";
    overlay.addEventListener("click", CloseOverlayEvent);
};
let HideContacts = function () {
    CloseOverlay();
    contactsContainer.className = "centered-fix invisible";
    overlay.removeEventListener("click", CloseOverlayEvent);
};
