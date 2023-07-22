import React, {useEffect, useState, useCallback, useRef} from "react";
import {Link} from "react-router-dom";

import socket from "../socket";
import {
    getChatMessages,
    getUsername,
    getConnectedUserCount,
    sendChatMessage,
    sendGameState,
    sendEndGame,
    sendGameSettings,
    updateProfileStats, updateProfileRating,
} from "../api";
import {
    arePointsCollinear,
    isMoveValid,
    isEndOfGame,
    removePoint,
} from "../game/logic";
import {
    drawLine,
    drawTriangle,
    changeColor,
    pointsDistance,
    circleRadius,
    clickedPoint,
    canvasHeightShape,
} from "../game/canvas";

import classNames from "classnames";
import Buttons from "../components/buttons/Buttons";
import Navbar from "../components/navbar/Navbar";
import Chat from "../pages/chat/Chat";
import {all} from "axios";
import * as api from "../api";
import {Modal, Button} from 'react-bootstrap';
import AlertModal from "../components/ratingModal/AlertModal";

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
let username = "";
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
    const [chatRoom, setChatRoom] = useState("");
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [trian, setTrian] = useState([])
    const [EnterRoomShow, setEnterRoomShow] = useState(false)
    const [chatMessage, setChatMessage] = useState("");
    const [sendGameSetting, setSendGameSetting] = useState(false)
    const [playerWin, setPlayerWin] = useState("")
    const [profile, setProfile] = useState(null);
    const [playerToBeRated, setPlayerToBeRated] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isClickable, setIsClickable] = useState(true);


    const [tableData, setTableData] = useState([]);
    useEffect(() => {


        function onConnect() {

            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);


        socket.on('message', message => {
            fetchChatMessages(chatRoom)
        });


        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('message', fetchChatMessages);
        };
    }, []);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const res = await getUsername(chatRoom);
                username = res.username
            } catch (error) {
                console.log("Greška prilikom dobavljanja korisničkog imena:", error);
            }
        };
    
        fetchUsername();
    }, []);



