import React from 'react'
import { Icon } from "@iconify/react/dist/iconify.js";

const MemberTitle = (props) => {
    const {name = ""} = props;
  return (
    <div className="TeamMembersTable__header">
        <h2>{name}</h2>
        <Icon icon="" />
      </div>
  )
}

export default MemberTitle