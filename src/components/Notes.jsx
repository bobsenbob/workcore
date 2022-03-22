import React from 'react';
import './Notes.css';
import { Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { CircularProgress, TextField, Typography } from '@mui/material';
import {List, ListItem, ListItemButton} from '@mui/material';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import { green, red } from '@mui/material/colors';
import { database } from '../firebase-config';
import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useState } from 'react';
const noteStyle = createTheme({
    styleOverrides:{
        "&.Mui-selected": {
            backgroundColor: "#f16037"
        }
    }
    
});
const NoteList = ((props) => { 
    const [searchTerm, setSearchTerm] = useState("");
    function handleSearchChange(e){
        setSearchTerm(e.target.value);
    }
    if(!props.synced){ // display swirling sync symbol
        return (
            <div className='columnList' style={props.style}>
                <CircularProgress/>
            </div>
        );   
    } else {
        const noteList = props.history.map(
            (item, index)=>{
                if (searchTerm && searchTerm){ //if searchTerm is nonempty
                    if (!item.title.toLowerCase().includes(searchTerm.toLowerCase())) //if searchTerm is not in title
                        return;
                }
                return (
                <ListItemButton 
                sx={{
                    outline: '0.5px solid black',
                    textOverflow: 'ellipsis',
                    whiteSpace:'nowrap',
                    width: '100%',
                    display: 'block',
                    overflow: 'hidden',
                    "&.Mui-selected": {
                        backgroundColor: green[500],
                    }
                }}
                
                selected={props.currIndex===index}
                key={index}
                onClick={(e) => props.handleChangeIndex(index)}
                >
                    <Typography 
                    fontWeight='bold'
                    sx={{
                        textOverflow: 'ellipsis',
                        whiteSpace:'nowrap',
                        display: 'block',
                        overflow: 'hidden',
                    }}
                    >
                        {item.title}
                    </Typography>
                    <Typography 
                    fontSize='small'
                    sx={{
                        textOverflow: 'ellipsis',
                        whiteSpace:'nowrap',
                        display: 'block',
                        overflow: 'hidden',
                    }}
                    >
                        {item.note}
                        </Typography>        
                </ListItemButton>
        )}); // FIX THIS KEY SO ITS NOT INDEX


        return (
            <div className='columnList' style={props.style}>
                <TextField
                sx={{
                    width:'95%'
                }}
                placeholder='Search'
                value={searchTerm}
                onChange={handleSearchChange}
                />
                <List >
                    {noteList.reverse()}
                </List>
            </div>
    );
    }
});
const CurrentNote = ((props) => {
    return (
        <div style={props.style}>
            <TextField
            style={{
                width:'100%',
                margin: '0.3em',
            }}
            label='Title:'
            placeholder='Untitled'
            value={props.currTitle}
            onChange={props.handleChangeTitle}
            />

            <TextField
            style={{
                width:'100%', 
                height: '100%',
                margin: '0.3em',
            }}
            id="multiline-note"
            label='Note:'
            multiline
            placeholder='New Note!'
            minRows={3}
            value={props.currNote}
            onChange={props.handleChangeNote}
            />
        </div>
    );
});
const NewNoteButton = ((props) => {
    return (
        <div style={props.style}>
            <Button 
            sx={{
                width:'10em',
                margin: '0.3em',
            }}
            variant='outlined'
            onClick={props.onClick}
            >
                New Note
            </Button>
        </div>
    );
});

const DeleteNoteButton = ((props) => {
    return (
        <div style={props.style}>
            <Button 
            sx={{
                width:'10em',
                margin: '0.3em',
            }}
            variant='outlined'
            onClick={props.onClick}
            color='error'
            >
                Delete Note
            </Button>
        </div>
    );
});


class Notes extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history : [], //how do I make this loading by default
            currNote : '',
            currTitle: '',
            currIndex : -1,
            initialSynced: false,
        }
    }

    componentDidMount(){
        this.getFromDatabase();
    }


    getFromDatabase(){
        const dbRef = ref(getDatabase());
        const userId = getAuth().currentUser.uid;
        get(child(dbRef, `users/${userId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                const history=snapshot.val().history;
                //maybe validate here
                this.setState({
                    history: history,
                    initialSynced: true
                });
            } else {
                console.log("No data available");
                this.setState({initialSynced: true});
            }
            }).catch((error) => {
            console.error(error);
            });
    }
    setDatabase(){
        set(ref(database, 'users/' + getAuth().currentUser.uid), {
            history: this.state.history,
        });
    }
    saveCurrentNote(){
        if (this.state.currIndex === -1)
            return;
        const history=this.state.history.slice();
        const editedIndex=this.state.currIndex;
        const editedNote={
            note:this.state.currNote,
            title:this.state.currTitle,
        };
        if (editedNote.title && !editedNote.title.trim() || editedNote.title===''){
            editedNote.title = 'Untitled';
        } //only white space and not null
        history[editedIndex]=editedNote;
        this.setState({
            history:history,
        });
        set(ref(database, 'users/' + getAuth().currentUser.uid), {
            history: history,
        });
        return history;
    }
    handleNewNote(){
        const history=this.saveCurrentNote();
        history.push({
            note: '', 
            title: '',
        });
        this.setState({
            history:history,
            currIndex: history.length - 1,
            currNote: '',
        })
    }

    handleDeleteNote(){
        console.log('deleting');
        if (this.state.currIndex === -1){
            return;
        }
        const history=this.state.history.slice();
        history.splice(this.state.currIndex, 1);
        this.setState({
            history:history,
            currIndex: Math.min(this.state.currIndex, history.length - 1)
        })
    }

    handleChangeIndex(newIndex){
        this.saveCurrentNote();
        let defTitle;
        if (this.state.history[newIndex].hasOwnProperty('title')){
            defTitle=this.state.history[newIndex].title;
        } else {
            defTitle='';
        }
        this.setState({
            currIndex: newIndex,
            currNote: this.state.history[newIndex].note, 
            currTitle: defTitle,
        })
    }


    handleChangeNote(e){
        this.setState({
            currNote: e.target.value
        });
    }

    handleChangeTitle(e){
        this.setState({
            currTitle: e.target.value
        });
    }

    handleSubmit(value){
        console.log(value);
        let history=this.state.history.slice();
        history.push(value);
        this.setState({
            history: history
        });
    }
    render() {
        if (!getAuth().currentUser)
            return <Navigate to='/'/>
        return (
            <div>
                <div style={{float:'right', clear:'right'}}>
                    <NewNoteButton
                    style={{float:'right', clear:'right'}}
                    onClick={()=>this.handleNewNote()}
                    />
                    <DeleteNoteButton
                        style={{float:'right', clear:'right'}}
                        onClick={()=>this.handleDeleteNote()}
                    />
                    <CurrentNote
                    style={{float:'right', clear:'right', width:'68.5vw', marginRight:'0.55em', height:'100vh'}}
                    currNote={this.state.currNote}
                    currTitle={this.state.currTitle}
                    handleChangeNote={(e) => this.handleChangeNote(e)}
                    handleChangeTitle={(e) => this.handleChangeTitle(e)}
                    />
                </div>
                    <NoteList 
                    style={{float:'left', marginTop: '0.3em'}}
                    history={this.state.history}
                    currIndex={this.state.currIndex}
                    synced={this.state.initialSynced}
                    handleChangeIndex={(e)=>this.handleChangeIndex(e)}
                    />
                    

                    
                
            </div>
        )
    }
}

export default Notes;