import {useEffect, useState} from "react";
import axios from "axios";
import * as api from '../../api';
import './TopFivePlayers.css';

const Statistic=()=>{
const [TopFive,setTopFive]=useState([]);
const [players,setPlayers]=useState([]);
const [fetched, setFetched] = useState(false)

useEffect(()=>{
    fetch();
},[] )

useEffect(()=>{
    fetch();
},[fetched] )
  


const  fetch=async()=>{
    try{

        const res=await api.statistic()
        setPlayers(res)
        const sorted=players.sort((a,b)=>(b.score-a.score)  )

        const top=sorted.slice(0,5);
        setTopFive(top)
        setFetched(true)
    }
    catch(error){
        console.error('Error fatching: ',error)
    }

}
return (

    <div>
        <h2 className="header">Top five players:</h2>
        <div className="tableContainer">
            <table className="table">
                <thead className="tableHeader">
                <tr>
                    <th className="tableHeaderCell">Username</th>
                    <th className="tableHeaderCell">Grade</th>
                    <th className="tableHeaderCell">Wins</th>
                    <th className="tableHeaderCell">Total score</th>
                </tr>
                </thead>
                <tbody>
                {TopFive.map((player, id) => (
                    <tr key={player.id}>
                        <td className="tableCell">{player.username}</td>
                        <td className="tableCell">{player.grade}</td>
                        <td className="tableCell">{player.games_won}</td>
                        <td className="tableCell">{player.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};
export default Statistic;