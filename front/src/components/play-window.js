import { useState, useEffect } from 'react';
import Broadside from "./broadside";
import Town from './town';
import Ship from './ship';
import axios from 'axios';
import Map from './map';
import AdminControls from './adminControls'

function PlayWindow(props) {
    const [isOpen, setIsOpen] = useState("Sail");

    const handleClick = (e) => {
        console.log(e.target.outerText)
        if (e.target.outerText === "Sail"){
            setIsOpen("Sail");
        } else if (e.target.outerText === "Town") {
            setIsOpen("Town");
        } else if (e.target.outerText === "Ship") {
            setIsOpen("Ship");
        } else if (e.target.outerText === "Map") {
            setIsOpen("Map");
        } else if (e.target.outerText === "Admin") {
            setIsOpen("Admin");
        }
    }

    useEffect(() => {

    }, [handleClick])

    return(
        <div className="gameNav">
            <div className="gameNavContent">
                <button onClick={(e) => handleClick(e)}>Ship</button>
                <button onClick={(e) => handleClick(e)}>Sail</button>
                <button onClick={(e) => handleClick(e)}>Town</button>
                <button onClick={(e) => handleClick(e)}>Map</button>
                <button onClick={(e) => handleClick(e)}>Admin</button>
            </div>
            <div className="main-window">
                {isOpen === "Sail" 
                    && <Broadside 
                            p1Ship={props.p1Ship}
                            p1Crew={props.p1Crew}
                            p1Guns={props.p1Guns}

                            p1Shot={props.p1Shot}
                            p2Shot={props.p2Shot}

                            result={props.finalResult}
                            />}
                {isOpen === "Town" && <Town p1ShipMaxCrew={props.p1ShipMaxCrew} p1AvailableCrew={props.p1Crew} playerFunds={props.playerFunds}/>}
                {isOpen === "Ship" && <Ship />}
                {isOpen === "Map" && <Map />}
                {isOpen === "Admin" && <AdminControls />}
            </div>
        </div>
    )
}

export default PlayWindow;