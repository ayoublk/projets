import React from 'react';
import './App.css';
import Presentation from'./Components/presentation/presentation';
import Chat from './Components/Chat/chat';
import Groupe from './Components/Groupes/groupe';
import Utilisateurs from './Components/Utilisateurs/utilisateurs';
import Socket from './Components/socket.js';
import {Container} from 'react-bootstrap';


class App extends React.Component {

  constructor(props){
    super(props);
    this.state={
        user:"",
        Chat:[]
    }
  }
    parentFunction=(data_from_child)=>{
      this.setState({user:data_from_child});  
    }
  render(){
  
    return(
      
    <div>
    <Presentation functionCallFromParent={this.parentFunction.bind(this)}/>
    <Socket valuefromparent={this.state.user}/>
    <div id='gauche'>
    <Groupe valuefromparent={this.state.user}/>
    <Utilisateurs valuefromparent={this.state.user}></Utilisateurs>
    </div>
    
    <div id='droite'>
    <Container fluid> <Chat valuefromparent={this.state.user}/> </Container>
    </div>
    </div>
    )
  };
}
export default App;
