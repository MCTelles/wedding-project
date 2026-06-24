import React, { FC } from 'react'
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import { Gift, GiftStatus } from '@/interfaces/gifts'
import theme from '@/config/theme'

type SingleGiftsProps = {
  gift: Gift
}

const SingleGift: FC<SingleGiftsProps> = ({ gift }: SingleGiftsProps) => {
  const buildFilloutId = (fresh = false): string => {
    const filloutParams = new URLSearchParams({
      id: gift.id,
      giftName: gift.name,
      giftCost: String(gift.cost),
      giftPicture: gift.picture,
      status: GiftStatus.Claimed,
      giftStatus: GiftStatus.Claimed,
    })

    if (fresh) {
      filloutParams.set('fresh', String(Date.now()))
    }

    return `${process.env.NEXT_PUBLIC_FILLOUT_GIFT_ID}?${filloutParams.toString()}`
  }

  const refreshFilloutId = (event: React.MouseEvent<HTMLElement>): void => {
    event.currentTarget.setAttribute('data-fillout-id', buildFilloutId(true))
  }

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
        data-fillout-id={buildFilloutId()}
        data-fillout-embed-type="popup"
        data-fillout-dynamic-resize
        data-fillout-popup-size="medium"
        data-id={gift.id}
        onMouseDown={refreshFilloutId}
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
          {gift.claimedByName && (
            <Box
              sx={{
                mt: 'auto',
                pt: 1.5,
                borderTop: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 0.25,
                }}
              >
                Resgatado por
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  wordBreak: 'break-word',
                }}
              >
                {gift.claimedByName}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default SingleGift
