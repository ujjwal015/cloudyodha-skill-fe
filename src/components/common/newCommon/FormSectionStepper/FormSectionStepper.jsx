import React from "react";
import "./FormSectionStepper.css";
import { Link } from "react-router-dom";

const FormSectionStepper = (props) => {

  console.log("PROPS",props.sections)

  return (
    <div className="form-section-stepper">
      {props.sections.map((item, id) => (
        <div onClick={(e)=>props.handleClick(e,item.id)}>
        <Link to={ `#${id}`} className={item === 0 && `form-section-stepper__step--active`} >
          {item.label}
        </Link>
         </div>
      ))}
    </div>
  );
};

export default FormSectionStepper;
