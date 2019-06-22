import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';
import withStyles from '@material-ui/core/styles/withStyles';

import CssBaseLine from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class ErrorComponent extends Component {
  render() {

    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseLine />
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h2'>
            Error 404
          </Typography>
          <Typography component='span' variant='h5'>
            Page Does Not Exist
          </Typography>
          <Link to='/login' className={classes.link}>
            <Button variant='contained' fullwidth color='primary'>
              Return To Login
            </Button>
          </Link>
        </Paper>
      </main>
    )
  }
}

export default withStyles(styles)(ErrorComponent);