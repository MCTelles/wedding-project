import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'

export const heroImages = [
  '/images/home/IMG-20240611-WA0014.jpg',
  '/images/home/IMG-20260202-WA0016.jpg',
  '/images/home/IMG-20260202-WA0017.jpg',
  '/images/home/IMG-20260202-WA0018.jpg',
  '/images/home/IMG-20260202-WA0019.jpg',
  '/images/home/IMG-20260202-WA0020.jpg',
  '/images/home/IMG-20260202-WA0022.jpg',
  '/images/home/IMG-20260202-WA0023.jpg',
  '/images/home/IMG-20260202-WA0024.jpg',
  '/images/home/IMG-20260202-WA0025.jpg',
  '/images/home/IMG-20260202-WA0026.jpg',
  '/images/home/IMG-20260202-WA0027.jpg',
  '/images/home/IMG-20260202-WA0028.jpg',
  '/images/home/IMG-20260202-WA0029.jpg',
  '/images/home/IMG-20260202-WA0031.jpg',
  '/images/home/IMG-20260202-WA0032.jpg',
  '/images/home/IMG-20260202-WA0033.jpg',
  '/images/home/IMG-20260202-WA0034.jpg',
  '/images/home/IMG-20260202-WA0035.jpg',
  '/images/home/IMG-20260202-WA0036.jpg',
  '/images/home/IMG-20260202-WA0037.jpg',
  '/images/home/IMG-20260202-WA0039.jpg',
  '/images/home/IMG-20260202-WA0040.jpg',
  '/images/home/IMG-20260202-WA0042.jpg',
  '/images/home/IMG-20260202-WA0043.jpg',
  '/images/home/IMG-20260202-WA0044.jpg',
  '/images/home/IMG-20260202-WA0046.jpg',
  '/images/home/IMG-20260202-WA0047.jpg',
  '/images/home/IMG-20260202-WA0048.jpg',
  '/images/home/IMG-20260202-WA0049.jpg',
  '/images/home/IMG-20260202-WA0050.jpg',
  '/images/home/IMG-20260202-WA0051.jpg',
  '/images/home/IMG-20260202-WA0052.jpg',
  '/images/home/IMG-20260202-WA0053.jpg',
  '/images/home/IMG-20260202-WA0054.jpg',
  '/images/home/IMG-20260202-WA0055.jpg',
  '/images/home/IMG-20260202-WA0056.jpg',
  '/images/home/IMG-20260202-WA0057.jpg',
  '/images/home/IMG-20260202-WA0058.jpg',
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
        src={heroImages[currentImageIndex]}
        alt={alt}
        layout="fill"
        objectFit="cover"
        objectPosition="center 38%"
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
