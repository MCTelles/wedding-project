import React, { FC } from 'react'
import { Card, CardActionArea, Typography } from '@mui/material'
import theme from '@/config/theme'
import adminConfig from '@/config/admin.config'

const FAQGiftClaim: FC = () => {
  return (
    <Card
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        backgroundColor: theme.palette.secondary.dark,
        maxWidth: 412,
        mx: 'auto',
      }}
    ></Card>
  )
}

export default FAQGiftClaim
