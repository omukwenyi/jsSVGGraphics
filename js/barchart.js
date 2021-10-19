"use strict";

import { getBarChart } from "./barchartdata.js";
import { drawGrid, drawLine, drawRect } from "./common.js";

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
        let baseX = 100;
        let rightEdge = cw - 50;
        let yTop = 25;
        const bchart = getBarChart(bars, useColors);

        //X axis
        drawLine(canvas,[baseX, yTop], [baseX, baseY], "black", 2);
        // drawValue(
        //     ctx,
        //     (baseX + rightEdge) / 2 - ctx.measureText(xAxisText).width / 2,
        //     baseY + 40,
        //     xAxisText
        // );

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
            // let ytext = ctx.measureText(yValue);
            // let textWidth = Math.ceil(ytext.width) + 15;

            drawLine(canvas, [baseX - 10, tickYPos], [baseX, tickYPos], "red", 1);
            // drawValue(ctx, baseX - textWidth, tickYPos, yValue);
        }

        //Y axis caption
        // ctx.save();
        // ctx.rotate((3 * Math.PI) / 2);
        // drawValue(ctx, -((yTop + baseY) / 2) - ctx.measureText(yAxisText).width / 2, 25, yAxisText);

        // ctx.restore();

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
                // drawValue(ctx, xpos + 3, ypos - 5, bar.value.toLocaleString());
            }

            //X axis bar label
            // drawValue(ctx, xpos + 10, baseY + 15, bar.id);
        }
    }
}

function drawValue(ctx, x, y, value) {
    ctx.font = "bold 12px serif";
    ctx.fillStyle = "black";
    ctx.fillText(value, x, y);
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
