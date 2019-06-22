import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const firebase = require('firebase');

class LoginComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      loginError: ''
    };
  }

  render() {

    const { classes } = this.props;

    return(
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">Login</Typography>
          <form className={classes.form} onSubmit={(e) => this.submitLogin(e)}>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor="login-email-input">Enter Your Email</InputLabel>
              <Input autoComplete="email" autoFocus id="login-email-input" onChange={(e) => this.userTyping('email', e)}></Input>
            </FormControl>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor="login-password-input">Enter Your Password</InputLabel>
              <Input type="password"  id="login-password-input" onChange={(e) => this.userTyping('password', e)}></Input>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Log In</Button>
          </form>
          {
            // If loginError is set then the error text is displayed otherwise it is skipped
            this.state.loginError ? 
            <Typography className={classes.errorText} component="h5" variant="h6">Incorrect Login Information</Typography> :
            null
          }
          <Typography component="h5" variant="h6" className={classes.noAccountHeader}>Don't Have An Account?</Typography>
          <Link className={classes.signUpLink} to="/signup">Sign Up</Link>
        </Paper>
      </main>
    );
  }

  // Function to update the state based on what the user is typing into the input fields
  userTyping = (type, e) => {
    switch (type) {
      case 'email':
        this.setState({ email: e.target.value });
        break;

      case 'password':
        this.setState({ password: e.target.value });
        break;
    
      default:
        break;
    }
  }

  // Login function
  submitLogin = (e) => {
    // Prevent the form from refreshing the page
    e.preventDefault();

    firebase
      .auth() // Access the authentication
      .signInWithEmailAndPassword(this.state.email, this.state.password) // Logs the user in based on email and password
      .then(() => {
        // If login is successful then user is redirected to the dashboard page
        this.props.history.push('/dashboard'); 
      }, err => {
        // Error handling for login error
        this.setState({ loginError: 'Server error' });
        console.log(err);
      });
  }

}

export default withStyles(styles)(LoginComponent);