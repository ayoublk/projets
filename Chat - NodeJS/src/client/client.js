// Create a client socket and connect to port 3636
const socketio = require('socket.io-client');
const socket = socketio.connect("http://localhost:3636");

// Read user's input
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

// Variable to keep user's nickname
let nickname = '';
let isConnected = false;

// Process user's input
rl.on('line', function(line) {

    var split = line.split(';');
    if (!isConnected) {
        console.log("Vous avez été déconnecté. Veuillez fermer le programme et vous reconnecter");
        return;
    }
    //broadcast
    if (line.match(/^b;.+$/))
    {
        socket.emit('send', { sender: nickname, msg: split[1], action: 'broadcast' });
    }
    //list
    else if (line.match(/^ls;$/))
     {
        socket.emit('send', { sender: nickname, action: 'list' });
     }
    //quit
    else if (line.match(/^q;/))
    {
        isConnected = false;
        socket.emit('send', { sender: nickname, action: 'quit' })
    }
    //create group
    else if (line.match(/^cg;/))
    {
        socket.emit('send', { sender: nickname, group: split[1], action: 'cgroup' })
    }
    //join
    else if (line.match(/^j;/))
    {
        socket.emit('send', { sender: nickname, group: split[1], action: 'join' })
    }
    //broadcast group
    else if (line.match(/^bg;/))
    {
      socket.emit('send', { sender: nickname, group: split[1], msg: split[2], action: 'gbroadcast' })
    }
    //members of a group
    else if (line.match(/^members;/))
    {
      socket.emit('send', { sender: nickname, group: split[1], action: 'members' })
    }
    //messages of a group
    else if (line.match(/^messages;/))
    {
      socket.emit('send', { sender: nickname, group: split[1], action: 'msgs' })
    }
    //list of groups
    else if (line.match(/^groups;/))
    {
      socket.emit('send', { sender: nickname, action: 'groups' })
    }
    //leave
    else if (line.match(/^leave;/))
    {
      socket.emit('send', { sender: nickname, group: split[1] ,action: 'leave' })
    }
    //invite
    else if (line.match(/^invite;/))
    {
      socket.emit('send', { sender: nickname, group: split[1], dest: split[2], action: 'invite' })
    }
    //kick
    else if (line.match(/^kick;/))
    {
      socket.emit('send', { sender: nickname, group: split[1], dest: split[2], reason: split[3], action: 'kick' })
    }
    //ban
    else if (line.match(/^ban;/))
    {
      socket.emit('send', { sender: nickname, group: split[1],dest: split[2], reason: split[3], action: 'ban' })
    }
    //unban
    else if (line.match(/^unban;/))
    {
      socket.emit('send', { sender: nickname, group: split[1], dest: split[2], action: 'unban' })
    }
    //states
    else if (line.match(/^states;/))
    {
      socket.emit('send', { sender: nickname, group: split[1], action: 'states' })
    }

    else if(line.match(/^bdd;/))
    {
      socket.emit('send', { sender: nickname, action: 'bdd' })
    }
    rl.prompt(true);
});


// Handle events from server
socket.on('message', function(data) {
    switch (data.event) {

        case 'user.connected':
            isConnected = true;
            console.log(data.msg);
            break;
        case 'user.connectionFailed':
            isConnected = false;
            console.log(data.msg);
            break;
        case 'user.new':
            console.log(`${data.user} s est connecté.`)
            break;
        case 'user.list':
            for (let user of data.users)
              {
                console.log(`${user}`) ;
              }
              break;
        case 'user.quit':
            console.log(`${data.user} a quitté chat.`)
            break;
        case 'user.broadcast':
            console.log(`${data.sender}>${data.msg}`);
            break;
        case 'group.create':
            console.log(`${data.sender} a créé le groupe ${data.group}`)
            break;
        case 'group.create.already.exists':
            console.log(`Le groupe existe déjà.`);
            break;
        case 'group.join':
            console.log(`${data.sender} a rejoint le groupe ${data.group}`)
            break;
        case 'group.already.joined':
            console.log(`Vous appartenez déjà à ce groupe`);
            break;
        case 'group.does.not.exist':
            console.log(`Le groupe n'existe pas`);
            break;
        case 'group.broadcast':
            console.log(`${data.sender}>${data.msg}`);
            break;
        case 'group.broadcast.not.in.group':
            console.log(`Le groupe n'existe pas ou vous n'en faites pas partie`);
            break;
        case 'group.members':
            console.log(`Liste des membres du groupe ${data.group} : `);
            console.log(data.tab);
            break;
        case 'group.messages':
            console.log(`Liste des messages du groupe ${data.group} : `)
            console.log(data.tab);
            break;
        case 'group.list':
            console.log(`Liste des groupes : `)
            console.log(data.tab);
            break;
        case 'group.leave':
            console.log(`${data.sender} a quitté le groupe ${data.group}.`)
            break;
        case 'group.invite':
            console.log(`${data.sender} a invité ${data.dest} dans le groupe ${data.group} `)
            break;
        case 'group.kick':
            console.log(`${data.sender} a exclu ${data.dest} du groupe ${data.group}. Raison : ${data.reason} `)
            break;
        case 'group.ban':
            console.log(`${data.sender} a banni ${data.dest} du groupe ${data.group}. Raison : ${data.reason} `)
            break;
        case 'group.unban':
            console.log(`${data.sender} a débanni ${data.dest} du groupe ${data.group} `)
            break;
        case 'group.states':
            console.log(`Liste des évènements du groupe ${data.group} : `)
            break;
        case 'bdd':
            console.log('Messages de la base de données : ');
            break;

        default:
            console.log(data.msg);
            break;
    }
    rl.prompt(true);
});

function main() {

    //node client.js --name ayoub
    if (process.argv.length == 4 && process.argv[2] == '--name')
    {
        nickname = process.argv[3];
        socket.emit('send', { sender: nickname, action: 'connection' });
    }
    //node client.js
    else
    {
        // Set the username
        rl.question( 'Veuillez entrer un nom d utilisateur:', function(nameInput) {
            nickname = nameInput;
            socket.emit('send', { sender: nickname, action: 'connection' });
            rl.prompt(true); });
    }
}

main();
