import React from "react";
import './presentation.css';
import {Navbar,Button} from 'react-bootstrap';
import {socketclient} from "../socket.js";

class Presentation extends React.Component {

  
    state = {
       user : ""
      }
    
     
      // fonction pour recuperer lors du clic sur le btn
      childFunction=(e)=>{

        e.preventDefault();
        this.props.functionCallFromParent(this.state.user);
        socketclient.emit('send', {'action':'client-connexion', 'sender':this.state.user});
        document.getElementById('text-input').value = '';
        document.getElementById('button-identifiant').disabled = true;
        socketclient.emit('send', {'action':'client-list-clients'});
    }

  render(){

    return(
      
  <Navbar 
    bg="dark" 
    variant="dark">
  <Navbar.Brand href="#home">
   <input
      className="form-control" 
      id="text-input"
      type="text" 
      placeholder="Entrez votre pseudo" 
      onChange = { e => this.setState({ user : e.target.value})}></input>
    </Navbar.Brand>
    <Button 
      variant="outline-success" 
      id = 'button-identifiant'
      valuefromparent = { this.state.user }
      // Envoie d'une socket au serveur + envoie au component Chat le nom de l'utilisateur
      onClick = {  this.childFunction.bind(this)}>
      Se connecter</Button>{' '}
  <Navbar.Toggle />
  <Navbar.Collapse className="justify-content-end">
  <Navbar.Brand>
     <img onClick={ () => window.location.reload()} src="/images/logo.png" alt="logo"/>
  </Navbar.Brand>
  </Navbar.Collapse>
</Navbar>
    )
  };
}
export default Presentation;
