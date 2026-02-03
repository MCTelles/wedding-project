import React from 'react'
import { HomeHero, HomeFAQ } from '@/components/home'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const HomeCountdown = dynamic(() => import('@/components/home/date/date'), { ssr: false })

const Home: NextPage = () => {
  return (
    <>
      <HomeHero />
      <HomeCountdown />
      <HomeFAQ />
    </>
  )
}

export default Home
