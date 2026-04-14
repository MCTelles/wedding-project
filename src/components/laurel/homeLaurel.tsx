import React from 'react'
import { Box } from '@mui/material'

const HomeLaurel: React.FC = () => {
  return (
    <Box
      component="img"
      alt="golden laurel"
      src="/images/laurel/laurel-svgrepo-com.svg"
      sx={{
        display: { xs: 'none', sm: 'block' },
        position: 'absolute',
        zIndex: 2,
        width: { sm: 150, md: 190, lg: 220 },
        height: { sm: 150, md: 190, lg: 220 },
        right: { sm: -34, md: -48, lg: -64 },
        bottom: { sm: -30, md: -45, lg: -60 },
        pointerEvents: 'none',
      }}
    />
  )
}

export default HomeLaurel
