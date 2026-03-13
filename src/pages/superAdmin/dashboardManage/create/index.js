import React, { useEffect, useState } from "react";
import PageTitle from "../../../../components/common/PageTitle";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import { DASHBOARD_MANAGE_LIST } from "../../../../config/constants/routePathConstants/superAdmin";
import { useNavigate } from "react-router-dom";
import CustomTextField from "../../../../components/common/CustomTextField";
import "../create/style.css";
import validateField from "../../../../utils/validateField";
import MyOutlinedBtn from "../../../../components/common/newCommon/Buttons/MyOutlinedBtn";
import MyFilledBtn from "../../../../components/common/newCommon/Buttons/MyFilledBtn";
import CustomMultiSelect from "../../../../components/common/CustomMultiSelect1";
import { useDispatch, useSelector } from "react-redux";
import {
  createDashboardApi,
  getAllDropdownListApi,
} from "../../../../api/superAdminApi/dashboardManage";
import { clientSelector } from "../../../../redux/slicers/clientSlice";
const initialFormValues = {
  dashboardName: "",
  widgets: [],
  graphs: [],
  table: [],
};
function DashboardCreatePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [graphDropDown, setGraphDropDown] = useState([]);
  const [widgetsDropDown, setWidgetsDropDown] = useState([]);
  const [tableDropDown, setTableDropDown] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { dashboardDropDownList = {} } = useSelector(clientSelector);
  const { graph, widget, table } = dashboardDropDownList;
  const getDropdownList = () => {
    setLoading(true);
    dispatch(getAllDropdownListApi(setLoading));
  };

  useEffect(() => {
    getDropdownList();
  }, []);

  useEffect(() => {
    if ((graph, widget, table)) {
      setGraphDropDown(graph);
      setWidgetsDropDown(widget);
      setTableDropDown(table);
    }
  }, [graph, widget, table]);

  const handleBreadCrumbClick = (event, name, path) => {
    event.preventDefault();
    path && navigate(path);
  };

  const breadCrumbsData = [
    {
      name: "Dashboard Management",
      isLink: true,
      key: "1",
      path: DASHBOARD_MANAGE_LIST,
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Dashboard List",
      isLink: true,
      key: "2",
      path: DASHBOARD_MANAGE_LIST,
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Create Dashboard",
      isLink: false,
      key: "3",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
  ];

  const changeHandler = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  const handleCancel = () => {
    setErrors({});
    clearFormValues();
    navigate(DASHBOARD_MANAGE_LIST);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const { dashboardName, widgets, graphs, table } = formValues;
      const allSelectedItems = [...widgets, ...graphs, ...table]?.map((item) =>
        item?.options?.map((items) => items?._id)
      );
      const payload = {
        dashboard_name: dashboardName,
        components: allSelectedItems?.flat(),
      };
      dispatch(
        createDashboardApi(payload, setLoading, clearFormValues, navigate)
      );
    }
  };

  const buttonData = {
    name: "create",
    text: "Create",
    onClick: handleSubmit,
    path: "",
    loading: loading,
    disabled: loading ? true : false,
    isPermissions: {},
    style: {
      fontSize: "small",
      paddingTop: "15px",
      paddingBottom: "15px",
      paddingRight: "28px",
      paddingLeft: "28px",
      marginLeft: "10px",
    },
  };

  const handleChange = (event, name) => {
    const fieldError = validateField(name, event);
    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
    setSelectedOptions(event);
    setFormValues((prev) => ({
      ...prev,
      [name]: event,
    }));
  };

  return (
    <div className="main-content">
      <div className="content--page">
        <div
          className="page-header-wrapper"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <PageTitle
              title={
                <h1 style={{ fontSize: "larger", fontWeight: "bold" }}>
                  Add Dashboard
                </h1>
              }
            />
            <div className="breadcrumbs">
              <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
            </div>
          </div>
        </div>

        <PageTitle
          title={
            <h1 style={{ fontSize: "16px", fontWeight: "bold" }}>
              Dashboard Information
            </h1>
          }
          subTitle={
            <h1 style={{ fontSize: "13px", fontWeight: "normal" }}>
              Add Dashboard details and necessary information from here.
            </h1>
          }
        />
        <div className="wrapper">
          <div className="form-group">
            <div className="textField-width">
            <CustomTextField
              //   type="password"
              name="dashboardName"
              required
              label="Dashboard Name"
              value={formValues?.dashboardName}
              error={errors?.dashboardName}
              onChange={changeHandler}
            />
            </div>
            <CustomMultiSelect
              label="Widgets"
              name="widgets"
              placeholder="Select widgets"
              categories={widgetsDropDown}
              selectedOptions={formValues?.widgets}
              handleChange={handleChange}
              required={true}
              grouping={true}
              error={errors.widgets}
            />
          </div>
          <div className="form-group">
            <CustomMultiSelect
              label="Graphs"
              name="graphs"
              placeholder="Select Graphs"
              categories={graphDropDown}
              selectedOptions={formValues?.graphs}
              handleChange={handleChange}
              required={true}
              grouping={true}
              error={errors.graphs}
            />
            <CustomMultiSelect
              label="Table"
              name="table"
              placeholder="Select Table"
              categories={tableDropDown}
              selectedOptions={formValues?.table}
              handleChange={handleChange}
              required={true}
              grouping={true}
              error={errors.table}
            />
          </div>
        </div>

        <div className="add-new-dashboard-button">
          <MyOutlinedBtn
            style={{
              fontSize: "small",
              border: "1px solid",
              paddingTop: "15px",
              paddingBottom: "15px",
              paddingRight: "28px",
              paddingLeft: "28px",
              marginRight: "18px",
            }}
            variant="outlined"
            onClick={handleCancel}
            disabled={loading ? true : false}
            text="Cancel"
          />
          <MyFilledBtn
            variant="contained"
            btnItemData={buttonData}
            disabled={loading ? true : false}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardCreatePage;
