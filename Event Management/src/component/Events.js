import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useNavigate,Link } from "react-router-dom";
import Notification from './Notification';

const Events = () => {
    const[auth,setAuth] = useState(false)
    const[message,setMessage] = useState()
    const[events,setEvents] = useState([]);
    const[searchEvents,setSearchEvents] = useState();
    const[editModel,setEditModel] = useState(false);
    const[invitationModel,setInvitationModel] = useState(false);
    const[editModelId,setEditModelId] = useState()
    const[eventId,setEventId] = useState()
    const[index,setIndex] = useState();
    const [modal, setModal] = useState(false);
    const [locationToggle, setlocationToggle] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const[user,setUserId] = useState();
    const[filteredData,setFilteredData] = useState([])
    const[timeFilter,setTimeFilter] = useState([])
    const [errors, setErrors] = useState({});
    const [editErrors, setEditErrors] = useState({});
    const [inviteErrors, setInviteErrors] = useState({});
    const [formData, setFormData] = useState({
      eventname: '',
      location: '',
      date: '',
      time: '',
      description:''
    });
    const [inviteData, setInviteData] = useState({
      emailid:'',
      description:''
    });
    const [selectFilter ,setSelectFilter] = useState("All");
    
    const navigate = useNavigate();
    const minDate = () => {
      const today = new Date().toISOString().split('T')[0];
      return today;
    };
    
    const toggle = () => {
      setModal(!modal);  
    }

    const editmodeltoggle = () => {
      setEditModel(!editModel)
      // console.log(modal)  
    }

    const handleChange = e => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };

    const invitehandleChange = e => {
      const { name, value } = e.target;
      setInviteData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };
    
    const sendInvitationmodeltoggle = () => {
      setInvitationModel(!invitationModel) 
    }
    
    let editevent = function (id,index){
      setEditModel(!editModel)
      setEditModelId(id)
      setIndex(index)
    }

    let invitationevent = function (eventid,index){
      setInvitationModel(!editModel)
      setEventId(eventid)
    }

    let deleteevent = function(id,index){
      axios.post('/delete',{id:id})
      .then(res => {
        if(res.data.status == "success"){
          setEvents(events.splice(index,1))
          setSearchEvents(events)
        }
      })
      .catch(err => console.log(err))
    }

    let addEvent = function (){
      // console.log(formData,"FGUJgsd")
      const validationErrors = validateForm()
      // console.log(validationErrors)
      if (Object.keys(validationErrors).length === 0) {
        setModal(!modal);
        axios.post("/addevents",formData)
          .then(res => {
              if(res.data.status === "success"){
                let newevent = [...events,res.data.events]
                setEvents(newevent)
                setSearchEvents(newevent)
                setUserId(res.data.id)
              }
              else{
                  alert('No Data Added')
              }
          // console.log(res)
        })
        .catch(err => console.log(err))
      }
      else{
        setErrors(validationErrors);
      }
    }

    let handleditevent = function (id){
      const validationErrors = validateForm()
      if (Object.keys(validationErrors).length === 0) {
        editmodeltoggle(!editModel)
        let payload = {
          eventdata:formData,
          id:id
        }
        axios.post('/edit',payload)
        .then(res => {
          if(res.data.status == "success"){
            let a = events.map((e,idx) => {
                if(idx == index){
                  return res.data.updatedevent
                }
                else{
                  return e;
                }
            })
            setEvents(a)
            setSearchEvents(a)
          }  
        })
        .catch(err => console.log(err))
      }
      else{
        setEditErrors(validationErrors)
      }  
    }

    let handlesearch = (e) => {
      setSearchEvents(events.filter(data => data.eventname.toLowerCase().includes(e.target.value.toLowerCase())))
    }

    let handlelogout = () => {
      axios.post('/logout')
      .then(res => {
        if(res.data == "success"){
          setAuth(false);
          navigate("/login");
        }
      })
    }

    let sendInvitation = () => {
      let invitevalidationErrors = inviteValidateForm()
      if (Object.keys(invitevalidationErrors).length === 0) {
        setInvitationModel(!invitationModel)
      let payload = {
        email:inviteData.emailid,
        description:inviteData.description,
        user_id:user,
        event_id:eventId
      }
      // console.log(inviteData)
      axios.post('/captureresponse',payload)
      .then(res => console.log(res,'res'))
      .catch(err => console.log(err))
      }
      else{
        console.log("Ifneugribgrui")
        setInviteErrors(invitevalidationErrors)
      } 
    }

    let handleSubmit = async e => {
      e.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        // try {
        // axios.post('/register',formData)
        // .then(function (response) {
        //       //handle success
        //       if(response.data == "success"){
        //         navigate("/login");        
        //       }
        //       else{
        //         setuserexists(true)
        //       }
        //     })
        //     .catch(function (response) {
        //       //handle error
        //       console.log(response);
        //     });
  
        // } 
        // catch(error){
        //   console.log(error)
        // }
      } else {
        setErrors(validationErrors);
      }
      // navigate("/login");
    };

    let validateForm = () => {
      const validationErrors = {};
  
      if (!formData.eventname || formData.eventname.trim().length <= 0) {
        validationErrors.username = 'eventname is required';
      }
      else if (!/^[a-zA-Z]*$/.test(formData.eventname)){
        validationErrors.eventname = 'eventname can contain ony alphabets';
      }
      
      if (!formData.location || formData.location.trim().length <= 0) {
        validationErrors.location = 'location is required';
      } 
      else if (!/^[a-zA-Z0-9]+$/.test(formData.location)) {
        validationErrors.location = 'Enter Valid Location';
      }
  
      if (!formData.date) {
        validationErrors.date = 'Date is required';
      } 
      
      if (!formData.time) {
        validationErrors.time = 'Time is required';
      }
      
      if (!formData.description || formData.description.trim().length <= 0) {
        validationErrors.description = 'description is required';
      } 
      
      return validationErrors;
    };

    let inviteValidateForm = () => {
      const validationErrors = {};
      console.log(inviteData.emailid)
      if (!inviteData.emailid) {
        validationErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(inviteData.emailid)) {
        validationErrors.email = 'Invalid email format';
      }
      
      if (!inviteData.description || inviteData.description.trim().length <= 0) {
        validationErrors.description = 'description is required';
      } 
      
      return validationErrors;
    };
    

    let selectFilterChnage =(e) =>{
      // console.log(e.target.value);
      if(e.target?.value =="All"){
        setSearchEvents(events);
      }
      else{
        let val = e.target.value;
        let search = events.filter((el)=>{
            // console.log( e?.location , e.target?.value);
          return el?.location == e.target.value
          })
          setSearchEvents(search);
      }

   

    }

    let timeFilterChnage =(e) =>{
      console.log(e.target.value);
      if(e.target?.value =="All"){
        setSearchEvents(events);
      }
      else{
        let search = events.filter((el)=>{
            // console.log( e?.location , e.target?.value);
          return el?.time == e.target.value
          })
          setSearchEvents(search);
      }

   

    }
    
    //   let newval = events.map((e) => {
    //     return e.location;
    //   })
    //   let newval1 = [...new Set(newval)]
    //   // console.log(Array.from(new Set(newval)),'newval1');
    //   setFilteredData(newval1);
    // }
    
