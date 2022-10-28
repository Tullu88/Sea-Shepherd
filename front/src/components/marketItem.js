import axios from 'axios';
import { useState, useRef, useEffect, useContext } from 'react';
import './marketItem.css';
import { ParentFundsContext } from './town';

const MarketItem = (props) => {

    const { funds, transaction } = useContext(ParentFundsContext);

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

    var [ gate, setGate ] = useState(true);

    var [ itemName, setItemName ] = useState(props.itemName);
    var [ itemQty, setItemQty ] = useState(props.itemQty);
    var [ itemBuyPrice, setItemBuyPrice ] = useState(props.itemBuyPrice);

    const p1Id = "61a6230fb0b1488a2cbb2fee";

    const marketItemQtyForPurchase = (event) => {
        if (event.target.value < value){
            setValue(value--);
        } else {
            setValue(value++);
        }
    }

    // Check which way the slider is going and calculate
    //the projected changes to the player funds then save to state
    useEffect(() => {
        //console.log("Value is " + value);

        if (oldValue < value) {
            
            newFund.current = playerFunds - props.itemSellPrice;
            setPlayerFunds(newFund.current);

            setTotalPrice(totalPrice - props.itemSellPrice)
            console.log('Total:' + totalPrice)

            setOldValue(value)
        } else if (oldValue > value) {

            newFund.current = playerFunds + props.itemSellPrice;
            setPlayerFunds(newFund.current);

            setTotalPrice(totalPrice + props.itemSellPrice)
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
            axios.post('/player/purchaseItems/' + p1Id, payload)
            .then(res => {
                console.log("purchase successful " + res)
                
                setItemQty(itemQty - res.data.qty);

                setSuccessfulTransaction(!successfulTransaction);
            })
            .catch(err => console.log("Error purchasing items: " + err))
        } else {
            return;    
        }
        setValue(0);
        setTotalPrice(0);
        setOldValue(0);        
    }

    useEffect(() => {

    }, [gate])

    return(
        <div>
            {itemQty !== 0 && <div>
                {/* I'm guessing that after importing the items 
                that exist within the town, we save them to an array,
                and then we forEach or map it, and every element 
                output with its own divs and or structure */}
                <div>{
                    <form>
                    <label htmlFor={marketItems} className='item'> <div className='name'>{props.itemName}</div> <div className='qty' key={props.itemName}> ({value}){itemQty}</div> <div className='price'>{props.itemSellPrice}<div className='coin'></div></div>
                        <input className="slider" name={props.itemName} id={props.itemName} type="range" value={value} min="0" max={itemQty} onChange={marketItemQtyForPurchase}/>
                        <input className="submit" name={props.itemName} id={props.itemName} type="submit" value="Buy" onClick={handleItemPurchase}/>
                    </label>
                    </form>
                }</div>
            </div>}
        </div>
    )
}

export default MarketItem;