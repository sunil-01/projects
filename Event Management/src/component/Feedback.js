import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from "react-router-dom";
const Feedback = () => {
    const location = useLocation().pathname.split('/')[2];
    const response = location.split('-')[0]
    const eventid =location.split('-')[1]
    const [userFeedback, setUserFeedback] = useState('');
    const [regards, setRegards] = useState(true);
    let handleChange = e => {
        // const { name, value } = e.target;
        // setFormData(prevData => ({
        //   ...prevData,
        //   [name]: value,
        // }));
        setUserFeedback(e.target.value)
    };
    console.log(userFeedback)
    let handleSubmit = function (){
        let payload = {
            response:response,
            eventid:eventid,
            feedback:userFeedback
        }
        axios.post('/userfeedback',payload)
        .then(res => {
            if(res.data == "success"){
                setRegards(false);
            }  
        })
        .catch(err => console.log(err))
    }
  return (
    <div className='container mt-4'>
    {
        regards ?
        <div>
            <h2>Please Provide Your Feedback Page</h2>
            <label>Feedback : </label>
            <input type="textarea" name="feedback" onChange={handleChange} value={userFeedback}/>
            <br></br>
            <br></br>
            <button onClick={handleSubmit} disabled={userFeedback.trim().length <= 0 ? true : false}>Thank You</button>
        </div>
        :
        <h2>Thank You !!!!</h2>
    }   
    </div>
  );
};

export default Feedback;
