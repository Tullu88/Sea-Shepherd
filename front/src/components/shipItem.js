import {useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import './shipItem.css';
import { ParentFundsContext } from './town';

const ShipItem = (props) => {
    const { funds, transaction } = useContext(ParentFundsContext);
    //const { successfulTransaction, setSuccessfulTransaction } = useContext(ParentFundsContext);

    const [ playerFunds, setPlayerFunds ] = funds;
    const [ successfulTransaction, setSuccessfulTransaction ] = transaction;

    var [ marketItems, setMarketItems ] = useState(props.info);
    var purchaseQuantity= useRef();
    var [ value, setValue ] = useState(0);
    var [ oldValue, setOldValue ] = useState(0);
    var [ townLocation, setTownLocation ] = useState(props.town);
    var [ totalPrice, setTotalPrice ] = useState(0);
    var newFund = useRef();
    var [ hasPurchased, setHasPurchased ] = useState(false);

    var [ gate, setGate ] = useState(props.itemQty !== 0 ? true : false);

    // Item states
    var [ itemName, setItemName ] = useState(props.itemName);
    var [ itemQty, setItemQty ] = useState(props.itemQty);
    var [ itemBuyPrice, setItemBuyPrice ] = useState(props.itemBuyPrice);

    const p1Id = "61a6230fb0b1488a2cbb2fee";

    const marketItemQtyForPurchase = (event) => {
        
        if (event.target.value < value){
            setValue(value--)
        } else {
            setValue(value++)
        }
        //console.log(value);
    }

    useEffect(() => {
        
        if (oldValue < value) {
            
            newFund.current = playerFunds + props.itemSellPrice;
            setPlayerFunds(newFund.current);

            setTotalPrice(totalPrice + props.itemSellPrice)
            console.log('Total:' + totalPrice)

            setOldValue(value)
        } else if (oldValue > value) {

            newFund.current = playerFunds - props.itemSellPrice;
            setPlayerFunds(newFund.current);

            setTotalPrice(totalPrice - props.itemSellPrice)
            console.log('Total:' + totalPrice)
            
            setOldValue(value);
        }
    }, [value])

    const handleItemPurchase = (event) => {
        event.preventDefault();

        if (value !== 0) {
            console.log(event.target.id + ' and ' + value);
            // Axios here to make purchase
            const payload = {
                itemToBuy: event.target.id,
                qtyToBuy: value,
                town: townLocation,
                cost: totalPrice
            }
            axios.post('/player/sellItems/' + p1Id, payload)
            .then(res => {
                // update the state of the changes here
                console.log("purchase successful " + res.data.qty)
                setItemQty(itemQty - res.data.qty);
                setSuccessfulTransaction(!successfulTransaction);
                // if (itemQty === 0){
                //     setGate(false);
                // }
            })
            .catch(err => console.log("Error selling items: " + err))
        } else {
            return;    
        }
        setValue(0);
        setTotalPrice(0);
        setOldValue(0);       
    }

    useEffect(() => {

    }, [itemQty])


    return(
        <div>
        
        {itemQty !== 0 && <div>
            {/* I'm guessing that after importing the items 
            that exist within the town, we save them to an array,
             and then we forEach or map it, and every element 
             output with its own divs and or structure */}
            <div>{
                <form>
                  <label htmlFor={marketItems} className='item'> <div className='name'>{itemName}</div> <div className='qty' key={itemName}> ({value}){itemQty}</div> <div className='price'>{itemBuyPrice}<div className='coin'></div></div>
                      <input className="slider" name={itemName} id={itemName} type="range" value={value} min="0" max={itemQty} onChange={marketItemQtyForPurchase}/>
                      <input className="submit" name={itemName} id={itemName} type="submit" value="Sell" onClick={handleItemPurchase}/>
                  </label>
                  </form>
             }</div>

          {/* <label>Sell:</label> */}

        </div>}
      
      </div>
    )
}


export default ShipItem;