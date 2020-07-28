import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../services/firebase'
import Images from '../../projectImages/projectImages'
import moment from 'react-moment'
import './ChatBox.css'
import LoginStrings from '../Signin/LoginStrings'
import 'bootstrap/dist/css/bootstrap.min.css'


export default function ChatBox(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [currnetUserName, setCurrnetUserName] = useState(localStorage.getItem(LoginStrings.Name))
    const [currnetUserId, setCurrnetUserId] = useState(localStorage.getItem(LoginStrings.ID))
    const [currnetUserPhoto, setCurrnetUserPhoto] = useState(localStorage.getItem(LoginStrings.PhotoURL))
    const [currnetUserDocumentId, setCurrnetUserDocumentId] = useState(localStorage.getItem(LoginStrings.FirebaseDocumentId))
    const [currentPeerUser, setCurrentPeerUser] = useState(props.currentPeerUser)
    const [inputValue, setInputValue] = useState(null)

    useEffect(() => {
        
       
    }, [currentPeerUser])


    function messageContentChange(e) {
        setInputValue(e.target.value)
    }

    function onChoosePhoto() {

    }

    function messageContentChange() {

    }

    function onKeyPress() {

    }

    function onSendMessage(a, b) {

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
                    // onClick={() => { refInput.click() }}
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
            </Card>
        </>
    )
}



