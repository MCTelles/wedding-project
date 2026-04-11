import React, { FC } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import { Gift } from '@/interfaces/gifts'
import theme from '@/config/theme'

type SingleGiftsProps = {
  gift: Gift
}

const SingleGift: FC<SingleGiftsProps> = ({ gift }: SingleGiftsProps) => {
  return (
    <Card
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 390,
        width: '100%',
        maxWidth: 280,
        mx: 'auto',
        borderRadius: 2,
        backgroundColor: theme.palette.secondary.main,
      }}
    >
      <CardActionArea
        data-fillout-id={`${process.env.NEXT_PUBLIC_FILLOUT_GIFT_ID}?id=${gift.id}`}
        data-fillout-embed-type="popup"
        data-fillout-inherit-parameters
        data-fillout-dynamic-resize
        data-fillout-popup-size="medium"
        data-id={gift.id}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <CardMedia
          component="img"
          image={gift.picture}
          alt={gift.name}
          sx={{
            height: 240,
            width: '100%',
            objectFit: 'contain',
            backgroundColor: '#fff',
          }}
        />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 0,
            px: 2,
            py: 2,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            color="secondary.contrastText"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.25,
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.75rem',
              mb: 1.25,
            }}
          >
            {gift.name}
          </Typography>
          <Typography variant="h6" color="secondary.contrastText" sx={{ fontSize: '1rem', mb: 1 }}>
            R$ {gift.cost}
          </Typography>
          <Typography
            variant="body2"
            color="secondary.contrastText"
            sx={{
              fontSize: '0.82rem',
              lineHeight: 1.35,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            }}
          >
            {gift.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default SingleGift
