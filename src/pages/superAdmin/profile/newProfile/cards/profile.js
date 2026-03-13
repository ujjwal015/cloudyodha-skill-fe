import { Tooltip } from "@mui/material";

export const ProfileCard = ({ title, content, onEdit }) => {
  const isAddressCard = title === "Address";
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
        <div className="edit-btn">
        {
        <button className="edit-btn" onClick={onEdit}>
        Edit
        </button>
        }
        </div>
      </div>
      <hr />
     
      <div className="card-body">
        
        {isAddressCard ? (
          <>
            <div className="content-row">
              <strong>Current Address:</strong>
              {content
                .filter((field) => field.group === "currentAddress")
                .map((field, index) => (
                  <div key={index} className="content">
                    <div className="content-label">{field.label}:</div>
                    <div className="content-value">
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
                ))}
            </div>
            <div className="content-row">
              <strong>Permanent Address:</strong>
              {content
                .filter((field) => field.group === "permanentAddress")
                .map((field, index) => (
                  <div key={index} className="content">
                    <div className="content-label">{field.label}:</div>
                    <div className="content-value">
                      {" "}
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
                ))}
            </div>
          </>
        ) : (
          content.map((field, index) => (
            <div key={index} className="content-row">
              <div className="content-label">{field.label}:</div>
              <div className="content-value">
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
          ))
        )}
      </div>
    </div>
  );
};
