import React, { Component } from "react";
import {
  withStyles,
  Paper,
//   ListItem,
//   ListItemSecondaryAction,
//   ListItemText,
//   IconButton,
  Grid,
  TextField,
  Button,
  FormControl
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import ACTIONS from '../modules/action';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 25,
    // backgroundColor: '#91a9bf'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: '#d0d9e8'
  },
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  success: {
    backgroundColor: green[600],
  },
  iconSmall: {
    fontSize: 20,
  },
  image: {
      width: '100%'
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`
  },
  pInput: {
    padding: 10
  },
  modal: {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
});

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            showModal: false
        }

    }

    componentDidMount() {
        // Grab Events from database here if any exist and set to state or set a default blank one
        try {
            const db = firebase.database();
            const dbRef = db.ref('events');
            dbRef.on('value', eventsSnap => {
                let dbEvents = eventsSnap.val();
                console.log('Events array is ', eventsSnap.val());
                this.setState({ events: dbEvents });
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            this.setState({
                events: this.state.events.concat([{ 
                    title: '',
                    date: '',
                    coverImgUrl: 'https://picsum.photos/451/192?grayscale',
                    description: '',
                    streetAddress: '',
                    city: '',
                    zip: '',
                }])
            });
        }
    }

    handleAddEvent = () => {
        this.setState({
          events: this.state.events.concat([{ 
              title: '',
              date: '',
              coverImgUrl: 'https://picsum.photos/451/192?grayscale',
              description: '',
              streetAddress: '',
              city: '',
              zip: '',
            }])
        });
    };

    handleDeleteEvent = (i) => (event) => {

        this.setState(prevState => {
            let newEvents = [...prevState.events];
            newEvents = newEvents.filter(function(value, index, arr){

                return index !== i;
            
            });
            return { events: newEvents };
        });
    }

    handleChange = (i) => (event) => {
        event.persist();
        // console.log('Event is ', event);
        let name = event.target.name;
        let value = event.target.value;
        
        this.setState(prevState => {
            const newEvents = [...prevState.events];
            newEvents[i][name] = value;
            return { events: newEvents };
        })
    };

    updateEvents = async () => {
        const { events } = this.state;
        const db = firebase.database();
        const dbRef = db.ref('events/');
        let updates = events;

        await dbRef.set(updates);
        this.setState({
            showModal: true
        })
    }

    handleClose = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
    const { classes } = this.props;
    const { events } = this.state;

    return (
        <div className={classes.root}>

        <Grid container direction="row" alignItems="center" justify="center" spacing={3}>
            <Grid item xs={2}>
                <Button variant="contained" color="primary" className={classes.button} onClick={this.updateEvents}>
                    Update Events
                    <CloudUploadIcon className={classes.rightIcon} />
                </Button>
            </Grid>
        </Grid>
        
        <Grid container direction="row" alignItems="center" justify="center" spacing={3}>
            {
            events.map((event, index) => {
                return (
                    <Grid item xs={10} key={index}>
                    <Paper className={classes.paper} elevation={10}>
                        <Grid container spacing={3}>

                            <Grid item xs={8}>
                                <FormControl>
                                    <TextField
                                        label='Title'
                                        id={`event${index}`}
                                        value={events[index].title}
                                        margin='normal'
                                        name={`title`}
                                        onChange={this.handleChange(index)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl>
                                    <TextField
                                        label='Date'
                                        id={`event${index}`}
                                        value={events[index].date}
                                        margin='normal'
                                        name={`date`}
                                        onChange={this.handleChange(index)}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl>
                                    <TextField
                                        label='Cover Image URL'
                                        id={`event${index}`}
                                        value={events[index].coverImgUrl}
                                        margin='normal'
                                        name={`coverImgUrl`}
                                        onChange={this.handleChange(index)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <img src={events[index].coverImgUrl} alt={`Event ${index} Cover`} className={classes.image} />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl>
                                    <TextField
                                        label='Description and/or Location'
                                        id={`event${index}`}
                                        value={events[index].description}
                                        margin='normal'
                                        name={`description`}
                                        onChange={this.handleChange(index)}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs>
                                <FormControl>
                                    <TextField
                                        label='Street Address'
                                        id={`event${index}`}
                                        value={events[index].streetAddress}
                                        margin='normal'
                                        name={`streetAddress`}
                                        onChange={this.handleChange(index)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs>
                                <FormControl>
                                    <TextField
                                        label='City'
                                        id={`event${index}`}
                                        value={events[index].city}
                                        margin='normal'
                                        name={`city`}
                                        onChange={this.handleChange(index)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl>
                                    <TextField
                                        label='Zip'
                                        id={`event${index}`}
                                        value={events[index].zip}
                                        margin='normal'
                                        name={`zip`}
                                        onChange={this.handleChange(index)}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        <Button variant="contained" color="primary" className={classes.button} onClick={this.handleAddEvent}>
                            Add New Event
                            <AddIcon className={classes.rightIcon} />
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleDeleteEvent(index)}>
                            Delete
                            <DeleteIcon className={classes.rightIcon} />
                        </Button>
                        <Button variant="contained" color="default" className={classes.button} onClick={() => console.log(this.state)}>
                            Console
                        </Button>
                    </Paper>
                    </Grid>
                );
            })
            }
        </Grid>

        <Snackbar
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
            }}
            open={this.state.showModal}
            autoHideDuration={6000}
            onClose={this.handleClose}
            ContentProps={{
            'aria-describedby': 'message-id',
            }}
            
        >
            <SnackbarContent
                className={classes.success}  
                message={<span id="message-id"><CheckCircleIcon /> Events Updated!</span>}
                action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    className={classes.close}
                    onClick={this.handleClose}
                >
                    <CloseIcon />
                </IconButton>,
                ]}
            >
            </SnackbarContent>
        </Snackbar>

        </div>
    );
    }
}

// export default withStyles(styles)(ToDO);
const mapStateToProps = state => ({
    items: state.items
});
  
const mapDispatchToProps = dispatch => ({
    createItem: item => dispatch(ACTIONS.createItem(item)),
    deleteItem: id => dispatch(ACTIONS.deleteItem(id))
});
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Events));
