import React from 'react';
import ChatListComponent from '../chatlist/chatList';
import ChatViewComponent from '../chatview/chatview';
import ChatTextBoxComponent from '../chattextbox/chattextbox';
import NewChatComponent from '../newchat/newchat';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';

const firebase = require('firebase');

class DashboardComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: []
    };
  }

  render() {

    const { classes } = this.props;

    return(
      <div>
        <ChatListComponent history={this.props.history} newChatBtnFn={this.newChatBtnClicked} selectChatFn={this.selectChat} chats={this.state.chats} userEmail={this.state.email} selectChatIndex={this.state.selectedChat}></ChatListComponent>
        {
          this.state.newChatFormVisible ? null :
          <ChatViewComponent 
            user={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}>
          </ChatViewComponent>
        }
        {
          this.state.selectedChat !== null && !this.state.newChatFormVisible ? <ChatTextBoxComponent submitMessageFn={this.submitMessage} messageReadFn={this.messageRead}></ChatTextBoxComponent> :
          null
        }
        {
          this.state.newChatFormVisible ? <NewChatComponent goToChatFn={this.goToChat} newChatSubmitFn={this.newChatSubmit}></NewChatComponent> : null
        }
        <Button onClick={this.signOut} className={classes.signOutBtn}>Sign Out</Button>
      </div>
    );
  }

  // Signout the user from firebase auth
  // Once signed out the user will automatically be redirected to the login page (see componentDidMount)
  signOut = () => firebase.auth().signOut();

  newChatBtnClicked = () => {
    this.setState({ newChatFormVisible: true, selectChat: null });
  }

  // Select chat to be displayed in the chat view
  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  }

  // Build the key string that will be used when saving the message to the firebase database
  // Takes your email and your friends email, sorts them alphabetically and then joins the two emails together with a : in between
  // eg. 'test@test.com' and 'bob@test.com' = 'bob@test.com:test@test.com'
  buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

  // Submit the users message to firebase database
  submitMessage = (message) => {
    // Generate the docKey for firestore
    const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
    // Add chat message to database
    firebase
      .firestore() // Access database update method
      .collection('chats') // Select chats collection
      .doc(docKey) // Use the docKey we generated as the docKey for the new database entry
      .update({
        // arrayUnion adds this new entry to the end of the current array in the database
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: message,
          timestamp: Date.now() // Added for potential use later
        }),
        recieverHasRead: false
      });
  }

  // Updates recieverHasRead in firebase database to true if the reciever of the message has read it
  // Once recieverHasRead is true the notification icon for a new message will automaticaly disappear
  messageRead = () => {
    const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
    if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
      firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({ recieverHasRead: true });
    } else {
      console.log('Clicked message where the user was the sender');
    }
  }

  // Open pre-existing chat
  goToChat = async (docKey, message) => {
    // Split the docKey into an array of both users
    const usersInChat = docKey.split(':');
    // Find the chat in state that includes both users
    const chat = this.state.chats.find(_chat => usersInChat.every(_usr => _chat.users.includes(_usr)));
    // Close the new chat form
    this.setState({ newChatFormVisible: false });
    // Open the pre-existing chat
    await this.selectChat(this.state.chats.indexOf(chat));
    // Submit the new message to the chat
    this.submitMessage(message);
  }

  // Submit new chat to firebase
  newChatSubmit = async (chatObj) => {
    // Generate new docKey
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .set({
        recieverHasRead: false,
        users: [this.state.email, chatObj.sendTo],
        messages: [{
          message: chatObj.message,
          sender: this.state.email
        }]
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length -1);
  }

  // Returns true if you are not the sender of the latest message
  clickedChatWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length -1].sender !== this.state.email; 

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (!_usr) {
        // Redirects the user back to the login page if not logged in
        this.props.history.push('/login');
      } else {
        await firebase
          .firestore() // Connect to firestore service
          .collection('chats') // Access chats collection
          .where('users', 'array-contains', _usr.email) // Grabs any documents that contain the users email in the array
          .onSnapshot(async res => {
            // onSnapshot is a listener for changes in firestore
            // Whenever a change is detected it will map the results to the state
            const chats = res.docs.map(_doc => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats
            });
          })
      }
    })
  }
}

export default withStyles(styles)(DashboardComponent);