import React from 'react';
import $ from 'jquery';
import './index.css';

class TextInput extends React.Component{

    sendMessage = () => {
        const message =$(".enter-message").val();
        $(".enter-message").val('');
        if(message){
            this.props.socket.emit('newMessage',{
                to: this.props.chatWithuser,
                message
            });
            this.props.sentMessage(this.props.chatWithuser,message)
        }
    }
    testFunc = (e) => {
        if(e.key==='Enter')
        this.sendMessage();
        
    }

    render(){
        
        console.log("socket",this.props.socket);
        return (
            <div className="text-input-class" >
                <div className="row">
                    <div className="col-md-10">
                        <input onKeyPress={this.testFunc} type="text" className="enter-message" placeholder="Type a message" />
                    </div>
                    <div className="col-md-2">
                        <button className="send-message-btn" onClick={this.sendMessage} >Send</button>   
                    </div>
                </div>    
            </div>
        )
    }
    
}

export default TextInput;