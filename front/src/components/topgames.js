import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';


const TwitchGames = () => {
    const [initialState, setInitialState] = useState([]);

    useEffect(() => {
            axios.get('/getinfo').then(response => {
            console.log(response.data.data);
            setInitialState(response.data.data);
            //console.log(initialState)
            });
    }, []);

    
    return(
    <div>
        {/* {Object.keys(initialState).map((k, i) => <li>{initialState[k]}</li>)} */}
        {initialState.map(e => { 
            return <div key={e.id}>
                    <p>{e.name}</p>
                    <img src={e.box_art_url.replace('{width}x{height}', "150x200")}/>
                    {/* <p>{e.box_art_url.replace('{width}x{height}', "500x500")}</p> */}
                </div>})}
    </div>)
}

export default TwitchGames;