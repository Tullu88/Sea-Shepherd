import axios from 'axios';
import { useState, useEffect, useRef } from 'react'; 
import './map.css';

function Map() {
    const [ goToLocation, setGoToLocation ] = useState(null);
    var time = 0;
    var player1Id = "61a6230fb0b1488a2cbb2fee";
    var currentLocation = useRef();
    var [ shipCurrentLocation, setShipCurrentLocation ] = useState();
    var boardingBell = useRef();
    var [ canSail, setcanSail ] = useState(true);
    var [ clockCount, setClockCount ] = useState();
    var boardingTimeout = useRef();
    var sailingClock = 0;
    var [ sailingCounter, setSailingCounter ] = useState();
    var [ isSailing, setIsSailing ] = useState();
    var destination = useRef();
    var sailingTimeout = 0;

    //>> This is the timer that shows how long boarding is taking (not which handles the boarding which is the respective setTimeout below.)
    useEffect(() => {

        if (canSail === false){
        setClockCount(5);
            time = setInterval(() => { 
                setClockCount(clockCount => clockCount - 1);
        }, 1000);
        } else {
        clearInterval(time);
        setClockCount(0);
        }
        return () => clearInterval(time);
    }, [canSail]);

    // Retrieve the player's current location on page load through the useEffect below it
    const retrieveLocation = () => {
        axios.get('/api/location/:p1Id' + player1Id)
            .then(response => {
                currentLocation.current = response.data.player.ship.location;
                setShipCurrentLocation(currentLocation.current);
                console.log('Current Location is ' + currentLocation.current)
            })
            .catch(err => console.log('Error retreiving player location: ' + err));
    }

    // This is to establish player's current location, when the page is first loaded.
    useEffect(() => {
        retrieveLocation();
    }, []);


    //>> Provide players with the functionality to cancel boarding to change 
    //the destination they wish to sail to.
    const cancelBoard = () => {
        setcanSail(true);
        boardingBell.current = "done";
        clearInterval(time);
        clearTimeout(boardingTimeout.current);
        console.log('cancel Board')
    }

    //>> Once a destination has been chosen from the list provided, handle the click
    //set the gates and initiate the boardin timer with the set timeout within the
    //fundtion, and a useEffect above with a setInterval is triggered to display the 
    //time it will take until boarding has been complete (at which point boarding could no longer be cancelled)
    // Once the setTimeout has concluded, sailing begins (with setTimeout) by invoking SailingToLocation() func.  
    const handleClick = (e) => {
        if (e.target.outerText !== currentLocation.current){
            setcanSail(false);
            boardingBell.current = currentLocation.current;
            
            boardingTimeout.current = setTimeout(() => {
                boardingBell.current = "done";
                destination.current = e.target.outerText;
                setIsSailing(true);
                SailingToLocation();
            }, 5000)
        } else {
            console.log(`You are already in ${currentLocation.current}`);
        }
    }

// This is to change the player's location updated after the setTimeout below it, has ended.

useEffect(() => {
    if (goToLocation != null) {
        axios.post('/api/sailTo/:playerId' + player1Id, goToLocation)
        .then(response => {
            // Setting current location could be placed here
            console.log(response);
        })
        .catch(err => console.log('Sail to error: ' + err));
    }
    // This triggers a get method to retrieve new location
    //can be optimized/ removed
    retrieveLocation();
}, [goToLocation]);

    const SailingToLocation = () => {

        //>> Location needs to be further updated to the location the ship is in the sea, in order to
        //segment further which ships are near one another enough to attack one another.

        //>> Once boarding has completed and the ship is sailing to destination, 
        //handle the time it takes until the ship reaches the destination.
        //player's ship reaches the destination once this setTimeout expires.
        

        sailingTimeout = setTimeout(() => {
            setGoToLocation({location: destination.current});
            currentLocation.current = destination.current;
            setcanSail(true);
            setIsSailing(false);
        }, 5000);

        
    }

    const [ newNum, setNewNum ] = useState()

    useEffect(() => {
        console.log(sailingCounter)
    }, [sailingCounter])

    //>> A visible timer showing the countdown for reaching the destination (after the expiry of the setTiemout above) to the user.
        useEffect(() => {

        if (isSailing) {
            //sailing counter variable (indicating the travel time and or the time until arrival)
            //is influenced by the skills in seamanship of the crew 
            setSailingCounter(5);
            sailingClock = setInterval(() => {
                //var newNumber = sailingCounter;
                setSailingCounter(sailingCounter => sailingCounter - 1);
                

                    console.log('SailingCounter is equal to 0')
                
                // Here, add a chance for the ship to encounter 
                //a hostile ship, and engage in battle.
                // The setInterval is broken out of with the
                //seconds remaining in the sailingCounter 
                //persisting as it were before the battle.
                // Once the battle has concluded, the setInterval
                //is reactivated and the sailing to the location
                //is resumed.
                const chance = Math.floor((Math.random() * 99) + 1);
                if (chance > 50) {
                    clearInterval(sailingClock);
                    //clearTimeout(sailingTimeout);
                    //sailingTimeout = 0;
                }

            }, 1000);
        } else {
            clearInterval(sailingClock);
            
            setSailingCounter(0);
        }
        return () => clearInterval(sailingClock);
    }, [isSailing])


    return (
        <div className="locations">
            <div className="locations-1">
                <div>Sail to a destination:</div>
                <div>--------------------</div>
                {/* Is the ship docked (instead of sailing) and is able to sail somewhere? Allow the buttons below to be clicked. If one is clicked, then the ship 'cannot' sail */}
                <div className="location-tab" ><div className="location" onClick={(e) => {if (canSail){handleClick(e)}}}>Port Royal</div>{ shipCurrentLocation === 'Port Royal' && <div className='anchored'></div>}</div>
                <div className="location-tab"><div className="location" onClick={(e) => {if (canSail){handleClick(e)}}}>Tortuga</div> { shipCurrentLocation === 'Tortuga' &&  <div className='anchored'></div>}</div>
                <div className="location-tab"><div className="location" onClick={(e) => {if (canSail){handleClick(e)}}}>Caracas</div>{ shipCurrentLocation === 'Caracas' && <div className='anchored'></div>}</div>
                <div>--------------------</div>
                <div>{newNum}</div>
            </div>

        {/*Is the ship boarding to go to "town name"? Show: "boarding..." and a "cancel" button that allows you to cancel within a time window otherwise show empty string.*/}
        {/* > The code below can be refactored < */}

        <div className="status"> 
            <div className="status-1">{boardingBell.current === "Port Royal" ? <div className="b1">boarding... 
            <button onClick={cancelBoard}>{clockCount ? `(${clockCount})` : ' '} Cancel</button>
            </div> : ' '}</div>
            {/* > In the below code, it doesn't matter the destination only that it is sailing, and while it is, we output the time required until the destination is reached < */}
            {/* > Would be cool to have an estimated time of arrival instead of time that is accurate to the second. This can be handled with the setInterval above. < */}
            {isSailing && destination.current === "Port Royal" && <div className="b1">Sailing... {sailingCounter}</div>} 

            <div className="status-2">{boardingBell.current === "Tortuga" ? <div className="b2">boarding... 
            <button onClick={cancelBoard}>{clockCount ? `(${clockCount})` : ' '} Cancel</button>
            </div> : ' '}</div>
            {isSailing && destination.current === "Tortuga" && <div className="b1">Sailing... {sailingCounter}</div>}

            <div className="status-3">{boardingBell.current === "Caracas" ? <div className="b3">boarding... 
            <button onClick={cancelBoard}>{clockCount ? `(${clockCount})` : ' '} Cancel</button>
            </div> : ' '}</div>
            {isSailing && destination.current === "Caracas" && <div className="b1">Sailing... {sailingCounter}</div>}
        </div>
            
        </div>
    )   
}

export default Map;