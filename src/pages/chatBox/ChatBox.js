import React, { useState, useEffect, useRef } from 'react'
import { Card } from 'react-bootstrap'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../services/firebase'
import Images from '../../projectImages/projectImages'
import moment from 'moment'
import './ChatBox.css'
import LoginStrings from '../Signin/LoginStrings'
import 'bootstrap/dist/css/bootstrap.min.css'
import { firestore } from 'firebase'


export default function ChatBox(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [currnetUserName, setCurrnetUserName] = useState(localStorage.getItem(LoginStrings.Name))
    const [currnetUserId, setCurrnetUserId] = useState(localStorage.getItem(LoginStrings.ID))
    const [currnetUserPhoto, setCurrnetUserPhoto] = useState(localStorage.getItem(LoginStrings.PhotoURL))
    const [currnetUserDocumentId, setCurrnetUserDocumentId] = useState(localStorage.getItem(LoginStrings.FirebaseDocumentId))
    const [currentPeerUser, setCurrentPeerUser] = useState(props.currentPeerUser)
    const [inputValue, setInputValue] = useState(null)
    // const [groupChatId, setGroupChatId] = useState(null)
    const [currentPeerUserMessages, setCurrentPeerUserMessages] = useState(null)
    // const [removeListener, setRemoveListener] = useState(null)
    const [currentPhotoFile, setCurrentPhotoFile] = useState(null)
    // const [listMessage, setListMessage] = useState([])

    const listMessage = useRef([])
    const groupChatId = useRef()
    const removeListener = useRef()
    const refInput = useRef(null)
    

    // useEffect(() => {
    //     scrollToBottom();
    // }
    // );

    useEffect(() => {
        setCurrentPeerUser(props.currentPeerUser)
        getListHistory()

        //these purpose lines is to get the message object of the "peer user" that we
        //want to chat with (who we click on) 
        firebase.firestore().collection('users').doc(currentPeerUser.documentKey).get()
            .then((docRef) => {
                setCurrentPeerUserMessages(docRef.data().messages)
            })

    }, [props.currentPeerUser]);


    function getListHistory() {
        setIsLoading(true)
        if (hashString(currnetUserId) <= hashString(currentPeerUser.id)) {
            groupChatId.current = `${groupChatId.current} - ${currentPeerUser.id}`
        }
        else {
            groupChatId.current = `${currentPeerUser.id} - ${groupChatId.current}`
        }
        //get history and listen to new data added
        removeListener.current = firebase.firestore().collection('Messages').doc(groupChatId.current)
        .collection(groupChatId.current).onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === LoginStrings.DOC){
                    listMessage.current.push(change.doc.data())
                }
            })
            setIsLoading(false)
        },
        err => {
            console.log(err)
        }
        )

    }



    function messageContentChange(e) {
        setInputValue(e.target.value)
    }

    function onChoosePhoto() {

    }

    function messageContentChange(e) {
        setInputValue(e.target.value)

    }

    function onKeyPress(e) {
        if (e.key === 'Enter') {
            onSendMessage(inputValue, 0)
        }
    }

    // function scrollToBottom() {
    //     if (messagesEnd) {
    //         messagesEnd.scrollIntoView({})
    //     }
    // }

    function onSendMessage(content, type) {
        let notificationMessages = []
        //checking if the content is empty, if so, dont do nothing
        if (content.trim() === '') {
            return
        }
        const timestamp = moment().valueOf().toString()
        const itemMessage = {
            idFrom: currnetUserId,
            idTo: currentPeerUser,
            timestamp: timestamp,
            content: content.trim(),
            type: type
        }
        //store the message object (itemMessage) in a new collection called Messages
        firebase.firestore().collection('Messages').doc(groupChatId.current)
            .collection(groupChatId.current).doc(timestamp).set(itemMessage).then(() => {
                setInputValue('')
            })
        //update the peer user messages object (for notification purpose)
        //inside the users collection
        currentPeerUserMessages.map(item => {
            if (item.notificationId = !currnetUserId) {
                notificationMessages.push(
                    {
                        notificationId: item.notificationId,
                        number: item.number
                    }
                )
            }
        })
        // console.log(currentPeerUser.documentKey)
        firebase.firestore().collection('users').doc(currentPeerUser.documentKey)
            .update({
                messages: notificationMessages,
            })
            .then((date => { }))
            .catch(err => {
                console.log(err)
            })
    }


    function hashString(str) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash //convert to 32bit integer
        }
        return hash
    }



    return (
        <>
            <Card className='viewChatBoard'>
                <div className='headerChatBoard'>
                    <img
                        className='viewAvatarItem'
                        src={currentPeerUser.URL}
                        alt=''
                    />
                    <span className='textHeaderChatBoard'>
                        <p style={{ fontSize: '20px' }}>{currentPeerUser.name}</p>
                    </span>
                    <div className='aboutme'>
                        <span>
                            <p>{currentPeerUser.description}</p>
                        </span>
                    </div>
                </div>

                <div className="viewListContentChat">
                    {}
                    <div
                        style={{ float: 'left', clear: 'both' }}></div>
                    {/* ref={el => { */}
                </div>


                <div className='viewBottom'>
                    <img
                        className='icOpenGallery'
                        src={Images.inputFile}
                        alt='input-file'
                        onClick={() => { refInput.current.click() }}
                    />
                    <img
                        className='viewInputGallery'
                        accept='images/*'
                        type='file'
                        onChange={onChoosePhoto}
                    />
                    <input
                        className='viewInput'
                        placeholder='type a message...'
                        value={inputValue}
                        onChange={messageContentChange}
                        onKeyPress={onKeyPress}
                    />
                    <img
                        className='icSend'
                        src={Images.send}
                        alt='icon send'
                        onClick={() => { onSendMessage(inputValue, 0) }}
                    />
                </div>
                {isLoading ? (
                    <div className='viewLoading'>
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null}
            </Card>
            <input
                ref={refInput}
                accept='image/*'
                className='viewInputFile'
                type='file'
                // onChange={onChangeAvatar}
            />

        </>
    )
}



/**
 * questions:
 * 1. when should i use states vs local variables using useRef?
 *
 */