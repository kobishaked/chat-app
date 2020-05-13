import React, { useState, useEffect, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';



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
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {

    const [userDetails, setUserDetails] = useState({
        email: "",
        password: ""
    })


    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");

    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const classes = useStyles();

    function handleChange (e) {
        setUserDetails({...userDetails, [e.target.name]: e.target.value})
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
        </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
          </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                            
              </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/Signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
       
        </Container>
    );
}




// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import './Login.css';
// import firebase from '../../services/firebase.js';
// import { Card } from 'react-bootstrap'
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Typography';
// import Avatar from '@material-ui/core/Avatar';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import Button from '@material-ui/core/Button';

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
//             <Avatar >
//                 <LockOutlinedIcon />
//             </Avatar>
//             <Typography component="h1" variant="h5">
//                 Sign up
//         </Typography>
//                 <form className='customform' noValidate onSubmit={hundleSubmit}>
//                     <TextField
//                         variant='outlined'
//                         margin='normal'
//                         required
//                         fullWidth
//                         id='email'
//                         label='Email Address. example: abc@gmail.com'
//                         name='email'
//                         autoComplete='email'
//                         autoFocus
//                         onChange={hundleChange}
//                         value={email}
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
//                         Login
//                     </Button>
//                   <Link  to="/Signup"> Don't have an account? Sign Up</Link>
//                      {/* <Link href="#" variant="body2">
//                      Don't have an account? Sign Up
//                      </Link> */}


//                 </form>
//             </Card>

//         </>
//     )
// }