import React, { FC, useState } from 'react'
import Link from 'next/link'
import useMediaQuery from '@mui/material/useMediaQuery'
import { StyledButton } from '@/components/styled-button'
import { useTheme } from '@mui/material/styles'
import { CustomExpandMoreIcon } from '.'
import { Box, Container, Typography } from '@mui/material'
import weddingConfig from '@/config/wedding.config'
import { formatDate, getWeddingDate } from '@/utils/date'
import HeroBackground from '@/components/hero-background'
import RsvpDialog from './rsvp-dialog'

const HomeHero: FC = () => {
  const { breakpoints } = useTheme()
  const matchTabletView = useMediaQuery(breakpoints.down('md'))
  const [rsvpOpen, setRsvpOpen] = useState(false)

  return (
    <Box id="hero" sx={{ backgroundColor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
        <Box sx={{ minHeight: { xs: 213, md: 355 }, opacity: 0.9 }}>
          <HeroBackground alt="Home page banner, wedding" priority={true} />
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
            {weddingConfig.people.bride.firstName} & {weddingConfig.people.groom.firstName}
          </Typography>
          <Typography variant="h2" textAlign="center" sx={{ color: 'primary.contrastText', pb: 2 }}>
            {formatDate(getWeddingDate())}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <Box sx={{ position: 'relative', top: -50, zIndex: 1 }}>
              <StyledButton
                color="dark"
                size="xlarge"
                onClick={() => setRsvpOpen(true)}
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
      <RsvpDialog open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </Box>
  )
}

export default HomeHero
