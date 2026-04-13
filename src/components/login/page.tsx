import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Login from './login'
import HeroBackground from '@/components/hero-background'

const LoginPage: FC = () => {
  return (
    <Box id="hero" sx={{ backgroundColor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden', opacity: 0.9 }}>
        <Box>
          <HeroBackground alt="Login banner, wedding" priority={true} />
        </Box>
        <Login />
      </Box>
    </Box>
  )
}

export default LoginPage
