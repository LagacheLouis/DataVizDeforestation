let data = new Array();
let dataToDisplay = new Array();

let canvas;
let ctx;
let speed = 50;


let feuille_img = new Image();
let tige_img= new Image();

const scaledSizeX = 0.37;
const scaledSizeY = 0.82;
function DrawScaledImage(image){
    let w = window.innerHeight * scaledSizeX;
    let h = window.innerHeight  * scaledSizeY;
    ctx.drawImage(image, window.innerWidth/2 - w/2, window.innerHeight/2 - h/2,w,h);
}

let holes = new Array();


const hole_img = ["img/Trou_1.png","img/Trou_2.png","img/Trou_3.png","img/Trou_4.png","img/Trou_5.png","img/Trou_6.png"];

window.onresize  = resize3000;

function resize3000(){
    document.documentElement.style = "font-size : "+62.5 * (window.innerWidth/2560) +"%";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Hole{

    constructor(posX,posY,size,image){
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.currentSize = 0;
        this.image = image;
    }

    draw(){
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(this.image, this.posX - this.currentSize/2, this.posY - this.currentSize/2,this.currentSize,this.currentSize);
        this.currentSize += this.size/speed;
        if(this.currentSize > this.size){
            this.currentSize = this.size;
        }
    }
}

let displayCanvas = false;

function HoleUpdate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    DrawScaledImage(feuille_img);


    holes.forEach( hole => {
        hole.draw();
    })
    ctx.globalCompositeOperation = 'source-over';

    DrawScaledImage(tige_img);
    if(displayCanvas){
        requestAnimationFrame(HoleUpdate);
    }else{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
}

window.onload = function(){
    //treeCutTimer();
    canvas = document.getElementById("myCanvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    resize3000();

    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled= false;

    TweenMax.killAll();
    let timeline = new TimelineMax();
    timeline.stop();
    timeline
        .to("#home",0.3,{opacity:0})
        .from("#feuille",0.1,{filter:"blur(20px)"})
        .from("#contextTitle",0.5,{delay:0.5,opacity:0})
        .from("#surfaceDisparu",0.4,{delay:0.5,right:"-5vw",opacity:0})
        .from("#surfaceDisparu :nth-child(2)",0.5,{delay:0.5,opacity:0})
        .from("#treeCounterZone",1,{delay:0.5,opacity:0})
        .to("#scroll_info",0.2,{delay:0.3,opacity:1});

    timeline.eventCallback("onComplete", function(){
        scrollLock = false;
    });

    document.getElementById("btn_start").onclick = function(){
        timeline.play();
    }

    document.getElementById("btn_visu").onclick = function(){
        ShowDataViz();
    }

    treeCutTimer();
}

let scrollLock = true;
let pageIndex = 1;

document.onwheel = function(e){
    if(!scrollLock){
        scrollLock = true;
        if(e.deltaY > 0 && pageIndex +1 < 4){
            pageIndex ++;
            ChangePage(false);
        }else if(e.deltaY < 0 && pageIndex-1 > 0){
            pageIndex--;
            ChangePage(true);
        }else{
            console.log("NOOOP " +pageIndex);
            scrollLock = false;
        }
    } 
}

function ChangePage(goBack){
    scrollInfoControl();
    if(goBack){
        if(pageIndex == 1){
            Page2To1();
        }else if(pageIndex == 2){
            Page3To2();
        }
    }else{
        if(pageIndex == 2){
            Page1To2();
        }else if(pageIndex == 3){
            Page2To3();
        }
    }
    setTimeout(()=>{
        scrollLock = false;
    },1000);
}

function scrollInfoControl(){
    if(pageIndex < 3){
        let timeline = new TimelineMax();
        timeline
            .to("#scroll_info div",0.2,{backgroundColor:"transparent"})
            .to("#scroll_info div",0.2,{delay:-0.2,borderColor:"#232323"})
            .to("#scroll_info :nth-child("+pageIndex+")",0.2,{backgroundColor:"#232323"});
    }else
    {
        let timeline = new TimelineMax();
        timeline
            .to("#scroll_info div",0.2,{backgroundColor:"transparent"})
            .to("#scroll_info div",0.2,{delay:-0.2,borderColor:"#e5e5e5"})
            .to("#scroll_info :nth-child("+pageIndex+")",0.2,{backgroundColor:"#e5e5e5"});
    }
}

function Page2To1(){
   // TweenMax.killAll();
    let timeline = new TimelineMax();
    timeline
        .to(".page2",0.3,{opacity:0})
        .to("#feuille",0.5,{scale:1,left: "50vw",top:"50vh"})
        .to(".page1",0.3,{opacity:1});
     
}

function Page1To2(){
  //  TweenMax.killAll();
    let timeline = new TimelineMax();
    timeline
        .to(".page1",0.3,{opacity:0})
        .to("#feuille",0.5,{scale:3,left: "23vw",top:"60vh"})
        .to(".page2",0.3,{opacity:1});
}

function Page2To3(){
  //  TweenMax.killAll();
    let timeline = new TimelineMax();
    timeline
        .to("#page_negatif",0,{display:"block"})
        .to("#page_positif",1,{delay:0.1,opacity:0})
        .to("#page_negatif",1,{delay:-0.8,opacity:1});
}

function Page3To2(){
   // TweenMax.killAll();
    let timeline = new TimelineMax();
    timeline
        .to("#page_negatif",1,{opacity:0})
        .to("#page_positif",1,{delay:-0.8,opacity:1})
        .to("#page_negatif",0,{delay:0.1,display:"none"})
   
}

function ShowDataViz(){
    displayCanvas = true;
    TweenMax.killAll();
    let timeline = new TimelineMax();
    timeline
        .to("#dataVizLayout",0,{delay:0.1,display:"block"})
        .to("#notDataViz",1,{opacity:0})
        .to("#dataVizLayout",1,{opacity:1})
        .to("#notDataViz",0,{delay:0.1,display:"none"})
        
   

    feuille_img.onload = function(){
        console.log("test");
        tige_img.onload = HoleUpdate;
        tige_img.src = "img/Tige_2.png";
    }
    feuille_img.src = "img/Feuille.png";
    


    var xhr = new XMLHttpRequest()
    xhr.open('GET', "json.json")
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText);

            data.sort(function(a,b){
                return (a[2015] - a[1990]) - (b[2015] - b[1990]);
            });
            dataToDisplay = data.slice(0,20);
            for(let i = 0;i< dataToDisplay.length;i++){
                let element = document.createElement("div");
                element.innerHTML = "<span class = 'country_value'></span><span>  </span><span class = 'country_name'></span>";
                element.id = dataToDisplay[i]["Country Code"];
                if(i < dataToDisplay.length/2)
                    document.getElementById("country_panel_l").appendChild(element); 
                else
                    document.getElementById("country_panel_r").appendChild(element); 
            } 
        }
    };
    xhr.send()

    let feuilleHovered = false;
    let numberCountryDisplayed = 0;

    // click sur la feuille
    canvas.addEventListener('click',function(e){
        if(feuilleHovered && dataToDisplay.length > 0){
            holeImage = new Image();
            console.log(dataToDisplay);
            holeImage.onload = function(){

                let country = dataToDisplay[Math.floor(Math.random() * dataToDisplay.length)];
                let sqrKm = Math.floor(country[1990] - country[2015]);

                document.querySelector("#"+country["Country Code"]+ " .country_name").innerText = `${country["Country Name"]}`; 
                document.querySelector("#"+country["Country Code"]+ " .country_value").innerText = `${formatNumber(sqrKm)}`; 
                TweenMax.fromTo("#"+country["Country Code"],1,{opacity:0},{opacity:1});
                numberCountryDisplayed++;
                document.getElementById("visu_legend_number").innerText = numberCountryDisplayed+"/20";

                let hole = new Hole(e.clientX, e.clientY,sqrKm/1000 * window.innerWidth/2560,holeImage);
                holes.push(hole);
                dataToDisplay.splice( dataToDisplay.indexOf(country), 1 );
            }
            holeImage.src = hole_img[Math.floor(Math.random() * hole_img.length)];
        }
    });

    canvas.onmousemove = function(e){
        let testSize = 13;
        let pix = ctx.getImageData(e.clientX - testSize/2, e.clientY - testSize/2, testSize, testSize).data; 
        let averageOpacity = 0;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            averageOpacity += pix[i+3];
        }
        averageOpacity = averageOpacity/Math.pow(testSize,2);
        if(averageOpacity > 0){
            feuilleHovered = true;
            canvas.style.cursor = "pointer";
        }else{
            feuilleHovered = false;
            canvas.style.cursor = "auto";
        }
    }

    document.getElementById("btn_restart").onclick = function(){
        TweenMax.killAll();
        let timeline = new TimelineMax();
        timeline
            .to("#notDataViz",0,{delay:0.1,display:"block"})
            .to("#dataVizLayout",1,{opacity:0})
            .to("#dataVizLayout",0,{delay:0.1,display:"none"})
            .to("#notDataViz",1,{opacity:1})
 
        timeline.eventCallback("onComplete", function(){
            displayCanvas = false;
            document.getElementById("country_panel_l").innerHTML =""; 
            document.getElementById("country_panel_r").innerHTML =""; 
            holes = new Array();
        });
    }
}



let treecounter = 0;

function treeCutTimer(){
    setTimeout(() =>{
        treecounter++;
        document.getElementById("treeCounter").innerText = treecounter;

        treeCutTimer();
    },25)
}


function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1\u2009')
  }