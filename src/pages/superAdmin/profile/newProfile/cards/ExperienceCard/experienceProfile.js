import { Tooltip } from "@mui/material";
import "./index.css";

export const ExperienceProfileCard = ({ title, content, onEdit, CardId, onAdd,onDelete }) => {
  const onClickHandler = (columnId) => {
    CardId(columnId);
    onEdit();
  };

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title">{title}</div>
        <div className="add-btn-container">
          <button className="add-btn" onClick={onAdd}>
            ADD
          </button>
        </div>
      </div>
      <hr />
      <div className="profile-card-body">
        <div className="profile-card-container">
          {content.length>0?content?.map((item, itemIndex) => {
            let certificateKey={
              cardName:"",
              value:""
            };
            return (
              <>
                {item?.contents?.map((field, index) => {
                  if(field.key==='experienceCertificateKey'){
                    certificateKey.value=field.value;
                    certificateKey.cardName="experience"
                  }
                  if(field.key==='educationCertificateKey'){
                    certificateKey.value=field.value;
                    certificateKey.cardName="degree"
                  }
                  return (
                    <>
                      {field.type !== "none" && (
                        <div className="field-container" key={index}>
                          <div key={index} className="field-row">
                            <div className="field-label">{field.label}:</div>
                            <div className="field-value">
                              {field.value?.length > 10 ? (
                                <Tooltip title={field.value || "-"} arrow>
                                  <p
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {field?.value}
                                  </p>
                                </Tooltip>
                              ) : (
                                <>{field?.value}</>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
                <div className="update-btn-container">
                  {
                    <button
                      className="update-btn"
                      onClick={() => onDelete(item?._id,certificateKey)}
                    >
                      DELETE
                    </button>
                  }
                  {
                    <button
                      className="update-btn"
                      onClick={() => onClickHandler(item?._id)}
                    >
                      UPDATE
                    </button>
                  }
                </div>
                {(itemIndex!==content.length-1)&&<hr />}
              </>
            );
          })
          :
          <div>
            <p className="no-data">No Information found..</p>
          </div>
          }
        </div>
      </div>
    </div>
  );
};
