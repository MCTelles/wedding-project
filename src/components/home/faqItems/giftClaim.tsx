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
    >
      <CardActionArea
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}
        target="_blank"
        rel="noopener noreferrer"
        href={`mailto:${adminConfig.email}`}
      >
        <Typography variant="h3" align="center" color="secondary.contrastText" sx={{ my: 1 }}>
          Escolhi o presente errado!
        </Typography>
        <Typography variant="body1" align="center" color="secondary.contrastText">
          Sem problema! Envie um e-mail para:
        </Typography>
        <Typography variant="body1" align="center" color="secondary.contrastText" sx={{ mb: 1 }}>
          {adminConfig.email} (precisa disso?)
        </Typography>
      </CardActionArea>
    </Card>
  )
}

export default FAQGiftClaim
