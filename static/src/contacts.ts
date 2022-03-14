let contactsContainer: HTMLDivElement = document.getElementById("contacts") as HTMLDivElement;

let CloseOverlayEvent = function(){
    CloseOverlay();
    HideContacts();
}
let RevealContacts = function():void{
    Overlay();
    contactsContainer.className = "centered-fix visible";
    overlay.addEventListener("click",CloseOverlayEvent);
}

let HideContacts = function():void{
    CloseOverlay();
    contactsContainer.className="centered-fix invisible";
    overlay.removeEventListener("click",CloseOverlayEvent);
}

