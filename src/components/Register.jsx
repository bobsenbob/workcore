import React from 'react';
import './Register.css';
import { Button, FormLabel, TextField } from '@mui/material';
import { app } from '../firebase-config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import {Navigate} from 'react-router-dom'

class Register extends React.Component {
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
    handleRegister(){
        const email = this.state.email;
        const password = this.state.password;
        this.props.handleRegister(email, password);
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
                <div className='registerPage'>
                    <FormLabel className='pad' sx={{display:'block'}}>Email: </FormLabel>
                    <TextField sx={{display:'block'}} onChange={(e) => this.onEmailChange(e)} value={this.state.username}/>
                    <FormLabel className='pad' sx={{display:'block'}}>Password: </FormLabel>
                    <TextField sx={{display:'block'}} onChange={(e) => this.onPasswordChange(e)} value={this.state.password}/>
                    <Button sx={{marginTop:'5%'}} variant='outlined' onClick={(e) => this.handleRegister()}>Register</Button>
                </div>
            );
        }
    }
}

export default Register;