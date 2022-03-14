let overlay: HTMLDivElement = document.createElement("div");
overlay.style.zIndex="1001";
overlay.style.position="fixed";
overlay.style.cursor = "pointer";
document.body.appendChild(overlay);

let Overlay = function(): void{
    overlay!.className = "overlay visible";
    document.body.style["overflowY"] ="hidden";
}
let CloseOverlay = function(): void{
    if(overlay === null) return;
    overlay.className = "overlay invisible";
    document.body.style["overflowY"] ="unset";
}