interface IMessage{
    from:string;
    subject:string;
    to:string;
    text:string;
}
interface IBooking{
    name: string,
    telefon: string,
    day:string,
    month:string ,
    year:string,
    hour:string
}
const MonthToInt = { "Ianuarie":1,"Februarie":2,"Martie":3,"Aprilie":4,
"Mai":5,"Iunie":6,"Iulie":7,"August":8,"Septembrie":9,"Octombrie":10,"Noiembrie":11,"Decembrie":12}
let bookingInfo:IBooking;

const currentDate: Date = new Date();
let bookedDate:Date = new Date();
let monthDropdown:HTMLDivElement;
let monthDropdownInput:HTMLInputElement | null;
let monthDropdownLI: NodeListOf<HTMLLIElement> | null;
let dayDropdown:HTMLDivElement ;
let dayDropdownInput:HTMLInputElement | null;
let dayDropdownUL: HTMLUListElement | null ;
let timeDropdown:HTMLDivElement;
let timeDropdownInput:HTMLInputElement | null;
let timeDropdownUL: HTMLUListElement | null;
localStorage.setItem("booked",`${BookingHasExpired()}`)
if(localStorage.getItem("booked") === "true"){
    OpenAppointmentsBookedPanel();
}
async function SendHttpRequest(method:string,url:string,data:object | null = null){
    const promise = new Promise((resolve,reject)=>{

        const xml = new XMLHttpRequest();
        xml.open(method,url);
        xml.responseType = "json";

        if(data) xml.setRequestHeader("Content-Type","application/json");
        console.log(data);
        xml.onload = ()=>{
            if(xml.status >= 400){
                reject(xml.response);
            }
            else{
                resolve(xml.response);
            }
        }

        xml.send(JSON.stringify(data));
    });
    return promise;
}
function BookingHasExpired():boolean{
    let monthString:string  = localStorage.getItem("month") as string;
    let day: number  = parseInt(localStorage.getItem("day") as string);
    let year: number = parseInt(localStorage.getItem("year") as string);
    let month: number = MonthToInt[monthString];
    return year>= currentDate.getFullYear() 
    && month >= currentDate.getMonth() 
    && day >= currentDate.getDate();
}
GrabFormElements();
InitializeMonths();
function GrabFormElements(){
    console.log("Grabbed form elements");
    monthDropdown = document.body.querySelector("#month-dropdown") as HTMLDivElement;
    monthDropdownInput = monthDropdown.querySelector("input");
    monthDropdownLI = monthDropdown.querySelectorAll("ul li");

    dayDropdown = document.body.querySelector("#day-dropdown") as HTMLDivElement;
    dayDropdownInput= dayDropdown.querySelector("input");
    dayDropdownUL = dayDropdown.querySelector("ul");

    timeDropdown= document.body.querySelector("#time-dropdown") as HTMLDivElement;
    timeDropdownInput= timeDropdown.querySelector("input");
    timeDropdownUL= timeDropdown.querySelector("ul");
}
function OpenAppointmentsBookedPanel(){
    let appointmentsBookedPanel:HTMLDivElement| null = document.querySelector("#appointments-booked");
    if(appointmentsBookedPanel === null) throw console.error("#appointments-booked could not be found");
    (appointmentsBookedPanel.querySelector("#appointments-booked-year") as HTMLElement)
        .innerHTML = localStorage.getItem("year") || "Error";
    (appointmentsBookedPanel.querySelector("#appointments-booked-month") as HTMLElement)
        .innerHTML = localStorage.getItem("month") || "Error";
    (appointmentsBookedPanel.querySelector("#appointments-booked-day") as HTMLElement)
        .innerHTML = localStorage.getItem("day") || "Error";
    (appointmentsBookedPanel.querySelector("#appointments-booked-hour") as HTMLElement)
        .innerHTML = localStorage.getItem("hour") || "Error";
    SwitchVisibleChild(appointmentsBookedPanel);
}


