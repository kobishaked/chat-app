import React, { useState, useEffect } from 'react'
import LoginStrings from "../Signin/LoginStrings"
import { useHistory } from "react-router-dom";
import firebase from '../../services/firebase'
import { makeStyles } from '@material-ui/core/styles';
import './Chat.css';
import ReactLoading from 'react-loading';

export default function Chat() {
    const history = useHistory();
    const classes = useStyles();
    //consider adding the localstorage function to get all the user data, movie 7, 5:00
    const [currnetUserName, setCurrnetUserName] = useState(localStorage.getItem(LoginStrings.Name))
    const [currnetUserId, setCurrnetUserId] = useState(localStorage.getItem(LoginStrings.ID) )
    const [currnetUserPhoto, setCurrnetUserPhoto] = useState(localStorage.getItem(LoginStrings.PhotoURL))
    const [currnetUserDocumentId, setCurrnetUserDocumentId] = useState(localStorage.getItem(LoginStrings.FirebaseDocumentId))
    const [currnetUserMessages, setCurrnetUserMessages] = useState([])

    const [searchUsers, setSearchUsers] = useState([])  //all the users from the DB
    const [currentPeerUser, setCurrentPeerUser] = useState(null)
    // const [displayedContactSwitchedNotification, setDisplayedContactSwitchedNotification] = useState([])
    const [notificationMessagesErase, setNotificationMessagesErase] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [isOpenDialogConfirmLogout, setIsOpenDialogConfirmLogout] = useState(false)
    const [displayedContacts, setDisplayedContacts] = useState([])

    const [currentUserEmail, setCurrentUserEmail] = useState(true)
    const [currnetUserPassword, setcurrnetUserPassword] = useState(true)

    const [docId, setDocId] = useState()

    /**
     * do this when the component render:
     * send request to firebase to get throw all the messages object of each the user
     * and insert to CurrnetUserMessages the values. 
     * after that call the getListUser to get all the data users from the DB.
     */
    useEffect(async () => {
        const doc = await firebase.firestore().collection('users').doc(
            currnetUserDocumentId).get()
        doc.data().messages.map((item) => {
            setCurrnetUserMessages([...currnetUserMessages, {
                notificationIid: item.notificationIid,
                number: item.number
            }])
        })
        // setDisplayedContactSwitchedNotification([...currnetUserMessages])
        getListUser()
    }, [])

    function handleLogout() {
        firebase.auth().signOut()
        history.push('/');
        localStorage.clear()
    }

    function onProfileClick() {
        history.push('/profile');
    }

    /**
     * this functions send request to firebase to get all the users from the DB. 
     * check if there is at least 1 user in the database. if so, get the information
     * of each user into the SearchUsers state array. this array is array of 
     * objects. each object include the data of specific user.
     * at the end call the renderListUser to render the list on the screen
     */
    async function getListUser() {
        const result = await firebase.firestore().collection('users').get();
        if (result.docs.length > 0) {
            let listUsers = []
            listUsers = [...result.docs]
            listUsers.forEach((item, index) => {
                setSearchUsers([...searchUsers, {
                    key: index,
                    documentKey: item.id,
                    id: item.data().id,
                    name: item.data().name,
                    messages: item.data().messages,
                    URL: item.data().URL,
                    description: item.data().description
                }])
            })
            setIsLoading(false)
        }
        renderListUser()
    }

/**
 * this function check again if there is at least 1 user in the array that
 * we already initialized in the previews function call. if so, generate the 
 * viewListUser to be the jsx of the view in the screen. each item in the array
 * is a button the inside this button there are an image of the user, the name of
 * the specific user and an indicator of the notifications from this user to the current user.
 */
    function renderListUser() {            //render the list of the users (exept the current user)
        if (searchUsers > 0) {
            let viewListUser = []
            let classname = ''
            searchUsers.map((item => {
                if (item.id != currnetUserId) {
                    classname = getClassnameforUserandNotification(item.id)
                    viewListUser.push(
                        <button
                            id={item.key}
                            className={classname}
                             {/* 
                              when we click the button of the user we want the following to happen:
                              1. the view of the notification will vanish and the data in the DB
                              will change
                              2. 
                            */}
                            onClick={() => {
                                notificationErase(item.id)
                                setCurrentPeerUser(item)
                                document.getElementById(item.key).style.backgroundColor = '#fff'
                                document.getElementById(item.key).style.color= '#fff'
                            }}
                        >
                            <img
                                className='viewAvatarItem'
                                src={item.URL}
                                alt=''
                            />
                            <div className='viewWrapContentItem'>
                                <span className='textItem'>
                                    {`Name: ${item.name}`}
                             

                                </span>
                                   {/* 
                                   next lines will displayed only if the current user get 
                                   notifications from the specific user (we check this in the 
                                    getClassnameforUserandNotification function)
                                */}
                            </div>
                            {classname === 'viewWrapItemNotificaion'?
                            <div classname = 'notificationparagraph'>
                                <p id={item.key} className='newmessages'> New messages</p>
                            </div>:null}
                        </button>
                    )
                }
            }))
            setDisplayedContacts([...viewListUser])
        }
        else{
            console.log('no user is present')
        }
    }

   /**
    * this function resposible to return the className that fit to the specific itemId
    * of the list dependign if this specific user sent messages to the current user.
    */
    function getClassnameforUserandNotification(itemId) {
        let number = 0
        let className = ''
        let check = false;
        //check what is than mean: currentPeerUser 
        if (currentPeerUser && currentPeerUser.id == itemId) {
            className = 'viewWrapItemFocused'
        }
        else {
            currnetUserMessages.forEach((item) => {
                if (item.notificationId.length > 0) {
                    if (item.notificationId === itemId) {
                        check = true;
                        number = item.number;
                    }
                }
            })   
            if (check === true) {
                className = 'viewWrapItemFocused'
            }
            else {
                className = 'viewWrapItem'
            }
        }
        return className
    }

/**
 * this  function 
 */
    function notificationErase (itemId) {
        currnetUserMessages.forEach((el) => {
            if (el.notificationIid.length > 0){
                if (el.notificationIid != itemId){
                    setNotificationMessagesErase([...notificationMessagesErase, {
                        notificationIid: el.notificationIid,
                        number: el.number
                    }]) 
                }
            }
        })
        updateRenderList()
    }

    function updateRenderList () {
        firebase.firestore().collection('users').doc(currnetUserDocumentId).update(
            {messages: notificationMessagesErase}
        )
        setDisplayedContactSwitchedNotification(notificationMessagesErase)

    }


    return (
        <div classes='root'>
            <div className='body'>
                <div className='viewListUser'>
                    <div className='profileviewleftside'>
                        <img
                            className='profilePicture'
                            alt=''
                            src={currnetUserPhoto}
                            onClick={onProfileClick}
                        />
                        <button className='Logout' onClick={handleLogout} ></button>
                    </div>
                        {displayedContacts}
                </div>

            </div>

        </div>
    )
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
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));





/* questions:
1. should i use local variables or all the variables should be states? */