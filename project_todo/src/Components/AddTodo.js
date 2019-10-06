import React from 'react';
import {Grid, TextField,Paper} from "@material-ui/core";

function Todo(props){
    return(
      <Paper style={{ margin: 16, padding: 14 ,background:'lightGreen'}}>
            <Grid container>
                <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
                    <form onKeyPress={props.addItem}>
                    <TextField
                        label="Add Todo here"
                        value={props.item}
                        onChange={props.onChangeHandler}
                        // onKeyPress={props.addItem}
                        fullWidth
                        autoFocus
                        style={{marginBottom:'20px'}}
                        required
                    />
                    <TextField
                        label="Assigned To :"
                        value={props.assignedTo}
                        onChange={props.onChangeHandler2}
                        fullWidth
                        placeholder={'email id'}
                        name="email"
                        required
                    />
                    </form>
                </Grid>
            </Grid>
        </Paper>
    )
}
export default Todo