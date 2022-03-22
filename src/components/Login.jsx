import React from 'react';
import './Login.css';
import { Button, FormLabel, TextField } from '@mui/material';
import { app }from '../firebase-config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import {Navigate} from 'react-router-dom';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state={
            email: '',
            password: '',
            redirectHome: false,
        }
    }
    onEmailChange(e) {
        this.setState({
            email : e.target.value
        });
    }
    onPasswordChange(e) {
        this.setState({
            password : e.target.value
        });
    }
    handleLogin(e){
         const email = this.state.email;
         const password = this.state.password;
         this.props.handleLogin(email, password);
         this.setState({
             redirectHome: true
         });
         

    }
    render() {
        if(this.state.redirectHome){
            return(
                <Navigate to='/'/>
            );
        } else {
        return(
            <div className='loginPage'>
                <FormLabel className='pad' sx={{display:'block'}}>Email: </FormLabel>
                <TextField sx={{display:'block'}} onChange={(e) => this.onEmailChange(e)} value={this.state.username}/>
                <FormLabel className='pad' sx={{display:'block'}}>Password: </FormLabel>
                <TextField sx={{display:'block'}} onChange={(e) => this.onPasswordChange(e)} value={this.state.password}/>
                <Button sx={{marginTop:'5%'}} variant='outlined' onClick={(e) => this.handleLogin(e)}>Login</Button>
            </div>
        );
    }
    }
}

export default Login;