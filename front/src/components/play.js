import { useState, useEffect } from 'react';
import player from '../database/player.json';
import BattleMechanic from "../mechanics/main";
import PlayWindow from './play-window';
import axios from 'axios';

function Play() {
    const firstPlayer = player.player1;
    const secondPlayer = player.player2;

  //   const p1Id = "61a6230fb0b1488a2cbb2fee";

  //   useEffect(() => {
  //     axios.get('/player/funds/' + p1Id)
  //     .then(res => {
  //       console.log("player funds: " + res)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }, [])
 

    return (
      <div className="Play">
        <div>This is the Play Page</div>
        <div><BattleMechanic player1={firstPlayer} player2={secondPlayer}/></div>
      </div>
    );
  }
  
  export default Play;