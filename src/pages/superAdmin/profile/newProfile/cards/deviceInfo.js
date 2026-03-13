import React, { useEffect, useState } from "react";
import Input from "../../../../../components/common/input";
import validateField from "../../../../../utils/validateField";
import { ReactComponent as DeviceLogo } from "../../../../../assets/images/pages/userProfile/ph_desktop.svg";
import { ReactComponent as DeviceLogoApple } from "../../../../../assets/images/pages/userProfile/ic_outline-apple.svg";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordApi, getDeviceDetailListsApi, signOutApi } from "../../../../../api/authApi";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { getUserDetails,getIP, getLocation } from "../../../../../utils/projectHelper";
import { useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
import CustomPagination from "../../../../../components/common/customPagination";


const initialFormValues = {
  olDPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function DeviceInfoCard() {

  const dispatch = useDispatch()
  const { pathname } = useLocation();
  const { _id = "",deviceId } = getUserDetails();
  const [loading, setLoading] = useState(false);
  const [isLogOutBtnLoading, setILogOutsBtnLoading] = useState(false);
  const [btnLogoutId, setBtnLogoutId] = useState("");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [deviceListData, setDeviceListData] = useState([]);
  const [focusedInput, setFocusedInput] = useState("");
  const [err, setErr] = useState("");
  const { deviceLists = [] } = useSelector(authSelector);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  const getList = () => {
    dispatch(
      getDeviceDetailListsApi(
        setLoading,
        _id,
        DeviceLogo,
        page,
        limit,
        setTotalPages,
      )
    );
  };

  useEffect(() => {
    setLoading(true)
    getList();

  }, [pathname, page, limit,]);
  

  useEffect(() => {
    const deviceDetail = deviceLists?.map((item) => {
      const date = new Date(item?.updatedAt)
      return ({
        _id: item?._id,
        deviceName: item?.device?.charAt(0)?.toUpperCase() + item?.device?.split('')?.slice(1, item?.device?.length)?.join(''),
        status: item?.isDeviceLogin ? "Active" : "Inactive",
        location: item?.addressName || "NA",
        time: date?.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        deviceLogo: <DeviceLogo />
      })
    })
    setDeviceListData(deviceDetail)
  }, [deviceLists]);


  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(
      name,
      fieldValue,
      formValues?.newPassword,
      formValues?.olDPassword,
      formValues?.confirmNewPassword
    );

    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const getLogoutDetails=async()=>{
      const [geolocation,userIp]=await Promise.all([getLocation(),getIP()])
      return  {
        userId: _id,
        isAllLogout: true,
        deviceId: deviceId,
        addreiss: userIp,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        alsoFromCurrentDevice: true,
      };
    }



  const handleSubmit = async(event) => {
    event.preventDefault();
    const formErrors = {};

    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(
        name,
        value,
        formValues?.newPassword,
        formValues?.olDPassword,
        formValues?.confirmNewPassword
      );
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Submit the form data
      setLoading(true);
      const formData = {
        oldPassword: formValues?.olDPassword,
        newPassword: formValues?.newPassword,
        confirmNewPassword: formValues?.confirmNewPassword,
        userId: _id,
      };
      const logoutPayload= await getLogoutDetails();
      dispatch(
        changePasswordApi(formData, setErr, setLoading, clearFormValues,logoutPayload)
      );
    }
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  const handleLogout = async (id) => {

    setBtnLogoutId(id);
    const formData = {
      userId: _id,
      deviceId: id,
      isAllLogout: false,
      address: await getIP(),
      isSimpleLogOut: true,
    };
    dispatch(
      signOutApi(
        formData,
        setILogOutsBtnLoading,
        setLoading,
        _id,
        setBtnLogoutId,
      )
    );
  };

  const range=[5,10,15,20,25];
  


  return (
    <div className="device-card-wrapper">
      <div className="container">
        <div className="header">
          <h2>Password</h2>
        </div>
        <hr />
        <div className="content"  style={{display:"flex",flexDirection:"column"}}>
          <div className="form-group-profile" style={{width:"100%"}}>
            <Input
              label="Current Password"
              type={"password"}
              name="olDPassword"
              placeholder="Type Password"
              onFocus={focusHandler}
              error={errors?.olDPassword}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.olDPassword}
              endAdornment
            />
          </div>
          <div className="form-group-profile" style={{width:"100%"}}>
            <Input
              label="New Password"
              type={"password"}
              name="newPassword"
              placeholder="Type Password"
              onFocus={focusHandler}
              error={errors?.newPassword}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.newPassword}
              endAdornment
            />
          </div>
          <div className="form-group-profile" style={{width:"100%"}}>
            <Input
              label="Confirm Password"
              type={"password"}
              name="confirmNewPassword"
              placeholder="Type Password"
              onFocus={focusHandler}
              error={errors?.confirmNewPassword}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.confirmNewPassword}
              endAdornment
            />
          </div>
          <button className="psw-update-btn" onClick={handleSubmit}>Update</button>
        </div>
      </div>
      <div className="container sticky-wrapper">
        <div className="sticky-header">
          <h2>Device Management</h2>
          <hr />
        </div>
        {loading ? <div className="loader">...Loading</div> : <div className="scrollable-content">
          {deviceListData?.map((item, index) => (
            <>
              <div key={index} className="device-content">
                <div className="status-container">
                  <div className="device-logo">{item?.deviceLogo}</div>
                  <div className="device-info">
                    <div className="device-name">
                      <h5>{item?.deviceName}</h5>
                      <span
                        className={
                          item?.status === "Active"
                            ? "status-bull-active"
                            : "status-bull-inactive"
                        }
                      >
                        &bull;
                      </span>
                      <p
                        className={
                          item?.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {item?.status}
                      </p>
                    </div>
                    <div className="device-sub-title">

                      {item?.location?.length > 10 ? (
                        <Tooltip title={item?.location || "-"} arrow>
                          <div style={{
                            width: "100px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {item?.location}
                          </div>
                        </Tooltip>
                      ) : (
                        <div style={{
                          width: "100px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {item?.location}
                        </div>
                      )}
                      <span>&bull;</span>
                      <p>{item?.time}</p>
                    </div>
                    
                  </div>
                </div>
                <div className="log-out-btn">
                  <button onClick={() => handleLogout(item?._id)}>Log Out</button>
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>}
        <div
        style={{
          display: [totalPages > 0 ? "" : "none"],
          marginTop: "auto"
        }}>
        <CustomPagination
          count={totalPages}
          page={page}
          limit={limit}
          limitRange={range}
          shouldSetWidth={true}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      </div>
    </div>
  );
}

export default DeviceInfoCard;
