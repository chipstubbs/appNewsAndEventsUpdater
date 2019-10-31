import React, { Component } from "react";
import {
  withStyles,
  Paper,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Grid,
  TextField,
  Button,
  FormControl,
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';
// import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import _ from 'lodash';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import ACTIONS from '../modules/action';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 20
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // backgroundColor: '#d0d9e8'
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`
  },
  success: {
    backgroundColor: green[600],
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

const firebaseConfig = {
    apiKey: "AIzaSyAUKLfhOXIVjZ6SSbTfbndZSF-LVM2Cs3o",
    authDomain: "one-time-password-eb048.firebaseapp.com",
    databaseURL: "https://one-time-password-eb048.firebaseio.com",
    projectId: "one-time-password-eb048",
    storageBucket: "one-time-password-eb048.appspot.com",
    messagingSenderId: "740624365426",
    appId: "1:740624365426:web:6a3cf9316fdf8be5"
};

firebase.initializeApp(firebaseConfig);

class ToDO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: 'Test',
            showNewsletter: false,
            sections: [
                { title: '', paragraphs: [
                    ''
                ] }
            ],
            newSources: '',
            newDate: '',
            currentText: '',
            showModal: false
        }

    }

    componentDidMount() {
        try {
            firebase.auth().signInAnonymously();
            const db = firebase.database();
            const dbRef = db.ref('newsletter');
            dbRef.on('value', snapshot => {
                let newsletterDate = snapshot.child('date').val();
                let newsletterContent = snapshot.child('sections').val();
                let sources = snapshot.child('sources').val();
                console.log(`newsletterdate = ${newsletterDate} and content = ${newsletterContent} and sources = ${sources}`);
                // this.setState({ newsletterDate: newsletterDate, newsletterContent, sources: sources });
                this.setState({ newDate: newsletterDate, sections: newsletterContent, newSources: sources });
            });
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
  
    generate = () => {
        // console.log(`Show newsletter`);
        // console.log(this.props);
        // console.log(this.state);
        
        return this.props.items.map(item => (
        <ListItem key={item.id}>
            <ListItemText primary={item.description} />
            <ListItemSecondaryAction>
            <IconButton
                aria-label="Delete"
                onClick={this.handleDelete}
                value={item.id}
            >
                <DeleteIcon />
            </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
        ));
    };

    // showNewsletter = () => {
    //     const { newsletterDate, newsletterContent, sources } = this.state;
    //     return (
    //         <div className='newsletter'>
    //             <h3>{newsletterDate}</h3>
    //             {
    //             _.map(newsletterContent, (section, index) => {
    //                 let title = section.title;
    //                 let pArray = section.paragraphs;
    //                 return (
    //                     <div className='section' key={index}>
    //                         <h4>{title}</h4>
    //                         {
    //                         pArray.map((p, i) => {
    //                             return (<p key={i}>{p}</p>)
    //                         })
    //                         }
    //                     </div>
    //                 );
    //             })
    //             }
    //             <p className='sources'>{sources}</p>
    //         </div>
    //     );
    // }

//   handleSubmit = event => {
//     // console.log(this.state.item);
//     this.setState({ item: "" });
//     if (this.state.item !== "") {
//       // add the item to the store
//       this.props.createItem(this.state.item);
//     }
//     event.preventDefault();
//   };

  handleDelete = event => {
    // delete the item from the store
    this.props.deleteItem(event.target.value);
  };

//   handleChange = event => {
//     this.setState({
//       [event.target.name]: event.target.value
//     });
//   };

  addSection = (e) => {
    this.setState((prevState) => ({
        sections: [...prevState.sections, {title:'', paragraphs: [ '' ] }],
    }));
  }

  handleSectionChange = (i) => (event) => {
    event.persist();
    // let id = event.target.id;
    let value = event.target.value;
    // console.log(`this is i ${i} and this is event`);
    // console.log(event);
    
    this.setState(prevState => {
        const sections = prevState.sections.map((section, j) => {
            if (i === j) {
                // console.log('this is correct section', section);
                // console.log(`i is ${i} and j is ${j}`);
                return { title: value, paragraphs: [...prevState.sections[i].paragraphs] }
            } else { return section }
            
        });
        return {
            sections
        }
    });
  }

  addParagraph = (index) => (e) => {
      
    this.setState((prevState) => {
        const sections = prevState.sections.map((section, j) => {
            if (index === j) {
                // Return the same exact thing that is there... but add a new empty string in paragraph array 
                return { title: section.title, paragraphs: [...prevState.sections[index].paragraphs, ""] }
            } else { return section }
            
        });
        return {
            sections
        }
        
    });
  }

  handleParagraphChange = (i,j) => (event) => {
    event.persist();
    let sectionIndex = i;
    let pIndex = j;
    let value = event.target.value;
    
    this.setState(prevState => {
        // const p = prevState.sections[sectionIndex].paragraphs[pIndex]
        let tempPara = [...prevState.sections[sectionIndex].paragraphs];
        tempPara[pIndex] = value;
        // console.log(paragraphs);
        return {
            ...prevState.sections[sectionIndex].paragraphs = tempPara
        }
    });
  }

  handleChange = event => {
      event.persist();
      let value = event.target.value;
      let stateName = event.target.name;
      this.setState({
        [stateName]: value
      });
  }

  updateNews = async () => {
    const { newDate, sections, newSources } = this.state;
    const db = firebase.database();
    const dbRef = db.ref('newsletter/');
    let updates = {};
    updates['date'] = newDate;
    updates['sections'] = sections;
    updates['sources'] = newSources;
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

    sectionDelete = (sectionIndex) => (event) => {
        this.setState(prevState => {
            let sections = [...prevState.sections];
            sections = sections.filter(function(value, index, arr){

                return index !== sectionIndex;
            
            });
            return { sections };
        });
    }

    paragraphDelete = (sectionIndex, paraIndex) => (event) => {
        this.setState(prevState => {
            let paragraphs = [...prevState.sections[sectionIndex].paragraphs];
            paragraphs = paragraphs.filter(function(value, index, arr){

                return index !== paraIndex;
            
            });
            return { ...prevState.sections[sectionIndex].paragraphs = paragraphs };
        });
    }

  render() {
    const { classes } = this.props;
    const { showNewsletter, sections } = this.state;

    return (
      <div>
        <div className={classes.root}>
          <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
            <Grid container spacing={4}>
                <Grid item xs={2}>
                    <Button variant="contained" color="default" onClick={this.addSection}>
                        <AddIcon /> Add Section
                    </Button>
                    <Button variant="contained" color="default" onClick={() => console.log(this.state)}>Console State</Button>
                    <Button variant="contained" color="primary" onClick={this.updateNews}>
                        <CloudUploadIcon /> Upload New Newsletter
                    </Button>
                    {
                    /*
                    <Button variant="contained" color="default" onClick={() => this.setState({ showNewsletter: !this.state.showNewsletter })}>
                        <LibraryBooksIcon /> Current Newsletter
                    </Button>
                    */    
                    }
                </Grid>
                <Grid item xs={10}>
                    <Paper className={classes.paper} elevation={10}>
                        <div className="section">
                            <FormControl className="dateField">
                                <TextField
                                    label='Newsletter Date'
                                    id='newsletterDate'
                                    value={this.state.newDate}
                                    margin='normal'
                                    name='newDate'
                                    onChange={this.handleChange}
                                />
                            </FormControl>
                        </div>
                        {
                        sections.map((section, i) => {
                            return (
                            <div className="section" key={i}>
                                <FormControl key={i}>
                                    <TextField
                                        label={`Section ${i+1} Title`}
                                        id={`section${i}`}
                                        value={this.state.sections[i].title}
                                        className={`sectionTitle`}
                                        margin='dense'
                                        name={`section${i}`}
                                        onChange={this.handleSectionChange(i)}
                                    />
                                </FormControl>
                                {
                                    section.paragraphs.map((para, j) => {
                                        return (
                                            <FormControl  key={j}>
                                                <TextField
                                                    label={`Section ${i+1} Paragraph`}
                                                    id={`section${i}paragraph${j}`}
                                                    value={this.state.sections[i].paragraphs[j]}
                                                    className={`sectionParagraph`}
                                                    margin='dense'
                                                    multiline
                                                    name={`section${i}paragraph${j}`}
                                                    onChange={this.handleParagraphChange(i,j)}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <IconButton
                                                                    key="close"
                                                                    aria-label="close"
                                                                    color="inherit"
                                                                className={classes.close}
                                                                onClick={this.paragraphDelete(i,j)}
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                        ),
                                                    }}
                                                />
                                                
                                            </FormControl>
                                        );                                
                                    })
                                }
                                <Button variant="contained" color="default" onClick={this.addParagraph(i)}> <AddIcon /> Add Paragraph</Button>
                                <Button variant="contained" color="secondary" onClick={this.sectionDelete(i)}> <CloseIcon /> Delete This Section</Button>
                            </div>
                            );
                        })
                        }
                        <div className="section">
                            <FormControl>
                                <TextField
                                    label='Sources'
                                    id='sources'
                                    value={this.state.newSources}
                                    margin='normal'
                                    name='newSources'
                                    onChange={this.handleChange}
                                />
                            </FormControl>
                        </div>
                        <Button variant="contained" size="large" color="primary" onClick={this.updateNews}>
                            <CloudUploadIcon style={{ paddingRight: 10 }} />  Upload New Newsletter
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            {/* Submit */}
            
          </form>

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
        <Grid container spacing={0} direction="row" alignItems="center" justify="center" style={{ minHeight: '10vh' }}>
            
            <Grid item xs={9}>
                <div className={classes.demo}>
                    {/*<List dense={false}>{this.generate()}</List>*/}
                    {/* showNewsletter && this.showNewsletter() */}
                </div>
            </Grid>
            
          </Grid>
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
)(withStyles(styles)(ToDO));
