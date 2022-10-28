import '../App.css';
import SailorMaker from "../mechanics/sailorMaker";
// import { useEffect, useState } from 'react';
import axios from 'axios';
import SailorCard from './sailors'
// import Timer from '../mechanics/timer';
//import countdown from 'countdown';
import { useEffect, useState } from 'react/cjs/react.development';

function Ship(props) {

    const p1Id = "61a6230fb0b1488a2cbb2fee";
//     var time = 0;

//     var [ timeState, setTimeState ] = useState(null);

//     useEffect(() => {
//         setInterval(() => {
//             time = new Date().toLocaleTimeString();
//             setTimeState(time);
//         }, 1000);
   
// }, []);

const sailorsPayload = {
    crew: 3,
    qty: 3
}
// This updates how many sailors are left in
//player 1's ship after the battle has 
//concluded (Once built)

// Create a player
const funky = () => {
    axios.post('/api/sailorsDeath/' + p1Id, sailorsPayload)
        .then(response => {
            // console.log('I fire once');
            console.log(response.data);
        })
        .catch(err => console.log("Sailor death frontEnd: " + err));
}

// Create an item
const itemCreate = () => {
    axios.post('/items/createItem')
    .then(response => {
        console.log(response.data)
    })
    .catch(err => console.log("Sailor death frontEnd: " + err));
}

    return(
        <div className="psShotsScreens">
            <div>This is the ship screen </div>
            <SailorCard prop1={"prop1"}/>
            {/* <button onClick={itemCreate}>Sailor death</button> */}
            {/* <div>{timeState}</div> */}
            {/* < SailorMaker /> */}
            </div>
    )
}

export default Ship;