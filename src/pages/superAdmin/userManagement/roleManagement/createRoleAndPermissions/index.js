import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Input from "../../../../../components/common/input";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import { PulseLoader } from "react-spinners";
import { errorToast } from "../../../../../utils/projectHelper";
import validateField from "../../../../../utils/validateField";
import {
  createUserRoleApi,
  getFeaturesApi,
} from "../../../../../api/superAdminApi/userManagement";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SubmitButton from "../../../../../components/SubmitButton";
const initialValues = {
  userRoleName: "",
};
const CreateNewRole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(initialValues);
  const [featureList, setFeatureList] = useState([]);
  const { featuresList = {} } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getFeaturesList = () => {
    setLoading(true);
    dispatch(getFeaturesApi(setLoading));
  };

  useEffect(() => {
    getFeaturesList();
  }, []);

  useEffect(() => {
    setFeatureList(featuresList);
  }, [featuresList]);
  const handleRoleName = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };
  const handlePermissionChange =
    (featureIndex, subFeatureIndex, permissionKey) => (event) => {
      const { checked } = event.target;
      setFeatureList((prevFormData) => {
        let newFormData = JSON.parse(JSON.stringify(prevFormData));
        newFormData[featureIndex].subFeatures[subFeatureIndex].permissions[
          permissionKey
        ] = checked;

        // Check the sub-feature if any permission is checked
        const subFeaturePermissions =
          newFormData[featureIndex].subFeatures[subFeatureIndex].permissions;
        newFormData[featureIndex].subFeatures[subFeatureIndex].enabled =
          Object.values(subFeaturePermissions).some(
            (permissions) => permissions
          );

        // Check the feature if any sub-feature is checked
        const isAnySubFeatureenabled = newFormData[
          featureIndex
        ].subFeatures?.some((subFeature) => subFeature?.enabled);
        newFormData[featureIndex].enabled = isAnySubFeatureenabled;

        // Update the feature checkbox class based on all sub-features' permissions
        const allSubFeaturesUnchecked = newFormData[
          featureIndex
        ].subFeatures?.every((subFeature) =>
          Object.values(subFeature?.permissions).every(
            (permissions) => !permissions
          )
        );
        newFormData[featureIndex].featureCheckboxClass = allSubFeaturesUnchecked
          ? "user-role-tb-unchecked user-role-tb-bg-unchecked"
          : "";

        // Uncheck the sub-feature if all its permissions are unchecked
        if (!newFormData[featureIndex].subFeatures[subFeatureIndex].enabled) {
          newFormData[featureIndex].subFeatures[
            subFeatureIndex
          ].enabled = false;
        }

        // Update the feature checkbox class if any sub-feature is unchecked
        newFormData[featureIndex].featureCheckboxClass = newFormData[
          featureIndex
        ].subFeatures.some((subFeature) => !subFeature.enabled)
          ? "user-role-tb-unchecked user-role-tb-bg-unchecked"
          : "";

        return newFormData;
      });
    };

  const handleFeatureSelect = (featureIndex) => (event) => {
    const { checked } = event.target;
    setFeatureList((prevFormData) => {
      let newFormData = JSON.parse(JSON.stringify(prevFormData));
      newFormData[featureIndex].enabled = checked;
      newFormData[featureIndex].subFeatures?.forEach((subFeature) => {
        subFeature.enabled = checked;
        subFeature.permissions.view = checked;
        subFeature.permissions.add = checked;
        subFeature.permissions.delete = checked;
        subFeature.permissions.export = checked;
        subFeature.permissions.edit = checked;
        subFeature.permissions.status = checked;
      });
      return newFormData;
    });
  };

  const handleSubFeatureenabled =
    (featureIndex, subFeatureIndex, subFeatureName) => (event) => {
      const { checked } = event.target;
      setFeatureList((prevFormData) => {
        let newFormValues = JSON.parse(JSON.stringify(prevFormData));
        newFormValues[featureIndex].subFeatures[subFeatureIndex].enabled =
          checked;

        // Select all permissions within the sub-feature
        const permissions =
          newFormValues[featureIndex].subFeatures[subFeatureIndex].permissions;
        Object.keys(permissions).forEach((permission) => {
          permissions[permission] = checked;
        });

        // Check the feature if any sub-feature is checked
        const isAnySubFeatureenabled = newFormValues[
          featureIndex
        ].subFeatures.some((subFeature) => subFeature.enabled);
        newFormValues[featureIndex].enabled = isAnySubFeatureenabled;

        const isAnySubFeatureUnchecked = newFormValues[
          featureIndex
        ].subFeatures.some((subFeature) => !subFeature.enabled);

        // Update the feature checkbox class based on sub-feature status
        newFormValues[featureIndex].featureCheckboxClass =
          isAnySubFeatureUnchecked
            ? "user-role-tb-unchecked user-role-tb-bg-unchecked"
            : "";

        return newFormValues;
      });
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
    const enabledFeatures = featureList?.filter((feature) => feature.enabled);
    if (enabledFeatures.length === 0) {
      errorToast("Please select at least one feature.");
      return;
    }

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const enabledFormData = {
        userRoleName: formValues?.userRoleName,
        features: featureList
          ?.filter((feature) =>
            feature?.subFeatures?.some((subFeature) => subFeature?.enabled)
          )
          .map((feature) => ({
            featureName: feature?.featureName,
            enabled: feature?.enabled,
            subFeatures: feature?.subFeatures
              .filter((subFeature) => subFeature?.enabled)
              .map((subFeature) => ({
                subFeatureName: subFeature?.subFeatureName,
                enabled: subFeature?.enabled,
                permissions: subFeature?.permissions,
              })),
          })),
      };
      dispatch(
        createUserRoleApi(
          enabledFormData,
          setLoading,
          clearFormValues,
          navigate
        )
      );
      setFormValues(initialValues);
    }
  };
  const clearFormValues = () => {
    setFormValues(initialValues);
  };

  return (
    <div className="main-content">
      <div className="title">
        <h1>
          <ArrowLeft onClick={() => navigate(-1)} />
          <span>Add New Role</span>
        </h1>
      </div>
      <section className="sub-admin-wrapper" style={{ marginBottom: "40px" }}>
        <div className="tab-content">
          <div className="edit-profile">
            <div className="form-wrapper user-role-tb">
              <h2>ADD NEW</h2>
              <div className="form upper-tab-form">
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Role Name"
                    placeholder="Enter the name"
                    type="text"
                    name="userRoleName"
                    error={errors?.userRoleName}
                    value={formValues?.userRoleName}
                    onChange={handleRoleName}
                    mandatory
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile">
            <div className="form-wrapper user-role-tb">
              <h2>MODULE PERMISSION</h2>
              <div className="form">
                <table>
                  <thead>
                    <tr>
                      <th>Features</th>
                      <th>Sub Feature</th>
                      <th>View only</th>
                      <th>Add</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>Status</th>
                      <th>Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureList?.map((feature, featureIndex) => (
                      <React.Fragment key={featureIndex}>
                        <tr className="role-table-input">
                          <td rowSpan={feature?.subFeatures?.length + 1}>
                            <div
                              className={`text-check ${feature?.featureCheckboxClass}`}
                            >
                              <input
                                type="checkbox"
                                name={feature?.featureName}
                                id={feature?.featureName}
                                label={feature?.featureName}
                                value={feature?.featureName}
                                checked={feature?.enabled}
                                onChange={handleFeatureSelect(featureIndex)}
                                disabled={feature?.featureName === "Dashboard"}
                              />
                              <label htmlFor={feature?.featureName}>
                                {feature?.featureName}
                              </label>
                            </div>
                          </td>
                        </tr>
                        {feature?.subFeatures?.map(
                          (subFeature, subFeatureIndex) => (
                            <tr
                              key={subFeatureIndex}
                              className="subFeature-table-input"
                            >
                              <td key={subFeatureIndex}>
                                <div className="text-check">
                                  <input
                                    type="checkbox"
                                    name={subFeature?.subFeatureName}
                                    id={subFeature?.subFeatureName}
                                    checked={subFeature?.enabled}
                                    value={subFeature?.subFeatureName}
                                    onChange={handleSubFeatureenabled(
                                      featureIndex,
                                      subFeatureIndex
                                    )}
                                    disabled={feature?.featureName === "Dashboard"}
                                  />
                                  <label htmlFor={subFeature?.subFeatureName}>
                                    {subFeature?.subFeatureName}
                                  </label>
                                </div>
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={subFeature?.permissions?.view}
                                  value={subFeature?.permissions?.view}
                                  onChange={handlePermissionChange(
                                    featureIndex,
                                    subFeatureIndex,
                                    "view"
                                  )}
                                  disabled={feature?.featureName === "Dashboard"}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={subFeature?.permissions?.add}
                                  value={subFeature?.permissions?.add}
                                  onChange={handlePermissionChange(
                                    featureIndex,
                                    subFeatureIndex,
                                    "add"
                                  )}
                                  disabled={feature?.featureName === "Dashboard"}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={subFeature?.permissions?.edit}
                                  value={subFeature?.permissions?.edit}
                                  onChange={handlePermissionChange(
                                    featureIndex,
                                    subFeatureIndex,
                                    "edit"
                                  )}
                                  disabled={feature?.featureName === "Dashboard"}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={subFeature?.permissions?.delete}
                                  value={subFeature?.permissions?.delete}
                                  onChange={handlePermissionChange(
                                    featureIndex,
                                    subFeatureIndex,
                                    "delete"
                                  )}
                                  disabled={feature?.featureName === "Dashboard"}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={subFeature?.permissions?.status}
                                  value={subFeature?.permissions?.status}
                                  onChange={handlePermissionChange(
                                    featureIndex,
                                    subFeatureIndex,
                                    "status"
                                  )}
                                  disabled={feature?.featureName === "Dashboard"}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={subFeature?.permissions?.export}
                                  value={subFeature?.permissions?.export}
                                  onChange={handlePermissionChange(
                                    featureIndex,
                                    subFeatureIndex,
                                    "export"
                                  )}
                                  disabled={feature?.featureName === "Dashboard"}
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SubmitButton
        cancelBtnText="Cancel"
        submitBtnText="Create Role"
        saveAndNextBtnText="Save and Next"
        handleSubmit={handleSubmit}
        clearFormValues={clearFormValues}
        navigate={navigate}
        loading={loading}
        showSaveAndNextBtn={false}
      />
    </div>
  );
};

export default CreateNewRole;
