import React from 'react';
import './index.css';

export default class ChatUser extends React.Component{
    render(){
        return(
            <div className="chat-user" >
                {
                    (this.props.chattingWith)
                    ? <p>{this.props.chattingWith}</p>
                    : <p>no users online</p>
                }
            </div>
        )
    }
}