// selectuniquefunction();



useEffect(() => {
  axios.get("/events")
  .then(res => {
    // console.log(res.data)
      if(res.data.status === "success"){
        setAuth(true);
        setEvents(res.data.events)
        setSearchEvents(res.data.events)
        setUserId(res.data.events[0].loggedin)
        

      }
      else{
        setMessage(res.data.Message)
      }

  })
  .catch(err => console.log(err))


},[])
useEffect(()=>{
  let newval = events.map((e) => {
    return e.location;
  })
  let newval1 = ["All",...new Set(newval)]
  // console.log(Array.from(new Set(newval)),'newval1');
  setFilteredData(newval1);
},[setFilteredData ,events])

useEffect(()=>{
  let newval = events.map((e) => {
    return e.time;
  })
  let newval1 = ["All",...new Set(newval)]
  // console.log(Array.from(new Set(newval)),'newval1');
  setTimeFilter(newval1);
},[setTimeFilter ,events])


    return (
    <div className='container mt-4'>
      {
        auth ? 
        <div className='text-center' style={{justifyContent:"center"}}>
            <button type="button" className="btn btn-primary" onClick={toggle}>
              Add Events
            </button>
            <button className='btn btn-danger ml-3' onClick={handlelogout}>Logout</button>
            <Notification></Notification>
            {
              events ?
              <>
                <div>
                <label htmlFor="search">Search</label>
                <input type="search" id="search" name="search" onChange={handlesearch} placeholder='Search Events Here'></input>
                <br></br>

                  <div>
                    <label htmlFor="filter">Location: </label>
                    <select
                      name="filter"
                      // value={filteredData}
                      onChange={(e)=>selectFilterChnage(e)}
                      // onClick={(e)=>{console.log(e)}}
                    >
                      {
    
                        filteredData.map((e) => {
                          // console.log(e);
                          return<option value={e}>{e}</option>
                        })
                      }
                      
                    </select>
                  </div>

                  <div>
                    <label htmlFor="filter">Time: </label>
                    <select
                      name="filter"
                      // value={filteredData}
                      onChange={(e)=>timeFilterChnage(e)}
                      // onClick={(e)=>{console.log(e)}}
                    >
                      {
    
                        timeFilter.map((e) => {
                          // console.log(e);
                          return<option value={e}>{e}</option>
                        })
                      }
                      
                    </select>
                  </div>    


                {/* <label htmlFor="search">Location</label>
                <input type="search" id="search" name="search" onChange={selectuniquefunction} placeholder='Search Events Here'></input>
                <br></br> */}
                </div>
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Number</th>
                        <th scope="col">Name</th>
                        <th scope="col">Location</th>
                        <th scope="col">Time</th>
                        <th scope="col">Date</th>
                        <th scope="col">Description</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      searchEvents.map((item,i) => (
                        <tr key={i}>
                          <td>{i+1}</td>
                          <td>{item.eventname}</td>
                          <td>{item.location}</td>
                          <td>{item.time}</td>
                          <td>{item.date}</td>
                          <td>{item.description}</td>
                          <td>
                            <>
                            
                              <button id={item.id} className={i} onClick={e => editevent(e.target.id,e.target.className)} disabled={item.user_id == user ? false : true}>Edit</button>
                              <button id={item.id} className={i} onClick={e => deleteevent(e.target.id,e.target.className)} disabled={item.user_id == user ? false : true}>DELETE</button>
                              <button id={item.id} className={i} onClick={e => invitationevent(e.target.id,e.target.className)} disabled={item.user_id == user ? false : true}>Send Invitation</button>
                            </>
                          </td>
                          
                        </tr>
                      ))
                    }
                    </tbody>
                  </table>
                </div>
              </>
              :
              <div>
              </div>
            }

              <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Add Event</ModalHeader>
              <ModalBody>
                <label htmlFor="eventname">Event Name:</label>
                <input type="text" id="eventname" name="eventname" onChange={handleChange} value={formData.eventname} required></input>
                {errors.eventname && <span className="error">{errors.eventname}</span>}
                <br></br>
                <label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location" onChange={handleChange} value={formData.location} required></input>
                {errors.location && <span className="error">{errors.location}</span>}
                <br></br>
                <label htmlFor="start">Date:</label>
                <input type="date" id="date" name="date" min={minDate()} max="2100-12-31" onChange={handleChange} value={formData.date} required/>
                {errors.date && <span className="error">{errors.date}</span>}
                <br></br>
                <label htmlFor="time">Time:</label>
                <input type="time" id="time" name="time" min="00:00" max="24:00" onChange={handleChange} value={formData.time} required />
                {errors.time && <span className="error">{errors.time}</span>}
                <br></br>
                <label>Description : </label>
                <input type="textarea" name="description" onChange={handleChange} value={formData.textarea}/>
                {errors.description && <span className="error">{errors.description}</span>}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={addEvent}>
                  Add
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
              </Modal>
             
              <Modal isOpen={editModel} toggle={editmodeltoggle}>
                  <ModalHeader toggle={editmodeltoggle}>Edit Event</ModalHeader>
                  <ModalBody>
                    <label htmlFor="eventname">Event Name:</label>
                    <input type="text" id="eventname" name="eventname" onChange={handleChange} value={formData.eventname} required></input>
                    {editErrors.eventname && <span className="error">{editErrors.eventname}</span>}
                    <br></br>
                    <label htmlFor="location">Location:</label>
                    <input type="text" id="location" name="location" onChange={handleChange} value={formData.location} required></input>
                    {editErrors.location && <span className="error">{editErrors.location}</span>}
                    <br></br>
                    <label htmlFor="start">Date:</label>
                    <input type="date" id="date" name="date" min={minDate()} max="2100-12-31" onChange={handleChange} value={formData.date} required/>
                    {editErrors.date && <span className="error">{editErrors.date}</span>}
                    <br></br>
                    <label htmlFor="time">Time:</label>
                    <input type="time" id="time" name="time" min="00:00" max="24:00" onChange={handleChange} value={formData.time} required />
                    {editErrors.time && <span className="error">{editErrors.time}</span>}
                    <br></br>
                    <label>Description : </label>
                    <input type="textarea" name="description" onChange={handleChange} value={formData.description}/>
                    {editErrors.description && <span className="error">{editErrors.description}</span>}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={() => handleditevent(editModelId)}>
                      Save
                    </Button>{' '}
                    <Button color="secondary" onClick={editmodeltoggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
              </Modal>

              <Modal isOpen={invitationModel} toggle={sendInvitationmodeltoggle}>
                  <ModalHeader toggle={sendInvitationmodeltoggle}>Send Invitataion</ModalHeader>
                  <ModalBody>
                    <label htmlFor="eventname">Email ID:</label>
                    <input type="text" id="emailid" name="emailid" onChange={invitehandleChange} value={inviteData.emailid} required></input>
                    {inviteErrors.email && <span className="error">{inviteErrors.email}</span>}
                    <br></br>
                    <label>Description : </label>
                    <input type="textarea" name="description" onChange={invitehandleChange} value={inviteData.description}/>
                    {inviteErrors.description && <span className="error">{inviteErrors.description}</span>}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={sendInvitation}>
                      Save
                    </Button>{' '}
                    <Button color="secondary" onClick={sendInvitationmodeltoggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
              </Modal>

        </div>
        :
        <div>
            <h1>{message}</h1>
            <a href ="/login">Click here to Login</a>
        </div>
      }
    </div>
  );
};

export default Events;
