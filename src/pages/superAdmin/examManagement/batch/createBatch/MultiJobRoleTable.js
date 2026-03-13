import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { TableHeader } from "../../../../../components/common/table";
import { Icon } from "@iconify/react";
import SelectInput from "../../../../../components/common/SelectInput";
import { getLevelAndVersionApi } from "../../../../../api/superAdminApi/examManagement";
import SelectedJobRoleDetail from "./SelectedJobRoleDetail";
const MultiJobRoleTable = ({
  name,
  jobRoleList = [],
  setter,
  jobRoleLevels = [],
  jobRoleVersions = [],
  jobRoleLoading,
  errors,
  setErrors,
  editable = true,
  formValues
}) => {
  const dispatch = useDispatch();

  const handleDelete = (index) => {
    setter((prevState) => {
      let tempData = [...prevState[name]];
      tempData.splice(index, 1);

      return {
        ...prevState,
        [name]: tempData,
      };
    });
  };

  const handleLevelChange = (event, index) => {
    const { name, value } = event.target;
    const [jobRoleId, type] = name?.split("/");
    dispatch(getLevelAndVersionApi(jobRoleId, value));
    setter((prevState) => {
      let tempData = [...prevState.multipleJobRole];
      tempData[index][type] = value;
      tempData[index]["version"] = "";

      if (value) {
        setErrors((prevState) => {
          return {
            ...prevState,
            [`${jobRoleId}/level`]: "",
            [`${jobRoleId}/version`]: "",
          };
        });
      }

      return {
        ...prevState,
        multipleJobRole: tempData,
      };
    });
  };

  const handleVersionChange = (event, index) => {
    const { name, value } = event.target;
    const [jobRoleId, type] = name?.split("/");
    setter((prevState) => {
      let tempData = [...prevState.multipleJobRole];
      tempData[index][type] = value;

      if (value) {
        setErrors((prevState) => {
          return {
            ...prevState,
            [`${jobRoleId}/version`]: "",
          };
        });
      }

      return {
        ...prevState,
        multipleJobRole: tempData,
      };
    });
  };

  const columns = [
    { name: "jobRole", label: "Jobrole Name" },
    { name: "qpCode", label: "QP Code" },
    { name: "level", label: "Level" },
    { name: "version", label: "Version" },
    editable && { name: "actions", label: "Actions" },
  ];

  if (jobRoleList?.length < 1) return null;

  return (
    <div className="table-wrapper" style={{ marginBottom: "40px" }}>
      <table className="subadmin-table">
        <TableHeader columns={columns} sortOrders={{}} setSortOrders={{}} />
        <tbody>
          {jobRoleList?.map((job, index) => {
            return (
              <SelectedJobRoleDetail
                index={index}
                styles={styles.tableCell}
                editable={editable}
                job={job}
                handleDelete={handleDelete}
                jobRoleLoading={jobRoleLoading}
                handleLevelChange={handleLevelChange}
                errors={errors}
                handleVersionChange={handleVersionChange}
                jobRoleLevels={jobRoleLevels}
                jobRoleVersions={jobRoleVersions}
                setter={setter}
                formValues={formValues}
                setErrors={setErrors}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableCell: {
    padding: "10px",
    textAlign: "left",
    wordWrap: "break-word",
    whiteSpace: "normal",
  },
  select: {
    width: "100%",
    padding: "4px",
    border: "0.5px solid white",
  },
};

export default memo(MultiJobRoleTable);
