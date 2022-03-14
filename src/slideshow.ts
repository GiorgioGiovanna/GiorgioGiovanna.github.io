let slideshow = document.querySelector("#slideshow");
let elements = slideshow?.querySelectorAll(".slideshow-element") as NodeListOf<HTMLElement>;
let animationTime = 1;
let visibleCount = 4 < elements.length ? 4 : elements.length;

let pointers : number[] = [];
for(let i = 0; i< elements!.length;i++) 
    pointers.push(i);


let ShiftArrayLeft = (array: number[])=>{
    let first = array[0]; 
    for(let i =0;i<array.length;i++)
        array[i] = array [i+1];
    array[array.length-1] = first;
}

let ShiftArrayRight = (array: number[])=>{
    let last = array[array.length-1]; 
    for( let i =array.length-2; i >= 0 ; i--)
        array[i+1] = array [i];
    array[0] = last;
}

let ResetAnim = ()=>{
    for(let i =visibleCount; i<visibleCount +1;i++){
        if(i == 5) elements[pointers[i]].style.removeProperty("display");
        elements[pointers[i]].classList.remove(`slideshow-position${pointers[i]}`);
        elements[pointers[i]].classList.add(`slideshow-position${pointers[i-1]}`);
    }
    ShiftArrayLeft(pointers);
}

let Initiate = ()=>{
    for(let i = 0;i < visibleCount;i++){
        elements[i].classList.add(`slideshow-position${i}`);
    }
    for(let i = visibleCount;i<elements?.length;i++){
        elements[i].style["display"] = "none";
    }
}

setInterval(ResetAnim,animationTime * 1000);




