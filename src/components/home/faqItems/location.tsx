import React, { FC } from 'react'
import Image from 'next/image'
import { Box, Card, CardContent, Divider, Link as MuiLink, Typography } from '@mui/material'
import theme from '@/config/theme'
import weddingConfig from '@/config/wedding.config'

const receptionLink =
  'https://www.google.com/maps/place/Tamandar%C3%A9+Iate+Clube/@-29.7504464,-57.0940466,756m/data=!3m2!1e3!4b1!4m6!3m5!1s0x94535b50eac58243:0x5b5017af7a971b74!8m2!3d-29.7504464!4d-57.0914717!16s%2Fg%2F1tyyy66q?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D'

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
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: { xs: 2, sm: 2.5, md: 3 },
          '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } },
        }}
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
                <MuiLink
                  href={weddingConfig.location.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="always"
                >
                  {weddingConfig.location.address}
                </MuiLink>
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                mt: { xs: 2, md: 'auto' },
                aspectRatio: '1 / 1',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            >
              <Image alt={weddingConfig.location.title} src="/church.png" layout="fill" objectFit="contain" />
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
                Recepção
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="secondary.contrastText"
                sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
              >
                Tamandaré Iate Clube
                <br />
                <MuiLink
                  href={receptionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="always"
                >
                  R. Gen. Vitorino, 1240 - Centro, Uruguaiana - RS
                </MuiLink>
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                mt: { xs: 2, md: 'auto' },
                aspectRatio: '1 / 1',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            >
              <Image alt="Local da recepcao" src="/reception.jpg" layout="fill" objectFit="contain" />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default FAQLocation
