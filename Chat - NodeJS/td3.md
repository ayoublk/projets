# TD3



> Un des objectifs est de comprendre le fonctionnement élémentaire d'un client et d'un serveur `node.js`

## Indications particulières

> Dans votre répertoire racine de votre dépot, vous devez: 
> -  Fournir un fichier `td3-Prenom-Nom.pdf` qui contient le rapport du **TD** et l'explication du code que vous avez produit (Le nom fichier doit contenir votre prénom et nom)!. 
> - Créer un sous répertoire `src` qui va contenir le code source de votre projet. 
> - Créer deux sous répertoire `src/client`et `src/server`pour contenir le code du client et du serveur respectivement. 

## Partie I: Prise en main d'une socket javascript

L’objectif de ce TD est de concevoir une application similaire à IRC, application permettant l’échange de messages entre utilisateurs. Plus précisément, vous devez créer un client de messagerie et son serveur associé *via* l’utilisation des primitives de `node.js` pour manipuler les **Stream**, et les sockets **TCP**.


1. Le point de départ est de bien comprendre le fonctionnement d'un serveur `TCP`. 
Pour cela veuillez bien lire la documentation sur les socket [server](https://nodejs.org/api/net.html#net_class_net_server) et [client](https://nodejs.org/api/net.html#net_class_net_socket).

Veuillez analyser la fragment de code suivant qui illustre le fonctionnement et la logique élémentaire d'un serveur. 
Ce fragment de code est directement disponible dans le fichier [server.js](startercode/server.js) dans le répertoire `startercode/server`

```javascript
...
var net = require('net');

var server = net.createServer((socket)=>{
    console.log('CONNECTED from ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.on('data', function(data) {
            msg = JSON.parse(data);
            console.log('DATA received from ' + socket.remoteAddress + ':' + data);

            switch(msg.action){
                case 'client-hello': 
                    socket.write(JSON.stringify({
                        "sender-ip":socket.remoteAddress+':'+socket.remotePort,
                        "action":"server-hello",
                        "msg":"Hello"}));
                break;
            }
        });
    }).listen(8080, '127.0.0.1');
...
```

Plusieurs éléments fondamentaux sont à comprendre. 
 - Le serveur se met en écoute
 - Attends une requête au format `JSON` 
 - Traite la requête (c'est à dire `parse` la requête)
 - Et renvoie une réponse au format `JSON`

Pour tester rapidement le fonctionnement du serveur, ouvrir un nouveau terminal et utilisez un utilitaire tel que `netcat` ou `putty` (en mode `telnet`) pour faire office de client. 

> Avec `netcat` pour envoyer un [message](startercode/client/msg.json) au format `json`:
>```console
>$ netcat 127.0.0.1 8080 < msg.json
>```
>

2. On s'intéresse dorénavant à la partie cliente. On veut dorénavant créer notre propre client permettant de se connecter à notre serveur. Le client va naturellement utiliser une [socket](https://nodejs.org/api/net.html#net_class_net_socket) pour se connecter au serveur.

Ce fragment de code est directement disponible dans le fichier [client.js](startercode/client.js) dans le répertoire `startercode/client`

```javascript
var net = require('net');
var client = new net.Socket();

client.connect(8080, '127.0.0.1', function() {
    console.log('Connected');
    process.stdout.write('>');
});

client.on('data', function(data) {
    console.log('Received: ' + data);
    process.stdout.write('>');
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('>');
process.stdin.on('data', (text) => {
		switch(text){
            case 'hello\n':
                    client.write(JSON.stringify({"action":"client-hello"}))
                    break;
            }
});
```

Plusieurs éléments fondamentaux sont à comprendre. 
 - Le client se met connecte au serveur
 - Attends que l'utilisateur saisisse un commande 
 - Traite la commande, l'interprête et génère une requête au format `JSON` envoyée au serveur
 - Et recoit une réponse au format `JSON` du serveur.

> Il en résulte que les messages échangés sont formatés en `JSON`. Le client et le serveur doivent se mettre d'accord sur ce format pour le bon fonctionnement de l'application. Cela implique la conception d'une spécification qui définit l'ensemble des messages échangés entre le client et le serveur. 


## PARTIE II: Développement et amélioration du client et du serveur de tchat

1. Améliorer le code du client et du serveur. 
    - Utiliser des variables d'environnements pour configurer le `host` et le `port` afin qu'ils ne soient pas figés dans le code. (voir [TD1](td1.md))
    - Utiliser un système de debug en lieu et place de `console.log` (voir [TD2](td2.md))
    - (côté client) Utiliser la librairie [readline](https://nodejs.org/api/readline.html) à la place de `process.stdin` (voir [TD1](td1.md))
    - (côté client) Utiliser la librairie [yargs](https://www.npmjs.com/package/yargs) pour gérer les arguments du programme, comme par exemple passer en paramètre le nom de l'utilisateur. 

1. Implementer la **connection** qui permet au client de se connecter au serveur;

    |Format du message
    |:---------------:|
    |``` {sender: sender_name ,action:'client-connection'}```|

    > Donner le format `JSON` de la réponse du serveur

1. Implémenter l'envoie de messages privés **send**.

    |commande| Message  | Format du message | commentaires
    | :------------| :------------ |:---------------:|:---------------:|
    |s;david;`hello` | send     |       ``` {sender: sender_name, dest: receiver_name ,msg: message_content ,action:'client-send'}```      |  `sender_name` envoie le message `message_content` à `receiver_name`

    > Donner le format `JSON` de la réponse du serveur 

1. Implémenter la fonction **broadcast**

    - **broadcast** envoie un message `a toutes les personnes connectées

    |command | message  | Json format | Comments
    | :------------| :------------ |:---------------:|:---------------:|
    |b;`hello` | broadcast     |       ``` {sender: sender_name ,msg: message_content ,action:'client-broadcast'}```      |  `sender_name` broadcasts the message `message_content`  

    ![Alt text](images/broadcast.png?raw=true "broadcast")

    > Donner le format `JSON` de la réponse du serveur 
1. Implémenter la commande **list**
    - **list** demande au serveur de lister le nom de toutes les personnes connectées

    |Command | Message  | Json format | Commments|
    | :------------| :------------ |:---------------:|:---------------:|
    |ls;| list   |       ``` {sender: sender_name ,action:'client-list-clients'}```       |   `sender_name` lists the connected clients

    > Donner le format `JSON` de la réponse du serveur 

1. Implémenter la commande **quit**
    - **quit** permet de quitter proprement l'utilisateur.

    |Command | Message  | Json format  | comments
    | :------------| :------------ |:---------------:|:---------------:|
    |q;| quit   |        ``` {sender: sender_name ,action:'client-quit'}``` | `sender_name` quit the serveré&

    > Donner le format `JSON` de la réponse du serveur 

1. Implémenter les notifications. L'utilisateur est automatiquement averti quand une personne se connecte, et se déconnecte.

    ![Alt text](images/notifications.png?raw=true "notifications")

    > Donner le format `JSON` de la réponse du serveur 
1. Il existe plusieurs pistes d'Amélioration de l'interface du client. Veuillez en explorer quelques unes avec au choix plusieurs librairies possibles: 
    - Ajouter des couleurs. Voir [chalk](https://github.com/chalk/chalk) ou [kleur](https://github.com/lukeed/kleur)
    - Améliorer l'interaction. Voir [Inquirer](https://github.com/SBoudrias/Inquirer.js) ou [Enquirer](https://github.com/enquirer/enquirer)
    - Ajouter une véritable interface. Voir [blessed](https://github.com/chjj/blessed)

1. Donner la spécification exacte des messages échangés entre le client et le serveur dans votre rapport.


