import React from "react";
import './groupe.css';
import { Button, Table } from 'react-bootstrap';
import {socketclient} from "../socket.js";



class Groupe extends React.Component {

        constructor(props)
        {
            super(props)
        
        this.state = {
            groupe: "",
            user:"",
        }

        }
      creerGroupe = () => {
        
        if(document.getElementById('button-quit').value=="")
        {
            alert("Veuillez vous connecter")
        }
        
        else {
           
            
            socketclient.emit('send', {'action' : 'cgroup', 'sender': this.props.valuefromparent, 'groupe':this.state.groupe })
            
            var tableaugroupes = document.getElementById('tableaugroupes');
            var groupe = document.createTextNode('*' + this.state.groupe);
            groupe.className = this.state.groupe
            console.log("classname : " + groupe.className);

            var rejoindre = document.createElement("Button");
            rejoindre.innerHTML = "Rejoindre" ;
            rejoindre.className = this.state.groupe;
            rejoindre.addEventListener('click', () => {this.joinGroup(rejoindre.className)}); 

            var quitter = document.createElement("Button");
            quitter.innerHTML = "Quitter";
            quitter.className = this.state.groupe;
            quitter.addEventListener('click', () => {this.leaveGroup(quitter.className)});
            quitter.addEventListener('click', () => { document.getElementById('annonces').innerHTML = "Annonce : Le groupe a été dissous.";});

            var messagegroupe = document.createElement("Button");
            messagegroupe.innerHTML = "Envoyer";
            messagegroupe.className = this.state.groupe;
            messagegroupe.addEventListener('click', () => 
            {this.sendGroup(messagegroupe.className)})

            var membres = document.createElement("Button");
            membres.innerHTML = "Membres";
            membres.className = this.state.groupe;
            membres.addEventListener('click', () => {this.groupMembers(membres.className)})
            
            var ban = document.createElement("input");
            ban.innerHTML = "Bannir";
            ban.className = this.state.groupe;
            ban.addEventListener("keyup", function(event) {
              // Number 13 is the "Enter" key on the keyboard
              if (event.keyCode === 13) {
                socketclient.emit('send', {'action':'isban', 'sender': document.getElementById("button-quit").value, 'groupe': ban.className, 'dest': ban.value});
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
              }
            });

            var newRow = tableaugroupes.insertRow();
            newRow.id = this.state.groupe;
            var newCell0 = newRow.insertCell(0);
            var newCell1 = newRow.insertCell(1);
            var newCell2 = newRow.insertCell(2);
            var newCell3 = newRow.insertCell(3);
            var newCell4 = newRow.insertCell(4);
            var newCell5 = newRow.insertCell(5);

            newCell0.appendChild(groupe);
            newCell1.appendChild(rejoindre);
            newCell2.appendChild(quitter);
            newCell3.appendChild(messagegroupe);
            newCell4.appendChild(membres);
            newCell5.appendChild(ban);
      }
    
  }

      joinGroup = (groupe) => {
        console.log("Join group")
        socketclient.emit('send', {'action':'join', 'sender': document.getElementById("button-quit").value, 'groupe': groupe})
        var annonces = document.getElementById("annonces");
        var message = "Vous avez rejoint le groupe " + this.state.groupe;
        annonces.innerHTML = "Annonce : " + message 

      }

      leaveGroup = (groupe) => {
        this.setState({groupe:groupe})
        socketclient.emit('send', {'action':'leave', 'sender': document.getElementById("button-quit").value, 'groupe': this.state.groupe})
        var annonces = document.getElementById("annonces");
        var message = "Vous avez quitté le groupe " + this.state.groupe;
        annonces.innerHTML = message;
      }

      sendGroup = (groupe) => {
        socketclient.emit('send', {'action':'gbroadcast', 'sender': document.getElementById("button-quit").value, 'groupe':groupe, "message": document.getElementById("message").value});
              var tableau2 = document.getElementById('tableau-envoyeur');
      				var tr = document.createElement('tr');
      				tableau2.appendChild(tr);
      				var td = document.createElement('td');
      				tr.appendChild(td);
      				var tdText = document.createTextNode(document.getElementById('message').value);
      				td.appendChild(tdText);
      }

      groupMembers = (groupe) => {
        console.log("Members group");
        socketclient.emit('send', {'action':'members', 'sender': document.getElementById("button-quit").value, 'groupe':groupe});
      }


    render() {
       

        return (

            <div id="groupestext">  Groupes <input
            id="text-input2"
            type ="text" 
            placeholder="Nom groupe"
            onChange={ e => this.setState({ groupe: e.target.value })}>
            </input>

            <Button 
            id = 'addgroupe'
            onClick = { () => this.creerGroupe()}>
                Créer 
            </Button>
            


            <Table striped bordered hover id="tab1">
            <tbody id="tableaugroupes">
            <tr>
            </tr>

            </tbody>
           </Table>
           </div>
        )
}}
export default Groupe;