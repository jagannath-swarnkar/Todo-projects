import React, { Component } from 'react';
import TodoHeader from './TodoHeader';
import AddTodo from './AddTodo';
import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import {Redirect} from 'react-router-dom';
import TodoList from './TodoList';
import _ from 'underscore';



export class Todos extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             item:'',
             assignedTo:"",
             itemList:[],
             defaultList:'Total',
             redirect:false,
             editItem:'',
             editId:'',
             todoId:''
        }
    }

    UNSAFE_componentWillMount(){
        axios
        .post('http://localhost:3030/getTodos',({
            'token':reactLocalStorage.get('token'),
            'project_id':this.props.match.params.id
            }))
        .then((data)=>{
            console.log('data in willmount : ',data.data)
            this.setState({itemList:data.data})
            })
        .catch((err)=>{
            console.log('err in getting todos in will mount',err)
            })
    }

    componentWillUpdate(){
        var Token =reactLocalStorage.get('token');
        axios
        .get('http://localhost:3030/checkToken',({params:{token:Token}}))
        .then(result=>{
                if(result.data==='tokenExpires'){
                    reactLocalStorage.get('token','')
                    reactLocalStorage.clear();
                    this.setState({redirect:true})
                }
          })
        .catch(err=>{
            console.log('this is err in componentWillUpdate',err);
        })
      }

    onChangeHandler = (e) =>{
        this.setState({item:e.target.value})
    }
    onChangeHandler2 = (e) =>{
        this.setState({assignedTo:e.target.value})
    }
    logout=()=>{this.setState({redirect:true});}

    addItem = (e) =>{
        var project_id = this.props.match.params.id
        if(e.key==="Enter"){
            if((this.state.item.length>0) && (this.state.item.match(/[a-z]/i))){
                axios
                .post('http://localhost:3030/todo',({
                    'text':this.state.item,
                    'assignedTo':this.state.assignedTo,
                    'done':false,
                    'project_id':project_id,
                    'token':reactLocalStorage.get('token')
                    }))
                .then((data)=>{
                    console.log('todos sent to backend',data.data)
                    this.setState({itemList:data.data})
                    this.setState({item:'',assignedTo:'',})
                    })
                .catch((err)=>{
                    console.log('err in sending todo to backend',err)
                    })
            }
        }
    }

    deleteHandler=(e)=>{
        var project_id = this.props.match.params.id
        var Token =reactLocalStorage.get('token');
        axios
        .post('http://localhost:3030/delete/'+e,{id:e,token:Token,project_id:project_id})
        .then((result)=>{
            this.setState({itemList:result.data})
        })
        .catch((err)=>{console.log('err in sending delete id to backend',err)})
    }

    checkbox = (e) => {
        var Token =reactLocalStorage.get('token');
        const itemList = this.state.itemList;
        var dict = _.findWhere(this.state.itemList,{id:parseInt(e.target.id,10)});     
        if(dict.done===0 || dict.done === false){            
            dict.done = true;
            this.setState({ itemList })            
            axios
            .put('http://localhost:3030/done/'+dict.id,{done:true,text:dict.text,token:Token,id:dict.id})
            .then(()=>{console.log('done updated to true')
            })
            .catch((err)=>{console.log('err in done updating',err)
            })
        }else{
            dict.done = false;
            this.setState({ itemList })
            
            axios
            .put('http://localhost:3030/done/'+dict.id,{done:false,text:dict.text,token:Token,id:dict.id})
            .then(()=>{console.log('done updated to false')
            })
            .catch((err)=>{console.log('err in done updating',err)
            })
        }

    }

    edit = (id) =>{
        // console.log(e,typeof(e))
        var dict = _.findWhere(this.state.itemList,{id:id})        
        this.setState({
            editItem:dict.text,
            editId:id,
            todoId:dict.id
        })  
    }
    editChangeHandler=(e)=>{
        this.setState({editItem:e.target.value})
    }
    updateTodo=(e)=>{
        console.log(this.state.editItem,this.state.editId,this.state.todoId);
        
        var project_id = this.props.match.params.id
        if(e.key==="Enter"){
            // console.log(this.state.editItem,this.state.editId,this.state.todoId);
            if((this.state.editItem.length>0) && (this.state.editItem.match(/[a-z]/i))){
                axios
                .put('http://localhost:3030/edit/'+this.state.editId,({
                    id : this.state.editId,
                    text : this.state.editItem,
                    project_id : project_id,
                    token : reactLocalStorage.get('token')
                    }))
                .then((result)=>{
                    console.log('todo updated successfully')
                    this.setState({
                        itemList:result.data,
                        editId:"",
                        editItem:'',
                        todoId:''
                        })
                    })
                .catch((err)=>{
                    console.log('err in sending todo to backend',err)
                    })
            }
        }
    }

    listShouldbe = (state) =>{ 
        this.setState({defaultList:state})
    }

    
    render() {
        if(this.state.redirect){
            return(<Redirect to={'/login'} />);
        }
        return (
            <div>
                <div style={{position:'sticky',top:0, width:'100%'}}>
                <TodoHeader 
                    itemList={this.state.itemList}
                    logout={this.logout}
                    listShouldbe={this.listShouldbe}
                    projectName={this.projectName}
                /></div>
                <AddTodo 
                    item={this.state.item}
                    assignedTo={this.state.assignedTo}
                    onChangeHandler={this.onChangeHandler}
                    onChangeHandler2={this.onChangeHandler2}
                    addItem={this.addItem}
                />
                <TodoList
                    itemList={this.state.itemList}
                    defaultList={this.state.defaultList}
                    deleteHandler={this.deleteHandler}
                    checkbox={this.checkbox}
                    edit={this.edit}
                    todo={this.state.editItem} 
                    todoId={this.state.todoId} 
                    editChangeHandler={this.editChangeHandler}
                    updateTodo={this.updateTodo}
                    projectName={this.projectName}
                />
            </div>
        )
    }
}

export default Todos
