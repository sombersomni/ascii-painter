window.onload = function () {
    let fileInput = document.getElementById('fileInput');
    let img = document.createElement('img');

    createFade(document.getElementById('message'), 1);
    function calcHeight(w, image) {
        return w/image.width * image.height
    }
    function drawAscii(data) {
        let table = document.getElementById('ascii');
        const bits = 1;
        const dark = "▓";
        const mid = "▒";
        const light = "░";
        for(var x = 0; x < data.length; x+=bits) {
            if(data[x] > 0 && data[x] <= 65) {
            table.innerText += dark;
            }
            else if(data[x] > 65 && data[x] <= 150) {
            table.innerText += mid;
            }
            else {
            table.innerText += light;
            }
            if((x +1) % Math.sqrt(data.length) == 0 && x != 0) {
            table.innerText += '\n';
            }
        }
    }
    function createFade(target, opacity) {
        anime({
            targets: target,
            translateX: 10,
            opacity: opacity,
            duration: 4000,
            loop: 1
        })
    }

    function processImageData(colors) {
    console.log("processing", colors);
    let newData = [];
    for(let x = 0; x < colors.data.length; x+=4) {
        const average = Math.floor((colors.data[x] + colors.data[x+1] + colors.data[x+2])/3);
        newData.push(average);
    }
    return newData;
    }

    function renderImage(image) {
        let canvas = document.querySelector("canvas");
        let imageHolder = document.getElementById("imageHolder");
        const len = imageHolder.children.length;
        if(len > 0) {
            for(let i = 0; i < len; i++){
            imageHolder.removeChild(imageHolder.children[0]);
            }
        }
        imageHolder.appendChild(image);
        let ctx = canvas.getContext('2d');
        const fixedWidth = canvas.width;
        const scaledDownHeight = calcHeight(fixedWidth, image); //scales down height
        ctx.drawImage(image, 0,0,fixedWidth, scaledDownHeight);
        let imageData = ctx.getImageData(0,0,fixedWidth, fixedWidth);
        let greyScaleData = processImageData(imageData);
        drawAscii(greyScaleData);
    }

    fileInput.addEventListener("change", (e) => {
        let table = document.getElementById('ascii');
        table.innerText = "";
            //createFade(document.getElementById('message'));
        const newFile = URL.createObjectURL(e.target.files[0]);
        
            const imgSize = 320;
        img.setAttribute("src", newFile);
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const scaledImg = calcHeight(imgSize, img); 
            img.setAttribute("width", img.toString()+"px");
            img.setAttribute("height", scaledImg.toString()+"px" );
            window.URL.revokeObjectURL(newFile);
            renderImage(img);
        };

    });
}