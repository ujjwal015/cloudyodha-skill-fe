import React, { useState } from "react";
import "./style.css";
import { ReactComponent as ProctorIcon } from "../../../../../assets/images/pages/examManagement/proctor-eye.svg";
import validateField from "../../../../../utils/validation/superAdmin/examManagement";
import Input, { RadioButton } from "../../../../../components/common/input";
import { groupItems } from "../data";

const Proctoring = (props) => {
  const { formValues, setFormValues, errors, setErrors } = props;
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const handleChange = (event) => {
    const { value, name } = event.target;

    // Validate the field.
    const fieldError = validateField(name, value);

    // Update the errors state for this specific field.
    setErrors((prevErrors) => {
      return fieldError
        ? { ...prevErrors, [name]: fieldError } // Set error for the field
        : { ...prevErrors, [name]: undefined }; // Clear error for the field
    });

    // Update form values.
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <section className="sub-admin-wrapper proctoring">
        <div className="tab-content">
          <div className="form-title">
            <h1>Proctoring</h1>
            <ProctorIcon />
          </div>
          <div className="form-wrapper">
            <div className="form">
              {/* ============Form Starts here ========= */}
              <form>
                <div
                  className="inputFeilds"
                  style={{ display: "flex", gap: "15px" }}
                >
                  <div style={{ width: "33.33%" }}>
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="imageProctorStatus"
                      label="Image Proctoring"
                      value={formValues?.imageProctorStatus}
                      error={errors?.imageProctorStatus}
                      mandatory
                    />
                    {formValues?.imageProctorStatus == "true" && (
                      <div className="form-group">
                        <Input
                          label="Image Proctoring Time (in Mins)"
                          name="imageProctoringTime"
                          type={"number"}
                          hideExponants={true}
                          placeholder="Proctoring Time(in Mins)"
                          onFocus={focusHandler}
                          error={errors?.imageProctoringTime}
                          onBlur={blurHandler}
                          onChange={handleChange}
                          value={formValues?.imageProctoringTime}
                          mandatory
                        />
                      </div>
                    )}
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="faceRecognition"
                      label="Face Recognition"
                      value={formValues?.faceRecognition}
                      error={errors?.faceRecognition}
                      mandatory
                    />
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="wrongLoginStatus"
                      label="Wrong Login Status"
                      value={formValues?.wrongLoginStatus}
                      error={errors?.wrongLoginStatus}
                      mandatory
                    />
                    {formValues?.wrongLoginStatus == "true" && (
                      <div className="form-group">
                        <Input
                          label="Max No. of Wrong Login"
                          name="noOfWrongLogin"
                          type={"number"}
                          hideExponants={true}
                          placeholder="Max no. Wrong Login"
                          onFocus={focusHandler}
                          error={errors?.noOfWrongLogin}
                          onBlur={blurHandler}
                          onChange={handleChange}
                          value={formValues?.noOfWrongLogin}
                          mandatory
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ width: "33.33%" }}>
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="videoStreaming"
                      label="Video Streaming"
                      value={formValues?.videoStreaming}
                      error={errors?.videoStreaming}
                      mandatory
                    />
                    {formValues?.videoStreaming == "true" && (
                      <div className="form-group">
                        <Input
                          label="Video Duration (in Seconds)"
                          name="videoDuration"
                          type={"number"}
                          hideExponants={true}
                          placeholder="Video Duration (in Seconds)"
                          onFocus={focusHandler}
                          error={errors?.videoDuration}
                          onBlur={blurHandler}
                          onChange={handleChange}
                          value={formValues?.videoDuration}
                          mandatory
                        />
                      </div>
                    )}
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="faceDetection"
                      label="Face Detection"
                      value={formValues?.faceDetection}
                      error={errors?.faceDetection}
                      mandatory
                    />
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="browserExitAlert"
                      label="Browser Exit Alert"
                      value={formValues?.browserExitAlert}
                      error={errors?.browserExitAlert}
                      mandatory
                    />
                    {formValues?.browserExitAlert == "true" && (
                      <div className="form-group">
                        <Input
                          label="No. of Suspicious Activity Allowed"
                          name="noOfBrowserExit"
                          type={"number"}
                          hideExponants={true}
                          placeholder="No. of Suspicious Activity"
                          onFocus={focusHandler}
                          error={errors?.noOfBrowserExit}
                          onBlur={blurHandler}
                          onChange={handleChange}
                          value={(formValues?.noOfBrowserExit).toString()}
                          mandatory
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ width: "33.33%" }}>
                    {formValues?.videoStreaming == "true" && (
                      <div className="form-group">
                        <Input
                          label="Video Interval (in Mins)"
                          name="videoInterval"
                          type={"number"}
                          hideExponants={true}
                          placeholder="Video Interval (in Mins)"
                          onFocus={focusHandler}
                          error={errors?.videoInterval}
                          onBlur={blurHandler}
                          onChange={handleChange}
                          value={formValues?.videoInterval}
                          mandatory
                        />
                      </div>
                    )}
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="capturingImageStatus"
                      label="Capture Image Status"
                      value={formValues?.capturingImageStatus}
                      error={errors?.capturingImageStatus}
                      mandatory
                    />
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="videoScreensharingProctoringStatus"
                      label="Video Proctoring"
                      value={formValues?.videoScreensharingProctoringStatus}
                      error={errors?.videoScreensharingProctoringStatus}
                      mandatory
                    />
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="identityProofStatus"
                      label="Identity Proof Status"
                      value={formValues?.identityProofStatus}
                      error={errors?.identityProofStatus}
                      mandatory
                    />
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="isAutoLogout"
                      label="Is Auto Log Out"
                      value={formValues?.isAutoLogout}
                      error={errors?.isAutoLogout}
                      mandatory
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Proctoring;
