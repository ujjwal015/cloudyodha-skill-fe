import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { InputAdornment } from '@mui/material';
// import { ReactComponent as SearchIcon } from "./../../assets/icons/search-icon-grey.svg";
import { ReactComponent as SearchIcon } from "./../../assets/icons/search-icon.svg";
import { useDispatch, useSelector } from 'react-redux';
import { clientManagementSelector } from '../../redux/slicers/superAdmin/clientManagement';
import { getClientManagementAllListsApi } from '../../api/superAdminApi/clientManagement';




export default function AutoCompleteTextField(props) {
    
    const {clientListAll}=   useSelector(clientManagementSelector) 
    const dispatch=useDispatch();
    const [sortedDataInSingleArray,setSortedDataInSingleArray]=React.useState();
    const [loading,setLoading]=React.useState(true);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [limit, setLimit] = React.useState(50);
    const [allPagesClientList,setAllPagesClientList]=React.useState([]);

    const handleDataTransform= (clientData)=>{
        const filterData=[]
        const clientDataInSingleArray=[]
        for (let data of clientData){
                filterData.push({
                    "clientcode":data.clientcode, "clientname":data.clientname, "email":data.email,"address":data.address, "state":data.state,"organisationType":data.organisationType
                })

        for(let data of filterData){
            for(let nestedData in data){
                if(data[nestedData] ===""  || clientDataInSingleArray.includes(data[nestedData])){
                   continue

                }
                else{
                    clientDataInSingleArray.push(data[nestedData])
                }
            }
        }
        setSortedDataInSingleArray(clientDataInSingleArray);
        }
     }

    React.useEffect(()=>{
        handleDataTransform(clientListAll);
    },[clientListAll])

    React.useEffect(()=>{
        dispatch(getClientManagementAllListsApi(setLoading,page,limit,"",setTotalPages));
    },[]);

    

    


  return (
    <Stack spacing={2} sx={{ width: 200 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        size="small"
        ListboxProps={{
          sx: { fontSize: 12 },
        }}
        // options={top100Films.map((option) => option.clientname)}
        disabled={loading}
        options={sortedDataInSingleArray}
        onChange={(event,newValue)=>props.SetAutocompleteSuggestedData(newValue)}
        renderInput={(params) => (
          <TextField
          size="small"
              variant="outlined"
              placeholder="Search"
            //   value={searchQuery}
              style={{ background: "#F8F8F8"}}
              onChange={props.handleChangeSearch}
            //   onKeyDown={props.handleKeyDown}
            //   onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
            {...params}
            label=""
            InputProps={{
                ...params.InputProps,
              type: 'search',
                startAdornment: (
                    <InputAdornment position="start">   
                       <SearchIcon style={{ color: "#231F20", width: 15 }} />
                    </InputAdornment>
                  )
            }}
          />
        )}
      />
    </Stack>
  );    
}


