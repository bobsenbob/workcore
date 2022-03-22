
import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './components/Home.jsx';
import Notes from './components/Notes.jsx';
import Todo from './components/Todo.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import './App.css';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import { Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';


function LogoutButton(props){
  const [redirectHome, setRedirectHome] = useState(false);
  const handleLogout = (()=>{
    const auth = getAuth();
    signOut(auth)
      .then(()=>{
        setRedirectHome(true); 
        sessionStorage.removeItem('Auth Token');
        props.setAuthToken(null);     
      })
      .catch((error) => {
        //error
      });
    
  });
  if(redirectHome){
    console.log("success?");
    return(
      <Navigate to='/'/>
    );
  } else {
    return(
      <>
      <Button variant='contained' onClick = {(e)=>{handleLogout()}}>Log Out</Button>
      </>
    );
  }
}


function NavBar(props){
  let block;
  if(sessionStorage.getItem('Auth Token')){
    block = (
    <>
      <Link className='navBarLink' to='/notes'>Notes</Link>
      <Link className='navBarLink' to='/todo'>Todo</Link>
      <LogoutButton setAuthToken={(e) => props.setAuthToken(e)}/>
    </>);
  } else {
    block = (
      <>
        <Link className='navBarLink' to='/register'>
          <Button variant='contained'>
            Register
          </Button>
        </Link>
        <Link className='navBarLink' to='/login'>
          <Button variant='contained'>
            Login
          </Button>
        </Link>
      </>);
  }
  return (
    <div className='navBar'>
      <Link className='navBarLink' to='/'>
        Home
      </Link>
      {block}
    </div>
  );
}

function WebsiteTitle(props) {
  return <h1 className='websiteTitle'>WORKCORE</h1>;
}

function App() {
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('Auth Token')); //null if none
  const [refresh, setRefresh] = useState(false);
  const handleLogin = ((email, password) => {
    const authentication = getAuth();
    signInWithEmailAndPassword(authentication, email, password)
            .then((response)=>{
                console.log(response);
                console.log(authentication.currentUser.uid);
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                setAuthToken(sessionStorage.getItem('Auth Token'));
            });
  });
  const handleRegister = ((email, password) => {
    const authentication = getAuth();
    createUserWithEmailAndPassword(authentication, email, password)
      .then((response)=>{
          console.log(response);
          console.log(authentication.currentUser.uid);
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
          setAuthToken(sessionStorage.getItem('Auth Token'));
      });
  });
  const handleLogout = (() => {

  })
  return (
    <div className="App">
      <header className="App-header">
        <WebsiteTitle/>
        <NavBar setAuthToken={(e) => {setAuthToken(e)}}/>
      </header>

        <Routes>
          <Route path='/' element={< Home />}></Route>
          <Route path='/notes' element={< Notes />}></Route>
          <Route path='/todo' element={< Todo />}></Route>
          <Route path='/login' element={< Login handleLogin = {handleLogin}/>}></Route>
          <Route path='/register' element={< Register handleRegister = {handleRegister}/>}></Route>
        </Routes>
    </div>
  );
}

export default App;
