import socketIOClient from "socket.io-client";
import React from "react";
var url = "http://localhost:4000";

export const socketclient = socketIOClient(url);

class Socket extends React.Component {

	constructor(props)
	        {
				super(props);
			}

		state={
				boolean : 'false',
				tab:[]
			}
			 
	
		render() {
	    //tester si le message envoyé est bien le même que celui écrit et en un exemplaire
		function sendmsg(data){
		    var tableau= document.getElementById('tableau-receveur');
	        var tr = document.createElement('tr');
	        tableau.appendChild(tr);
			var td = document.createElement('td');
			var td1 = document.createElement('td');
			tr.appendChild(td1);
			tr.appendChild(td);
			var tdText = document.createTextNode(data.message);
			var tdText2 =  document.createTextNode(data.sender);
			td.appendChild(tdText);
			td1.appendChild(tdText2);
		}
		
	    socketclient.off('message').on('message', function (data) {
		  var nomuser = document.getElementById("button-quit").value
		  
	    switch(data.action){

		case 'pseudo-already-connected':
			alert('Ce pseudo est déjà pris !')
		break;

	    case 'action-broadcast':
	    	sendmsg(data);
	    break;

	    case 'action-send':
			sendmsg(data);
	    break;
			 
		case 'liste-user':
			var tableauUsers= document.getElementById('tab2');
			console.log(tableauUsers.getElementsByTagName('tr'));
			var liste = data.message;

	        for ( let i in liste ){

	        	console.log(liste[i]);
				var id = document.getElementById(liste[i]);
				if ( id == undefined ){
				const button = document.createElement('Button');
				const user = document.createTextNode(liste[i]);
				button.className = data.message[i];	
				button.innerHTML = "Envoyer";
				var newRow = tableauUsers.insertRow();
				newRow.id = liste[i];
				var newcell1 = newRow.insertCell();
				var newcell2 = newRow.insertCell();
				newcell1.appendChild(user);
				newcell2.appendChild(button);
				button.addEventListener("click", () => {
					socketclient.emit('send', {'action':'client-send', 'msg':document.getElementById('message').value, 'sender':document.getElementById("button-quit").value, 'dest':button.className})
					var tableau2 = document.getElementById('tableau-envoyeur');
      				var tr = document.createElement('tr');
      				tableau2.appendChild(tr);
      				var td = document.createElement('td');
      				tr.appendChild(td);
      				var tdText = document.createTextNode(document.getElementById('message').value);
      				td.appendChild(tdText);
				})
				}
			}
			
	    break;

	    case 'creategroup':

	      	function annoncejoin () {
				var annonces = document.getElementById("annonces");
		        var message = "Vous avez rejoint le groupe " + data.groupe;
		        annonces.innerHTML = "Annonce : " + message 
	    	}

	    	function annonceleave() {
		    	var annonces = document.getElementById("annonces");
		        var message = "Vous avez quitté le groupe " + data.groupe;
		        annonces.innerHTML = "Annonce : " + message 
	    	}


	        var tableaugroupes = document.getElementById('tableaugroupes');
	        var groupe = document.createTextNode(data.groupe);
	        var rejoindre = document.createElement("Button");
	        rejoindre.innerHTML = "Rejoindre";
	        rejoindre.className = data.groupe;
	        rejoindre.addEventListener("click", () => {socketclient.emit('send', {'action' : 'join', 'sender':nomuser, 'groupe':rejoindre.className})})
			rejoindre.addEventListener("click", () => {annoncejoin()});
	
	        var quitter = document.createElement("Button");
	        quitter.innerHTML = "Quitter"
	        quitter.className = data.groupe;
	        quitter.addEventListener("click", () => {socketclient.emit('send', {'action' : 'leave', 'sender':nomuser, 'groupe':quitter.className})})
	        quitter.addEventListener("click", () => {annonceleave()});
 			

 			var messagegroupe = document.createElement("Button");
            messagegroupe.innerHTML = "Envoyer";
            messagegroupe.className = data.groupe;
            messagegroupe.addEventListener('click', () => {socketclient.emit('send', {'action': 'gbroadcast', 'sender':nomuser, 'groupe':messagegroupe.className, 'message':document.getElementById('message').value})})

            var membres = document.createElement("Button");
            membres.innerHTML = "Membres";
            membres.className = data.groupe;
            membres.addEventListener('click', () => {socketclient.emit('send', {'action':'members', 'sender': nomuser, 'groupe':messagegroupe.className})});

			var ban = document.createElement("input");
            ban.innerHTML = "Bannir";
            ban.className = data.groupe;
			ban.addEventListener('click', () =>socketclient.emit('send', {'action':'members', 'sender': nomuser, 'groupe':messagegroupe.className}));
			
			var newRow = tableaugroupes.insertRow();
			newRow.id = data.groupe;
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

	    break;

	    case 'quit':
			  var annonces = document.getElementById("annonces");
			  message = document.createTextNode(data.message);
			  annonces.innerHTML = "Annonce : "
			  annonces.appendChild(document.createTextNode(data.message));
			  const idquit = document.getElementById(data.sender);
			  if ( idquit !=null ){
			  idquit.remove();
			  }
		break;

		case 'restart_connexion': 
		document.getElementById('button-identifiant').disabled = false;
		break;
			
	    case 'joingroup':
	      	console.log('Join group')
	      	var annonces = document.getElementById("annonces");
	      	var message = document.createTextNode(data.message);
	      	annonces.innerHTML = "Annonce : "
	      	annonces.appendChild(message);
		break;
		
		case 'gbroadcast':
			sendmsg(data);

		break;
		
	    case 'leavegroup':
	      	console.log("Leave group");
	     	annonces = document.getElementById("annonces");
	      	message = document.createTextNode(data.message);
	      	annonces.innerHTML = "Annonce : "
	      	annonces.appendChild(message);
		break;

		case 'supprimergroupe' : document.getElementById(data.groupe).remove();
			
		break;

		case 'members': alert(data.membres + ' | Créateur : ' + data.creator );

		break;

		case 'estBani' : alert('Vous avez été banni de ce groupe ! ')
		break;
		
		case 'ban':  var val = window.confirm('Bannir cette personne ?');
		if ( val == true ) {
			socketclient.emit('send', {'action':'ban', 'sender': data.sender, 'groupe':data.groupe,'dest':data.dest });
		}
		else return;
		break;
		
		case 'deban': var val = window.confirm('Debannir cette personne ?');
		if ( val == true ) {
			socketclient.emit('send', {'action':'unban', 'sender': data.sender, 'groupe':data.groupe,'dest':data.dest} );
		}
		else return;
		break;

	    default:
	        console.log("Aucune fonction n'est associée")
		break;
		
	    }
	  })
   	return (null);
   }

}

export default Socket;