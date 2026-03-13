import React from "react";
import Joyride, { STATUS, ACTIONS, EVENTS } from "react-joyride";
import { tourApi } from "../../../../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { setProfileDropdown } from "../../../../../redux/slicers/activitySlice";

const steps = [
  {
    target: "#admin-profile",
    title: "My profile",
    content: "Here You can Edit or Manage your profile and preferences",
    placement: "bottom",
    disableBeacon: true,
    spotlightPadding: 0,
    // offset: 40,
    styles: {
      tooltip: {
        backgroundColor: "transparent",
        width: "250px",
        padding: "0px",
      },
      buttonNext: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "100px",
      },
      buttonSkip: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "80px",
      },
    },
  },
  {
    target: "#drop-down",
    title: "Help & Support",
    content: "For any assistance support go to the profile > Help & support",
    placement: "bottom",
    disableBeacon: true,
    spotlightPadding: 0,
    // offset: 40,
    styles: {
      tooltip: {
        backgroundColor: "transparent",
        width: "250px",
        padding: "0px",
      },
      buttonNext: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "100px",
      },
      buttonSkip: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "80px",
      },
    },
  },
  {
    target: "#bell-icon",
    title: "Notifications",
    content:"Here you can Manage all your Notifications",
    placement: "right",

    styles: {
      tooltip: {
        backgroundColor: "transparent",
        width: "250px",
      },
      buttonNext: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "100px",
      },
      buttonSkip: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "80px",
      },
    },
  },
  {
    target: "#menu-list-item-client-management",
    title: "Client Management",
    content:
      "Here you can see your all listed clients also add new client in your list.",
    placement: "right",
    spotlightPadding: 0,
    styles: {
      tooltip: {
        backgroundColor: "transparent",
        width: "400px",
      },
      buttonNext: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "100px",
      },
      buttonSkip: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "80px",
      },
    },
  },
  {
    target: "#menu-list-item-assessment",
    title: "Assessment",
    content:
      "Here you can manage for assessment and also create new assessment.",
    placement: "right",
    spotlightPadding: -6,
    styles: {
      tooltip: {
        backgroundColor: "transparent",
      },
      buttonNext: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "100px",
      },
      buttonSkip: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "80px",
      },
    },
  },
  {
    target: "#menu-list-item-report-and-analytics",
    title: "Report & Analytics",
    content: "Here you can manage all report and analytics.",
    placement: "right",
    spotlightPadding: -6,
    styles: {
      tooltip: {
        backgroundColor: "transparent",
      },
      buttonNext: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "100px",
      },
      buttonSkip: {
        backgroundColor: "transparent",
        border: "1.50609px solid #FFFFFF",
        borderRadius: "27.4862px",
        color: "#FFFFFF",
        fontFamily: "poppins",
        fontSize: "13px",
        padding: "9px 10px 9px 10px",
        width: "80px",
      },
    },
  },
];

const joyRideCustomStyles = {
  options: {
    overlayColor: "rgba(0, 0, 0, 0.9)",
    textColor: "#FFFFFF",
  },
  tooltipContainer: {
    textAlign: "left",
  },
  tooltipTitle: {
    color: "#FFFFFF",
    fontFamily: "poppins",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "40px",
    padding: "0px",
  },
  tooltipContent: {
    color: "#FFFFFF",
    fontFamily: "poppins",
    fontSize: "13px",
    fontStyle: "normal",
    fontWeight: 300,
    lineHeight: "25px",
    padding: "0px",
    letterSpacing: 0.5,
  },
  spotlight: {
    borderRadius: 0,
  },
};

export default function UserTour() {
  const dispatch = useDispatch();
  const { userInfo = {} } = useSelector(authSelector);
  const handleJoyrideClose = (data) => {
    const { status, type, index } = data;
    if (index === 1) {
      dispatch(setProfileDropdown(true));
    }

    if (status === STATUS.FINISHED && type === EVENTS.TOUR_END) {
      dispatch(tourApi(userInfo?._id));
    }
    if (status === STATUS.SKIPPED && type === EVENTS.TOUR_END) {
      dispatch(tourApi(userInfo?._id));
    }
  };
  return (
    <>
      <Joyride
        steps={steps}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        hideCloseButton={true}
        hideBackButton={true}
        debug={false}
        run={!userInfo?.isTourComplete}
        disableScrolling={true}
        disableOverlayClose={true}
        disableCloseOnEsc={true}
        floaterProps={{
          styles: {
            arrow: {
              // display: "none",
            },
          },
        }}
        styles={joyRideCustomStyles}
        locale={{
          skip: "Skip",
          last: "Done",
        }}
        callback={handleJoyrideClose}
      />
    </>
  );
}
