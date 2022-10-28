import '../App.css';
import SailorMaker from "../mechanics/sailorMaker";
// import { useEffect, useState } from 'react';
import axios from 'axios';
// import Timer from '../mechanics/timer';
//import countdown from 'countdown';
import { useEffect, useState, useRef } from 'react/cjs/react.development';

function AdminControls(props) {

    var addItemToMarket = useRef("Rum");
    var addItemQuantity = useRef();
    var townSelected = useRef("Tortuga");

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

const addItemToTown = (event) => {
    event.preventDefault();

    const payload = {
        town: townSelected.current,
        item: addItemToMarket.current,
        qty: addItemQuantity.current
    }
    //axios route here

    axios.post('/items/addItemsToTown', payload)
    .then(response => {
        console.log('Success add items to market ' + response)
    })
    .catch(err => console.log('Error adding item (F) ' + err))

    console.log("adding " + addItemQuantity.current + ' ' + addItemToMarket.current)
}

const handleMarketItemChange = (event) => {
    addItemToMarket.current = event.target.value;
    console.log(addItemToMarket.current)
}

const handleMarketItemQuantity = (event) => {
    addItemQuantity.current = event.target.value;
    console.log(addItemQuantity.current)
}

const handleSelectedTown = (event) => {
    townSelected.current = event.target.value
    console.log(townSelected.current)
}

    return(
        <div className="psShotsScreens">
            <div>This is the Admin Controls Screen </div>
            <div>Enter new information for a new item in items route, then:</div>
            <button onClick={itemCreate}>Create Item</button>
            
            <form>
                <label>Choose an item to add to town:</label>
                <select onChange={handleSelectedTown}>
                    <option value="Tortuga">Tortuga</option>
                    <option value="Caracas">Caracas</option>
                    <option value="Port Royal">Port Royal</option>
                </select>
                <select onChange={handleMarketItemChange}>
                    <option value="Rum">Rum</option>
                    <option value="Potato">Potato</option>
                    <option value="Salt">Salt</option>
                    <option value="Mahogany Wood">Mahogany Wood</option>
                    <option value="Banana">Banana</option>
                    <option value="Banana">Grain</option>
                </select>
                <input type="number" onChange={handleMarketItemQuantity}></input>
                <input type="Submit" onClick={addItemToTown}></input>
            </form>
            {/* <div>{timeState}</div> */}
            {/* < SailorMaker /> */}
            </div>
    )
}

export default AdminControls;