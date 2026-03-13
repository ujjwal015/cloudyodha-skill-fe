import React, { useCallback, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import "./style.css";
import { VerticalDropdown } from "../VerticalDropDown";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import { getSubRole, getUserDetails, navigate, userRoleType } from "../../../utils/projectHelper";
import { authSelector } from "../../../redux/slicers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import EditScheduleModal from "../Modal/AddNewMeetingModal/EditScheduleModal";
import DeleteModal from "../Modal/DeleteModal";

const ScheduleCalendar = ({ calendar }) => {
  const { calenderName, isCalender, listName, schedule } = calendar;
  const dispatch = useDispatch();
  const userData = getUserDetails();
  const { userInfo = {} } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);

  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [showActionBtn, setShowActionBtn] = useState(false);

  // EditSchedule Modal
  const [isScheduleEditModal, setIsScheduleEditModal] = useState(false);
  const [editScheduleDetails, setEditScheduleDetails] = useState({});
  const [deleteItemDetails, setDeleteItemDetails] = useState({});

  const handleEditModalClose = useCallback(() => {
    setEditScheduleDetails({});
    setIsScheduleEditModal(false);
  }, []);

  console.log(editScheduleDetails, "editScheduleDetails");
  // permission
  const { ASSESSOR_MANAGEMENT_FEATURE, ASSESSOR_MANAGEMENT_LIST_FEATURE } = ROLESPERMISSIONS;

  const userRole = userInfo?.userRole;
  const featureName = ASSESSOR_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = ASSESSOR_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  // Delete Meeting open modal
  const handleDeleteCloseModal = () => {
    setDeleteModal(false);
  };

  const deleteModalHandler = useCallback((deleteItem) => {
    console.log("delete", deleteItem);
    setDeleteItemDetails(deleteItem);
    setDeleteModal(true);
    setActionOpen(false);
  }, []);

  // Confirm Delete Meeting Modal
  const handleConfirmDeleteMeeting = () => {
    console.log(deleteItemDetails, "deleteItemDetails");
  };

  // Edit Modal Meeting Handler
  const editModalHandler = (data) => {
    console.log(data, "editdata");
    const dataDetails = {
      scheduleTitle: "d",
      from_userid: "65c5da1a65491290ea447989",
      schedule_startDate: "14/06/2024",
      start_time: "12:00 AM",
      schedule_endDate: "14/06/2024",
      end_time: "12:00 AM",
    };
    setShowActionBtn(false);
    setIsScheduleEditModal(true);
    setEditScheduleDetails(dataDetails); ///
    // navigate(`${ASSESSOR_MANAGEMENT_UPDATE}/${actionId}`);
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen((prev) => !prev);
    setActionId(id);
  };

  return (
    <div className="ScheduleCalendar">
      <h1>{calenderName}</h1>
      <div className="ScheduleCalendar__body">
        <div className="ScheduleCalendar__calendar">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar showDaysOutsideCurrentMonth fixedWeekNumber={6} />
          </LocalizationProvider>
        </div>
        <div className="ScheduleCalendar__events">
          <div className="events_topheader">
            <h4>{listName}</h4>
            {schedule?.buttonList?.map((btnItem) => {
              return (
                <button key={btnItem?.name} onClick={btnItem?.onClick}>
                  {btnItem?.name}
                </button>
              );
            })}
          </div>
          {schedule?.listofMeetings.length > 0 && (
            <div className="events-wrappers meetings">
              {schedule?.listofMeetings.map((meetItem) => (
                <div className="ScheduleCalendar__events-card">
                  <div className="event-date">
                    <p>{meetItem?.day}</p>
                    <h2>{meetItem?.date}</h2>
                  </div>
                  <div className="event-details">
                    <h2>{meetItem?.meeting}</h2>
                    <p>
                      {meetItem?.icon}
                      {`${meetItem?.startTiming} - ${meetItem?.endTiming}`}{" "}
                    </p>
                  </div>
                  <div className="event-actions">
                    <VerticalDropdown
                      actionOpen={actionOpen}
                      setActionOpen={setActionOpen}
                      deleteHandler={() => deleteModalHandler(meetItem)}
                      editBtnHandler={() => editModalHandler(meetItem)}
                      MoreBtnHandler={MoreBtnHandler}
                      id={meetItem._id}
                      actionId={actionId}
                      featureName={featureName}
                      subFeatureName={subFeatureName}
                      showDelete={meetItem?.status !== true ? true : false}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {schedule?.listOfUpcomings?.length > 0 && (
            <div className="events-wrappers upcoming">
              {schedule?.listOfUpcomings?.map((upcomingItem) => (
                <div className="ScheduleCalendar__events-card">
                  <div>
                    <h1>23 Mar - 25 Mar</h1>
                    <ul>
                      {upcomingItem?.batchDetails?.map((batchItem, index) => {
                        const { isPermission, ...rest } = batchItem;
                        const keys = Object?.keys(rest);
                        return keys?.map((item, i) => <li key={`${index}-${i}`}>{`${item}: ${batchItem[item]}`}</li>);
                      })}
                    </ul>
                  </div>
                  <div>
                    <h1>{upcomingItem?.status}</h1>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isScheduleEditModal && (
        <EditScheduleModal
          open={isScheduleEditModal}
          handleClose={handleEditModalClose}
          editData={editScheduleDetails}
        />
      )}
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleCloseModal={handleDeleteCloseModal}
          title={"Delete Meeting"}
          confirmDelete={handleConfirmDeleteMeeting}
        />
      )}
    </div>
  );
};

export default ScheduleCalendar;
