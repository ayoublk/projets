
class Groupe {
    constructor(name, creator ) {
        this.utilisateurs = new Array();
        this.name = name;
        this.creator=creator;
        this.utilisateurs.push(creator);
        this.messagegroupe=new Array();
        this.tableauban=new Array();
    }
    getEtat(){
        return this.privee;
    }
    getName(){
        return this.name;
    }
    getCreator(){
        return this.creator;
    }

    addUtilisateur(utilisateur){
        this.utilisateurs.push(utilisateur);
    }

    getUtilisateur(utilisateur){
        return this.utilisateurs.includes(utilisateur);
    }

    getTabUtilisateur(){
        return this.utilisateurs;
    }
    getMessageGroupe(){
        return this.messagegroupe;
    }
    addMessageGroupe(message){
        this.messagegroupe.push(message);
    }
    quitGroupe(utilisateur){
        console.log( this.utilisateurs ) ;
        for ( let i = 0 ; i < this.utilisateurs.length ; i++  ){
            if ( this.utilisateurs[i] === utilisateur ) {
                this.utilisateurs.splice(i);
            }
        }
        console.log(this.utilisateurs);
    }
    appartientBani(utilisateur){
        return this.tableauban.includes(utilisateur);
    }
    addBani(utilisateur){
        this.tableauban.push(utilisateur);
    }
    getTabBani(){
        return this.tableauban;
    }
    quitBan(utilisateur){
        console.log(this.tableauban);
        for ( let i = 0 ; i < this.tableauban.length ; i++  ){
            if ( this.tableauban[i] === utilisateur ) {
                this.tableauban.splice(i);
            }
    }
        console.log(this.tableauban);
}
}

module.exports = Groupe ;