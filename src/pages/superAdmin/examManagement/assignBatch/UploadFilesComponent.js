import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import UploadService from "./UploadServer";
import { ReactComponent as UploadIcon } from "./../../../../assets/icons/upload-cloud-file.svg";

function UploadFiles(props) {
  const { selectedFiles, setSelectedFiles } = props;
  const [currentFile, setCurrentFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  /* useEffect(() => {
    UploadService.getFiles().then((response) => {
      setFileInfos(response.data);
    });
  }, []); */

  const upload = () => {
    const currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);

    // UploadService.upload(currentFile, (event) => {
    //   setProgress(Math.round((100 * event.loaded) / event.total));
    // })
    //   .then((response) => {
    //     setMessage(response.data.message);
    //     return UploadService.getFiles();
    //   })
    //   .then((files) => {
    //     setFileInfos(files.data);
    //   })
    //   .catch(() => {
    //     setProgress(0);
    //     setMessage("Could not upload the file!");
    //     setCurrentFile(null);
    //   });

    setSelectedFiles([]);
  };

  const onDrop = (files) => {
    const allowedFileTypes = [
      "application/vnd.ms-excel",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    // Filter the dropped files to include only XLSX and CSV files
    const filteredFiles = files.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    if (filteredFiles.length > 0) {
      setSelectedFiles(filteredFiles);
    } else {
      // Show an error message if the file type is not allowed
      setMessage("Please select a valid XLSX or CSV file.");
    }
  };

  return (
    <div className="assign-batch-upload-file">
      <div>
        {currentFile && (
          <div className="progress mb-3">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        <Dropzone onDrop={onDrop} multiple={true}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />

                <>
                  <div className="assign-batch-upload-item">
                    <div>
                      <UploadIcon />
                    </div>
                    <div>
                      <button
                        className="btn btn-success upload-btn"
                        disabled={!selectedFiles}
                        onClick={upload}
                      >
                        Click to upload
                      </button>
                      <span>or drag and drop</span>
                    </div>
                    <p> Supported Format XLSX, CSV etc.</p>
                  </div>
                </>
              </div>
            </section>
          )}
        </Dropzone>

        <div className="alert alert-light" role="alert">
          {message}
        </div>

        {fileInfos.length > 0 && (
          <div className="card">
            <div className="card-header">List of Files</div>
            <ul className="list-group list-group-flush">
              {fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadFiles;
