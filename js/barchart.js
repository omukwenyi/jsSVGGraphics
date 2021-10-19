"use strict";

const NS = "http://www.w3.org/2000/svg";

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

    drawGrid(cw, ch, 10, 0.2);

    if (bars > 0) {
        //Axis
        let baseY = ch - 50;
        let baseX = 100;
        let rightEdge = cw - 50;
        let yTop = 25;
        const bchart = getBarChart(bars, useColors);

        //X axis
        // drawLine(canvas,[baseX, yTop], [baseX, baseY], "black", 2);
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

        // drawLine(ctx, [baseX, baseY], [rightEdge, baseY], "black", 2);

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

            // drawLine(ctx, [baseX - 10, tickYPos], [baseX, tickYPos], "red", 1);
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
            // drawRect(ctx, xpos, ypos, barwidth, height, bar.fill);

            if (showBarValues) {
                // drawValue(ctx, xpos + 3, ypos - 5, bar.value.toLocaleString());
            }

            //X axis bar label
            // drawValue(ctx, xpos + 10, baseY + 15, bar.id);
        }
    }
}

const makeSVG = function (tagName, attrs, children) {
    var element = document.createElementNS(NS, tagName);
    if (attrs instanceof Array || typeof attrs == "string") {
        children = attrs;
        attrs = {};
    }
    if (attrs)
        for (var a in attrs) {
            element.setAttribute(a, attrs[a]);
        }
    if (children instanceof Array) {
        children.forEach(function (c) {
            element.appendChild(c);
        });
    } else if (typeof children == "string") {
        element.textContent = children;
    }
    return element;
};

function drawValue(ctx, x, y, value) {
    ctx.font = "bold 12px serif";
    ctx.fillStyle = "black";
    ctx.fillText(value, x, y);
}

function drawRect(ctx, x, y, width, height, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
}

function drawLine(ctx, begin, end, stroke = "black", width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }

    if (width) {
        ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}

function drawGrid(width, height, gap, lineWidth) {
    const svg = document.querySelector("#svg");

    var top = makeSVG("line", {
        x1: 0,
        y1: 0,
        x2: width,
        y2: 0,
        stroke: "black",
        style: "stroke-width:3;",
    });

    svg.appendChild(top);

    var left = makeSVG("line", {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: height,
        stroke: "black",
        style: "stroke-width:3;",
    });

    svg.appendChild(left);

    var bottom = makeSVG("line", {
        x1: 0,
        y1: height,
        x2: width,
        y2: height,
        stroke: "black",
        style: "stroke-width:3;",
    });
    
    svg.appendChild(bottom);

    var right = makeSVG("line", {
        x1: width,
        y1: 0,
        x2: width,
        y2: height,
        stroke: "black",
        style: "stroke-width:3;",
    });

    svg.appendChild(right);

    for (let i = 0; i < width; i += gap) {
        let vline = makeSVG("line", {
            x1: i,
            y1: 0,
            x2: i,
            y2: height,
            stroke: "black",
            style: "stroke-width:0.2;",
        });

        svg.appendChild(vline);
    }
    for (let i = 0; i < height; i += gap) {
        let hline = makeSVG("line", {
            x1: 0,
            y1: i,
            x2: width,
            y2: i,
            stroke: "black",
            style: "stroke-width:0.2;",
        });

        svg.appendChild(hline);
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
