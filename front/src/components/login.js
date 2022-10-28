import axios from 'axios'
import '../App.css'

function App() {

  const p1Id = "61a6230fb0b1488a2cbb2fee";

  const createPlayer1 = () => {
    axios.post('/createPlayers/player1')
    .then(res => {
      console.log('Create Player response: '  + res.data)
    })
    .catch(err => console.log('Create Player Error: ' + err))
  } 

  const createPlayer2 = () => {
    axios.post('/createPlayers/player2')
    .then(res => {
      console.log('Create Player response: '  + res.data)
    })
    .catch(err => console.log('Create Player Error: ' + err))
  } 

    return (
      <div className="login">
          <div>This is the Login page</div>
          <div>Create player here</div>
          <button onClick={createPlayer1}>Create player 1</button>
          <button onClick={createPlayer2}>Create player 2</button>
      </div>
    );
  }
  
  export default App;