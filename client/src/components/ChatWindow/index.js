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
                            (this.props.messages.map((message,i) => {
                                console.log("message is",message);
                                if(message.from === this.props.chattingWith){
                                    console.log("******",message.text)
                                    return (
                                        <div key={i} className="from-div" >
                                        <span className="from-message" >{message.text}</span>
                                        <div className="clear"></div></div>
                                    //    <div> <span class="left">{message.text}</span>
                                    //     <div class="clear"></div></div>
                                    )
                                }
                                if(message.to === this.props.chattingWith){
                                        return (
                                            <div key={i} className="to-div" >
                                            <span className="to-message" >{message.text}</span>
                                            <div className="clear"></div></div>
                                            // <div>
                                            //     <span class="right">{message.text}</span>
                                            //     <div class="clear"></div>
                                            // </div>
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