import React, { Component } from 'react';
import Header from './Header';
import Projects from './Projects';
import {reactLocalStorage} from 'reactjs-localstorage';
import {Redirect} from 'react-router-dom';
import Addicon from './Addicon';
import axios from 'axios';


export class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       Projects:[],
       redirect:false
    }
  }

  UNSAFE_componentWillMount(){
    var token = reactLocalStorage.get('token')
    axios
    .post('http://localhost:3030/getProject',({
      'token':token
      }))
    .then((data)=>{
      this.setState({Projects:data.data})
      })
    .catch((err)=>{
      console.log({status:404,message:"err in fatching data from db",Error:err})
      })
  }

  componentWillUpdate(){
    var Token =reactLocalStorage.get('token');
    axios
    .get('http://localhost:3030/checkToken',{params:{token:Token}})
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

  projectHandler = (data) =>{
    this.setState({Projects:data})
  }
  logout=()=>{this.setState({redirect:true})}
  
  render() {
    if(!reactLocalStorage.get('token')){
      return(<Redirect to={'/login'} />);
      }
    if(this.state.redirect){
      return(<Redirect to={'/login'} />);
      }
    return (
      <React.Fragment>
        <Header />
          <Projects
            Projects={this.state.Projects}
            logout={this.logout}
          />
        <div style={{
          right:0,
          margin:30,
          marginRight:60,
          position: 'absolute',
          bottom:0
          }}
          >
          <Addicon 
            projectHandler={this.projectHandler}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default App
