import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const[userexists,setuserexists] = useState(false)
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        // console.log(formData)
          // var bodyFormData = new FormData();
          // bodyFormData.append('userName', formData.username);
      //  let data = await axios.post('/register', formData);
      // .then(res => console.log(res))
      // .catch(err => console.log(err))
      //   console.log(data)
      //   console.log('User registered successfully');
      //   navigate("/login");

      axios.post('/register',formData)
      .then(function (response) {
            //handle success
            if(response.data == "success"){
              navigate("/login");        
            }
            else{
              setuserexists(true)
            }
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });

      } 
      catch(error){
        console.log(error)
      }
    } else {
      setErrors(validationErrors);
    }
    // navigate("/login");
  };

  // Validation logic here...
  
  const validateForm = () => {
    const validationErrors = {};

    if (!formData.username || formData.username.trim().length <= 0) {
      validationErrors.username = 'Username is required';
    }
    else if (!/^[a-zA-Z]*$/.test(formData.username)){
      validationErrors.username = 'UserNAme can contain ony alphabets';
    }
    if (!formData.email || formData.email.trim().length < 0) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Invalid email format';
    }

    if (!formData.password || formData.password.trim().length <= 0) {
      validationErrors.password = 'Password is required';
    } 
    else if (formData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    return validationErrors;
  };

  return (
    // Registration form JSX...
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        {userexists && <span className="error">{'User Already Exists'}</span>}
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>  
  );
};

export default Registration;
