import React from "react";
import './utilisateurs.css';
import { Button, Table } from 'react-bootstrap';
import {socketclient} from "../socket.js";

class Utilisateurs extends React.Component {

    
        constructor(props)
        {
            super(props)
    
        this.state = {
            liste : [],
            vico : ""
        }

        }
    
    render() {
        return (

            <div id="userstext">
            Utilisateurs
            <div>
            <Table striped bordered hover id="tab2">
            <tbody>
               <tr id="listeutilisateurs">
               </tr>
             </tbody>
           </Table>
           </div>
           </div>
        )
}}
export default Utilisateurs;