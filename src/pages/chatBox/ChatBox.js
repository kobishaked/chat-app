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
    // const [currentPeerUser, setCurrentPeerUser] = useState(props.currentPeerUser)
    const [inputValue, setInputValue] = useState(null)
    // const [groupChatId, setGroupChatId] = useState(null)
    const [currentPeerUserMessages, setCurrentPeerUserMessages] = useState(null)
    // const [removeListener, setRemoveListener] = useState(null)
    const [currentPhotoFile, setCurrentPhotoFile] = useState(null)
    const [listMessage, setListMessage] = useState([])
    

    const currentPeerUser = useRef(props.currentPeerUser)
    // const listMessage = useRef([])
    const groupChatId = useRef("")
    const removeListener = useRef(null)
    const refInput = useRef(null)
    const messagesEnd = useRef(null)


    useEffect(() => {
        // getListHistory()
        scrollToBottom();
    });

    useEffect(() => {
        getListHistory()
        return () => {
            if (removeListener.current) {
                removeListener.current()
            }
        }
    }, []);

    useEffect(() => {
        // setCurrentPeerUser(props.currentPeerUser)
        currentPeerUser.current = props.currentPeerUser
        setListMessage([])
        getListHistory()

        //these purpose lines is to get the message object of the "peer user" that we
        //want to chat with (who we click on) 
        firebase.firestore().collection('users').doc(currentPeerUser.current.documentKey).get()
            .then((docRef) => {
                setCurrentPeerUserMessages(docRef.data().messages)
            })

    }, [props.currentPeerUser]);


    function getListHistory() {
        if (removeListener.current) {
            removeListener.current()
        }
        setIsLoading(true)
        getChatId()
        // groupChatId.current = currnetUserId + currentPeerUser.id
        // if (hashString(currnetUserId) <= hashString(currentPeerUser.id)) {
        //     groupChatId.current = `${groupChatId.current} - ${currentPeerUser.id}`
        // }
        // else {
        //     groupChatId.current = `${currentPeerUser.id} - ${groupChatId.current}`
        // }
        //get history and listen to new data added
        removeListener.current = firebase.firestore().collection('Messages').doc(groupChatId.current)
            .collection(groupChatId.current).onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === LoginStrings.DOC) {
                        listMessage.push(change.doc.data())
                        setListMessage([...listMessage])
                    }
                })
                
                setIsLoading(false)
            },
                err => {
                    console.log(err)
                }
            )

    }

    function getChatId() {
        for (let i = 0; i < currnetUserId.length; i++) {
            if (currnetUserId[i] > currentPeerUser.current.id[i]) {
                groupChatId.current = currnetUserId + currentPeerUser.current.id
                break;
            }
            else if (currnetUserId[i] < currentPeerUser.current.id[i]) {
                groupChatId.current = currentPeerUser.current.id + currnetUserId
                break;
            }
        }
    }


    function onChangePicture(e) {
        if (e.target.files && e.target.files[0]) {
            const prefixFiletype = e.target.files[0].type.toString()
            if (prefixFiletype.indexOf(LoginStrings.PREFIX_IMAGE) !== 0) {
                console.log('this file is not an image')
                return
            }
            // updateProfile(e.target.files[0])
            // setNewPhoto(e.target.files[0])
            // setPhotoUrl(URL.createObjectURL(e.target.files[0]))
            setIsLoading(true)
            const timestamp = moment().valueOf().toString()
            const uploadTask = firebase.storage().ref(timestamp).put(e.target.files[0]);
            uploadTask.on(
                "state_changed",
                snapshot => { },
                err => {
                    console.log(err)
                },
                () => {
                    firebase.storage().ref(timestamp).getDownloadURL().then(url => {
                        onSendMessage(url, 1)
                        // console.log(url)
                        // updateUserInfo(true, url)
                    })
                }
            )

        }
        else {
            console.log('something wrong with input file')
        }
    }


    // function updateProfile(picture) {
       
    // }





    function messageContentChange(e) {
        setInputValue(e.target.value)
    }

 

    function messageContentChange(e) {
        setInputValue(e.target.value)

    }

    function onKeyPress(e) {
        if (e.key === 'Enter') {
            onSendMessage(inputValue, 0)
        }
    }

    function scrollToBottom() {
        if (messagesEnd.current) {
            messagesEnd.current.scrollIntoView({})
        }
    }

    function onSendMessage(content, type) {
        let notificationMessages = []
        //checking if the content is empty, if so, dont do nothing
        if (type === 0) {
            if (content.trim() === '') {
                return
            }
        }
        const timestamp = moment().valueOf().toString()
        const itemMessage = {
            idFrom: currnetUserId,
            idTo: currentPeerUser.current.id,
            timestamp: timestamp,
            content: content,
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
        firebase.firestore().collection('users').doc(currentPeerUser.current.documentKey)
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


    function renderListMessage() {
        if (listMessage.length > 0) {
            let viewListMessage = []
            listMessage.forEach((item, index) => {
                //the message belong to the current user
                if (item.idFrom === currnetUserId) {
                    //text message
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className='viewItemRight' key={item.timestamp}>
                                <span className='textContentItem'>{item.content}</span>
                            </div>
                        )
                    }
                    //picture message
                    else {
                        viewListMessage.push(
                            <div className='viewItemRight2' key={item.timestamp}>
                                <img
                                    className='imgItemRight'
                                    src={item.content}
                                    alt=''
                                />
                            </div>
                        )
                    }
                }
                //the message belong to the peer user
                else {
                    //text message
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className='viewWrapItemLeft' key={item.timestamp}>
                                <div className='viewWrapItemLeft3'>
                                    {isLastMessageLeft(index) ? (
                                        <img
                                            src={currentPeerUser.current.URL}
                                            alt='avatar'
                                            className='peerAvatarLeft'
                                        />
                                    ) : (
                                            <div className='viewPaddingLeft' />
                                        )}
                                    <div className='viewItemLeft'>
                                        <span className='textContentItem'>{item.content}</span>
                                    </div>
                                </div>
                                {isLastMessageLeft(index) ? (
                                    <span className='textTimeLeft'>
                                        <div className='time'>
                                            {moment(Number(item.timestamp)).format('ll')}
                                        </div>
                                    </span>
                                ) : null}
                            </div>
                        )
                        //picture message
                    } else {
                        viewListMessage.push(
                            <div className='viewWrapItemLeft2' key={item.timestamp}>
                                <div className='viewWrapItemLeft3'>
                                    {isLastMessageLeft(index) ? (
                                        <img
                                            src={currentPeerUser.current.URL}
                                            alt='avatar'
                                            className='peerAvatarLeft'
                                        />
                                    ) : (
                                            <div className='viewPaddingLeft' />
                                        )}
                                    <div className='viewItemLeft'>
                                        <img
                                            src={item.content}
                                            alt='content message'
                                            className='imgItemLeft'
                                        />
                                    </div>
                                </div>
                                {isLastMessageLeft(index) ? (
                                    <span className='textTimeLeft'>
                                        <div className='time'>
                                            {moment(Number(item.timestamp)).format('ll')}
                                        </div>
                                    </span>
                                ) : null}
                            </div>
                        )
                    }
                }
            })
            return viewListMessage
        }
    }


    function isLastMessageLeft(index) {
        if ((index + 1 < listMessage.length && listMessage[index + 1].idFrom === currnetUserId) ||
            index === listMessage.length - 1) {
            return true
        }
        else {
            return false
        }
    }

    function isLastMessageRight(index) {
        if ((index + 1 < listMessage.length && listMessage[index + 1].idFrom !== currnetUserId) ||
            index === listMessage.length - 1) {
            return true
        }
        else {
            return false
        }
    }


    return (
        <>
            <Card className='viewChatBoard'>
                <div className='headerChatBoard'>
                    <img
                        className='viewAvatarItem'
                        src={currentPeerUser.current.URL}
                        alt=''
                    />
                    <span className='textHeaderChatBoard'>
                        <p style={{ fontSize: '20px' }}>{currentPeerUser.current.name}</p>
                    </span>
                    <div className='aboutme'>
                        <span>
                            <p>{currentPeerUser.current.description}</p>
                        </span>
                    </div>
                </div>

                <div className="viewListContentChat">
                    {renderListMessage()}
                    <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={messagesEnd}
                    ></div>
                </div>


                <div className='viewBottom'>
                    <img
                        className='icOpenGallery'
                        src={Images.inputFile}
                        alt='input-file'
                        onClick={() => { refInput.current.click() }}
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
                onChange={onChangePicture}
            />

        </>
    )
}



/**
 * questions:
 * 1. when should i use states vs local variables using useRef?
 *
 */