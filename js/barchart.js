"use strict";

import { getBarChart } from "./barchartdata.js";
import { createSVGElement, drawGrid, drawLine, drawRect, drawValue } from "./common.js";

function draw(bars = 0, useColors = false, showBarValues = false, xAxisText = "", yAxisText = "") {
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

    while (canvas.lastChild) {
        canvas.removeChild(canvas.lastChild);
    }

    drawGrid(canvas, cw, ch, 10);

    if (bars > 0) {
        //Axis
        let baseY = ch - 50;
        let baseX = 150;
        let rightEdge = cw - 50;
        let yTop = 25;
        const bchart = getBarChart(bars, useColors);

        //X axis
        drawLine(canvas, [baseX, yTop], [baseX, baseY], "black", 2);
        drawValue(canvas, (baseX + rightEdge) / 2, baseY + 40, xAxisText);

        //Y axis
        let max = bchart[0].value;
        bchart.forEach((item) => {
            if (item.value > max) {
                max = item.value;
            }
        });

        drawLine(canvas, [baseX, baseY], [rightEdge, baseY], "black", 2);

        //Y axis ticks
        let yAxisHeight = baseY - yTop - 20;
        let ticks = 10;
        let majorYRange = yAxisHeight / ticks;
        let tickRange = max / ticks;

        let rfactor = max < 1000 ? 10 : max < 10000 ? 100 : 1000;

        let rt = Math.round(tickRange / rfactor) * rfactor;
        let adRatio = rt / tickRange;

        for (let y = 0; y <= ticks; y++) {
            let tickYPos = baseY - y * majorYRange * adRatio;
            let yValue = parseInt(y * rt).toLocaleString();

            let textWidth = yValue.length + 60;

            drawLine(canvas, [baseX - 10, tickYPos], [baseX, tickYPos], "red", 1);
            drawValue(canvas, baseX - textWidth, tickYPos, yValue);
        }

        drawValue(canvas, baseX / 2 - 50, baseY / 2, yAxisText, 1);

        let barwidth = 50;
        const xAxisWidth = rightEdge - baseX;
        const totalBarWidth = bars * barwidth;
        let gap = (xAxisWidth - totalBarWidth) / (parseInt(bars) + 1);

        for (let i = 0; i < bchart.length; i++) {
            const bar = bchart[i];
            let xpos = baseX + (i + 1) * gap + i * barwidth;
            let height = bar.value * (yAxisHeight / max);
            let ypos = baseY - height;
            drawRect(canvas, xpos, ypos, barwidth, height, bar.fill);

            if (showBarValues) {
                drawValue(canvas, xpos + 3, ypos - 5, bar.value.toLocaleString());
            }

            //X axis bar label
            drawValue(canvas, xpos + 10, baseY + 15, bar.id);
        }
    }
}

let r = 1; // slices

const xAxisLabel = document.getElementById("xlabel");
xAxisLabel.onchange = () => {
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

const yAxisLabel = document.getElementById("ylabel");
yAxisLabel.onchange = () => {
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

const diffColors = document.getElementById("colors");
diffColors.onclick = () => {
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

const showValues = document.getElementById("showvalues");
showValues.onclick = () => {
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

const controlOut = document.getElementById("nodes-output");
const control = document.getElementById("nodes");
control.oninput = () => {
    controlOut.textContent = r = control.value;
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

window.onresize = () => {
    const canvas = document.querySelector("#svg");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.setAttribute("width", window.innerWidth - 20);
    canvas.setAttribute("height", window.innerHeight - headerHeight - 60);

    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
