import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Divider, Card } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
      width: '99%',
      display:"flex",
      flexDirection:"column",
    },
    card:{
        background:'skyblue',
        margin:'5px',
    },

    listItem:{
        // border:"2px solid black",
        margin:'5px',
    },
    Input:{
      width:"100%",
    },
    IconButton:{
      alignItems:"flex-end",
    },
    h1:{color:'red',},
  }));

export default function TodoList(props) {
    const classes = useStyles();
    const listState = props.defaultList;
    const todos = props.itemList.filter((it) => {
        if ( listState === 'Pending' ) {            
            return !it.done;
        } else if ( listState === 'Done') {
            return it.done;
        } else {
            return true;
        }
    })

    return (
        <List className={classes.root}>
          {todos.map((value,index) => {
              if(value.id===props.todoId){
                return (
                  <Card 
                    className={classes.card}
                    >
                    <ListItem 
                        style={{background:'black',color:'white'}}
                        >
                        <ListItemText>
                            Assigned By : {value.user_email}
                        </ListItemText>
                    
                        Assigned To : {value.assigned_to}
                    </ListItem>
                    <Divider/>
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Checkbox title="Checkbox"
                                  checked={value.done} 
                                  onClick={props.checkbox} 
                                  id={value.id} />
                      </ListItemIcon>
                      <Input  title="press enter to save"
                              value={props.todo} 
                              onChange={props.editChangeHandler}
                              error 
                              onKeyPress={props.updateTodo} 
                              autoFocus 
                              fullWidth/>
                      <ListItemSecondaryAction>
                      <IconButton 
                        title="delete"
                        edge="end" 
                        aria-label="comments"  
                        id={value.id} 
                        onClick={()=>{props.deleteHandler(value.id)}}>
                        <HighlightOffIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                    </ListItem>
                  </Card>
                );
              }else{
                return (
                    <Card 
                    className={classes.card}
                    >
                    <ListItem 
                        style={{background:'black',color:'white'}}
                        >
                        <ListItemText>
                            Assigned By : {value.user_email}
                        </ListItemText>
                    
                        Assigned To : {value.assigned_to}
                    </ListItem>
                    <Divider/>
                  <ListItem key={index} 
                    title="Doubble click here to edit"
                    className={classes.listItem}
                    onDoubleClick={()=>{props.edit(value.id)}} 
                    value={value.text} 
                    id={value.id}>
                    <ListItemIcon>
                      <Checkbox 
                        title="Checkbox"
                        checked={value.done} 
                        onClick={props.checkbox} 
                        id={value.id} />
                    </ListItemIcon>
                      <ListItemText 
                        id={value.id} 
                        primary={`${value.text}`} />
                    <ListItemSecondaryAction>
                      <IconButton 
                        title="delete"
                        edge="end" 
                        aria-label="comments"  
                        id={value.id} 
                        onClick={()=>{props.deleteHandler(value.id)}}>
                        <HighlightOffIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  </Card>
                );
              }
          })}
        </List>
      );
}