let FrizerieWorkTime = {
    "weekOpen": 9,
    "weekClose": 20,
    "weekendOpen": 9,
    "weekendClose" : 17
}
let DaysInMonth:Array<number> = [31,28,31,30,31,30,31,31,30, 31,30,31];

function InitializeMonths():void{
    console.log("Months Initialized");
    for(let i = 0;i < monthDropdownLI!.length; i++){
        let month:HTMLLIElement = monthDropdownLI![i];
        month.addEventListener('click',()=>{
            if(monthDropdownInput != null) {
                monthDropdownInput.value = month.innerHTML;
                if(!monthDropdownInput.classList.contains("valid"))monthDropdownInput.className+= " valid";
                bookedDate.setMonth(month.value);
                bookedDate.setFullYear( bookedDate.getMonth()< currentDate.getMonth() ? currentDate.getMonth() + 1 : currentDate.getMonth());
                dayDropdownInput!.value = "";
                dayDropdownInput?.classList.remove("valid");
                timeDropdownInput!.value ="";
                timeDropdownInput?.classList.remove("valid");
                InitializeAvailableDates();
                console.log(bookedDate);

            }
        });
    }
}

let InitializeAvailableDates = ():void=>{
    console.log("Dates Initialized");
    let dayCount:number = DaysInMonth[bookedDate.getMonth()];

    if(dayDropdownUL != null) dayDropdownUL.innerHTML = ""
    else dayDropdownUL = document.createElement("ul");

    for(let i =0;i<dayCount;i++){
        let date : HTMLLIElement= document.createElement("li")as HTMLLIElement;
        date.innerHTML = `${i+1}`;
        date.value = i+1;
        date.addEventListener('click',()=>{
            if(dayDropdownInput != null) {
                dayDropdownInput.value = date.innerHTML;
                if(!dayDropdownInput.classList.contains("valid"))dayDropdownInput.className+=" valid";
                bookedDate.setDate(date.value);
                timeDropdownInput!.value = "";
                timeDropdownInput!.classList.remove("valid");
                InitializeAvailableTimes();
                console.log(bookedDate);
            }
        });
        dayDropdownUL.appendChild(date);
    }
}

let InitializeAvailableTimes = async ()=>{
    console.log("Times Initialized");
    if(bookedDate.getDay() === null) return;

    if(timeDropdownUL != null) timeDropdownUL.innerHTML = ""
    else timeDropdownUL = document.createElement("ul");

    bookedDate.setFullYear(currentDate.getFullYear());
    if(bookedDate.getMonth() + 1 <= bookedDate.getMonth()){
        if(bookedDate.getDay() +1 <= bookedDate.getDate()){
            bookedDate.setFullYear(currentDate.getFullYear() + 1);
        }
    }

    //This system is breaks if they close after 12:00 or open before 12:00
    let openHour: number = bookedDate.getDay()<6? FrizerieWorkTime.weekOpen : FrizerieWorkTime.weekendOpen;
    let closeHour: number = bookedDate.getDay()<6? FrizerieWorkTime.weekClose : FrizerieWorkTime.weekendClose;
    let hoursWorked:number = closeHour-openHour;
    let unavailableDates: string = "";
    await SendHttpRequest('GET',`/unavailableDates/${bookedDate.getFullYear()}/${bookedDate.getMonth() + 1}/${bookedDate.getDate()}`)
    .then((responseData)=>{
        unavailableDates = JSON.stringify(responseData) as string;
        console.log("Unavailable times" + JSON.stringify(unavailableDates));
    });
    for(let i =0;i<=hoursWorked;i++){       
        if(!unavailableDates.includes(`${i+openHour}:00`)){
            let time : HTMLLIElement= document.createElement("li")as HTMLLIElement;
            time.innerHTML = `${i+openHour}:00`;
            time.value = i+openHour;
            time.addEventListener('click',()=>{
                if(timeDropdownInput != null) {
                    timeDropdownInput.value = time.innerHTML;
                    if(!timeDropdownInput.classList.contains("valid"))timeDropdownInput.className+= " valid";
                    bookedDate.setHours(time.value, 0, 0 , 0);
                }
            });
            timeDropdownUL.appendChild(time);
        }
        if(timeDropdownUL.childElementCount === 0){
            let placeholder: HTMLLIElement= document.createElement("li")as HTMLLIElement;
            placeholder.innerHTML = `Nu sunt timpuri disponibile în aceasta zi`;
            timeDropdownUL.appendChild(placeholder);
        }
    }
}

