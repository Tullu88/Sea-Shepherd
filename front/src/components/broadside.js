import axios from 'axios';
import { useEffect, useState } from 'react/cjs/react.development';
import '../App.css';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

function Broadside(props) {

    var [ p1Crew, setP1Crew ] = useState();
    var [ p1Shots, setP1Shots ] = useState();
    var [ reset, setReset ] = useState(false);

    const player1Id = "61a6230fb0b1488a2cbb2fee";

    useEffect(() => {
        setP1Crew(props.p1Crew)
    }, [props.p1Crew])

    useEffect(() => {
        setP1Shots(props.p1Shot)
    }, [props.p1Shot])

    // useEffect(() => {
    //     axios.get('/api/player/' + player1Id)
    //     .then(response => {
    //         setP1Crew(response.data.player.crew.qty);
    //     })
    //     .catch(err => {
    //         console.log("Error: " + err.message)});
            
    // }, [])

    const resetBattle = () =>{
        setP1Shots(null);
        setReset(true);
    }

    return(
        <div className="battleWindow">
            <div className="psShotsScreens">
                <div>Player 1</div>
                <div className="playerInfo">
                    <div>Ship: {props.p1Ship}</div> <div>Crew: {p1Crew ? p1Crew : '0' }</div> <div>Guns: {props.p1Guns}</div>
                </div>
                <div className="p1-shots-screen"><strong>P1 Cannon fires:</strong>{ reset === false && <div>{p1Shots}</div>}</div>
                
                <div className="start-end">
                <div><strong>{props.finalResult}</strong></div>
                {props.result !== null && reset === false && <button onClick={resetBattle}>Continue</button>}
                
            </div>
                </div>

            <div className="psShotsScreens">   
                <div>Player 2</div> 
                <div className="playerInfo">
                    <div>Ship: </div> <div>Crew:</div> <div>Guns: </div>
                </div>
                <div className="p2-shots-screen"><strong>P2 Cannon fires:</strong> { reset === false &&  <div>{props.p2Shot}</div> } </div>
                
            
            </div>

            

        </div>
    )
}

export default Broadside;