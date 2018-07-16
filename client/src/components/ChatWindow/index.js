import React from 'react';
import TextMessage from '../TextMessage';
import './index.css';

class ChatWindow extends React.Component{
    
    render(){
        const class1 = "floting-right";
        const class2 = "floating-left";
        return(
            <div className="chat-window" >  
                {
                    (this.props.chattingWith)
                    ?<div>
                        {
                            (this.props.messages.map((message) => {
                                console.log("message is",message);
                                if(message.from === this.props.chattingWith){
                                    return (
                                        <div className="from-div" >
                                        <span className="from-message" >{message.text}</span></div>
                                    )
                                }
                                if(message.to === this.props.chattingWith){
                                        return (
                                            <div className="to-div" >
                                            <span className="to-message" >{message.text}</span></div>
                                        )
                                }
                            }))
                        }
                    </div>
                    :null
                }
            </div>
        )
    }
}

export default ChatWindow;