//Validates the Input if the page was saved
if(monthDropdownInput!.value != ""){
    monthDropdownInput!.classList.add("valid");
    bookedDate.setMonth(1);
    InitializeAvailableDates();
}
if(dayDropdownInput!.value != ""){
    dayDropdownInput!.classList.add("valid");
    bookedDate.setDate(parseInt(dayDropdownInput!.innerHTML));
    InitializeAvailableTimes();
}
if(timeDropdownInput!.value != "")timeDropdownInput!.classList.add("valid");

function ToggleVisibility (element:HTMLElement,visible:boolean){
    if(visible){
        if(element.classList.contains("invisible"))
            element.classList.remove("invisible");
        if(element.classList.contains("visible"))
            element.classList.add("visible");
    }
    else{
        if(element.classList.contains("visible"))
            element.classList.remove("visible");
        if(element.classList.contains("invisible"))
            element.classList.add("invisible");       
    }
}

function SwitchVisibleChild (child:HTMLElement): void{
    let parent : HTMLElement | null= child.parentElement;
    if(parent === null) return;
    ToggleVisibility(child, true);
    let siblings: HTMLElement[] = [].slice.call(parent.getElementsByTagName('*'),0);
    for(let i = 0;i< siblings.length;i++){
        ToggleVisibility(siblings[i], false);
    }
}

async function FinishBooking(){
    console.log("It works");
    let form:HTMLFormElement = document.querySelector("#form-book") as HTMLFormElement;
    bookingInfo  = {
       name: (form.querySelector("#form-book-name") as HTMLInputElement).value,
       telefon:(form.querySelector("#form-book-telefon") as HTMLInputElement).value,
       month: MonthToInt[(form.querySelector("#form-book-month") as HTMLInputElement).value],
       day:(form.querySelector("#form-book-day") as HTMLInputElement).value,
       hour:(form.querySelector("#form-book-hour") as HTMLInputElement).value,
       year: `${currentDate.getFullYear()}`
    };
    
    if(parseInt(bookingInfo.month) <= currentDate.getMonth()){
        if(parseInt(bookingInfo.day) <= currentDate.getDate()){
            if(parseInt(bookingInfo.hour) <= currentDate.getHours()){
                bookingInfo.year = `${currentDate.getFullYear()+1}`;
            }
        }
    }

    let Response = await SendHttpRequest('POST','/book',bookingInfo);
    console.log(Response);
    SaveBookingInfo(bookingInfo);
}

function SaveBookingInfo(formData : IBooking){
    console.log("Attempted to save booking");
    localStorage.setItem("name", `${formData.name}`);
    localStorage.setItem("telefon" ,`${formData.telefon}`);
    localStorage.setItem("month",`${formData.month}`);
    localStorage.setItem("day",`${formData.day}`);
    localStorage.setItem("hour",`${formData.hour}`);
    localStorage.setItem("year", `${formData.year}`)
    localStorage.setItem("booked","true");
    OpenAppointmentsBookedPanel();
}
function GetBookingInfo(): IBooking{
    bookingInfo = {
        name: localStorage.getItem("name") || "NA",
        telefon: localStorage.getItem("telefon") || "NA",
        month: localStorage.getItem("month") || "NA",
        day: localStorage.getItem("day") || "NA",
        hour: localStorage.getItem("hour") || "NA",
        year: localStorage.getItem("year") || "NA"
    }
    return bookingInfo;
}