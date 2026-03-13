import React from 'react'
import { Box } from '@mui/material'
import './styles.css'

function DottedProgressBar({ progress = 60, dots = 4 }) {
  const filledDots = Math.ceil((progress / 100) * dots)
  


  return (
    <Box className="progress-container">
      {[...Array(dots)].map((_, index) => (
        <div
          key={index}
          className={`progress-dot ${index < filledDots ? 'progress-dot-filled' : 'progress-dot-empty'}`}
        />
      ))}
      <span className="progress-text">{progress}%</span>
    </Box>
  )
}

export default DottedProgressBar

