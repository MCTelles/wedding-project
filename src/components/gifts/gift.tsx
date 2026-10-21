import React, { FC } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Chip, Typography } from '@mui/material'
import { Gift, GiftStatus } from '@/interfaces/gifts'
import theme from '@/config/theme'

type SingleGiftsProps = {
  gift: Gift
  onSelect: (gift: Gift) => void
}

const SingleGift: FC<SingleGiftsProps> = ({ gift, onSelect }) => {
  const available = gift.status !== GiftStatus.Claimed

  return (
    <Card
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: 260,
        mx: 'auto',
        borderRadius: 2,
        backgroundColor: theme.palette.secondary.main,
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        onClick={() => onSelect(gift)}
        disabled={!available}
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
            aspectRatio: '9 / 16',
            height: 'auto',
            width: '100%',
            objectFit: 'contain',
            backgroundColor: '#fff',
          }}
        />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            px: 2,
            py: 1.5,
          }}
        >
          {!available && <Chip label="Já escolhido" size="small" sx={{ alignSelf: 'flex-start', mb: 1 }} />}
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
              minHeight: '2.5rem',
              mb: 1,
            }}
          >
            {gift.name}
          </Typography>
          <Typography
            variant="h6"
            color="secondary.contrastText"
            sx={{ fontSize: '1rem', mb: gift.description ? 1 : 0 }}
          >
            R$ {gift.cost}
          </Typography>
          {gift.description && (
            <Typography
              variant="body2"
              color="secondary.contrastText"
              sx={{
                fontSize: '0.82rem',
                lineHeight: 1.35,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
              }}
            >
              {gift.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default SingleGift
