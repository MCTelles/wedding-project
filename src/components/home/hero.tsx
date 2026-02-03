import React, { FC, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useMediaQuery from '@mui/material/useMediaQuery'
import { StyledButton } from '@/components/styled-button'
import { useTheme } from '@mui/material/styles'
import { CustomExpandMoreIcon } from '.'
import { Box, Container, Typography } from '@mui/material'
import weddingConfig from '@/config/wedding.config'
import { formatDate, getWeddingDate } from '@/utils/date'

const HomeHero: FC = () => {
  const { breakpoints } = useTheme()
  const matchTabletView = useMediaQuery(breakpoints.down('md'))

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://server.fillout.com/embed/v1/'
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <Box id="hero" sx={{ backgroundColor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
        <Box sx={{ minHeight: { xs: 213, md: 355 }, opacity: 0.9 }}>
          <Image
            src={'/images/banners/home-hero.webp'}
            alt="Home page banner, wedding"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority={true}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              opacity: 0.7,
              backgroundColor: 'secondary.dark',
            }}
          />
        </Box>
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            top: matchTabletView ? -150 : -300,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h1"
            textAlign="center"
            marginTop={'80px'}
            sx={{
              color: 'primary.contrastText',
              pb: 2,
              fontSize: { md: 112, sm: 72, xs: 54 },
              fontFamily: '"Dancing Script", cursive;',
            }}
          >
            {weddingConfig.people.groom.firstName} & {weddingConfig.people.bride.firstName}
          </Typography>
          <Typography variant="h2" textAlign="center" sx={{ color: 'primary.contrastText', pb: 2 }}>
            {formatDate(getWeddingDate())}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <Box sx={{ position: 'relative', top: -50, zIndex: 1 }}>
              <StyledButton
                color="dark"
                size="xlarge"
                data-fillout-id={process.env.NEXT_PUBLIC_FILLOUT_RSVP_ID}
                data-fillout-embed-type="popup"
                data-fillout-inherit-parameters
              >
                Confirmação de presença
              </StyledButton>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Link href="gifts">
                <StyledButton color="primary" size="large">
                  Escolha um presente aqui
                </StyledButton>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      <CustomExpandMoreIcon />
    </Box>
  )
}

export default HomeHero
