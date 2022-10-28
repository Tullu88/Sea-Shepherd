import { Link } from 'react-router-dom';

function App() {
    return (
      <div className="Nav">
          <Link to='/' className="linkComp">
        <div className="link">Home</div>
        </Link>
        <Link to='/play' className="linkComp">
        <div className="link">Play</div>
        </Link>
        <Link to='/topgames' className="linkComp">
        <div className="link">Top Games</div>
        </Link>
        <Link to='/auth/login' className="linkComp">
        <div className="link">Login</div>
        </Link>
        <Link to='/auth/logout' className="linkComp">
        <div className="link">Logout</div>
        </Link>
      </div>
    );
  }
  
  export default App;