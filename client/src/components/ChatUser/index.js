import React from 'react';
import './index.css';
import {withRouter} from 'react-router-dom'

class ChatUser extends React.Component{

    logout=() => {
        // emiting logout event
        this.props.socket.emit("logout");
        this.props.socket.on("loggedOut",() => {
            this.props.cookie.remove('user');
            this.props.history.push("/");
        })
    }

    render(){
        return(
            <div className="chat-user" >
                {
                    (this.props.chattingWith)
                    ? <p>{this.props.chattingWith.toUpperCase()} <button onClick={this.logout} className="btn btn-primary" >Logout</button></p>
                    : <p>no users online <button onClick={this.logout} className="btn btn-primary" >Logout</button></p>
                }
                
                <hr/>
            </div>
        )
    }
}
export default withRouter(ChatUser);