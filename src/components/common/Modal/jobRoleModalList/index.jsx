import React from 'react'
import './style.css'

const JobRoleTableModal = ({ open, onClose, data,clientNameOfJobRoleList }) => {
    console.log("jobRolemodalList",data)
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{clientNameOfJobRoleList}</h2>
            <p className="modal-subtitle">Number of associated Jobrole List : {data.length}</p>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="table-container">
          <table className="skill-table">
            <thead>
              <tr>
                <th>JOBROLE</th>
                <th>QUALIFICATION PACK (QP Code)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item?.qpCode}>
                  <td>{item?.jobRole}</td>
                  <td>{item?.qpCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default JobRoleTableModal

