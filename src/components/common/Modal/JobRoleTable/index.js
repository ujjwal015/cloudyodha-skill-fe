import * as React from 'react';
import "./JobRoleTable.css"


export default function JobRoleTable({data=[]}) {
  return (
    <div className='jobrole-dialog-list'>
        {data.length>0 && data.map((row,idx) => (

              <p>
                {idx+1}. {row.jobRole || "-"}
              </p>

          ))}
    </div>
  );
}