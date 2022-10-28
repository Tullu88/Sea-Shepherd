import { useState } from 'react';
import './sailors.css';

const Sailors = (props) => {

   return (
       <div className="sailorCard">
           <div>This is a sailor</div>
           <div>{props.prop1}</div>
           </div>
   ) 
}

export default Sailors;