import React from 'react'
import MultipleSelect from '../../../../components/common/MultiSelect'

function GlobalClientSelect({selectedIds=[],setSelectedIds,assignedClientList=[],handleChange,label=""}) {
  return (
    <div>
    <MultipleSelect
    setSelectedIds={setSelectedIds || null}
    selectedIds={selectedIds || []}
    options={assignedClientList || []}
    handleChange={handleChange || null}
    label={label || ""}
  /></div>
  )
}

export default GlobalClientSelect