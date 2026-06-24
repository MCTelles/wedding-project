import React from 'react'
import { GiftsClaim, GiftsHero } from '@/components/gifts'
import { GetStaticProps, NextPage } from 'next'
import { Gift } from '@/interfaces/gifts'
import { getGifts } from '@/utils/gifts'
import { Box } from '@mui/material'
import { GiftClaim as GiftClaimDisclaimer } from '@/components/home/faqItems'

type HomePageProps = {
  gifts: Gift[]
}

const Home: NextPage<HomePageProps> = ({ gifts }) => {
  return (
    <>
      <GiftsHero />
      <GiftsClaim gifts={gifts} />
      <Box sx={{ my: 3 }}>
        <GiftClaimDisclaimer />
      </Box>
    </>
  )
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  let gifts: Gift[] = []
  try {
    gifts = await getGifts()
  } catch (error) {
    console.error('Failed to fetch gifts from Supabase:', error)
  }

  return {
    props: { gifts },
    revalidate: 300,
  }
}

export default Home
