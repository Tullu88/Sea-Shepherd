import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login'
import Home from './components/home'
import Topgames from './components/topgames';
import Nav from './components/nav'
import Logout from './components/logout';
import Play from './components/play'

function App() {
  return (
    <div className="main">
    <Router> 
        <Nav/>
        <Routes>
            <Route path="/" exact element={<Home/>} />
            <Route path="/play" element={<Play/>} />
            <Route path="/auth/login" element={<Login/>} />
            <Route path="/auth/logout" element={<Logout/>} /> 
            <Route path="/topgames" element={<Topgames/>} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
