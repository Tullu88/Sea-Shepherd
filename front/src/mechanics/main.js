
import { useState, useEffect, useRef } from 'react';
import PlayWindow from '../components/play-window';

import axios from 'axios';


function BattleMechanic(props) {
    const player1Id = "61a6230fb0b1488a2cbb2fee";
    const player2Id = "61a7e25b0e505068298870cb";

    // Saving initial crew quantities to these
    var [ p1Ship, setP1Ship ] = useState(null); 
    var [ p1ShipMinCrewStat, setP1ShipMinCrewStat ] = useState(null);
    var [ p1ShipMaxCrewStat, setP1ShipMaxCrewStat ] = useState(null);
    var [ p1Crew, setP1Crew ] = useState(0); 
    var [ p1Guns, setP1Guns ] = useState(0);
    var [ playerFunds, setPlayerFunds ] = useState();

    var [ canSail, setCanSail ] = useState(null)
    var [ p1CrewDeaths, setP1CrewDeaths ] = useState(0);

    var p1CrewQuantityUpdate = useRef();
    
    var length = 0;

    var [play, setPlay] = useState(null);
    var [ p1CrewUpdate, setP1CrewUpdate ] = useState();

    // The crew number is equivalent to a ship's Health points
    // Get the amount the ship has
    var p1_crew = p1Crew;
    var p2_crew = props.player2.fleet["ship 1"].crew;

    // The guns (and their type) determine the damage that the
    //ship can deliver.
    // Here I first save the object where the guns are stored
    //to a variable.
    var p1_guns = p1Guns;
    var p2_guns = props.player2.fleet["ship 1"].guns;

    // This function will count how many guns the ship has
    // This might be temporary until I figure out a different
    //way I'd like to make the calculations (or not)
    function GunCount( obj ) {
        length = 0;
        for( var key in obj ) {
            if( obj.hasOwnProperty(key) ) {
                ++length;
            }
        }
        return length;
    }


    // Retriever PLAYER 1 and ship data here
    //then save to state
    useEffect(() => {

        axios.get('/api/player/' + player1Id)
            .then(response => {
                console.log(JSON.stringify(response));
                setP1Ship(response.data.player.ship.type);
                setP1Crew(response.data.player.crew.qty);
                setP1Guns(response.data.player.guns);
                setP1ShipMinCrewStat(response.data.ship._min_crew);
                setP1ShipMaxCrewStat(response.data.ship._max_crew);
                setPlayerFunds(response.data.player.funds);
        })
        .catch(err => {
            console.log("Error: " + err.message);
            //return
        });
}, []);  

useEffect(() => {
    if (p1Crew > p1ShipMinCrewStat) {
        setCanSail(true);
    } else {
        setCanSail(false);
    }
}, [p1Crew])


    // Here I save the amount of guns each ship has
    //so I can use them in the battle calculation
    //const p1_guns_count = GunCount(p1_guns);
    const p2_guns_count = GunCount(p2_guns);

    const [p1Broadside, setP1Broadside] = useState([]);
    const [p2Broadside, setP2Broadside] = useState([]);
    const [isBattle, setIsBattle] = useState(true);
    
    
        const p1ShotLog = [];
        const p2ShotLog = [];
        var p1ShotCount = 0;
        var p2ShotCount = 0;
        var p1ReactionTime = Math.floor(Math.random() * (1000 - 400 + 1) + 400); // (max - min + 1) + min
        var p2ReactionTime = Math.floor(Math.random() * (1000 - 400 + 1) + 400);
        var reloadTime = 2000;
        var p1Defeated = false;
        var p2Defeated = false;
        var p1Timer = setInterval;
        var p2Timer = setInterval;
        // let audioInstance = 0;
        // let audioArr = [];
        

// >>>>>>>>>>>>>>>>>>>>>> Shared functions <<<<<<<<<<<<<<<<<<<<<<<<<

        // This makes both players shoot
        const startBattle = () => {
            setP1CrewDeaths(0);
            setIsBattle(false);
            p1Defeated = false;
            p2Defeated = false;
            p1Shoots();
            p2Shoots();
        }

        // This callback stops both shooting related functions and outputs the winner
        const WinCondition = () => {
            clearInterval(p1Timer);
            clearInterval(p2Timer);
            
            setIsBattle(true);
            if (p1Defeated === true) {
                setPlay('Player 2 Won');
                //setP1CrewUpdate(p1_crew);

                sailorDeathUpdate();

                console.log("Crew update: " + JSON.stringify(p1CrewUpdate))
                console.log('Player 2 wins');
            } else if (p2Defeated === true) {
                //setP1CrewUpdate(p1_crew);
                setPlay('Player 1 Won');

                sailorDeathUpdate();

                console.log("Crew update: " + JSON.stringify(p1CrewUpdate))
                console.log('Player 1 wins');
            }

            // Update database here???
            
        }

        // const p1Audio = () => {
        //     let cannon1 = new Audio(cannon1Audio);
            
        //     audioArr.push([...audioArr], cannon1)
            
        //     audioArr[audioInstance].volume = 0.2;
        //     audioArr[audioInstance].play();
        //     audioInstance++;
        // }

        useEffect(() => {
            setP1CrewUpdate(p1_crew--);
            console.log("this is useEffect for p1CrewUpdate " + p1CrewUpdate)
            console.log('Player Funds: ' + playerFunds)
        }, [p1_crew, playerFunds])

// >>>>>>>>>>>>>>>>>>>>>> PLAYER 1 <<<<<<<<<<<<<<<<<<<<<<<<<      

        // This controls the discharge of each shot
        // This is activated once then shooting is the one repeated
        const p1Shoots = () => {
            p1ShotCount = 0;
            console.log('p1shoot');
            p1ReactionTime = Math.floor(Math.random() * (1000 - 400 + 1) + 400);
            if (p2Defeated === false && p1Defeated === false) {
                p1Timer = setInterval(shooting, p1ReactionTime);
            } else {
                console.log('p1 return 0')
                return;
            }
        }

        // Here is where the shots get discharged and an if statement checks for break
        const shooting = () => {
            if (p2Defeated === false && p1Defeated === false) {
                p1ReactionTime = Math.floor(Math.random() * (1000 - 400 + 1) + 400);
                console.log(`[${p1ReactionTime}] p1 boom`);
                //p1Audio();

                const shot = Math.floor(Math.random() * 99 + 1);
                p1ShotLog.push(`${shot} `);

                p1ShotCount++;

                // Kills are determined here by the shot roll above
                if (shot > 40) {
                    p2_crew--;
                    console.log(`HIT: [${shot}]p2 crew: ${p2_crew}`)

                    // game over condition if enemy crew is equal to 0
                    if (p2_crew <= 0) {
                        p2Defeated = true;
                        WinCondition();
                    } 
                }

            setP1Broadside([...p1ShotLog], p1ShotLog);

                // The break here is set for when reload is required 
                //which depends on the number of guns on the ship
                if (p1ShotCount >= p1_guns && p2Defeated === false && p1Defeated === false){
                    clearInterval(p1Timer);
                    setTimeout(p1Reload, reloadTime);
                    console.log('P1 Reloading...')
                } else if (p2Defeated === true || p1Defeated === true){
                    console.log('p1 return 1')
                    return;
                }
            } else {
                console.log('p1 return 2')
                return;
            }
        }

        const p1Reload = () => {
            setTimeout(p1Shoots, p1ReactionTime);
        }

// >>>>>>>>>>>>>>>>>>>>>> PLAYER 2 <<<<<<<<<<<<<<<<<<<<<<<<<
// Repetition of the above functions with different values    

        // This controls the discharge of each shot
        // This is activated once then shooting is the one repeated
        const p2Shoots = () => {
            p2ShotCount = 0;
            console.log('p2shoot');
            p2ReactionTime = Math.floor(Math.random() * (1000 - 400 + 1) + 400);
            
            if (p2Defeated === false && p1Defeated === false) {
                p2Timer = setInterval(p2Shooting, p2ReactionTime);
            } else {
                console.log('p2 return 0')
                return;
            }
        }

        // Here is where the shots get discharged and an if statement checks for break
        const p2Shooting = () => {
            if (p2Defeated === false && p1Defeated === false) {
                p2ReactionTime = Math.floor(Math.random() * (1000 - 400 + 1) + 400);
                console.log(`[${p2ReactionTime}] p2 boom`);
                
                const shot = Math.floor(Math.random() * 99 + 1);
                p2ShotLog.push(`${shot} `);

                p2ShotCount++;

                // Kills are determined here by the shot roll above
                if (shot > 40) {
                    p1_crew--;
                    //setP1CrewUpdate(p1_crew);
                    p1CrewQuantityUpdate = p1_crew;
                    setP1CrewDeaths(p1CrewDeaths++);
                    setP1Crew(p1_crew); //<<<<NEED POST REQUEST FOR THIS<<<<
                    console.log(`HIT: [${shot}]p1 crew: ${p1_crew}`)

                    // game over condition if enemy crew is equal to 0
                    if (p1_crew <= 0) {
                        p1Defeated = true;
                        WinCondition();
                    }
                }

            setP2Broadside([...p2ShotLog], p2ShotLog);
                // The break here is set for when reload is required 
                //which depends on the number of guns on the ship
                if (p2ShotCount >= p2_guns_count && p2Defeated === false && p1Defeated === false){
                    
                    clearInterval(p2Timer);
                    setTimeout(p2Reload, reloadTime);
                    console.log('P2 Reloading...')
                } else if (p2Defeated === true || p1Defeated === true){
                    console.log('p2 return 1')
                    return;
                }
            } else {
                console.log('p2 return 2')
                return;
            }
        }

        const p2Reload = () => {
            setTimeout(p2Shoots, p2ReactionTime);
        }

        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


        // const sailorsPayload = {
        //     crew: p1CrewDeaths,
        //     qty: p1CrewUpdate
        // }
        // This updates how many sailors are left in
        //player 1's ship after the battle has 
        //concluded (Once built)
        const sailorDeathUpdate = () => {
            console.log(play);
            axios.post('/api/sailorsDeath/' + player1Id, {crew: p1CrewDeaths, qty: p1CrewQuantityUpdate})
                .then(response => {
                    // console.log('I fire once');
                    console.log(response.data);
                })
                .catch(err => console.log("Sailor death frontEnd: " + err));
            }
    
    
    return (
        
    <div>
        <PlayWindow 
        p1Ship= {p1Ship}
        p1Crew= {p1_crew}
        p1Guns= {p1_guns}
        
        p1ShipMaxCrew = {p1ShipMaxCrewStat}
        
        p1Shot={p1Broadside} 
        p2Shot={p2Broadside} 
        finalResult={play}

        playerFunds={playerFunds}
        
        player1Id={player1Id}/>
        {/* <button onClick={sail}>Battle</button> */}
        {isBattle === true && canSail && <button onClick={startBattle}>Battle</button>}
        {/* <button onClick={SailorDeathEp}>Test sailor death endpoint</button> */}
        
    </div>
    );
}

export default BattleMechanic;