"use strict";

import { getPieData } from "./piedata.js";
import { createSVGElement, drawGrid, drawValue, drawTriangle, drawLegend } from "./common.js";

function draw(nodes) {
    const canvas = document.querySelector("#svg");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.setAttribute("width", window.innerWidth - 20);
    canvas.setAttribute("height", window.innerHeight - headerHeight - 60);

    const cw = canvas.width.animVal.value;
    const ch = canvas.height.animVal.value;

    const cx = cw / 2;
    const cy = ch / 2;

    while (canvas.lastChild) {
        canvas.removeChild(canvas.lastChild);
    }

    drawGrid(canvas, cw, ch, 10);

    let radius = Math.min(ch / 2, cw / 2) - 20;

    if (nodes > 0) {
        let pie = getPieData(nodes);

        pie.sort((a, b) => b.value - a.value);
        //   console.log(pie);

        let sum = 0;
        pie.forEach((item) => {
            sum += item.value;
        });

        let startAngle = 0;
        for (let i = 0; i < nodes; i++) {
            const p = pie[i];
            const ratio = p.value / sum;
            const angle = ratio * (Math.PI * 2);
            const xpos = cx;
            // const degStart = (startAngle * 180) / Math.PI;
            // const degEnd = ((startAngle + angle) * 180) / Math.PI;
            const radEnd = angle + startAngle;

            let x1 = radius * Math.cos(startAngle);
            let y1 = radius * Math.sin(startAngle);
            let x2 = radius * Math.cos(radEnd);
            let y2 = radius * Math.sin(radEnd);

            drawTriangle(canvas, [cx, cy], [cx + x1, cy + y1], [cx + x2, cy + y2], p.fill);

            drawSector(canvas, xpos, cy, radius, startAngle, radEnd, p.fill, p.fill);
            //console.log([x1, y1], [x2, y2]);

            let percent = parseFloat(ratio * 100).toFixed(1) + "%";
            let valueXpos = (cx + (2 * cx + x1 + x2) / 2) / 2;
            let valueYpos = (cy + (2 * cy + y1 + y2) / 2) / 2;

            if (nodes == 2 && i == 0 && ratio > 0.5) {
                drawValue(canvas, 2 * cx - valueXpos, 2 * cy - valueYpos, percent);
            } else {
                drawValue(canvas, valueXpos, valueYpos, percent);
            }
            drawLegend(canvas, cw - 150, 55 + i * 20, 50, 22, p.fill, p.id, "black");

            startAngle += angle;
        }
    }
}

function drawSector(ctx, x, y, radius, start = 0, end = 0, stroke = "black", fill = "green") {
    let sect = createSVGElement("circle");

    ctx.appendChild(sect);
}

let r = 2; // slices

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
