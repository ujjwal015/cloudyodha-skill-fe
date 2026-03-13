import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import "./style.css";
export default function SubmitButton({
    cancelBtnText,
    submitBtnText,
    saveAndNextBtnText,
    handleSubmit,
    clearFormValues,
    loading,
    navigate,
    showSaveAndNextBtn = false,
    saveAndNextHandler,
}) {
    return (
        <section className="buttonsBox">
            <div className="action-btn-box">
                <div className="action-btn-card">
                    <button
                        className="cancel-btn outlined-btn"
                        onClick={clearFormValues}
                        disabled={loading ? true : false}
                    >
                        {cancelBtnText}
                    </button>
                    <button
                        className="submit-btn light-blue-btn"
                        disabled={loading ? true : false}
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <PulseLoader size="10px" color="white" />
                        ) : (
                            submitBtnText
                        )}
                    </button>
                </div>
                {showSaveAndNextBtn ? (
                    <div
                        className="action-btn-card"
                    >
                        <div className="action_btn_lg">
                            <button
                                className="light-blue-btn"
                                disabled={loading ? true : false}
                                onClick={saveAndNextHandler}
                            >
                                {loading ? (
                                    <PulseLoader size="10px" color="white" />
                                ) : (
                                    saveAndNextBtnText
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </section>
    );
}
SubmitButton.propTypes = {
    cancelBtnText: PropTypes.string,
    submitBtnText: PropTypes.string,
    saveAndNextBtnText: PropTypes.string,
    handleSubmit: PropTypes.func,
    clearFormValues: PropTypes.func,
    loading: PropTypes.bool,
    showSaveAndNextBtn: PropTypes.bool,
    // navigate,
}