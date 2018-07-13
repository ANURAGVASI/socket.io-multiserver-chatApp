import React from 'react';
import $ from 'jquery';

class TextInput extends React.Component{


    componentDidMount(){

    }

    sendMessage = () => {
        const message =$(".enter-message").val();
        if(message){
            this.props.socket.emit('newMessage',{
                to: this.props.chatWithuser,
                message
            })
        }
    }

    render(){
        console.log("socket",this.props.socket);
        return (
            <div>
                <div className="row">
                    <div className="col-md-9">
                        <input type="text" className="enter-message" placeholder="Type a message" />
                    </div>
                    <div className="col-md-3">
                        <button onClick={this.sendMessage} >Send</button>   
                    </div>
                </div>    
            </div>
        )
    }
    
}

export default TextInput;