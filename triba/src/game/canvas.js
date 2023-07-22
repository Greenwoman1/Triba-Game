export const gameBoardWidthLarge = 10;
export const gameBoardHeightLarge = 8;
export const gameBoardWidthMedium = 7;
export const gameBoardHeightMedium = 6;
export const gameBoardWidthSmall = 5;
export const gameBoardHeightSmall = 4;
export const gameBoardWidthShape = 7;
export const gameBoardHeightShape = 7;
export const pointsDistance = 50;
export const canvasWidthLarge = 550;
export const canvasHeightLarge = 450;
export const canvasWidthMedium = 400;
export const canvasHeightMedium = 350;
export const canvasWidthSmall = 300;
export const canvasHeightSmall = 250;
export const canvasWidthShape = 400;
export const canvasHeightShape = 400;

export const circleRadius = 7;

export const clickedPoint = (ctx, a, b, color) => {
    ctx.beginPath();
    ctx.arc(a, b, 7, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  export const drawTriangle = (ctx, ax, ay, bx, by, cx, cy, player) => {
    ctx.beginPath();
    ctx.arc(ax, ay, 7, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
  
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
  
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
  
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.lineTo(ax, ay);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.stroke();
  
    changeColor(ctx, player);
  };

export const changeColor = (ctx, player) =>{
    if(!player) {
        ctx.strokeStyle = "yellow";
    }
    else ctx.strokeStyle = "blue";
    const canvasWidth = document.getElementById("canvas").width;
    const canvasHeight = document.getElementById("canvas").height;
    ctx.beginPath();
    ctx.lineWidth = 3;

    ctx.moveTo(5, 50);
    ctx.lineTo(5, canvasHeight - 50);
    ctx.stroke();


    ctx.moveTo(canvasWidth - 5, 50);
    ctx.lineTo(canvasWidth - 5, canvasHeight - 50);

    ctx.closePath();
    ctx.stroke();
}

export const drawLine = (ctx, playerOne) => {
    const canvasWidth = document.getElementById("canvas").width;
    const canvasHeight = document.getElementById("canvas").height;
    if(playerOne)
        ctx.strokeStyle = "yellow";
    else
        ctx.strokeStyle = "blue";

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(5, 50);
    ctx.lineTo(5, canvasHeight - 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - 5, 50);
    ctx.lineTo(canvasWidth - 5, canvasHeight - 50);
    ctx.stroke();
}