import React, { useState, useEffect } from "react";
import "./AttendanceRequest.css";
import { ReactComponent as SearchIcon } from "../../../../../../assets/icons/search-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssessorAttendanceRequestApi,
  updateAssessorAttendanceRegularizeApi,
} from "../../../../../../api/superAdminApi/assessorManagement";
import { assessorAttendanceSelector } from "../../../../../../redux/slicers/superAdmin/assessorAttendanceSlice";
import moment from "moment";
import { BeatLoader, PropagateLoader, PulseLoader } from "react-spinners";
import NoDataFoundImg from "../../../../../../assets/images/common/noDataFound.png";
import { InputAdornment, TextField } from "@mui/material";
import { handleTrimPaste } from "../../../../../../utils/projectHelper";
import PreviewImageModel from "./imgPreview";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const initialFormValues = {
  comment: "",
};

export default function AttendanceRequest() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [rightSideLoading, setRightSideLoading] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [assessorId, setAssessorId] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [showRightSide, setShowRightSide] = useState(false);
  const [rightSideList, setRightSideList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [locationDetails, setLocationDetails] = useState({});
  const { assessorAttendanceRequest } = useSelector(assessorAttendanceSelector);

  const getMarkedAttendanceLocation = (latitude, longitude) => {
    // setLoading(true);
    if (latitude && longitude) {
      setLocationDetails({ latitude, longitude });
    }
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setLocation(data.display_name);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching location name:", error);
      });
  };

  const getAssessorAttendanceRequestList = () => {
    dispatch(
      getAssessorAttendanceRequestApi(
        setLoading,
        actionId,
        "",
        getMarkedAttendanceLocation
      )
    );
  };

  useEffect(() => {
    getAssessorAttendanceRequestList();
  }, []);

  useEffect(() => {
    setRequestList(assessorAttendanceRequest);
  }, [assessorAttendanceRequest]);

  const [fieldName, setFieldName] = useState(null);
  const [batchName, setBatchName] = useState(null);
  const handlePreview = (fieldName, batchName) => {
    setIsPreviewOpen((pre) => !pre);
    setFieldName(fieldName);
    setBatchName(batchName);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  const handleChange = (e, assessorId, id) => {
    const { checked } = e.target;
    setAssessorId((prevAssessorId) =>
      prevAssessorId === assessorId ? null : assessorId
    );
    setShowRightSide(checked);
    rightSideArray(assessorId, id);
    setActionId((preactionId) => (preactionId === id ? null : id));
  };
  const rightSideArray = (assessorIds, id) => {
    const details = requestList?.filter((item) => {
      return item?._id === id;
    });

    requestList?.filter((item) => {
      if (item?._id === id) {
        return getMarkedAttendanceLocation(
          item?.location?.latitude,
          item?.location?.longitude
        );
      }
    });

    if (details) {
      setRightSideList([...details]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      dispatch(getAssessorAttendanceRequestApi(setLoading, actionId));
    }
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "") {
      setLoading(true);
      dispatch(
        getAssessorAttendanceRequestApi(setLoading, actionId, searchQuery)
      );
    }
  };

  const [err, setErr] = useState("");
  const commentHandler = (e) => {
    const { name, value } = e.target;
    if (formValues?.comment?.length > 0) {
      setErr(() => null);
    } else {
      setErr(() => "Comment is required");
    }
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setErr("");
  }, [formValues?.comment]);

  const handleSubmit = (status) => {
    if (formValues?.comment?.length === 0 && status === "reject") {
      setErr("Comment is required");
      return false;
    }
    if (formValues?.comment?.length > 0 || status === "approve") {
      setBtnLoading(true);
      let payload = {
        isApprove: status,
        comment: formValues?.comment,
      };
      dispatch(
        updateAssessorAttendanceRegularizeApi(
          setBtnLoading,
          actionId,
          payload,
          getAssessorAttendanceRequestList,
          setShowRightSide
        )
      );
    }
  };

  return (
    <div className="attendanceRequest-screen">
      <div className="attendanceRequest-left">
        <div className="attendanceRequest-search-box">
          <SearchIcon />
          <input
            placeholder="Search Name"
            value={searchQuery}
            onChange={handleSearchChange}
            onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="attendance-requests">
          {/* <label>
            <input type="checkbox" />
            <h6>Select All</h6>
          </label> */}
          {loading ? (
            <div className="no-req">
              <PropagateLoader color="#2ea8db" />
            </div>
          ) : requestList && requestList?.length > 0 ? (
            requestList?.map((item) => (
              <label key={item?._id}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    handleChange(e, item?.assesor_id?._id, item?._id);
                  }}
                  checked={actionId === item?._id}
                />
                <div className="req-card">
                  {/* <img src={item?.profileKeyUrl?.[0]?.url} alt="assessor-img" /> */}
                  {item?.profileKeyUrl !== null ? (
                    <img
                      src={
                        item?.profileKeyUrl !== null
                          ? item?.profileKeyUrl?.[0]?.url
                          : ""
                      }
                      alt="assessor-img"
                    />
                  ) : (
                    <Stack direction="row" spacing={2}>
                      <Avatar>
                        {item?.assesor_id?.fullName?.["0"]?.toUpperCase()}
                      </Avatar>
                    </Stack>
                  )}

                  <div className="req-txt">
                    <h3>{item?.assesor_id?.fullName}</h3>
                    <h6>
                      {moment(item?.createdAt).format(" MMM Do YYYY, h:mm a")}
                    </h6>
                    <p>{item?.remark}e</p>
                  </div>
                  <h6>{moment(item?.createdAt).fromNow()}</h6>
                </div>
              </label>
            ))
          ) : (
            <>
              <div className="no-req">
                <h3>No request for regularize</h3>
              </div>
            </>
          )}
        </div>
      </div>
      {rightSideLoading ? (
        <PropagateLoader color="#2ea8db" />
      ) : showRightSide ? (
        rightSideList && rightSideList?.length > 0 ? (
          rightSideList?.map((item) => (
            <div className="attendanceRequest-right" key={item?._id}>
              <PreviewImageModel
                handlePreview={handlePreview}
                isPreviewOpen={isPreviewOpen}
                setIsPreviewOpen={setIsPreviewOpen}
                handlePreviewClose={handlePreviewClose}
                url={item?.clockInImageKey?.url}
                assessorName={item?.assesor_id?.fullName}
                fieldName={fieldName}
                locationDetails={locationDetails}
                batchName={batchName}
              />

              <div className="req-card">
                {/* <img src={item?.profileKeyUrl?.[0]?.url} alt="assessor-img" /> */}
                {item?.profileKeyUrl !== null ? (
                  <img
                    src={
                      item?.profileKeyUrl !== null
                        ? item?.profileKeyUrl?.[0]?.url
                        : ""
                    }
                    alt="assessor-img"
                  />
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Avatar>
                      {item?.assesor_id?.fullName?.["0"]?.toUpperCase()}
                    </Avatar>
                  </Stack>
                )}
                <div className="req-txt">
                  <h3>{item?.assesor_id?.fullName}</h3>
                  <p>
                    {moment(item?.createdAt).format(" MMM Do YYYY, h:mm a")}
                  </p>
                </div>
              </div>

              <div className="date-card">
                <div className="req-date">
                  <h6>{moment(item?.createdAt).format("MMM")}</h6>
                  <h3>{moment(item?.createdAt).format("Do")}</h3>
                  <p>{moment(item?.createdAt).format("dddd")}</p>
                </div>
                <div className="req-txt">
                  <h3>Attendance Request</h3>
                  <p>
                    {moment(item?.createdAt).format(" MMM Do YYYY")},
                    {item?.clockInTime}-{item?.clockOutTime}
                  </p>
                </div>
              </div>

              <div className="slot-card">
                <h3>Location</h3>
                {loading ? (
                  <div className="loading">
                    <BeatLoader color="#2ea8db" />
                  </div>
                ) : item?.location?.latitude && item?.location?.longitude ? (
                  <>
                    <p className="location-text">{location}</p>
                    <button
                      onClick={() => {
                        handlePreview("location", item?.batch_id?.batchId);
                      }}
                      className="location-btn"
                    >
                      View Map
                    </button>
                  </>
                ) : (
                  <>
                    <p className="location-text">No Location Found</p>
                  </>
                )}
              </div>

              <div className="clockin-card">
                <h3>Clock-in</h3>
                <img
                  src={item?.clockInImageKey?.url}
                  alt="assessor-img"
                  loading="lazy"
                  onClick={() =>
                    handlePreview("image", item?.batch_id?.batchId)
                  }
                />
              </div>
              <div className="reason-card">
                <h3>Reason</h3>
                <p>{item?.remark}</p>
              </div>
              <div className="comments-card">
                <h3>Add Comments</h3>
                <textarea
                  rows={4}
                  placeholder="Write comment..."
                  name="comment"
                  onChange={commentHandler}
                ></textarea>
                <p className="err">{err}</p>
              </div>

              <div className="req-btn-action">
                {item?.isApprove === "pending" ? (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => {
                        handleSubmit("approve");
                      }}
                      disabled={btnLoading}
                    >
                      {btnLoading ? (
                        <PulseLoader color="white" size="10px" />
                      ) : (
                        "Approve"
                      )}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => {
                        handleSubmit("reject");
                      }}
                      disabled={btnLoading}
                    >
                      {btnLoading ? (
                        <PulseLoader color="white" size="10px" />
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </>
                ) : item?.isApprove === "approve" ? (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => {
                        handleSubmit("approve");
                      }}
                      disabled={btnLoading}
                    >
                      {btnLoading ? (
                        <PulseLoader color="white" size="10px" />
                      ) : (
                        "Approve"
                      )}
                    </button>
                  </>
                ) : item?.isApprove === "reject" ? (
                  <>
                    <button
                      className="reject-btn"
                      onClick={() => {
                        handleSubmit("reject");
                      }}
                      disabled={btnLoading}
                    >
                      {btnLoading ? (
                        <PulseLoader color="white" size="10px" />
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))
        ) : (
          "No data found"
        )
      ) : (
        <>
          <div className="no-attend-selected-container">
            <img
              src={NoDataFoundImg}
              alt="no-request-pending"
              className="no-data-img"
              loading="lazy"
            />
            <h1>No Attendance selected to regularize</h1>
          </div>
        </>
      )}
    </div>
  );
}
