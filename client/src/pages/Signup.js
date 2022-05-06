import React from 'react'
import {Col, Container, Row, Form, Button} from 'react-bootstrap'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import "./Signup.css"
import profile from "../assests/default.png"

function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [image, setImage] = useState(null)
    const [uploadingImg, setUploadingImg] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    function ValidateImg(e) {
        const file = e.target.files[0]
        if (file.size >= 1048576) {
            return alert("Max size is 1MB")
        }else {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }
    
     async function uploadImage(){
         const data = new FormData()
         data.append('file', image)
         data.append('upload_preset', 'branper-app')
         try {
             setUploadingImg(true)
             const res = await fetch(
                `https://api.cloudinary.com/v1_1/sushiboi/image/upload`,
                {
                  method: "POST",
                  body: data,
                }
              );
              const urlData = await res.json(); 
             setUploadingImg(false)
             return urlData.url
         }catch(error) {
             setUploadingImg(false)
             console.log(error);
         }
     }

     
async function handleSignup(e){
    e.preventDefault()
    if (!image) return alert('Please set your profile picture')
    const url = await uploadImage(image)
    console.log(url);

}
     
   return(
<Container>
  <Row>
   <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
    <Form style={{width: "80%", maxWidth: 500}} onSubmit={handleSignup} >

    <h1 className='text-center'>Create Account</h1>
    <div className='signup-profile-pic_container'>
        <img src={imagePreview || profile} className='signup-profile-pic'/>
        <label htmlFor='image-upload' className='image-upload-label'>
            <i className='fas fa-plus-circle add-picture-icon'></i>
        </label>
        <input type='file' id='image-upload' hidden accept="image/png image/jpeg" onChange={ValidateImg}/>
    </div>

    <Form.Group className="mb-3" controlId="formBasicName">
    <Form.Label>Full name</Form.Label>
    <Form.Control type="text" placeholder="Your full name" onChange={(e) => setName(e.target.value)} value={name} />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} value={password} />
    </Form.Group>
    <Button variant="primary" type="submit">
        {uploadingImg ? "Signing up.." : "Signup"}
        </Button>
    <div className="py-4">
    <p className="text-center">
        Already have an account? <Link to ="/login">Login</Link>
    </p>
</div>
</Form>
    </Col>
    <Col md={5} className="signup_bg"></Col>
    </Row>
</Container>
   )
}

export default Signup