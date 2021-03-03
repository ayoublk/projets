import React from "react";
import './chat.css';
import { Navbar, Button } from 'react-bootstrap';
import {socketclient} from "../socket.js";

class Chat extends React.Component {
 
  envoieMessage(){
    //tester si le message reçu est bien le même que le message envoyé et reçu en un exemplaire
    if(document.getElementById('button-quit').value=="")
    {
        alert("Veuillez vous connecter")
    }
        
    else {
    socketclient.emit('send', { 'action':'client-broadcast', 'msg': this.state.msg, 'sender': this.props.valuefromparent});
    document.getElementById('message').value = '';
    var tableau2 = document.getElementById('tableau-envoyeur');
      var tr = document.createElement('tr');
      tableau2.appendChild(tr);
      var td = document.createElement('td');
      tr.appendChild(td);
      var tdText = document.createTextNode(this.state.msg);
      td.appendChild(tdText);
  }
}

  sendMessage(){
    socketclient.emit('send', { 'action': 'client-send', 'msg':this.state.msg, 'sender':this.props.valuefromparent, 'dest':this.state.destinataire})
  }

  deconnexion() {
    socketclient.emit('send', { 'action': 'client-quit' , 'sender': this.props.valuefromparent})
    document.getElementById('button-quit').innerHTML = ""
  }


  state = {
    msg: "",
    nomGroupe: ""
  }

  render() {
    return (
      // zone des messages
            
            <div id="chatbox">
             {/* Créer une zone d'annonces générales plus jolie*/}
            <div id = 'annonces'>
            Annonce :
            </div> 
              <div id="messagebox">
                <table id="tableau-receveur">
                </table>
                <table id="tableau-envoyeur">
                </table>
              </div>
              <Navbar
                id="chatbar"
                bg="dark"
                variant="dark">
                <Navbar.Brand href="#home">
                  <input
                    className="form-control"
                    id="message"
                    type="text"
                    placeholder="Entrez votre message"
                    onChange={e => this.setState({ msg: e.target.value })}
                    value = {this.state.msg}>
                    </input>
                </Navbar.Brand>

                <Button
                  id='button-quit'
                  onClick={a => this.deconnexion()}
                  value= {this.props.valuefromparent}>
                  {this.props.valuefromparent}
                </Button>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                  <Button
                    variant="outline-success"
                    id='button-message'
                    value={this.state.msg}
                    onClick={ a => this.envoieMessage()} >
                    Envoyer le message</Button>{' '}
                </Navbar.Collapse>
              </Navbar>
            </div>


    )}}
export default Chat;