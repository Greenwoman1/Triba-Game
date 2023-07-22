import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Statistic from "../topFivePlayers/TopFivePlayers";
import {useEffect, useState} from "react";
import socket from "../../socket";
import './MainMenu.css';

function Home() {
    const isLogged = localStorage.getItem("token") != null;

 
    const [isConnected ,setIsConnected] = useState(false);

    useEffect(() => {


        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        },[]);

return (

    <div className="MainMenu menuWrapper">
        <div className="mainMainMenu">
        <Navbar/>
            <div className="menuMainMenu" >
            <Link className="link" to="/normalgame"><button className="navButtonMainMenu"><h2>NORMAL GAME</h2></button></Link>
            <Link className="link" to="/fastgame"><button className="navButtonMainMenu"><h2>FAST GAME</h2></button></Link>
            <Link className="link" to="/ai"><button className="navButtonMainMenu"><h2>AI MODE</h2></button></Link>
            <Link className="link" to="/ai/fg"><button className="navButtonMainMenu"><h2>AI MODE FAST GAME</h2></button></Link>
            <Link className="link"  to="/multiplayer"><button className="navButtonMainMenu"><h2>MULTIPLAYER</h2></button></Link>
            </div>
{ isLogged && (
            <div className="menuContainer">
                <Statistic />
            </div>)
}
        </div> 
    </div>
    
    );
}
export default Home;