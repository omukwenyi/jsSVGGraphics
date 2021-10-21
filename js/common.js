"use strict";

const NS = "http://www.w3.org/2000/svg";

const createSVGElement = function (tagName, attrs, children) {
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

function drawSector(ctx, center, start, radius, end, fill = "green", isLarge = false) {
    let sect = createSVGElement("path", {
        d: `M ${center[0]},${center[1]} ${start[0]},${start[1]} A${radius},${radius} 0 ${
            isLarge ? 1 : 0
        },1 ${end[0]},${isLarge ? end[1] - 0.001 : end[1]} Z`,
        style: `fill: ${fill};`,
    });

    ctx.appendChild(sect);
}

function drawTriangle(ctx, pointA, pointB, pointC, fill, width = 1) {
    const tri = createSVGElement("polyline", {
        points: `${pointA[0]},${pointA[1]}  ${pointB[0]},${pointB[1]}  ${pointC[0]},${pointC[1]}`,
        fill: fill,
        style: `stroke: ${fill} ;`,
    });

    ctx.appendChild(tri);
}

function drawLegend(ctx, x, y, width, height, fill, label, labelFill) {
    drawRect(ctx, x, y, width, height, fill);
    drawValue(ctx, x + width + 5, y + 5 + height / 2, label, 0);
}

function drawRect(ctx, x, y, width, height, fill) {
    ctx.appendChild(
        createSVGElement("rect", { x: x, y: y, width: width, height: height, fill: fill })
    );
}

function drawRectClear(ctx, x, y, width, height, stroke) {
    ctx.strokeStyle = stroke;
    ctx.strokeRect(x, y, width, height);
}

function drawValue(ctx, x, y, value, rotated = 0, stroke = "black") {
    let txt;
    if (rotated === 1) {
        txt = createSVGElement("text", {
            x: x,
            y: y,
            stroke: stroke,
            textContent: value,
            style: "writing-mode: tb; font-size: 0.8em;",
        });
    } else {
        txt = createSVGElement("text", {
            x: x,
            y: y,
            stroke: stroke,
            textContent: value,
            style: "font-size: 0.8em;",
        });
    }

    txt.textContent = value;

    ctx.appendChild(txt);
}

function drawValueActive(ctx, x, y, value, fill = "black") {
    let txt = createSVGElement("text", {
        x: x,
        y: y,
        fill: fill,
        textContent: value,
        style: "font-size: 0.8em; font-weight:bold;",
    });

    txt.textContent = value;

    ctx.appendChild(txt);
}

function drawLine(ctx, begin, end, stroke = "black", width = 1) {
    ctx.appendChild(
        createSVGElement("line", {
            x1: begin[0],
            y1: begin[1],
            x2: end[0],
            y2: end[1],
            stroke: stroke,
            style: "stroke-width:" + width,
        })
    );
}

function drawCircleClear(ctx, x, y, radius = 10, stroke = "black", lineWidth = 1) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
    ctx.stroke();
    //ctx.fill();
}

function drawCircle(ctx, x, y, radius = 10, stroke = "black", fill = "black", lineWidth = 1) {
    let circle = createSVGElement("circle", {
        cx: x,
        cy: y,
        r: radius,
        stroke: stroke,
        fill: fill,
        style: `stroke-width: ${lineWidth}`,
    });
    ctx.appendChild(circle);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function create2DArray(i, j) {
    let array = new Array(i);
    for (let k = 0; k < i; k++) {
        array[k] = new Array(j);
    }
    return array;
}

function drawGrid(svg, width, height, gap) {
    var top = createSVGElement("line", {
        x1: 0,
        y1: 0,
        x2: width,
        y2: 0,
        stroke: "black",
        style: "stroke-width:3;",
    });

    svg.appendChild(top);

    var left = createSVGElement("line", {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: height,
        stroke: "black",
        style: "stroke-width:3;",
    });

    svg.appendChild(left);

    var bottom = createSVGElement("line", {
        x1: 0,
        y1: height,
        x2: width,
        y2: height,
        stroke: "black",
        style: "stroke-width:3;",
    });

    svg.appendChild(bottom);

    var right = createSVGElement("line", {
        x1: width,
        y1: 0,
        x2: width,
        y2: height,
        stroke: "black",
        style: "stroke-width:3;",
    });

    svg.appendChild(right);

    for (let i = 0; i < width; i += gap) {
        let vline = createSVGElement("line", {
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
        let hline = createSVGElement("line", {
            x1: 0,
            y1: i,
            x2: width,
            y2: i,
            stroke: "black",
            style: "stroke-width:0.1;",
        });

        svg.appendChild(hline);
    }
}

export {
    createSVGElement,
    drawTriangle,
    drawSector,
    drawRect,
    drawLegend,
    drawRectClear,
    drawValue,
    drawGrid,
    drawLine,
    drawCircle,
    drawCircleClear,
    getRandomIntInclusive,
    drawValueActive,
    create2DArray,
};
