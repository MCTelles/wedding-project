import React, { FC } from 'react'
import Image from 'next/image'
import { Box, Card, CardActionArea, Typography } from '@mui/material'
import theme from '@/config/theme'
import weddingConfig from '@/config/wedding.config'

const FAQLocation: FC = () => {
  return (
    <Card
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 560,
        minHeight: { md: 520 },
        mx: 'auto',
        borderRadius: 3,
        overflow: 'visible',
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
        href={weddingConfig.location.link}
      >
        <Typography
          variant="h2"
          align="center"
          color="secondary.contrastText"
          sx={{ my: 1, fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2.2rem' } }}
        >
          Onde irá acontecer?
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="secondary.contrastText"
          sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' } }}
        >
          {weddingConfig.location.title}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="secondary.contrastText"
          sx={{ mb: 2, maxWidth: 720, fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {weddingConfig.location.address}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 440,
            aspectRatio: { xs: '4 / 3', sm: '16 / 9', md: '1 / 1' },
            borderRadius: 2,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <Image
            alt={`Mapa de ${weddingConfig.location.title}`}
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${weddingConfig.location.latLng}&zoom=15&size=800x400&markers=${weddingConfig.location.latLng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
            layout="fill"
            objectFit="cover"
          />
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default FAQLocation
