import React, { FC } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import theme from '@/config/theme'

const FAQModelCard: FC = () => {
  return (
    <Card
      elevation={4}
      sx={{
        width: '100%',
        maxWidth: 560,
        mx: 'auto',
        borderRadius: 3,
        backgroundColor: theme.palette.secondary.dark,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
        <Typography
          variant="h3"
          align="center"
          color="secondary.contrastText"
          sx={{ mb: 1.5, fontSize: { xs: '1.3rem', sm: '1.55rem', md: '1.8rem' } }}
        >
          Titulo do card
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="secondary.contrastText"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          Texto modelo para ajustar depois.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default FAQModelCard
