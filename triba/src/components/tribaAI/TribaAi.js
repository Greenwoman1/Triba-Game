import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import './TribaAI.css';

import {
  aiMove,
  isMoveValid,
  isEndOfGame,
  removePoint,
  arePointsCollinear,
  largeBoard
} from "../../game/logic";
import {
  drawLine,
  drawTriangle,
  pointsDistance,
  circleRadius,
  changeColor,
  clickedPoint,
  canvasHeightShape,
} from "../../game/canvas";
import classNames from "classnames";
import Buttons from "../buttons/Buttons";



let canvas;
let ctx;
let playerOne = Math.random() >= 0.5;
let allPoints = [];
let occupiedPoints = [];
let trianglePoints = [];
let allTriangles = [];
let aiPlaysFirst = playerOne ? 0 : 1;

let gameWidth;
let gameHeight;
let canvasWidth;
let canvasHeight;

const TribaAI = (props) => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [playAgainButton, setPlayAgainButton] = useState(false);
  const [showStartGameButton, setShowStartGameButton] = useState(true);
  const [gameType, setGameType] = useState(largeBoard);
  const [chooseTypeOfGameButton, setChooseTypeOfGameButtons] = useState(false);

  const [remainingTime, setRemainingTime] = useState(7);
  const timeEnabled = props.fastGame;
  const [endMessage, setEndMessage] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [firstMove, setFirstMove] = useState(false);

  useEffect(() => {
    let timer;
    if (remainingTime === 0 && gameStarted) {
      setShowMessage(true);
      setIsEnd(true);
      showEndMessage();
      clearTimeout(timer);
    } else if (timeEnabled && gameStarted) {
      timer = setTimeout(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  });

  const showEndMessage = () => {
    setPlayAgainButton(true);
    let text = "KRAJ! Pobjednik je ";
    if (!timeEnabled) {
      if (playerOne) text += "prvi igrac!";
      else text += "drugi igrac!";
    } else {
      if (playerOne) text += "drugi igrac!";
      else text += "prvi igrac!";
    }
    setEndMessage(text);
  };

  const drawBoard = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    allPoints = [];

    if (canvas.height === canvasHeightShape) {
      for (let i = 1; i <= gameWidth; i++) {
        for (let j = 1; j <= gameHeight; j++) {
          if (
            i === 4 ||
            j === 4 ||
            ((i === 3 || i === 5) &&
              (j === 2 || j === 3 || j === 5 || j === 6)) ||
            ((i === 2 || i === 6) && (j === 3 || j === 5))
          ) {
            ctx.beginPath();
            ctx.arc(i * 50, j * 50, 7, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            allPoints.push([i * 50, j * 50]);
          }
        }
      }
    } else {
      for (let i = 1; i <= gameWidth; i++) {
        for (let j = 1; j <= gameHeight; j++) {
          ctx.beginPath();
          ctx.arc(
            i * pointsDistance,
            j * pointsDistance,
            circleRadius,
            0,
            Math.PI * 2,
            true
          );
          ctx.closePath();
          ctx.fill();
          allPoints.push([i * pointsDistance, j * pointsDistance]);
        }
      }
    }

    drawLine(ctx, playerOne);
  };

  const drawCanvas = () => {
    drawBoard();
    canvas.addEventListener("click", function (event) {
      if (!firstMove) {
        setFirstMove(true);

        setGameStarted(true);
      }
      let x = event.pageX - canvas.offsetLeft;
      let y = event.pageY - canvas.offsetTop;

      let xk = x % pointsDistance;
      let yk = y % pointsDistance;

      if (
        ((xk >= pointsDistance - circleRadius && xk <= pointsDistance - 1) ||
          (xk >= 0 && xk <= circleRadius)) &&
        ((yk >= pointsDistance - circleRadius && yk <= pointsDistance - 1) ||
          (yk >= 0 && yk <= circleRadius))
      ) {
        if (xk >= pointsDistance - circleRadius && xk <= pointsDistance - 1)
          x = x + (pointsDistance - xk);
        else x = x - xk;

        if (yk >= pointsDistance - circleRadius && yk <= pointsDistance - 1)
          y = y + (pointsDistance - yk);
        else y = y - yk;

        addPoint(x, y);
      }
    });

    if (!playerOne) makeMove();
  };

  const addPoint = (i, j) => {
    if (occupiedPoints.some((point) => point[0] === i && point[1] === j)) {
      alert("Tacka je u listi zauzetih odaberi drugu tacku!");
    } else {
      clickedPoint(ctx, i, j, "green");

      trianglePoints.push([i, j]);

      if (trianglePoints.length === 3) {
        if (
          arePointsCollinear(
            trianglePoints[0],
            trianglePoints[1],
            trianglePoints[2]
          )
        ) {
          alert("Ove tacke su kolinearne! Odaberi nove tacke!");
          for (let el of trianglePoints) {
            clickedPoint(ctx, el[0], el[1], "black");
          }
          trianglePoints = [];
        } else if (isMoveValid(allTriangles, trianglePoints)) {
          allTriangles.push(trianglePoints);
          occupiedPoints.push(trianglePoints[0]);
          occupiedPoints.push(trianglePoints[1]);
          occupiedPoints.push(trianglePoints[2]);
          allPoints = removePoint(
            allPoints,
            trianglePoints[0],
            trianglePoints[1],
            trianglePoints[2]
          );

          drawTriangle(
            ctx,
            trianglePoints[0][0],
            trianglePoints[0][1],
            trianglePoints[1][0],
            trianglePoints[1][1],
            trianglePoints[2][0],
            trianglePoints[2][1],
            playerOne
          );

          if (isEndOfGame(allPoints, allTriangles)) {
            setIsEnd(true);
            showEndMessage();
          }
          playerOne = !playerOne;
        } else {
          alert("Neispravan potez, odigrajte ponovo!");
          for (let el of trianglePoints) {
            clickedPoint(ctx, el[0], el[1], "black");}
        }

        trianglePoints = [];

        if (!playerOne && !isEndOfGame(allPoints, allTriangles)) {
          // AI move
          makeMove();
        }
      }
    }
  };

  const makeMove = () => {
    if (!firstMove) {
      setFirstMove(true);

      setGameStarted(true);
    }
    trianglePoints = aiMove(allTriangles, allPoints, gameType, aiPlaysFirst);

    allTriangles.push(trianglePoints);
    occupiedPoints.push(trianglePoints[0]);
    occupiedPoints.push(trianglePoints[1]);
    occupiedPoints.push(trianglePoints[2]);
    allPoints = removePoint(
      allPoints,
      trianglePoints[0],
      trianglePoints[1],
      trianglePoints[2]
    );

    drawTriangle(
      ctx,
      trianglePoints[0][0],
      trianglePoints[0][1],
      trianglePoints[1][0],
      trianglePoints[1][1],
      trianglePoints[2][0],
      trianglePoints[2][1],
      playerOne
    );

    if (isEndOfGame(allPoints, allTriangles)) {
      setIsEnd(true);
      showEndMessage();
    }
    setRemainingTime(7);
    playerOne = !playerOne;
    trianglePoints = [];
  };

  const handleTypeButton = (width, height, canvasW, canvasH) => {
    setChooseTypeOfGameButtons(false);
    gameWidth = width;
    gameHeight = height;
    canvasWidth = canvasW;
    canvasHeight = canvasH;
    drawCanvas();
    setShowCanvas(true);
  };

  const playAgain = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    setPlayAgainButton(false);
    allPoints = [];
    occupiedPoints = [];
    trianglePoints = [];
    allTriangles = [];
    drawBoard();
    setRemainingTime(7);
    setIsEnd(false);
    playerOne = Math.random() >= 0.5;
    aiPlaysFirst = playerOne ? 0 : 1;
    changeColor(ctx, !playerOne);

    if (!playerOne) makeMove();
  };
  const resetGame = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    setPlayAgainButton(false);
    allPoints = [];
    occupiedPoints = [];
    trianglePoints = [];
    allTriangles = [];
    setRemainingTime(7);
    drawBoard();
    setIsEnd(false);
    playerOne = Math.random() >= 0.5;
    changeColor(ctx, !playerOne);
  };
  const styles = {
    none: {
      display: "none",
    }
  };

  return (
    <div className="wrapperTribaAI">
      <Navbar resetGame={resetGame} gameStarted={gameStarted}></Navbar>

      {showCanvas && (
        <div className="row text-start margin-left w-50">
          {playAgainButton && (
            <button
              className="startButtonAI btn text-start btn-play-again ms-4"
              onClick={playAgain}
            >
              Igraj ponovo
            </button>
          )}
        </div>
      )}
      {isEnd && showEndMessage && <div> {endMessage}</div>}

      {showStartGameButton && (
       
        <div>
          
          <button
            className="startButtonAI"
            onClick={() => {
              setShowStartGameButton(false);
              setChooseTypeOfGameButtons(true);
            }}
          >
            START GAME
          </button>
        </div>
      )}

      {showCanvas && timeEnabled && !isEnd && (
        <div>
          <div>Preostalo vrijeme za potez: {remainingTime} sekundi</div>
        </div>
      )}

      {chooseTypeOfGameButton && <Buttons handleChange={handleTypeButton} />}

      <div
        style={showCanvas ? styles.gameWindow : styles.none}
        className={classNames({
          hide: !showCanvas,
        })}
      >
        <div className="canvas">
          <canvas id="canvas" width="70vw" height="70vh" />
        </div>
      </div>
    </div>
  );
};

export default TribaAI;
