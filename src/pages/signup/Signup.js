import React, { useState, useEffect, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LoginStrings from '../Signin/LoginStrings'
import firebase from '../../services/firebase'
import { useHistory } from "react-router-dom";
import Images from '../../projectImages/projectImages'

export default function SignUp() {
    const history = useHistory();
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
        name: ""
    })
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [name, setName] = useState("");
    // const [error, setError] = useState(null);
    const classes = useStyles();


    function handleChange(e) {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const authRes = await firebase.auth().createUserWithEmailAndPassword(
            userDetails.email, userDetails.password)
            const docRef = await firebase.firestore().collection('users').add({
                name: userDetails.name,
                id: authRes.user.uid,
                email: userDetails.email,
                password: userDetails.password,
                URL: Images.anknownPerson,
                description: '',
                messages: [{ notificationId: "", number: 0 }]
            })
            localStorage.setItem(LoginStrings.ID, authRes.user.uid);
            localStorage.setItem(LoginStrings.Name, userDetails.name);
            localStorage.setItem(LoginStrings.Email, userDetails.email);
            localStorage.setItem(LoginStrings.Password, userDetails.password);
            localStorage.setItem(LoginStrings.PhotoURL, Images.anknownPerson);
            localStorage.setItem(LoginStrings.UPLOAD_CHANGED, 'state_changed');
            localStorage.setItem(LoginStrings.Description, "");
            localStorage.setItem(LoginStrings.FirebaseDocumentId, docRef.id);
            setUserDetails({ ...userDetails, name: "", email: "", password: "" })
            history.push("/chat");
        }
        catch (error) {
            console.error("Error in signup please try again", error)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
        </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="Nickname"
                                autoFocus
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                helperText="example: abc@gmail.com"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                                helperText="password have to be at least 6 characters"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        Sign Up
          </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/" href="/" variant="body2">
                                Already have an account? Sign in
              </Link>
                        </Grid>
                    </Grid>
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));





/* questions:
    1.  the onSubmit property in the submit botton didnt work so i switched it to 
        onClick. why did it not work?
    2.  


*/






// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import './Signup.css';
// import firebase from '../../services/firebase.js';
// import { Card } from 'react-bootstrap'
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Typography';
// import Avatar from '@material-ui/core/Avatar';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';

// export default function Signup() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [name, setName] = useState("");
//     const [error, setError] = useState(null);






//     function hundleSubmit() {

//     }

//     function hundleChange(e) {
//         e.target.name === 'email' && setEmail(e.target.value);
//         e.target.name === 'password' && setPassword(e.target.value);
//         e.target.name === 'name' && setName(e.target.value);
//     }



//     return (
//         <>

//             <CssBaseline />

//             <Card className="formacontrooutside">
//                 <Avatar >
//                     <LockOutlinedIcon />
//                 </Avatar>
//                 <Typography component="h1" variant="h5">
//                     Sign up
//                 </Typography>
//                 <form className='customform' noValidate onSubmit={hundleSubmit}>

//                     <TextField
//                         variant='outlined'
//                         margin='normal'
//                         required
//                         fullWidth
//                         id='name'
//                         label='nickname'
//                         name='name'
//                         autoComplete='name'
//                         autoFocus
//                         onChange={hundleChange}
//                         value={name}
//                     />

//                     <TextField
//                         variant='outlined'
//                         margin='normal'
//                         required
//                         fullWidth
//                         id='email'
//                         label='Email Address'
//                         name='email'
//                         autoComplete='email'

//                         onChange={hundleChange}
//                         value={email}
//                         helperText="example: abc@gmail.com"
//                     />

//                     <TextField
//                         variant='outlined'
//                         margin='normal'
//                         required
//                         fullWidth
//                         id='password'
//                         label='Password'
//                         name='password'
//                         type='password'
//                         autoComplete='current-password'

//                         onChange={hundleChange}
//                         value={password}
//                         helperText="password have to be at least 6 characters"
//                     />

//                     <Button
//                         type="submit"
//                         fullWidth
//                         variant="contained"
//                         color="primary"
//                     >
//                         Sign Up
//                     </Button>

//                     <Grid container justify="flex-end">
//                         <Grid item>
//                             <Link  to="/" variant="body2"> Already have an account? Sign in</Link>
//                         </Grid>
//                     </Grid>
//                     {/* <Link href="#" variant="body2">
//                         Already have an account? Sign in
//                      </Link> */}


//                 </form>
//             </Card>


//         </>
//     )
// }










