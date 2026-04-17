import React, { FC, useEffect } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import { Gift } from '@/interfaces/gifts'
import SingleGift from './gift'

type GiftsHeroProps = {
  gifts: Gift[]
}

const GiftsClaim: FC<GiftsHeroProps> = ({ gifts }: GiftsHeroProps) => {
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
    <Box id="hero" sx={{ backgroundColor: 'background.paper', py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {gifts.length === 0 ? (
            <Grid size={12}>
              <Typography align="center" color="text.secondary">
                Nenhum presente disponível no momento.
              </Typography>
            </Grid>
          ) : (
            gifts.map((gift) => (
              <Grid key={gift.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <SingleGift gift={gift} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  )
}

export default GiftsClaim
