"use strict";

import { drawGrid, drawLine, drawImage, drawValue, getRandomIntInclusive } from "./common.js";

function draw(nodes) {
    console.clear();

    const canvas = document.querySelector("#svg");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.setAttribute("width", window.innerWidth - 20);
    canvas.setAttribute("height", window.innerHeight - headerHeight - 60);

    const cw = canvas.width.animVal.value;
    const ch = canvas.height.animVal.value;

    const cx = cw / 2;
    const cy = ch / 2;
    // console.log("cx", cx, "cy", cy);

    while (canvas.lastChild) {
        canvas.removeChild(canvas.lastChild);
    }

    drawGrid(canvas, cw, ch, 10);
    drawLine(canvas, [cx, 0], [cx, ch], "red", 1);
    drawLine(canvas, [0, cy], [cw, cy], "red", 1);

   
    if (nodes > 0) {
        //console.clear();
        const nodeSize = 40;
        const angleGap = (2 * Math.PI) / nodes;
        const lineLength = Math.min(cx, cy) - nodeSize;

        let i = 0;
        for (let angle = 0; angle < Math.PI * 2; angle += angleGap) {
            const x = lineLength * Math.cos(angle);
            const y = lineLength * Math.sin(angle);

            drawLine(canvas, [cx, cy], [cx + x, cy + y], "black", 2.5);
            
            const ip = Math.ceil(angle * (180 / Math.PI) + 2);
            const type = getDeviceType();
            
            i++;
            if (i <= nodes) {
                drawImageRect(canvas, cx + x, cy + y, nodeSize, nodeSize, type, i, cx);
            }
        }

        drawImageRect(canvas, cx, cy, nodeSize + 10, nodeSize + 10, "R", "192.168.0.1", cx);
        
    }
}

function getDeviceType() {
    const tn = Math.round(getRandomIntInclusive(1, 5));
    switch (tn) {
        case 1:
            return "S";
        case 2:
            return "R";
        case 3:
            return "F";
        case 4:
            return "V";
        case 5:
            return "D";
        default:
            return "U";
    }
}

function drawImageRect(ctx, x, y, width, height, type, label, cx) {
    const img1 = new Image();
    let src = "";
    switch (type) {
        case "S":
            src = "./images/switch.svg";
            break;
        case "R":
            src = "./images/router.svg";
            break;
        case "F":
            src = "./images/firewall.svg";
            break;
        case "V":
            src = "./images/server.svg";
            break;
        case "D":
            src = "./images/database.svg";
            break;
        case "U":
            src = "./images/workstation.svg";
            break;
    }

    img1.src = src;

    img1.onload = function () {
        drawImage(ctx, img1.src, x - width / 2, y - height / 2, width, height);

        if (x >= cx) {
            drawValue(ctx, 5 + x + width / 2, y - 5, label);
        } else {
            drawValue(ctx, x - width / 2, y - height / 2 - 5, label);
        }

        this.tag = label;
    };

    img1.onclick = function () {
        console.log(this.tag);
    };
}



let r = 2; // nodes

const controlOut = document.getElementById("nodes-output");
const control = document.getElementById("nodes");
control.oninput = () => {
    controlOut.textContent = r = control.value;
    draw(r);
};

window.onresize = () => {
    const canvas = document.querySelector("#svg");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.setAttribute("width", window.innerWidth - 20);
    canvas.setAttribute("height", window.innerHeight - headerHeight - 60);

    draw(r);
};

draw(r);
