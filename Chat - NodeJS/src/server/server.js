// Create a server socket and listen on port 3636
const socketio = require('socket.io');
const io = socketio.listen(3636);
//const bcrypt = require('bcrypt');
var sq = require('sqlite3');

let sockets = {}; //liste des utilisateurs associés à leur sockets
let groups = [[],[],[]]; //liste des utilisateurs associés à leur socket et à leurs groupes
var liste_messages = [[],[],[]];
var bannis = [[],[],[]];
var operations = [[],[]];
let i = 0;


sq.verbose();

var db = new sq.Database('bdd.db', err => {
  if (err)
  {
    throw err
  }
  else { console.log('Database started on bdd.db')}
});

//db.run('CREATE TABLE message (content TEXT, nom_user TEXT, nom_groupe TEXT)');

// Handle event 'send' from client
io.on('connection', function(socket) {


    socket.on('send', function(data) {
        if (!data.sender || (sockets[data.sender] === undefined && data.action !== 'connection'))
        {
            socket.emit('message', { sender: 'server', msg: `Sender ${data.sender} is not existed or disconnected`, event: 'error.user.notConnectusered' });
            socket.disconnect();
            return;
        }
//toutes les fonctions propres à chaque case sont définies en dessous du switch
        switch (data.action) {
            case 'connection':
                seConnecter();
                break;
            case 'broadcast':
                socket.broadcast.emit('message', { sender: data.sender, msg: data.msg, event: 'user.broadcast' });
                break;
            case 'list':
                socket.emit('message', { sender: 'server', users: Object.keys(sockets), event: 'user.list' });
                break;
            case 'quit':
                socket.disconnect();
                break;
            case 'cgroup':
                creerGroupe();
                break;
            case 'join':
                joinGroupe()
                break;
            case 'gbroadcast':
                broadcast();
                break;
            case 'members':
                membres();
                break;
            case 'msgs':
                messages();
                break;
            case 'groups':
                groupes();
                break;
            case 'leave':
                quitter();
                break;
            case 'invite':
                inviter();
                break;
            case 'kick':
                exclure();
                break;
            case 'ban':
                bannir();
                break;
            case 'unban':
                debannir();
                break;
            case 'states':
                evenements();
                break;
            case 'bdd':
                db.get('SELECT * FROM message', (err, data) => {
                  if(err)
                    {throw err;}
                  else { console.log(data);}

                });
                break;

            default:
                socket.emit('message', { sender: 'server', msg: `Action ${data.action} is not supported`, event: 'error.action.notSupported' });
                break;
        }

        function seConnecter() {
        let username = data.sender; //nom de l'utilisateur

        if (sockets[username] !== undefined) //si pas de nom d'utilisateur, on déconnecte
        {
            socket.emit('message', { sender: 'server', msg: `Connection failed, nickname has already been taken `, event: 'user.connectionFailed' });
            socket.disconnect();
        }

        else {
            sockets[data.sender] = socket.id; //on associe à un nom d'utilisateur sa socket : sockets[username]=socket
            socket.emit('message', { sender: 'server', msg: `Hello ${data.sender}`, event: 'user.connected' });
            socket.broadcast.emit('message',{ sender: 'server', user: data.sender, event: 'user.new' } )
        }
        }

        function testpres () //test de l'appartenance à un groupe
        {
          let test = false; //boolean qui change de valeur si présent
            for(i=0;i<groups[0].length;i++)
            {
              if(groups[0][i]==data.sender && groups[2][i]==data.group)
              {
                test=true; //true si déjà présent dans le groupe
              }
            }
            return test;
          }

        function testbanjoin() //test si le sender est banni
        {
          let test = false; //boolean qui change de valeur
          for(i=0;i<bannis[0].length;i++)
          {
            if(bannis[0][i]==data.sender && bannis[2][i]==data.group)
            {
              test=true; //true si déjà présent dans le groupe
            }
          }
          return test;
        }

        function testbandest() //test si le destinataire est banni
        {
          let test = false;
          for(i=0;i<bannis[0].length;i++)
          {
            if(bannis[0][i]==data.dest && bannis[2][i]==data.group)
            {
              test=true;
            }
          }
          return test;
        }

        function creerGroupe()
        {
        if(!(groups[2].includes(data.group))) //on vérifie que le groupe n'existe pas
        {
          groups[0].push(data.sender); //on push le sender dans le tableau
          groups[1].push(socket); //on push la socket du sender dans le tableau
          groups[2].push(data.group); //on push son groupe dans le tableau

          socket.emit('message', {sender: data.sender, group: data.group, event: 'group.create'});
          socket.broadcast.emit('message', {sender: data.sender, group: data.group, event: 'group.create'});
        }

        else //le groupe existe déjà
        { socket.emit('message', {sender: data.sender, group: data.group, event: 'group.create.already.exists'});}
        }

        function joinGroupe(){
        //Gestion des évènements
        operations[0].push(data.sender + " a joint le groupe " + data.group);
        operations[1].push(data.group);

        //si le groupe existe et l'utilisateur y appartient
        if(testpres()==true)
        { socket.emit('message', { sender: data.sender, group: data.group, event: 'group.already.joined'}); }

        //si l'utilisateur n'appartient pas au groupe, que le groupe existe et qu'il n'est pas banni
        else if(testpres()==false && groups[2].includes(data.group) && testbanjoin()==false)
        {
          groups[0].push(data.sender); //on push le sender dans le tableau
          groups[1].push(socket); //on push la socket
          groups[2].push(data.group); //on push le groupe
          socket.emit('message', { sender: data.sender, group: data.group, event: 'group.join'});
        }
        //si le groupe n'existe pas
        else if(!groups[2].includes(data.group)){ //le groupe n'existe pas -> on refuse
          socket.emit('message', { sender: data.sender, group: data.group, event: 'group.does.not.exist'});
        }
        }

        function broadcast(){
        //Gestion des messages avec un tableau contenant les messages
        liste_messages[0].push(data.sender + ' : ' + data.msg);
        liste_messages[1].push(socket);
        liste_messages[2].push(data.group);

        //Gestion des évènements avec un tableau contenant
        operations[0].push(data.sender + " : " + data.msg);
        operations[1].push(data.group);

        if(testpres()==true) //si le groupe existe et qu'il fait partie du groupe
        {
          for(i=0;i<groups[0].length;i++)
          {
            if(groups[2][i]==data.group)
              {groups[1][i].emit('message', { sender: data.sender, group: data.group, msg: data.msg, event: 'group.broadcast'});}
          }
          db.run("INSERT INTO message VALUES(?,?,?)", [data.msg, data.sender, data.group]);
        }

        else
         { socket.emit('message', { sender: data.sender, group: data.group, msg: data.msg, event: 'group.broadcast.not.in.group'});}
       }

       function membres(){
       //Gestion des évènements
       operations[0].push(data.sender + " a affiché la liste des membres du groupe " + data.group);
       operations[1].push(data.group);

       //on stocke les membres du groupe demandé dans un tableau
       var listemembres = [];
       function memberlist()
       {
         for(i=0;i<groups[0].length;i++)
         {
           if(groups[2][i]=data.group)
           {listemembres.push(groups[0][i]);}
         }
         return listemembres;
       }

       socket.emit('message', { sender: data.sender, tab : memberlist(), group: data.group, event: 'group.members'});
      }

      function messages(){
      //Gestion des évènements
      operations[0].push(data.sender + " a affiché l'historique des messages du groupe " + data.group);
      operations[1].push(data.group);

      //on stocke les messages du groupe demandé dans un tableau
      var liste_messages_groupe = [];
      for(i=0;i<liste_messages[0].length;i++)
      {
        if(liste_messages[2][i]==data.group)
          {liste_messages_groupe.push(liste_messages[0][i]);}
      }
      socket.emit('message', { sender: data.sender, tab: liste_messages_groupe, group: data.group, event: 'group.messages'});
      }

      function groupes(){
      var listegroupes = []; //tableau qui va contenenir la liste des groupes existants
      function grouplist()
        {
          for(i=0;i<groups[0].length;i++) //on parcourt les groupes et on les ajoute dans un tableau en évitant les doublons
          {
            if(listegroupes.includes(groups[2][i])==false)
                {listegroupes.push(groups[2][i]);}
          }
          return listegroupes;
        }

      socket.emit('message', { sender: data.sender, tab : grouplist(), event: 'group.list'});
      }


      function quitter() {
      //Gestion des évènements
      operations[0].push(data.sender + " a quitté le groupe " + data.group);
      operations[1].push(data.group);


      for(i=0;i<groups[0].length;i++)
      {
        if(groups[0][i]==data.sender && groups[2][i]==data.group)
        {
          groups[0].splice(i,1); //On supprime le nom
          groups[1].splice(i,1); //On supprime la socket
          groups[2].splice(i,1); //On supprime le groupe
        }
      }

      socket.emit('message', { sender: data.sender, group: data.group, event: 'group.leave'});
      }

      function inviter(){
      //Gestion des évènements
      operations[0].push(data.sender + " a invité " + data.dest + " dans le groupe " + data.group);
      operations[1].push(data.group);
      //console.log(bannis);
      //console.log(testbandest());
      if(testbandest()==false) //on vérifie s'il n'est pas banni
      {
          groups[0].push(data.dest);
          groups[2].push(data.group);
          socket.emit('message', { sender: data.sender, group: data.group, dest: data.dest, event: 'group.invite'});
      }
      }

      function exclure() {
      //Gestion des évènements
      operations[0].push(data.sender + " a exclu " + data.dest + " du groupe " + data.group);
      operations[1].push(data.group);

      for(i=0;i<groups[0].length;i++)
      {
        if(groups[0][i]==data.dest) //si le dest correspond
        {
          groups[0].splice(i,1); //on supprime nom
          groups[1].splice(i,1); //on supprime socket
          groups[2].splice(i,1); //on supprime groupe
        }
      }
      socket.emit('message', { sender: data.sender, group: data.group, dest: data.dest, reason: data.reason, event: 'group.kick'});
      }

      function bannir() {
      //Gestion des évènements
      operations[0].push(data.sender + " a banni " + data.dest + " du groupe " + data.group);
      operations[1].push(data.group);

      for(i=0;i<groups[0].length;i++)
      {
        if(groups[0][i]==data.dest && groups[2][i]==data.group) //si le nom du dest et le groupe correspondent
        {
          bannis[0].push(data.dest); //on push dans le tableau des bannis
          bannis[2].push(data.group);
          groups[0].splice(i,1); //on supprime dans le tableau des utilisateurs
          groups[2].splice(i,1);
        }
      }
      socket.emit('message', { sender: data.sender, group: data.group, dest: data.dest, reason: data.reason, event: 'group.ban'});
      }

      function debannir() {
      //Gestion des évènements
      operations[0].push(data.sender + " a débanni " + data.dest + " du groupe " + data.group);
      operations[1].push(data.group);

      for(i=0;i<bannis[0].length;i++)
      {
        if(bannis[0][i]==data.dest && bannis[2][i]==data.group) //si le nom du dest et le groupe correspondent
        {
          bannis[0].splice(i,1); //on supprime dans le tableau des bannis
          bannis[2].splice(i,1);
        }
      }
      socket.emit('message', { sender: data.sender, group: data.group, dest: data.dest, event: 'group.unban'});
      }


      function evenements(){
      //Gestion des évènements
      operations[0].push(data.sender + " a affiché l'historique des opérations du groupe " + data.group);
      operations[1].push(data.group);

      var operations_groupe = [];
      for(i=0;i<operations[0].length;i++)
      {
        if(operations[1][i]==data.group) //si le nom correspond au groupe que l'on veut
        {
          operations_groupe.push(operations[0][i]); //on ajoute les opérations d'un groupe dans un tableau
        }
      }
      socket.emit('message', { sender: data.sender, group: data.group, event: 'group.states'});
      }

    });

    // Handle event disconnect by program
    socket.on('disconnect', function() {
        disconnectUser(socket);

    });
});


function disconnectUser(socket) {
    let disconnectedUser = null;
    for (let user in sockets) {
        let socketId = sockets[user];
        if (socketId === socket.id) {
            disconnectedUser = user;
            break;
        }
    }
    if (disconnectedUser) {
        delete sockets[disconnectedUser];
        socket.broadcast.emit('message',{ sender: 'server', user: disconnectedUser, event: 'user.quit' });
    }
}
