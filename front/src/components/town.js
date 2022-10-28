import React from 'react';
import axios from 'axios';
import { useState, useRef, useEffect, usecontext } from 'react';
import MarketItem from './marketItem';
import ShipItem from './shipItem';
import { useInRouterContext } from 'react-router';

export const ParentFundsContext = React.createContext(); 

const Town = (props) =>  {

  // Names and code are a fucking mess, to fix.
  var [ viewSailorsToBeHired, setViewSailorsToBeHired ] = useState(props.p1AvailableCrew ? props.p1AvailableCrew : 0);
  var sailorViewCount = useRef({});
  var [ sailorsToBeHired, setSailorsToBeHired ] = useState(0);
  var [ p1AvailableCrew, setP1AvailableCrew ] = useState(props.p1AvailableCrew ? props.p1AvailableCrew : 0);

  var [ playerFunds, setPlayerFunds ] = useState(props.playerFunds);

  var [ shipMaxStorageWeight, setShipMaxStorageWeight ] = useState();
  var [ playerShipStorageWeight, setPlayerShipStorageWeight ] = useState();
  var [ playerShipStorageContent, setPlayerShipStorageContent ] = useState();
  var [ shipName, setShipName ] = useState();

  var [ townName, setTownName ] = useState();

  var [ availableSailorsForHire, setavailableSailorsForHire ] = useState();
  var [ isTavernBuilt, setIsTavernBuilt ] = useState();
  var sailorPrice = useRef();
  var maxInputValue = useRef();

  var [ isMarketBuilt, setIsMarketBuilt ] = useState();
  var [ marketItems, setMarketItems ] = useState();
  var [ playerItems, setPlayerItems ] = useState([]);
  var [ playerItemsArray, setPlayerItemsArray ] = useState([]);

  var townNameRef = useRef();

  var [ isFoundryBuilt, setIsFoundryBuilt ] = useState();
  var [ isGunsmithyBuilt, setIsGunsmithyBuilt ] = useState();
  var [ isBlacksmithyBuilt, setIsBlacksmithyBuilt ] = useState();

  var [ oldValue, setOldValue ] = useState(0);

  var [ successfulTransaction, setSuccessfulTransaction ] = useState(true);

  //var count = 0;

  var [ exampleArray, setExampleArray ] = useState([]);

  //var array = useRef([]);

  var p1Id = "61a6230fb0b1488a2cbb2fee";

  const getPlayerTown = () => {
    axios.get('/town/player/' + p1Id)
    .then(response => {
      setTownName(response.data._name)
      setIsTavernBuilt(response.data.buildings.tavern.built);
      setavailableSailorsForHire(response.data.buildings.tavern.sailors.qty);
      setIsMarketBuilt(response.data.buildings.market.built);
      setMarketItems(response.data.buildings.market.products); //duplicate but necessary to make purchase changes view work
      

      townNameRef.current = response.data._name;

      sailorPrice.current = response.data.buildings.tavern.sailors.sellPrice;

        GetMarketItemsPriceList(response.data.buildings.market.products);  
      
      HandleMax(response.data.buildings.tavern.sailors.qty);
      
      console.log("Town response: " + JSON.stringify(response.data.buildings.tavern.sailors.qty));
  })
  .catch(err => console.log("Town Player response: " + err));
  }

  // const handleArray = () => {
  //  return array.current.map(e => <div>{e._name}</div>);
  // }

  useEffect(() => {
    // GET the town name of the town the player's docked in
    // GET all the town variables (What is found in it)
    getPlayerTown();
    updateState();
    // Save all the town variables into state
    // Render
  }, [])

  useEffect(() => {
    getPlayerTown();
    updateState();
  }, [successfulTransaction])

  


  const playerId = "61a6230fb0b1488a2cbb2fee";



    const updateState = () =>{
      axios.get('/api/player/' + p1Id)
      .then((res) => {
          setP1AvailableCrew(res.data.player.crew.qty);
          setViewSailorsToBeHired(res.data.player.crew.qty);
          setShipMaxStorageWeight(res.data.ship._shipLoad);
          setPlayerShipStorageWeight(res.data.player.ship.storage.weight);
          setPlayerShipStorageContent(res.data.player.ship.storage.content)
          setSailorsToBeHired(0);
          setPlayerItems(res.data.player.ship.storage.content) //duplicate but necessary to make purchase changes view work
          setShipName(res.data.player.ship.name)
          // Call the function that will retrieve the prices
          //of the items that both the player and the town have
        
          console.log('UpdateState func');
          // Get the price list of player storage content
          GetPlayerItemsPriceList(res.data.player.ship.storage.content);
          //console.log("playe stuff:  " + res.data.player.ship.storage.content)

          //console.log('Player storage ' + JSON.stringify(res.data.player.ship.storage.content))

          //console.log('This is the player GET method: ' + JSON.stringify(res.data.player))
        })
      .catch((err) => {
          console.log('Internal Server Error' + err);
        })

      // await axios.get('/items/getItemsPriceList', payload)
      // .then((res) => {
      //   console.log('Retreiving items successful ' + res)
      // })
      // .catch(err => {console.log("Error retrieving item list " + err)})
  }

  const  GetPlayerItemsPriceList = (passedPlayerItems) => {
    
    //  Post request t get data on all the items in player's ship.
  axios.post('/items/getItemsPriceList/' + townNameRef.current, passedPlayerItems)
    .then(res => {
      //set States for the item(s) and their prices
      console.log('setPlayer Items axios')
      setPlayerItems(res);

      //setPlayerItemsArray(playerItems.data?.baseItemDetails)

      // setExampleArray(res.data.baseItemDetails);
      // setExampleArray(a => [...a, res.data.playerItemDetails])

      // console.log('base item details ' + JSON.stringify(exampleArray) + ' player item details: ' + JSON.stringify(exampleArray))

      //console.log('Player items response: ' + JSON.stringify(res));
    })
    .catch(err => console.log('Player items prices retrieval error: ' + err))
  }

  const  GetMarketItemsPriceList = (passedMarketItems) => {
    //Get the items in the market, the items with the player
      axios.post('/items/getItemsPriceList/' + townNameRef.current, passedMarketItems)
      .then(res => {
        //set States for the item(s) and their prices
        setMarketItems(res);
  
        // console.log('base item details ' + JSON.stringify(exampleArray) + ' player item details: ' + JSON.stringify(exampleArray))
  
        //console.log('Market items response: ' + JSON.stringify(res));
      })
      .catch(err => console.log('Player items prices retrieval error: ' + err))
      //console.log('Market items prices: ' + JSON.stringify(passedMarketItems.map(e => e._name)))

}

// useEffect(() => {

// }, [marketItems])
  
  const HandleMax = (e) => {

    if (e + viewSailorsToBeHired < props.p1ShipMaxCrew) {
      maxInputValue.current = e + viewSailorsToBeHired;
      console.log('Available: ' + e + ' View Sailors: ' + viewSailorsToBeHired)
      console.log('maxval' + JSON.stringify(maxInputValue.current))
    } else {
      maxInputValue.current = props.p1ShipMaxCrew;
      console.log('maxval 2 : ' + JSON.stringify(maxInputValue.current))
    }
   }  

   //maybe I can addd a gate here that checks whether the player has money to afford 
     //hiring sailors or if there are sailors anyway
     //before activating the handle change below
     //>>>>>I STILL NEED TO HANDLE WHAT TO DO 
     //WHEN PLAYER DOES NOT HAVE ENOUGH MONEY TO HIRE
     //MORE SAILORS<<<<<<<

     //later
    //  const fundsCheck = () => {
    //    if ( funds !== 0 ) {
    //      handleChange();
    //    } else {
    //      return ;
    //    }
    //  }

   const handleMarketValueInput = (event) => {
     if (handleMarketValueInput < 9){
       return handleMarketValueInput = event.target.value;
     } else {
       return handleMarketValueInput = event.target.value - 1;
     }
   }

  //  const handleMarketPurchase = () => {

  //  }
   
  const handleChange = (event) => {
    // Read somewhere that you can do setTimeouts to reset the value changes made by the mouse 
    //clicks and slides, so that it couldn't be glitched. 

  var numberOfAvailableSailorsForHire = availableSailorsForHire;

    event.preventDefault();
    if (availableSailorsForHire <= 0){
      setViewSailorsToBeHired(event.target.value - 1);
      //console.log('View sailors to be hired 1: ' + viewSailorsToBeHired)
    } else {
      setViewSailorsToBeHired(event.target.value);
      //console.log('View sailors to be hired 2: ' + viewSailorsToBeHired)
    }
    
    sailorViewCount = event.target.value - p1AvailableCrew;
    
    // if (availableSailorsForHire <= 0) {
    //   return false;
    // }

    if (oldValue < event.target.value) {
      
      setPlayerFunds(playerFunds - sailorPrice.current); // The number here can be switched up with the sailor's price as specified somewhere in the backend
      setavailableSailorsForHire(numberOfAvailableSailorsForHire - 1)
      setOldValue(event.target.value)
      //console.log("up")
      //console.log(playerFunds)
    } else if (oldValue > event.target.value){
      setPlayerFunds(playerFunds + sailorPrice.current);
      setavailableSailorsForHire(numberOfAvailableSailorsForHire + 1)
      setOldValue(event.target.value)
      //console.log("down")
      //console.log(playerFunds)
    } else {
      return;
    }

    setSailorsToBeHired(sailorViewCount);
   
  } 
 

 const Hire = (e) => {
   e.preventDefault();

   var payload = {
     crew: sailorsToBeHired,
     sellPrice: sailorPrice.current,
     town: townName
   }

   axios.post('/hireSailors/' + playerId, payload)
   .then((res) => {
     console.log('Res Status: ' + JSON.stringify(res))
        if (res.status === 200) {
          updateState();
          console.log('Added sailor');
        }
   }) .catch((err) => {
     console.log('Internal Server Error ' + err);
   });
  // Maybe here another get to update all the values?
  //or can we do that with the post response?
   console.log("Submit value of useRef var " + sailorsToBeHired);
 }

//

    return (
      <div>
        {/* The div entitled tab below would hold all 
        the essential info about the player and the ship that
        needs to be seen at all time and are not part of the town:
        funds, ship weight, ... ? */}
          <div className="player-tab">

              <div className="townValue"><strong>{townName}</strong></div> 
              <div className="playerFunds" >{playerFunds} <div className='coin'></div> </div> 
              <div className="townValue">Storage Weight: {playerShipStorageWeight ? playerShipStorageWeight : '0'} / ({shipMaxStorageWeight})</div>
          
          </div>

        <div className="hireSailors">
          <div className="hire-sailors-left-side">
          {/* <button onClick={getPlayerTown}>Get Player Town</button> */}
          
          {isTavernBuilt && <details> <summary>Tavern:</summary>
              <form>
                  <div>
                      <label>
                        Hire Sailors (Available: {availableSailorsForHire})
                        {/* props.p1ShipMaxCrew ? props.p1ShipMaxCrew : 0 */}
                        <input id="rangeInput" type="range" value={viewSailorsToBeHired} min={p1AvailableCrew ? p1AvailableCrew : 0} max={JSON.stringify(maxInputValue.current)} onChange={handleChange} step={1} /> 
                      </label>
                      <div>{viewSailorsToBeHired} / {props.p1ShipMaxCrew} ({sailorsToBeHired})</div>
                    <input type="submit" onClick={Hire} value="Hire"/>
                  </div>
              </form> </details>} 
              </div>
            </div>

          {isFoundryBuilt && <form>
            <div>
              <label>
                Buy Gun
                <button value="Add Gun">+</button>
              </label>
            </div>
          </form>}

          {isBlacksmithyBuilt && <form>
            <div>
              <label>
                Buy Cutlass
                <button value="Add Gun">+</button>
              </label>
            </div>
          </form>}

          {isGunsmithyBuilt && <form>
            <div>
              <label>
                Buy Pistol
                <button value="Add Gun">+</button>
              </label>
            </div>
          </form>}

          {isGunsmithyBuilt && <form>
            <div>
              <label>
                Buy Musket
                <button value="Add Gun">+</button>
              </label>
            </div>
          </form>}

          {isMarketBuilt && <details className='details'> <summary>Market</summary>
              <div className='market-window'>
                
                  <div className='left-side'>
                  <div>Inventory:</div>
                      <label> 
                        <div>{marketItems?.data?.baseItemDetails
                        && marketItems?.data?.baseItemDetails.map(e => {
                          return (
                          <div key={e._name}>
                            <ParentFundsContext.Provider value={{funds: [playerFunds, setPlayerFunds], transaction: [successfulTransaction, setSuccessfulTransaction]}}>
                              <MarketItem key={e._name} itemName={e._name} itemQty={marketItems?.data?.playerItemDetails.find(a => a._name === e._name).qty} town={townName} itemSellPrice={e.priceList[0]?.sellPrice} itemBuyPrice={e.priceList[0]?.buyPrice} />
                            </ParentFundsContext.Provider>
                          </div>)})}</div>    
                      </label>
                  </div>
              

                  <div className="right-side">
                      <div>{shipName}'s Inventory</div>
                      <label>
                        <div>
                            {playerItems.data?.baseItemDetails && playerItems.data?.baseItemDetails.map(e => 
                            <ParentFundsContext.Provider value={{funds: [playerFunds, setPlayerFunds], transaction: [successfulTransaction, setSuccessfulTransaction]}}>
                            <ShipItem key={e._name} itemName={e._name} itemQty={playerItems.data?.playerItemDetails.find(a => a._name === e._name).qty} town={townName} itemSellPrice={e.priceList[0]?.sellPrice} itemBuyPrice={e.priceList[0]?.buyPrice}/>
                            </ParentFundsContext.Provider>)}
                        </div>
                        </label>
                  </div>
              </div>
                
                
              </details>}
              
    </div>)
  
}

 

export default Town;