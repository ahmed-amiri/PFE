import React, { useContext, useEffect, useRef, useState } from 'react'
import {Button, Form, Col, Row} from 'react-bootstrap'
import "./MessageForm.css"
import {useSelector} from 'react-redux'
import {AppContext} from '../context/appContext'

function MessageForm() {
    const [message, setMessage] = useState("")
    const user = useSelector((state) => state.user)
    const {socket, currentRoom, messages, setMessages, privateMemeberMsg} = useContext(AppContext)
    const messageRef = useRef(null)

    useEffect(() => {
        bottomScroll()
    }, [messages])

    function getFormattedDate(){
        const date = new Date()
        const year = date.getFullYear()
        let month = (1+date.getMonth()).toString()

        month = month.length > 1 ? month : '0' + month 
        let day = date.getDate().toString()
        day = day.length > 1 ? day : '0' + day
        return month + '/' + day + '/' + year 
    }

    const todayDate = getFormattedDate()
    socket.off('room-messages').on('room-messages', (roomMessages) => {
        console.log('room-messages:', roomMessages);
        setMessages(roomMessages)
    })

    function bottomScroll(){
        messageRef.current?.scrollIntoView({ behavior : 'smooth'})
    }

    function handleSubmit(e){
        e.preventDefault()
        if (!message) return
        const today = new Date()
        const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
        const time = today.getHours() + ':' + minutes
        const roomId = currentRoom
        socket.emit('message-room', roomId, message, user, time, todayDate)
        setMessage('')
    }

    return (
        <>
    <div className='messages-output'> 
    {user && <div className='alert alert-info'>No more messages</div>}
    {!user && <div className='alert alert-danger'> Please Login </div>} 
    
    {user && messages.map(({_id: date, messagesByDate}, idx)=> (
        <div key={idx}>
            <p className='alert alert-info text-center message-date-indicator'>{date}</p>
            {messagesByDate?.map(({content, time, from: sender}, msgIdx) =>(
                <div className={sender?.email == user?.email ? 'message' : 'incoming-message'} key={msgIdx}>
                    <div className='message-inner'>
                        <div className='d-flex align-items-center mb-3'>
                            <img src={sender.picture} style={{width: 35, height: 35, objectFit: 'cover', borderRadius: '50%', marginRight: 10}}/>
                            <p className='message-sender'>{sender._id == user?.id ? "You" : sender.name}</p>
                        </div>
                        <p className='message-content'>{content}</p>
                        <p className='message-timestamp-left'>{time}</p>
                    </div>
                </div>
            ))}
        </div>
    ))}
    <div ref={messageRef}/>

    </div>
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={11}>
                    <Form.Group>
                        <Form.Control type="text" placeholder='Your message' disabled={!user} 
                        value={message} onChange={(e) => setMessage(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={1}>
                    <Button variant="primary" type="submit" 
                    style={{width: "100%", backgroundColor: "blue"}} disabled={!user} >
                        <i className='fas fa-paper-plane'></i>
                    </Button>
                </Col>
            </Row>
        </Form>
           </>
  )
}

export default MessageForm