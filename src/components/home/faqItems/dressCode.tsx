import React, { FC } from 'react'
import Image from 'next/image'
import { Box, Card, CardActionArea, Typography } from '@mui/material'
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
        width: '100%',
        maxWidth: 500,
        minHeight: { md: 520 },
        mx: 'auto',
        borderRadius: 3,
        backgroundColor: theme.palette.secondary.dark,
      }}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: { xs: 2, sm: 2.5, md: 3 },
        }}
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.annabellaw.com/post/what-to-wear-to-a-wedding#:~:text=Black%2DTie%20Optional%20Dress%20Code"
      >
        <Typography
          variant="h3"
          align="center"
          color="secondary.contrastText"
          sx={{ my: 1, fontSize: { xs: '1.3rem', sm: '1.55rem', md: '1.8rem' } }}
        >
          Como voce deve se vestir?
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="secondary.contrastText"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          Traje social ou esporte fino.
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="secondary.contrastText"
          sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          Escolha algo confortavel para celebrar conosco.
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: { xs: 300, sm: 320, md: 330 },
            aspectRatio: '1 / 1',
            borderRadius: 2,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <Image alt="Dress code" src="/images/home/attiree.png" layout="fill" objectFit="cover" />
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default FAQDressCode
