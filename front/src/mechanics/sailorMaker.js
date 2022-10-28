import Sailor from './sailorClass';
import { useState } from 'react';

const SailorMaker = (playerId) => {
    let [sailor, setSailor] = useState(new Sailor());

   

   const newSailor = () => {
    setSailor(new Sailor());
    return sailor;
   }


return (
    <div>
    <div>Gunnery: {sailor.skills.gunnery}</div>
    <div>Seamanship: {sailor.skills.seamanship}</div>
    <div>Swordmanship: {sailor.skills.swordmanship}</div>
    <div>Navigation: {sailor.skills.navigation}</div>
    <div>Marksmanship: {sailor.skills.marksmanship}</div>
    <button onClick={newSailor}>New</button>
    </div>
)

}

export default SailorMaker;