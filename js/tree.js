"use strict";

import { ternarytree, binarytree } from "./nodedata.js";
import { drawGrid, drawCircle, drawLine, drawValue } from "./common.js";

function init(nodes, type) {
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

    let root;

    //
    switch (type) {
        case 1:
            root = binarytree(0, nodes);
            draw(canvas, root, cx, 50, null);
            break;
        case 2:
            root = ternarytree(0, nodes);
            drawT(canvas, root, cx, 50, null);
            break;
        case 3:
            root = randomtree(0, nodes);
            break;
        default:
            break;
    }
}

function drawT(ctx, root, px, py, direction = null) {
    if (root === null) {
        return;
    }
    let cx = ctx.width.animVal.value / 2;

    const radius = 15;

    const level = root.level;
    let angle = 0;
    const ypos = level <= 1 && direction !== "M" ? radius * 2 : level * 60 + radius * 2;
    const xpos = (px, direction) => {
        angle = ((150 - level * 40) / 2) * (Math.PI / 180);
        if (direction == "L") {
            if (level == 1) {
                return cx / 2;
            }
            return px - 100 * Math.tan(angle);
        } else if (direction == "M") {
            return px;
        } else if (direction == "R") {
            if (level == 1) {
                return cx + cx / 2;
            }
            return px + 100 * Math.tan(angle);
        } else {
            return cx;
        }
    };

    const ccx = xpos(px, direction);

    if (direction !== null) {
        let xoffset = radius * Math.sin(angle);
        let yoffset = radius * Math.cos(angle);

        if (level > 1) {
            if (direction == "L") {
                drawLine(ctx, [px, py + yoffset], [ccx, ypos - yoffset], "black", 1.5);
            } else if (direction == "R") {
                drawLine(
                    ctx,
                    [px + xoffset, py + yoffset],
                    [ccx - xoffset, ypos - yoffset],
                    "black",
                    1.5
                );
            } else if (direction == "M") {
                drawLine(ctx, [px, py + yoffset], [ccx, ypos - yoffset], "black", 1.5);
            }
        } else {
            xoffset = direction === "L" ? -radius : direction === "R" ? radius : 0;
            yoffset = direction == "M" ? radius : 0;
            drawLine(ctx, [px + xoffset, py + yoffset], [ccx, ypos], "black", 1.5);
        }
    }

   
    drawCircle(ctx, ccx, ypos, radius, "black", "rgb(0,0,0,0.9)");
    drawValue(ctx, ccx - 8, ypos + 5, formatNum(root.id), 0, "white");

    if (root.left !== null) {
        drawT(ctx, root.left, ccx, ypos, "L");
    }
    if (root.middle !== null) {
        drawT(ctx, root.middle, ccx, ypos, "M");
    }
    if (root.right !== null) {
        drawT(ctx, root.right, ccx, ypos, "R");
    }
}

function draw(ctx, root, px, py, direction = null) {
    if (root === null) {
        return;
    }

    let cx = ctx.width.animVal.value / 2;
    
    const radius = 15;
    const level = parseInt(Math.log2(root.id));
    const ypos = level * 60 + radius * 2;
    const xpos = (px, direction) => {
        let angle = ((180 - level * 30) / 2) * (Math.PI / 180);
        if (direction == "L") {
            return px - 100 * Math.tan(angle);
        } else if (direction == "R") {
            return px + 100 * Math.tan(angle);
        } else {
            return cx;
        }
    };

    const ccx = xpos.call(null, px, direction);

    if (direction !== null) {
        drawLine(ctx, [px, py], [ccx, ypos], "black", 1.5);
    }
    
    drawCircle(ctx, ccx, ypos, radius, "black", "rgb(0,0,0,0.9)");
    drawValue(ctx, ccx - 8, ypos + 5, formatNum(root.id), 0, "white");

    if (root.left !== null) {
        draw(ctx, root.left, ccx, ypos, "L");
    }
    if (root.right !== null) {
        draw(ctx, root.right, ccx, ypos, "R");
    }
}
function formatNum(n) {
    if (n < 10) {
        return "0" + n;
    } else {
        return n;
    }
}

function resize() {
    const canvas = document.querySelector("#svg");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.setAttribute("width", window.innerWidth - 20);
    canvas.setAttribute("height", window.innerHeight - headerHeight - 60);
}

let r = 1; // nodes
let type = 1;

const treeType = document.getElementById("treetype");
treeType.onchange = (e) => {
    type = parseInt(e.target.value);
    init(r, type);
};

const controlOut = document.getElementById("nodes-output");
const control = document.getElementById("nodes");
control.oninput = () => {
    controlOut.textContent = r = control.value;
    init(r, type);
};

window.onresize = () => {
    //draw(parseInt(r));

    init(r, type);
};

let scale = 1;
init(r, type);
