import React from 'react'
import { Box } from '@mui/material'

const HomeLaurel: React.FC = () => {
  return (
    <Box
      component="img"
      alt="golden laurel"
      src="/images/laurel/laurel-svgrepo-com.svg"
      sx={{
        display: { xs: 'none', lg: 'block' },
        position: 'absolute',
        zIndex: 2,
        width: { sm: 120, md: 150, lg: 170 },
        height: { sm: 120, md: 150, lg: 170 },
        right: { lg: -28 },
        bottom: { lg: -30 },
        pointerEvents: 'none',
      }}
    />
  )
}

export default HomeLaurel
