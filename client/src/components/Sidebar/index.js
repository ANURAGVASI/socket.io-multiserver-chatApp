import React from 'react';

export default class sidebar extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            Cuser: this.props.cookie.load('user').email
        }
    }

    render(){
        return(
            <div className="side-bar" >
                online users 
                {
                    (this.props.users && this.props.users.length!==0)
                    ? <div>
                        {
                            this.props.users.map((user,i) => {
                                if(user!==this.state.Cuser)
                                return(
                                    <p key={i}
                                    onClick={(e) => {this.props.chatWithuser(user)}} >
                                        {user}
                                    </p>
                                )
                            })
                        }
                    </div>
                    : <p>no online users</p>
                }
            </div>
        );
    }
}