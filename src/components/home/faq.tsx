import React, { FC } from 'react'
import { Container, Divider, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import { DressCode, Location, ModelCard } from './faqItems'
import { HomeLaurel } from '../laurel'

const HomeFAQ: FC = () => {
  return (
    <Box id="faq" sx={{ pt: { xs: 2, md: 4 }, backgroundColor: 'background.paper', pb: 10, overflowX: 'hidden' }}>
      <Container maxWidth="lg" sx={{ width: '100%', mx: 'auto', px: { xs: 2, sm: 4, md: 5 } }}>
        <Grid container justifyContent="center" alignItems="stretch" spacing={{ xs: 4, md: 3 }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
            <DressCode />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ position: 'relative', display: 'flex' }}>
            <HomeLaurel />
            <Location />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', mt: { xs: 0, md: 2 } }}>
            <ModelCard />
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ width: '50%', mx: 'auto', mt: 5 }} />
    </Box>
  )
}

export default HomeFAQ
