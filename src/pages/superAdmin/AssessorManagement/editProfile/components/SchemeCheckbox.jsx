import React, { useEffect, useState } from 'react'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { schemeOptions } from '../../../../../utils/projectHelper'




// const schemeOptions = [
//   { label: "PM Vishvakarma", value: "66fe694fbbbb4da49e095a46" },
//   { label: "PMKVY", value: "65aa7bf1b19149328d4ec965" },
//   { label: "Non PMKVY", value: "65aa7ca8b19149328d4ecc61" },
// ]

export default function SchemeEditCheckbox({updateScheme,incomingScheme=[],title="", handleUserClick}) {
  const [selected, setSelected] = useState([])
  const [error,setError]=useState(false)

  const handleError=(data=false)=>{
    setError(data);
  }

  useEffect(()=>{
    updateScheme(selected)  
  },[selected])

  useEffect(()=>{
    if(incomingScheme.length>0){
      setSelected(incomingScheme)
      setError(false)
    }
  },[incomingScheme])

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(schemeOptions.map(option => option.value))
      handleUserClick(true)
      handleError(false)
    } else {
      setSelected([])
      handleError(true)
      handleUserClick(true)

    }
  }

  const handleCheckboxChange = (value) => (event) => {
    if (event.target.checked) {
      setSelected([...selected, value]);
      handleError(false)
      handleUserClick(true)
    } else {
      setSelected(selected.filter(item => item !== value))
      handleError(false)
      handleUserClick(true)
    }
  }

  const isAllSelected = schemeOptions.length === selected.length

  const handleColorofTitle=(error)=>{
    if(error){
      return {color:"#de3126"}
    }
  }

  return (
    <>
    <p style={handleColorofTitle(error)}>{`${title}*`}</p>
    <FormGroup style={{display:"flex",flexDirection:"row"}}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isAllSelected}
            onChange={handleSelectAll}
            indeterminate={selected.length > 0 && !isAllSelected}
          />
        }
        label="Select All"
      />
      {schemeOptions.map((option) => (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              checked={selected.includes(option.value)}
              onChange={handleCheckboxChange(option.value)}
            />
          }
          label={option.label}
        />
      ))}
    </FormGroup>
    {error && <p style={{fontSize:"small",color:"#de3126"}}> Please select atleast one scheme. </p>}
    </>
  )
}