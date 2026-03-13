import SelectInput from "@mui/material/Select/SelectInput";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clientManagementSelector } from "../../../../../redux/slicers/superAdmin/clientManagement";
import { getAllClientListsApi } from "../../../../../api/superAdminApi/clientManagement";

function ClientFilter() {
  const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    console.log("options+options",options)
  const { clientManagementLists = [] } = useSelector(clientManagementSelector);
  console.log("clientManagementLists12345",clientManagementLists)
  const dispatch=useDispatch()

  useEffect(()=>{
    dispatch(getAllClientListsApi(
        setLoading,
        1,
        Infinity,
    ))
  },[])

  useEffect(()=>{
    let newArrr=[]
    if(clientManagementLists.length>0){
        for(let item of clientManagementLists){
            newArrr.push({clientCode:item.clientCode,clientName:item.clientName})
        }
    }
    setOptions(newArrr);
  },[clientManagementLists])

  return (
    <div>
      <select name="clientList" id="clientList" value={options[0]?.clientName}>
        {options.length>0 && options.map((item)=>{
            <option value={item.clientName}>{item.clientCode}</option>
        })}
      </select>
    </div>
  );
}

export default ClientFilter;
