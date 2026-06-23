import React from 'react'
import { GiftsClaim, GiftsHero } from '@/components/gifts'
import { GetStaticProps, NextPage } from 'next'
import { Gift } from '@/interfaces/gifts'
import { getGiftsFromAirtable } from '@/utils/airtable'
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
    const timeout = new Promise<Gift[]>((_, reject) =>
      setTimeout(() => reject(new Error('Airtable timeout')), 30000)
    )
    gifts = await Promise.race([getGiftsFromAirtable(), timeout])
  } catch (error) {
    console.error('Failed to fetch gifts from Airtable:', error)
  }

  return {
    props: { gifts },
    revalidate: 60,
  }
}

export default Home
