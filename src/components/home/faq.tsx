import React, { FC } from 'react'
import { Container, Divider, Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import { DressCode, Location } from './faqItems'
import { HomeLaurel } from '../laurel'

const HomeFAQ: FC = () => {
  return (
    <Box id="faq" sx={{ pt: { xs: 2, md: 4 }, backgroundColor: 'background.paper', pb: 10, overflowX: 'hidden' }}>
      <Typography variant="h2" color="primary" align="center" sx={{ mb: 2, fontSize: { md: '32px' } }}>
        FAQ
      </Typography>

      <Container maxWidth="lg" sx={{ width: '100%', mx: 'auto' }}>
        <Grid container justifyContent="center" alignItems="center" spacing={{ xs: 4, md: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 9.5 }}>
            <HomeLaurel />
            <Location />
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ width: '50%', mx: 'auto', mt: 5 }} />
    </Box>
  )
}

export default HomeFAQ
