const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 30;
let adjustY = 3;
const mouse = {
    x:0,
    y:0,
    radius:250
}
ctx.fillStyle = 'white';
ctx.font = "30px Verdana";
ctx.fillText("Txt",0,40);
const textCO = ctx.getImageData(0,0,1000,100)
class Particle{
    constructor(x,y,special){
        this.x = x;
        this.y = y;
        this.Initialx = x;
        this.Initialy = y;
        this.size = 30;
        this.affectRate = Math.random() * 4 + 5;
        this.special = special;
    }
    draw(){
        if (this.special == true){
            this.size = 25;
            ctx.fillStyle='rgba(177,156,217,1)';
        }
        else{
            ctx.fillStyle='white';
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x-this.x;
        let dy = mouse.y-this.y;
        let distance=Math.sqrt(dx*dx+dy*dy);
        let forceX = dx/distance;
        let forceY = dy/distance;
        let mainforce = (mouse.radius-distance)/mouse.radius;
        let direx= forceX*mainforce*this.affectRate;
        let direy= forceY*mainforce*this.affectRate;
        if (distance<mouse.radius){
            this.x -=direx;
            this.y -=direy;
        }else{
            if (this.x !== this.Initialx){
                let dx = this.x-this.Initialx;
                this.x -=dx /10;
            }
            if (this.y !== this.Initialy){
                let dy = this.y-this.Initialy;
                this.y -=dy /10;
            }
        }
    }
}
function init(){
    particleArray = [];
    let scaleUp = 8;
    for (let y=0,y2 = textCO.height;y<y2 ;y++){
        for (let x=0 , x2 = textCO.width; x<x2; x++){
            if (textCO.data[(y * 4 * textCO.width) + (x*4) + 3] > 128){
                let poxitionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(poxitionX * scaleUp,positionY * scaleUp));
            }
        }
    }
    for (let y=0,y2 = textCO.height;y<y2 ;y++){
        for (let x=0 , x2 = textCO.width; x<x2; x++){
            if (textCO.data[(y * 4 * textCO.width) + (x*4) + 3] > 128){
                let poxitionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(poxitionX * scaleUp,positionY * scaleUp , true));
            }
        }
    }
}
init();
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (let i=0; i < particleArray.length;i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    conect();
    requestAnimationFrame(animate);
}
animate();
function conect(){
    for (let i=0; i < particleArray.length;i++){
        for (let b=i; b < particleArray.length;b++){
            if (particleArray[b] !== particleArray[i]){
                let dx = particleArray[i].x - particleArray[b].x;
                let dy = particleArray[i].y - particleArray[b].y;
                let distance=Math.sqrt(dx*dx+dy*dy);
                if (distance < 10){
                    let opacity = 1-(distance/10) 
                    ctx.strokeStyle='rgba(255,255,255,' + opacity + ')';
                    ctx.beginPath(); 
                    ctx.moveTo(particleArray[i].x, particleArray[i].y);
                    ctx.lineTo(particleArray[b].x, particleArray[b].y); 
                    ctx.lineWidth = 10;
                    ctx.stroke();
                }
            }
        }
    }
}
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
})