import React from 'react'
import { Typography } from '@mui/material'

function Help() {
  return (
    <section className="flex flex-col gap-4 p-3">
        <Typography
        variant="h4"
        component="div"
        sx={{ flexGrow: 1, fontWeight: "bold" }}
      >
        HELP AND DOCUMENTATION
      </Typography>
    </section>
  )
}
export default Help