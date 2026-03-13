import React from 'react'

function AttendanceImage(props) {


const imageurl=props.src;
  return (
    <img src={imageurl} alt='attendanceImge'/>
  )
}

export default AttendanceImage