import React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

// const arr=["Prashant","Kumar","Madheshiya"]

 const ToolTipContent=(data=[])=>{

console.log("data12345",data)
  return(
    <div>
        <ul style={{padding:"20px"}}>
          {data.length > 0 && data.map((item)=> <li style={{fontWeight:"bold",fontSize:"large"}}>{item.jobRole || ""}</li>)}
        </ul>
    </div>
  )
}


export default ToolTipContent;

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

// function DenseTable(data=[]) {
//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
//         {/* <TableHead>
//           <TableRow>
//             <TableCell>JobRoleList</TableCell>
//           </TableRow>
//         </TableHead> */}
//         <TableBody>
//           {rows.map((row) => (
//             <TableRow
//               key={row.name}
//               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//             >
//               {data.length>0 && data.map((item)=>{
//                 return <TableCell>{item.jobRole || ""}</TableCell>
//             })}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

