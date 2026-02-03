import React, { FC } from 'react'
import Image from 'next/image'
import { Card, CardActionArea, Box, Typography } from '@mui/material'
import theme from '@/config/theme'

const FAQDressCode: FC = () => {
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
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <CardActionArea
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.annabellaw.com/post/what-to-wear-to-a-wedding#:~:text=Black%2DTie%20Optional%20Dress%20Code"
      >
        <Typography variant="h3" align="center" color="secondary.contrastText" sx={{ my: 1 }}>
          Como você deve se vestir?
        </Typography>
        <Typography variant="body1" align="center" color="secondary.contrastText">
          ???Formal or Cocktail???
        </Typography>
        <Typography variant="body1" align="center" color="secondary.contrastText" sx={{ mb: 1 }}>
          ???The wedding will be held entirely indoors???
        </Typography>
        <Box sx={{ borderRadius: 5, overflow: 'hidden', cursor: 'pointer' }}>
          <Image alt="Dress code" src="/images/home/attiree.png" width={400} height={400} />
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default FAQDressCode
