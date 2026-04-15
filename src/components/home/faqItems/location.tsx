import React, { FC } from 'react'
import Image from 'next/image'
import { Box, Card, CardActionArea, Divider, Typography } from '@mui/material'
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
        minHeight: { xs: 'auto', md: 520 },
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
          sx={{
            minHeight: { md: 62 },
            my: 1,
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2.2rem' },
          }}
        >
          Onde irá acontecer?
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
            gap: { xs: 3, sm: 2 },
            width: '100%',
            alignItems: 'stretch',
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Box
              sx={{
                minHeight: { xs: 'auto', sm: 80, md: 90 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant="h5"
                align="center"
                color="secondary.contrastText"
                sx={{ fontSize: { xs: '1rem', sm: '1.05rem', md: '1.15rem' } }}
              >
                Cerimônia
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="secondary.contrastText"
                sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
              >
                {weddingConfig.location.title}
                <br />
                {weddingConfig.location.address}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                mt: { xs: 2, md: 5 },
                aspectRatio: '1 / 1',
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
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: 'none', sm: 'block' }, borderColor: 'rgba(255,255,255,0.24)' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Box
              sx={{
                minHeight: { xs: 'auto', sm: 122, md: 134 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant="h5"
                align="center"
                color="secondary.contrastText"
                sx={{ fontSize: { xs: '1rem', sm: '1.05rem', md: '1.15rem' } }}
              >
                Festa
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="secondary.contrastText"
                sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
              >
                Local da recepção
                <br />
                Depois da cerimônia, esperamos vocês para celebrar com jantar, música e muita alegria.
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                mt: { xs: 2 },
                aspectRatio: '1 / 1',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.12)',
              }}
            />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default FAQLocation
