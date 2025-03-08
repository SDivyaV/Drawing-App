const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');
const toolBtns = document.querySelectorAll('.tool');
const fillColor = document.querySelector('#fill-color');
const sizeSlider = document.querySelector('#size-slider');
const colorsBtns = document.querySelectorAll('.colors .option');
const colorPicker =  document.querySelector('#color-picker');
const clearCanvas = document.querySelector('.clear-canvas');
const saveImage = document.querySelector('.save-image');

let prevMouseX, prevMouseY;
let snapshot;
let isDrawing = false;
let brushWidth = 5;
let selectedTool = "brush";
let selectedColor = '#f4d03f';

const setCanvasBackground = () => {
    //setting whole canvas background to white, so the download image background will be white
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //setting fillStyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
})

const drawRect = (e) => {
    //if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked){
        //creating rectangle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);   
}

const drawCircle = (e) => {
    ctx.beginPath(); //creating new path to draw circle
    //getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawSquare = (e) => {
    ctx.beginPath(); //creating  a new path to draw square

    let sideLength = Math.max(
        Math.abs(prevMouseX - e.offsetX),
        Math.abs(prevMouseY - e.offsetY)
    )

    let startX = prevMouseX < e.offsetX ? prevMouseX : prevMouseX - sideLength;
    let startY = prevMouseY < e.offsetY ? prevMouseY : prevMouseY - sideLength;

    ctx.rect(startX, startY, sideLength, sideLength);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath(); //creating  a new path to draw square
    ctx.moveTo(prevMouseX, prevMouseY); //move to draw triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);; //creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
    ctx.closePath(); //closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawLine = (e) => {
    ctx.beginPath(); //creating a new path to draw line
    ctx.moveTo(prevMouseX, prevMouseY); //move to draw line to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);; //creating first line according to the mouse pointer
    
    ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; //passing current mouseY position as prevMouseY value
    ctx.beginPath(); //creating a new path to draw
    ctx.lineWidth = brushWidth; //passing brushSize as line width
    ctx.strokeStyle = selectedColor; //passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; //passing selectedColor as fill style
    //copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; //if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas

    if(selectedTool === 'brush' || selectedTool === 'eraser'){
        //if selected tool is eraser then set strokeStyle to white
        // to paint white color on the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //creating the libe according to the mouse pointer
        ctx.stroke(); //drawing/filling line with color
    } else if(selectedTool === 'rectangle'){
        drawRect(e);
    } else if(selectedTool === 'circle'){
        drawCircle(e);
    } else if(selectedTool === 'square'){
        drawSquare(e);
    } else if(selectedTool === 'triangle'){
        drawTriangle(e);
    } else if(selectedTool === 'line'){
        drawLine(e);
    }
    
    
}

toolBtns.forEach(btn => {
    btn.addEventListener('click',() => {
        //removing active class from the previous option and adding on current clicked option
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
        console.log(selectedTool)
    })
})

sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value);

colorsBtns.forEach(btn => {
    btn.addEventListener('click',() => {
        //removing active class from the previous option and adding on current clicked option
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        //passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})

colorPicker.addEventListener('change',() => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
})

saveImage.addEventListener('click', () => {
    const link = document.createElement('a'); //creating <a></a> element
    link.download = `${Date.now()}.jpg`; //passing current date as link download value
    link.href = canvas.toDataURL(); //passing canvasData as link href value
    link.click(); //clicking link to download image
})

canvas.addEventListener('mousedown',startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup',() => isDrawing = false);