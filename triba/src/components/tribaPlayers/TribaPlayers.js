import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import './TribaPlayers.css';
import {
  arePointsCollinear,
  isMoveValid,
  isEndOfGame,
  removePoint,
} from "../../game/logic";
import {
  drawLine,
  drawTriangle,
  changeColor,
  pointsDistance,
  circleRadius,
  canvasHeightShape,
  clickedPoint,

} from "../../game/canvas";

import classNames from "classnames";
import Buttons from "../buttons/Buttons";
import Navbar from "../navbar/Navbar";
import Chat from "../../pages/chat/Chat"
let canvas;
let ctx;
let playerOne = Math.random() >= 0.5;
let allPoints = [];
let occupiedPoints = [];
let trianglePoints = [];
let allTriangles = [];
let gameWidth;
let gameHeight;
let canvasWidth;
let canvasHeight;

const TribaPlayers = (props) => {

  const [showCanvas, setShowCanvas] = useState(false);
  const [showStartGameButton, setShowStartGameButton] = useState(true);
  const [chooseTypeOfGameButton, setChooseTypeOfGameButtons] = useState(false);
  const [playAgainButton, setPlayAgainButton] = useState(false);
  const [remainingTime, setRemainingTime] = useState(7);
  const timeEnabled = props.fastGame;
  const [endMessage, setEndMessage] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [firstMove, setFirstMove] = useState(false);
  const isLogged = localStorage.getItem("token") != null;

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
          setRemainingTime(7);
        } else {
          alert("Neispravan potez, odigrajte ponovo!!");
          for (let el of trianglePoints) {
                        clickedPoint(ctx, el[0], el[1], "black");}
        }
        trianglePoints = [];
      }
    }
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
    setRemainingTime(7);
    drawBoard();
    setIsEnd(false);
    playerOne = Math.random() >= 0.5;
    changeColor(ctx, !playerOne);
  };
  const resetGame = () => {
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
    main: {
      display: "flex",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    menu: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      width: "20%",
      gap: "48px",
      alignItems: "center",
      padding: "96px 48px",
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: "8px",
      filter: "drop-shadow(0px 37px 23px #000)",
    },
    navButton: {
      padding: "8px 4px",
      width: "100%",
      fontSize: "20px",
      fontWeight: "800",
      backgroundColor: "white",
      color: "rgba(0, 74, 149, 0.8)",
      cursor: "pointer",
      borderRadius: "4px",
      border: "none",
    },
    link: {
      width: "80%",
    },
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      height: "100vh",
      width: "100vw",
      padding: "16px",
      boxSizing: "border-box",
      margin: "auto",
      marginTop:"10%",
    },
    startButton: {
      backgroundColor: "rgba(0,0,0, 0.5)",
      filter: "drop-shadow(0px 37px 23px #000)",
      border: "none",
      borderRadius: "8px",
      color: "white",
      padding: "16px 32px",
      fontSize: "20px",
      cursor: "pointer",
    },
    gameWindow: {},
    none: {
      display: "none",
    },
    canvas: {
      backgroundColor: "rgba(0,0,0, 0.3)",
      borderRadius: "16px",
      padding: "16px",
    },
  };

  return (
    <div className="wrapperTribaPlayers">
      <Navbar resetGame={resetGame} gameStarted={gameStarted}></Navbar>
      {showCanvas && (
        <div className="row text-start margin-left w-50">
          {playAgainButton && (
            <button
              className="btn text-start startButton btn-play-again ms-4"
              onClick={playAgain}
            >
              Igraj ponovo
            </button>
          )}
        </div>
      )}
      {isEnd && showEndMessage && <div> {endMessage}</div>}
      {showStartGameButton && (
        <div className="menu">
          <button
            className="navButton"
            onClick={() => {
              setShowStartGameButton(false);
              setChooseTypeOfGameButtons(true);
            }}
          >
            <h2>START GAME</h2>
          </button>
        </div>
      )}
      {chooseTypeOfGameButton && <Buttons handleChange={handleTypeButton} />}
      {showCanvas && timeEnabled && !isEnd && (
        <div>
          <div>Preostalo vrijeme za potez: {remainingTime} sekundi</div>
        </div>
      )}

      <div
        style={showCanvas ? styles.gameWindow : styles.none}
        className={classNames({
          hide: !showCanvas,
        })}
      >
        <div className="canvas">
          <canvas id="canvas" width="600px" height="550px" />
        </div>
      </div>
      
    </div>
  );
};

export default TribaPlayers;
