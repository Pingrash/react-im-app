import React from 'react';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './styles';
const firebase = require('firebase');

class SignupComponent extends React.Component {
  
  // Set state
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      passwordConfirmation: null,
      signupError: ''
    };
  }

  render() {

    // Assign this.props.classes to a const called classes
    const { classes } = this.props;

    return(
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">Sign Up!</Typography>
          <form onSubmit={(e) => this.submitSignup(e)} className={classes.form}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-email-input">Enter Your Email</InputLabel>
              <Input autoComplete="email" onChange={(e) => this.userTyping("email", e)} autoFocus id="signup-email-input"></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-input">Create A Password</InputLabel>
              <Input type="password" onChange={(e) => this.userTyping("password", e)} id="signup-password-input"></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-confirmation-input">Confirm Your Password</InputLabel>
              <Input type="password" onChange={(e) => this.userTyping("passwordConfirmation", e)} id="signup-password-confirmation-input"></Input>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Submit</Button>
          </form>
          {
            // If signupError is set then it is displayed here, otherwise returns null and is skipped
            this.state.signupError ?
            <Typography className={classes.errorText} component="h5" variant="h6">{this.state.signupError}</Typography> :
            null
          }
          <Typography component="h5" variant="h6" className={classes.hasAccountHeader}>Already Have An Account</Typography>
          <Link className={classes.loginLink} to="/login">Log In!</Link>
        </Paper>
      </main>
    );
  }

  // Helper function to check if password and passwordConfirmation in state are equal
  formIsValid = () => this.state.password === this.state.passwordConfirmation;

  // On change function for the form, sets the field value to the relevent state based on which form field is being typed into
  userTyping = (type, e) => {
    switch (type) {
      case 'email':
        this.setState({ email: e.target.value });
        break;

      case 'password':
        this.setState({ password: e.target.value });
        break;

      case 'passwordConfirmation':
          this.setState({ passwordConfirmation: e.target.value });
          break;
    
      default:
        break;
    }
  }

  // Submit function for the form
  // Checks for password match then submits the form data to Firebase to add the new user
  submitSignup = (e) => {
    // Prevents the form from refreshing the page as normal
    // User is routed to the dashboard page at the end of this function
    e.preventDefault();
    
    // Set an error message to the state if the passwords do not match
    if (!this.formIsValid()) {
      this.setState({ signupError: 'Passwords do not match!' });
      return;
    }

    // Signup the user to Firebase
    firebase
      .auth() // For adding the user to Authentication table
      .createUserWithEmailAndPassword(this.state.email, this.state.password) // Create the new user using the email and password in the state
      .then(authRes => {
        const userObj = {
          email: authRes.user.email
        }; // Takes the Authentication result and sets the users email to a user object
        firebase
          .firestore() // For adding the user to the database
          .collection('users') // Tells firestor to use the users collection
          .doc(this.state.email) // Creates a new document in the collection and names it after the users email
          .set(userObj) // Add the userObj data to the new document
          .then(() => {
            this.props.history.push('/dashboard'); // Routes the user to the dashboard component
          }, dbError => {
            console.log(dbError);
            this.setState({ signupError: 'Failed to add user' });
          }) // Error handler for database failure
      }, authError => {
        console.log(authError);
        this.setState({ signupError: authError.message });
      }) // Error handler for authentication error
  }

}

export default withStyles(styles)(SignupComponent);