import React, { FC } from 'react'
import Image from 'next/image'
import { Box, Card, CardContent, Typography } from '@mui/material'
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
        minHeight: { xs: 'auto', md: 520 },
        mx: 'auto',
        borderRadius: 3,
        backgroundColor: theme.palette.secondary.dark,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          p: { xs: 2, sm: 2.5, md: 3 },
          '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } },
        }}
      >
        <Typography
          variant="h3"
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
          Como você deve se vestir?
        </Typography>
        <Box
          sx={{
            minHeight: { xs: 'auto', sm: 80, md: 90 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <Typography
            variant="body1"
            align="center"
            color="secondary.contrastText"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            Traje social.
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="secondary.contrastText"
            sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            Escolha algo confortável para celebrar conosco.
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: { xs: 300, sm: 320, md: 330 },
            mt: { xs: 2, md: 'auto' },
            aspectRatio: '1 / 1',
            borderRadius: 2,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <Image alt="Dress code" src="/attire.jpeg" layout="fill" objectFit="cover" />
        </Box>
      </CardContent>
    </Card>
  )
}

export default FAQDressCode
