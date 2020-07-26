import React, { useState, useRef } from 'react'
import './Profile.css'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../services/firebase'
import Images from '../../projectImages/projectImages'
import ReactLoading from 'react-loading'
import { useHistory } from "react-router-dom";
import LoginStrings from "../Signin/LoginStrings";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';


export default function Profile() {
    const history = useHistory();
    const inputEl = useRef(null)
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false)
    const [documentKey, setDocumentKey] = useState(localStorage.getItem(LoginStrings.FirebaseDocumentId))
    const [id, setId] = useState(localStorage.getItem(LoginStrings.ID))
    const [name, setName] = useState(localStorage.getItem(LoginStrings.Name))
    const [aboutMe, setAboutMe] = useState(localStorage.getItem(LoginStrings.Description))
    const [photoURL, setPhotoUrl] = useState(localStorage.getItem(LoginStrings.PhotoURL))
    const [newPhoto, setNewPhoto] = useState(null)

    function onChangeAvatar(e) {
        if (e.target.files && e.target.files[0]) {
            const prefixFiletype = e.target.files[0].type.toString()
            if (prefixFiletype.indexOf(LoginStrings.PREFIX_IMAGE) !== 0) {
                console.log('this file is not an image')
                return
            }
            setNewPhoto(e.target.files[0])
            setPhotoUrl(URL.createObjectURL(e.target.files[0]))
        }
        else {
            console.log('something wrong with input file')
        }
    }

    function updateProfile() {
        setIsLoading(true)
        if (newPhoto) {
            const uploadTask = firebase.storage().ref(id).put(newPhoto);
            uploadTask.on(
                "state_changed",
                snapshot => { },
                err => {
                    console.log(err)
                },
                () => {
                    firebase.storage().ref(id).getDownloadURL().then(url => {
                        console.log(url)
                        updateUserInfo(true, url)
                    })
                }
            )
        }
        else {
            updateUserInfo(false, null)
        }
    }

    async function updateUserInfo(isUpdatedPhotoURL, downloadURL) {
        let newinfo = {
            name,
            description: aboutMe
        }
        if (isUpdatedPhotoURL) {
            newinfo = { ...newinfo, URL: downloadURL }
        }
        const data = await firebase.firestore().collection('users').doc(documentKey).update(newinfo)
        localStorage.setItem(LoginStrings.Name, name)
        setName(name)
        localStorage.setItem(LoginStrings.Description, aboutMe)
        setAboutMe(aboutMe)
        if (newPhoto) {
            localStorage.setItem(LoginStrings.PhotoURL, downloadURL)
        }
        setIsLoading(false)
        // add success message
    }

    function updateName(e) {
        setName(e.target.value)
    }

    function updateDescription(e) {
        setAboutMe(e.target.value)
    }

    function backToChat() {
        history.push('/chat');
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>

                <img className='avatar' alt='' src={photoURL}></img>
                <div className='viewWrapInputFile'>
                    <img
                        className='imgInputFile'
                        alt='icon gallery'
                        src={Images.addPicImage}
                        onClick={() => { inputEl.current.click() }}
                    >

                    </img>
                    <input
                        ref={inputEl}
                        accept='image/*'
                        className='viewInputFile'
                        type='file'
                        onChange={onChangeAvatar}
                    />
                </div>

                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        value={name ? name : ''}
                        fullWidth
                        id="Name"
                        label="Name"
                        name="Name"
                        autoComplete="Name"
                        autoFocus
                        placeholder='your nickname...'
                        onChange={updateName}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={aboutMe ? aboutMe : ''}
                        name="description"
                        label="About Me"
                        type="description"
                        id="description"
                        placeholder='Tell about yourself...'
                        onChange={updateDescription}
                    />
                    <div className="btn-group">

                        <Button

                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.save}
                            onClick={backToChat}
                        >
                            Back
              </Button>

                        <Button

                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.back}
                            onClick={updateProfile}
                        >
                            Save
              </Button>

                    </div>
                    {isLoading ? (
                        <div>
                            <ReactLoading
                                type={'spin'}
                                color={'#203152'}
                                height={'3%'}
                                width={'3%'}
                            />
                        </div>
                    ) : null}


                </form>
            </div>

        </Container>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    back: {
        background: '#1abc9c',
        margin: theme.spacing(3, 6, 2),
        maxWidth: '100px',
        alignItems: 'center',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#16a085',
        }
    },
    save: {
        background: '#e74c3c',
        margin: theme.spacing(3, 6, 2),
        maxWidth: '100px',
        alignItems: 'center',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#c0392b',
        }
    }
}));


/**
 * firestore is use for regular DB (no sql) that composed of collections and docs. here we can use commands as same as any other DB.
 * like, add, update (update a specific feild in a doc), set (override the whole doc), delete
 * firebase storage is use for storing data like images, audios, videos etc... (https://www.youtube.com/watch?v=SpxHVrpfGgU)
 **/



