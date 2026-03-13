// import React, { useState, useEffect } from 'react';
// import http from '../http-common';

// function UploadFilesService() {
//   const [progress, setProgress] = useState(0);

//   const upload = (file) => {
//     let formData = new FormData();
//     formData.append('file', file);

//     http.post('/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress: (progressEvent) => {
//         const progress = Math.round(
//           (progressEvent.loaded / progressEvent.total) * 100
//         );
//         setProgress(progress);
//       },
//     })
//       .then((response) => {
//         // Handle the response as needed
//       })
//       .catch((error) => {
//         // Handle errors
//       });
//   };

//   const getFiles = () => {
//     axios
//     .create({
//       baseURL: 'http://localhost:8080',
//       headers: {
//         'Content-type': 'application/json',
//       },
//     })
//     .get('/files').get('/files')
//       .then((response) => {
//         // Handle the response as needed
//       })
//       .catch((error) => {
//         // Handle errors
//       });
//   };

//   useEffect(() => {
//     // Call the getFiles function when the component mounts
//     getFiles();
//   }, []);

//   return (
//     <div>
//       <h1>Upload Files Service</h1>
//       <div>
//         <p>Progress: {progress}%</p>
//       </div>
//       <button onClick={() => upload(/* pass your file here */)}>Upload File</button>
//     </div>
//   );
// }

// export default UploadFilesService;
