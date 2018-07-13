import React from 'react';
import TextMessage from '../TextMessage';
import './index.css';

class ChatWindow extends React.Component{
    
    render(){
        return(
            <div className="chat-window" >  
                <TextMessage/>
            </div>
        )
    }
}

export default ChatWindow;