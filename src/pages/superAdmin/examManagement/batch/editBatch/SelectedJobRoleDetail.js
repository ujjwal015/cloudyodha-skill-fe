import { Icon } from "@iconify/react";
import React, { memo, useEffect, useState } from "react";
import SelectInput from "../../../../../components/common/SelectInput";
import {
  getLevelAndVersionApi,
  getLevelandVersionofJobRoleApi,
  getLevelandVersionofParticularJobRoleApi,
  getVersionOfJobRoleSelectedApi,
} from "../../../../../api/superAdminApi/examManagement";
import { useDispatch } from "react-redux";

function SelectedJobRoleDetail({
  index,
  styles,
  editable,
  job,
  handleDelete,
  handleLevelChange,
  errors,
  handleVersionChange,
  jobRoleLevels,
  jobRoleVersions,
  setErrors,
  setter,
  formValues
}) {
  const [jobRoleLoading, setJobRoleLoading] = useState(false);
  // const [levelList,setLevelList]=useState([]);
  // const [versionList,setVersionList]=useState([]);
  // const dispatch = useDispatch();

const clearValues=()=>{
  // setLevelList([]);
  // setVersionList([]);
  setJobRoleLoading(false)
}

// console.log(`Executed----${index}`)

// const updateLevel=(data)=>{
//     if(data.length>0){
//       setLevelList(data);
//   }
// }

// console.log(`DeletedData--${index}`,levelList,"--", versionList)
  // useEffect(() => {
  //   if (Object.keys(job).length > 0) {
  //     setErrors((prevState) => {
  //       return {
  //         ...prevState,
  //         multipleJobRole: "",
  //       };
  //     });
  //     const jobRoleId = job?.jobRoleId;
  //     dispatch(getLevelandVersionofParticularJobRoleApi(setJobRoleLoading,jobRoleId,updateLevel));
  //   }
  // }, []);

  // useEffect(() => {
  //   if (levelList.length>0) {
  //     const jobRoleId = job?.jobRoleId;
  //     dispatch(  getVersionOfJobRoleSelectedApi(jobRoleId, formValues.level));
  //   }
  // }, [formValues.level]);


  // const handleVersionChange = (event, index) => {
  //   const { name, value } = event.target;
  //   const [jobRoleId, type] = name?.split("/");
  //   setter((prevState) => {
  //     let tempData = [...prevState.multipleJobRole];
  //     tempData[index][type] = value;

  //     if (value) {
  //       setErrors((prevState) => {
  //         return {
  //           ...prevState,
  //           [`${jobRoleId}/version`]: "",
  //         };
  //       });
  //     }

  //     return {
  //       ...prevState,
  //       multipleJobRole: tempData,
  //     };
  //   });
  // };

  // const handleLevelChange = (event, index) => {
  //   console.log("Event_target",event?.target,index)
  //   const { name, value } = event?.target;
  //   const [jobRoleId, type] = name?.split("/");
  //   // dispatch(getLevelAndVersionApi(jobRoleId, value));

  //   // if (levelList.length>0) {
  //         // const jobRoleId = job?.jobRoleId;
  //         dispatch(  getVersionOfJobRoleSelectedApi(jobRoleId,value,setVersionList ));
  //       // }

  //   setter((prevState) => {
  //     let tempData = [...prevState.multipleJobRole];
  //     tempData[index][type] = value;
  //     tempData[index]["version"] = "";

  //     if (value) {
  //       setErrors((prevState) => {
  //         return {
  //           ...prevState,
  //           [`${jobRoleId}/level`]: "",
  //           [`${jobRoleId}/version`]: "",
  //         };
  //       });
  //     }
  //     return {
  //       ...prevState,
  //       multipleJobRole: tempData,
  //     };
  //   });
  // };

  const handleJobroleDelete=(indexnumber)=>{
    handleDelete(indexnumber)
    clearValues()
  }

  return (
    <tr key={index}>
      <td style={{ ...styles }}>
        <p>{editable ? job?.jobRoleLabel : job?.jobRoleId?.jobRole || "-"}</p>
      </td>
      <td style={{}}>{editable ? job?.qpCode : job?.jobRoleId?.qpCode ?? "-"}</td>
      <td>
        <SelectInput
          name={`${job?.jobRoleId}/level`}
          placeHolder={"Level"}
          value={job?.level}
          handleChange={(event) => handleLevelChange(event, index)}
          options={editable ? jobRoleLevels || [] : [{ label: job?.level, value: job?.level }]}
          // options={levelList}
          error={errors?.[`${job?.jobRoleId}/level`]}
          mandatory
          // disabled={jobRoleLevel?.length < 1}
          loading={jobRoleLoading}
          disabled={!editable}
        />
      </td>
      <td style={{ ...styles.tableCell }}>
        <SelectInput
          name={`${job?.jobRoleId}/version`}
          placeHolder={"Version"}
          value={job?.version}
          handleChange={(event) => handleVersionChange(event, index)}
          options={editable ? jobRoleVersions || [] : [{ label: job?.version, value: job?.version }]}
          // options={versionList}
          error={errors?.[`${job?.jobRoleId}/version`]}
          mandatory
          // disabled={jobRoleLevel?.length < 1}
          disabled={!editable}
          loading={jobRoleLoading}
        />
      </td>

      {editable && (
        <td style={{ textAlign: "center" }}>
          <Icon icon={"formkit:trash"} onClick={() => handleJobroleDelete(index)} style={{ cursor: "pointer" }} />
        </td>
      )}
    </tr>
  );
}

export default memo(SelectedJobRoleDetail);
