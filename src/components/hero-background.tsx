import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'

type HeroImage = { src: string; position: string }

export const heroImages: HeroImage[] = [
  { src: '/images/home/LeticiaeRafael-103.jpg', position: 'center 20%' },
  { src: '/images/home/LeticiaeRafael-104.jpg', position: 'center 20%' },
  { src: '/images/home/LeticiaeRafael-105.jpg', position: 'center 20%' },
  { src: '/images/home/LeticiaeRafael-106.jpg', position: 'center 15%' },
  { src: '/images/home/LeticiaeRafael-107.jpg', position: 'center 15%' },
  { src: '/images/home/LeticiaeRafael-113.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-114.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-115.jpg', position: 'center 20%' },
  { src: '/images/home/LeticiaeRafael-120.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-122.jpg', position: 'center 40%' },
  { src: '/images/home/LeticiaeRafael-126.jpg', position: 'center 40%' },
  { src: '/images/home/LeticiaeRafael-127.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-132.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-133.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-134.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-142.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-144.jpg', position: 'center 20%' },
  { src: '/images/home/LeticiaeRafael-146.jpg', position: 'center 40%' },
  { src: '/images/home/LeticiaeRafael-158.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-160.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-161.jpg', position: 'center 20%' },
  { src: '/images/home/LeticiaeRafael-162.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-164.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-165.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-167.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-170.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-173.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-175.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-178.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-180.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-182.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-184.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-186.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-190.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-191.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-194.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-196.jpg', position: 'center 40%' },
  { src: '/images/home/LeticiaeRafael-199.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-203.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-206.jpg', position: 'center 45%' },
  { src: '/images/home/LeticiaeRafael-219.jpg', position: 'center 25%' },
  { src: '/images/home/LeticiaeRafael-220.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-221.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-222.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-225.jpg', position: 'center 35%' },
  { src: '/images/home/LeticiaeRafael-226.jpg', position: 'center 30%' },
  { src: '/images/home/LeticiaeRafael-227.jpg', position: 'center 40%' },
  { src: '/images/home/LeticiaeRafael-229.jpg', position: 'center 45%' },
  { src: '/images/home/LeticiaeRafael-230.jpg', position: 'center 45%' },
  { src: '/images/home/LeticiaeRafael-237.jpg', position: 'center 30%' },
]

type HeroBackgroundProps = {
  alt: string
  priority?: boolean
}

const HeroBackground: FC<HeroBackgroundProps> = ({ alt, priority = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = window.setInterval(() => {
      setCurrentImageIndex((currentIndex) => (currentIndex + 1) % heroImages.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <>
      <Image
        src={heroImages[currentImageIndex].src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        objectPosition={heroImages[currentImageIndex].position}
        priority={priority}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          opacity: 0.7,
          backgroundColor: 'secondary.dark',
        }}
      />
    </>
  )
}

export default HeroBackground
