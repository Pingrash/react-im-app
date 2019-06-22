import React from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

class ChatViewComponent extends React.Component {

  componentDidUpdate = () => {
    // On update the chatview container will scroll to the bottom of the container
    const container = document.getElementById('chatview-container');
    if (container) {
      container.scrollTo(0, container.scrollHeight);
    }
  }

  render() {

    const { classes, chat, user } = this.props;

    if (chat === undefined) {
      return(<main id='chatview-container' className={classes.content}></main>);
    } else {
      return(
        <div>
          <div className={classes.chatHeader}>
            Your conversation with {chat.users.filter(_user => _user !== user)[0]}
          </div>
          <main id='chatview-container' className={classes.content}>
            {
              chat.messages.map((_msg, _index) => {
                return(
                    <div key={_index} className={_msg.sender === user ? classes.userSent : classes.friendSent}>
                      {
                        _msg.timestamp ? 
                        <Typography variant='caption'>
                          {this.convertTimeStamp(_msg.timestamp)}
                        </Typography> : null
                      }
                      <br/> 
                      <Typography variant='body1'>{_msg.message}</Typography>
                    </div>    
                );
              })
            }
          </main>
        </div>
      );
    }    
  }

  // Convert the timestamp generated within firebase to a date string
  convertTimeStamp = (timeStamp) => {
    const date = new Date(timeStamp).toString().slice(0, 21);
    return date;
  }

}

export default withStyles(styles)(ChatViewComponent);