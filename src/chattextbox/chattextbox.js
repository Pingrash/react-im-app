import React from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class ChatTextBoxComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      chatText: ''
    };
  }

  render() {

    const { classes } = this.props;

    return(
      <div className={classes.chatTextBoxContainer}>
        <TextField placeholder='Type your message...' onKeyUp={(e) => this.userTyping(e)} id='chatTextBox' className={classes.chatTextBox} onFocus={this.userClickedInput}></TextField>
        <Send onClick={this.submitMessage} className={classes.sendBtn}></Send>
      </div>
    );
  }

  // Checks if the enter key has been pressed
  // If the enter key has been pressed then the submitMessage function is called
  // Otherwise the value of the key pressed is added to chatText in the state
  userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });

  // Checks for text and replaces all space characters with an empty string to check for messages that only contain spaces
  messageValid = (text) => text && text.replace(/\s/g, '').length;

  // Calls the parent message read function to remove new message notification
  userClickedInput = () => this.props.messageReadFn();

  // Send the message to the parent submitMessage function provided the message is valid
  submitMessage = () => {
    if (this.messageValid(this.state.chatText)) {
      // Call parent submitMessage function
      this.props.submitMessageFn(this.state.chatText);

      // Clear the text box
      document.getElementById('chatTextBox').value = '';
    }
  }

}

export default withStyles(styles)(ChatTextBoxComponent);