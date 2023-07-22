import TribaPlayers from "../tribaPlayers/TribaPlayers";
import TribaAI from "../tribaAI/TribaAi";
import MainMenu from "../mainMenu/MainMenu";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "../../pages/login/Login";
import {Register} from "../../pages/register/Register";
import {Profile} from "../../pages/profile/Profile";
import TribaPlayersMultiplayer from "../../socket/TribaPlayers";
import './Home.css';

function Home() {
   
    return (
        <div className="Home mainHome">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainMenu/>}/>

                    <Route path="/login" element={<Login/>}/>

                    <Route path="/register" element={<Register/>}/>

                    <Route path="/profile" element={<Profile/>}/>

                    <Route path="/normalgame" element={<TribaPlayers fastGame={false}/>}/>

                    <Route path="/fastgame" element={<TribaPlayers fastGame={true}/>}/>

                    <Route path="/ai" element={<TribaAI fastGame={false}/>}/>

                    <Route path="/ai/fg" element={<TribaAI fastGame={true}/>}/>
                    
                    <Route path="/multiplayer" element={<TribaPlayersMultiplayer fastGame={false}/>}/>

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Home;