const socketio = require('socket.io');
const io = socketio.listen(4000);
var repertoire = [];
var Groupe = require('./Groupe.js');
var listegroupes=new Array(Groupe);
var listeusers = []

function addGroupe ( groupe ) {
    listegroupes[groupe.getName()]= groupe;
} 
function appartientUtilisateur ( utilisateur, nomGroupe ){
    if ( (listegroupes[nomGroupe] !== undefined) && ( listegroupes[nomGroupe].getUtilisateur(utilisateur) === false) ) {
        listegroupes[nomGroupe].addUtilisateur(utilisateur);
    }
}

io.on('connection', function (socket) { 

    console.log("A user has connected")

    socket.on('send',function(msg){
        
        switch (msg.action) {
            case 'client-connexion':
                //if(repertoire[msg.sender]!=null){
                  //  socket.emit('message',{'action':'pseudo-already-connected'});
                   // break;
                //}
                //else{
                socket.emit('message',{"action":"connexion", "sender": msg.sender, "message": "Welcome " + msg.sender});
                repertoire[msg.sender] = socket;
                listeusers.push(msg.sender)
                //}
                console.log(msg.sender + " s'est connecté");
                break;

            case 'client-send':
                repertoire[msg.dest].emit('message',{ 'action':'action-send', "message": msg.msg, "dest":msg.dest, "sender":msg.sender});
                break;

            case 'client-broadcast':
                socket.broadcast.emit('message',{ 'action':'action-broadcast',"message": msg.msg , 'sender':msg.sender });
                console.log("Message envoyé");
                break;

            case 'client-list-clients':
                let liste = "";
                for (let i in repertoire) {
                    console.log(i);
                    liste = liste + i + ";";
                }
                if(liste.length!=0){
                var slice = liste.slice(0,-1);
                socket.broadcast.emit('message',{ 'action':"liste-user","message": listeusers });
                socket.emit('message',{ 'action':"liste-user","message": listeusers });
                }
                break;  

            case 'client-quit': for (let i in listeusers) {console.log("users : " + listeusers); console.log("/////////////////////////")
               // if ( msg.sender != listeusers[i]){

                socket.broadcast.emit('message',{"action":'quit', "message": msg.sender + " a quitté le chat ", "sender":msg.sender });
                socket.emit('message',{"action":'quit', "message": msg.sender + " a quitté le chat ", "sender":msg.sender });
                socket.emit('message',{"action":'restart_connexion', "message": msg.sender + " a quitté le chat ", "sender":msg.sender });
                //}
                var index = listeusers.indexOf(msg.sender);
                listeusers.splice(index,1);
            }  
                console.log("users : " + listeusers);
                console.log(msg.sender + " s'est déconnecté")

                break;
            case 'cgroup': 
                groupe = new Groupe(msg.groupe, msg.sender);
                
                socket.broadcast.emit('message',{'action' : 'creategroup' , "message": msg.sender + " a créé le groupe " + msg.groupe, "groupe":msg.groupe, "sender" : msg.sender });
                    
                
                addGroupe ( groupe );
                console.log("Groupe créé");
                console.log(listegroupes);
                console.log("Sender : " + msg.sender);
                break;

            case 'join':
                if ( (listegroupes[msg.groupe].appartientBani(msg.sender) )){
                    socket.emit('message',{"action":'estBani'});
                }
                else {
                appartientUtilisateur(msg.sender , msg.groupe);
                socket.broadcast.emit('message',{"action":"joingroup", "message": msg.sender + " a rejoint le groupe " + msg.groupe + "  ", "groupe" : msg.groupe, "sender" : msg.sender});
                //repertoire[msg.sender].emit('message',{"message": msg.sender + " a rejoint le groupe " + msg.groupe + "  "});
                console.log("Un utilisateur a rejoint le groupe : " + msg.sender);
                }
                break;

            case 'gbroadcast':
                if ( listegroupes[msg.groupe] !== undefined) {
                    let tab = listegroupes[msg.groupe].getTabUtilisateur();
                    listegroupes[msg.groupe].addMessageGroupe(msg.message);
                    console.log(tab);
                    for (let j in tab ){
                        if(tab[j] !== msg.sender)
                            repertoire[tab[j]].emit('message',{"action":"gbroadcast", "message" : msg.message, "sender":msg.sender, "groupe":msg.groupe});
                    }
                }
                console.log(msg.message);
                break;
            case 'members' : 
            var tab = listegroupes[msg.groupe].getTabUtilisateur();
            if ( repertoire[msg.sender] != undefined) 
            repertoire[msg.sender].emit('message',{"action":'members', "membres" : tab, 'creator': listegroupes[msg.groupe].getCreator() });
            break;

            case 'msgs' : 
                repertoire[msg.sender].emit('message',{"message" : listegroupes[msg.groupe].getMessageGroupe()});
            break;

            case 'groups': let a = '';
                 for (let i in listegroupes ){
                    a = a + listegroupes[i].name + ' ';
            }
                repertoire[msg.sender].emit('message',{"message" : " voici la liste des groupes   " + a });
            console.log("lol");
            break;

            case 'leave' : 
            if ( listegroupes[msg.groupe].getCreator() === msg.sender ){
            socket.broadcast.emit( 'message', {"action": 'supprimergroupe' , 'groupe': msg.groupe });
            socket.emit('message', {"action": 'supprimergroupe' , 'groupe': msg.groupe});
            }
            else{ 
            socket.broadcast.emit('message', {"action":"leavegroup", "message" : msg.sender + " a quitté le groupe " + msg.groupe})
            console.log("Un utilisateur a quitté le groupe");
            }
            listegroupes[msg.groupe].quitGroupe(msg.sender);
            break;

            case 'invite':  
                if (listegroupes[msg.groupe].appartientBani(msg.dest)==0){
                    appartientUtilisateur(msg.dest, msg.groupe);
                    repertoire[msg.dest].emit('message',{"message" : msg.sender + '  vous a ajoutez au groupe ' + msg.groupe + ' ! '});
            }
                else  repertoire[msg.sender].emit('message',{"message" : " Cette personne a été banni "});
            console.log("Un utilisateur a été invité")
            break;

            case 'kick':  
                if ((listegroupes[msg.groupe] !== undefined)&&(msg.dest !==listegroupes[msg.groupe].getCreator())){
                    listegroupes[msg.groupe].quitGroupe(msg.dest);
                    repertoire[msg.dest].emit('message',{"message" : "Vous avez été kick du groupe"+ " " + msg.groupe + " pour la raison suivante " + msg.reason });
            }
            else {
                    repertoire[msg.dest].emit('message',{"message" : msg.sender + " a tenté de vous kick "});
            }
            break;
            case 'isban' :
                if(listegroupes[msg.groupe].appartientBani(msg.dest)){
                    socket.emit('message',{"action":"deban", "groupe":msg.groupe, "dest":msg.dest, "sender":msg.sender});
                }
                else {
                    socket.emit('message',{"action" :"ban", "groupe":msg.groupe, "dest":msg.dest, "sender":msg.sender});
                }
                break;

            case 'ban' :
                console.log(msg.dest);
                if((msg.dest!==listegroupes[msg.groupe].getCreator())&& (listegroupes[msg.groupe] !== undefined)&&(msg.sender==listegroupes[msg.groupe].getCreator())){
                    listegroupes[msg.groupe].addBani(msg.dest);
                    listegroupes[msg.groupe].quitGroupe(msg.dest);
                    
                    repertoire[msg.dest].emit('message',{"message" : "Vous avez été BAN du groupe"+ " " + msg.groupe + " pour la raison suivante " + msg.reason });
                    }
                else {
                    repertoire[msg.sender].emit('message',{"message" : "Vous n'avez pas les droits " });
            }
            break;

            case 'unban' : 
                if(msg.sender!==listegroupes[msg.groupe].getCreator()){
                    repertoire[msg.sender].emit('message',{"message" : "Vous n'avez pas les droits " });
                }
                else {  
                    listegroupes[msg.groupe].quitBan(msg.dest);
                    repertoire[msg.dest].emit('message',{"message" : "Vous avez été DEBAN du groupe" });
                }
        }

    });

        
});