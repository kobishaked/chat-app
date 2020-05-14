import React, { useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom';
import './App.css';
// import Home from './Pages/home/Home';
import Chat from './pages/chat/Chat';
import Profile from './pages/profile/Profile';
import Signup from './pages/signup/Signup';
import Login from './pages/Signin/Signin';
import { toast, ToastContainer } from 'react-toastify'

function App() {


  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   firebase.auth().onAuthStateChange(user => {
  //     if (user) {
  //       setAuthenticated(true)
  //       setLoading(false)
  //     }
  //     else {
  //       setAuthenticated(false)
  //       setLoading(false)
  //     }
  //   })
  //what is these lines mean? for what uses?
  // return () => {
  //   cleanup
  // }
  // }, [])

  // showToast = (type, message) => {
  //   switch (type) {
  //     case 0:
  //       toast.warning(message)
  //       break;
  //     case 1:
  //       toast.success(message)
  //       break;
  //     default:
  //       break;
  //   }
  // }

  return (
    <>


      <Router>
        <Switch>
          <Route
            exact
            path="/"
            component={Login} />
          <Route
            exact
            path="/Signup"
            component={Signup} />
          <Route
            exact
            path="/chat"
            component={Chat} />

        </Switch>
      </Router>

      {/* {loading ?
        <div className="spinner-border text-succes" role='status'>
          <span className="sr-only">Loading...</span>
        </div>
        :
        <Router>
          <ToastContainer
            autoClose={2000}
            hideProgressBar={true}
            position={toast.POSITION.BOTTOM_CENTER}
          />
          <Switch>
            <Route exact path="/" render={props => <Home {...props} />} />
            <Route path="/login" />} />
            <Route path="/profile" render={props => <Profile showtost={showToast}{...props} />} />
            <Route path="/signup" render={props => <Signup showtost={showToast}{...props} />} />
            <Route path="/chat" render={props => <Chat showtost={showToast}{...props} />} />
          </Switch>
        </Router>
      } */}
    </>
  )
}

export default App