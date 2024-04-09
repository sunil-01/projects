import React from 'react'
// import Image from "next/image";
import { useEffect, useState } from "react";
import { NavbarToggler } from "reactstrap";
import axios from 'axios';
const Notification = () => {
//   console.log(props);
  let [toggle, setToggle] = useState(0);
  let [notification ,setNotification ] = useState([]);
//   let [notification,setNotification] =useState([]);
    let [isunread,setIsunread] = useState(false);
  let toggleBtn =(value) =>{
    setToggle(value);
    if(value == 0 ){
        // we can run query her for updating the notification
        axios.post('/clearnotification')
        .then(res => {
                console.log("fygeufuyrufvrbfv")
                setNotification([])
                setIsunread(false)
        })
        .catch(err => console.log(err))
    }
  }
  useEffect(()=>{
    // let data = [
    //     {
    //         inviteuser:"hello sunil ",
    //         isread :false
    //      },
    //      {
    //         inviteuser:"hello arvind sir ",
    //         isread :false
    //      },
    //      {
    //         inviteuser:"hello jitu ",
    //         isread :true
    //      },
    //      {
    //         inviteuser:"hello bhaskar ",
    //         isread :true
    //      }
    //  ]
    //  let  array = data.filter((el)=>el.isread)
    //  console.log(array,'array');
    //  if(array.length > 0){
    //     setIsunread(true);
    //     setNotification(array);
    //  }
     axios.get('/getnotification')
     .then(res => {
        if(res.data.status == "success"){
            // let  array = res.data.notification.filter((el)=>el.isread)
            // console.log(array,'array');
            console.log(res.data.notification)
            if(res.data.notification.length > 0){
                setIsunread(1);
                setNotification(res.data.notification);
            }
        }
     })
     .catch(err => console.log(err))

    },[setNotification])
  // $('#myModal').on('shown.bs.modal', function () {
  //     // $('#myInput').trigger('focus')
  //   })
  return (
    <>
      <div
      style={{ width: "50px", height: "50px", position: "relative" }}
      onClick={() => {
        if(toggle == 1){
            toggleBtn(0)
        }
        else{
            toggleBtn(1)
        }
        
      }}
      type="button"
    >
      <img
        src="/notifi.png"
        alt="Vercel Logo"
        width={"50"}
        height={"50"}
        priority
      />
      {isunread ? (
        <div
          style={{
            width: "15px",
            height: "15px",
            backgroundColor: "red",
            position: "absolute",
            top: "0px",
            left: "0px",
            fontSize: "10px",
            color: "white",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {notification.length}
        </div>
      ) : null}
    </div>
      {toggle ? (
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                notification
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={()=>toggleBtn(0)}>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {notification.length > 0 ? (
                <div >
                 { notification.map((el) => {
                    return <p style={{ borderBottom: "1px solid black" }}>
                      {`The ${el.inviteuser} gave confirmation of ${el.yes == 1 ? 'yes' : 'No'}`}
                    </p>;
                  })}
                    </div>
              ) : (
                <p> "there is no notification to show"{notification.length}</p>
              )}
            </div>
          </div>
      </div>
    ) : null}</>
  );
};
export default Notification;