useEffect(()=>{
    socket.on('message', data =>{
        fetchChatMessages(chatRoom)
    })
    return () => {
        socket.off('message')
    }

})
    useEffect(() => {

        socket.on('game_state', data => {
            const {player, allPoints, occupiedPoints, trianglePoints, allTriangles} = data.gameState;

            
            setGameState( player, allPoints, occupiedPoints, trianglePoints, allTriangles);

        });
        return () => {
            socket.off('game_state')
        }
    })

    useEffect(() => {
      }, [isClickable]);
      

    useEffect(() => {

        socket.on('game_settings', data => {
            const {player, gwidth, gheight, cwidth, chight} = data.gameSettings;
            setGameSettings(player, gwidth, gheight, cwidth, chight);


        });
        return () => {
            socket.off('game_settings')

        }
    })

    const setGameSettings = (p, GW, GH, CW, CH) => {
        playerOne = p
        gameWidth = GW;
        gameHeight = GH;
        canvasWidth = CW;
        canvasHeight = CH;

        setSendGameSetting(true);
        drawCanvas();
        setShowCanvas(true);
        setShowStartGameButton(false)


    }
    useEffect(() => {
        (async () => {
            const profile = await api.getProfile();
            setProfile(profile);
        })()
    }, []);

    useEffect(() => {
        socket.on('end_game', data => {
            const {payload} = data;
            const {winnerUsername, loserUsername, ...restPayload} = payload;
            setPlayerWin(winnerUsername)
            setIsEnd(true);
            showEndMessage(winnerUsername);
            setShowMessage(true);

            setPlayAgainButton(true)
            updateProfileStats(winnerUsername, loserUsername)

            if (profile.username === winnerUsername) {
                setPlayerToBeRated(loserUsername);
                // alert("you need to rate: " + loserUsername)
            } else {
                setPlayerToBeRated(winnerUsername);
                // alert("you need to rate: " + winnerUsername)
            }
            setShowModal(true);

        });

        return () => {
            socket.off('end_game');
        };
    },);

    const setGameState = ( p,ap, op, tp, at) => {
        if (sendGameSetting) {
            
            if(p === username){
                setIsClickable(false)
            } else {
                setIsClickable(true)
            }

            allPoints = ap;
            occupiedPoints = op;
            trianglePoints = tp
            setTrian(tp)
            allTriangles = at


        }
    }

    useEffect(() => {
        if (trianglePoints.length === 3 && sendGameSetting) {
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
        }
        trianglePoints = []

    }, [trianglePoints])


    const connectToRoom = async (event) => {
        event.preventDefault();
        setEnterRoomShow(true);
        fetchChatMessages(chatRoom)
        const profile = await api.getProfile();
        socket.emit('join', {room: chatRoom, username: profile.username})
    }
    const fetchChatMessages = async (room) => {
        try {
            const response = await getChatMessages(room)
            setTableData(response)
        } catch (error) {
            console.log('Error fetching data:', error)
        }
    }
    const sendMessageToParent = (mess) => {
        setChatMessage(mess);
        fetchChatMessages(chatRoom)
    }
    const sendMessage = async (event) => {
        event.preventDefault();
        await sendChatMessage(chatRoom, chatMessage)
        await fetchChatMessages(chatRoom)
    }


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

    const showEndMessage = (username) => {

        setPlayAgainButton(true);
        let text = "KRAJ! Pobjednik je :  " + username;


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
        setGameStarted(true)
        canvas.addEventListener("click", function (event) {
            if(isClickable){if (!firstMove) {
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
            }}
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


                        sendEndGame(chatRoom, {endGame: "true"})
                    }
                    sendGameState(chatRoom, {
                        player: username,
                        allPoints: allPoints,
                        occupiedPoints: occupiedPoints,
                        trianglePoints: trianglePoints,
                        allTriangles: allTriangles,

                    });
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
        sendGameSettings(chatRoom, {
            gwidth: width,
            gheight: height,
            cwidth: canvasW,
            chight: canvasH,

        });

    };

    const playAgain = () => {
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
            marginTop: "10%",
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

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    const handleRate = (rating) => {
        updateProfileRating(playerToBeRated, rating);
        setShowModal(false);
    };

    return (
        <div style={styles.wrapper}>
            {showModal && playAgainButton &&
                <AlertModal playerToBeRated={playerToBeRated} onClose={closeModal}/>}
            <Navbar resetGame={resetGame} gameStarted={gameStarted}></Navbar>
            {showCanvas && (
                <div className="row text-start margin-left w-50">
                    {playAgainButton && (
                        <button
                            style={styles.startButton}
                            className="btn text-start btn-play-again ms-4"
                            onClick={playAgain}
                        >
                            Igraj ponovo
                        </button>
                    )}
                </div>
            )}
            {isEnd && showEndMessage && <div> {endMessage}</div>}
            {showStartGameButton && (
                <div style={styles.menu}>
                    <button
                        style={styles.navButton}
                        onClick={() => {
                            setShowStartGameButton(false);
                            setChooseTypeOfGameButtons(true);
                        }}
                    >
                        <h2>START GAME</h2>
                    </button>
                </div>
            )}
            {chooseTypeOfGameButton && <Buttons handleChange={handleTypeButton}/>}
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
                <div style={styles.canvas}>
                    <canvas id="canvas" width="600px" height="550px" style={{ pointerEvents: isClickable ? 'auto' : 'none' }}
 />
                </div>
            </div>

            {!EnterRoomShow ? (<form onSubmit={connectToRoom}>
                    <input
                        type="text"
                        value={chatRoom}
                        onChange={event => setChatRoom(event.target.value)}
                        placeholder="Enter room name..."
                        className="chatMenuInput"
                    />
                    <button type="submit"
                            className="chatButton">Connect
                    </button>

                </form>) :
                (
                    <Chat sendMessageToParent={sendMessageToParent} chatMessage={chatMessage} socket={socket}
                          chatRoomParent={chatRoom} tableDataParent={tableData} fetchChatMessages={fetchChatMessages}
                          sendMessage={sendMessage}></Chat>)

            }
        </div>
    );
};

export default TribaPlayers;
