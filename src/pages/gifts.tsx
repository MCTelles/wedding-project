import React, { useEffect } from 'react'
import { GiftsClaim, GiftsHero } from '@/components/gifts'
import { NextPage } from 'next'
import { Gift } from '@/interfaces/gifts'
import { Box, CircularProgress } from '@mui/material'
import { getGiftsFromAirtable } from '@/utils/airtable'

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [giftsData, setGiftsData] = React.useState<Gift[]>([])

  useEffect(() => {
    let isMounted = true

    const fetchData = async (showLoading = false): Promise<void> => {
      if (showLoading) {
        setIsLoading(true)
      }

      try {
        const gifts = await getGiftsFromAirtable()

        if (isMounted) {
          setGiftsData(gifts)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const refreshVisiblePage = (): void => {
      if (!document.hidden) {
        fetchData()
      }
    }

    fetchData(true)

    const interval = window.setInterval(() => {
      fetchData()
    }, 10000)

    window.addEventListener('focus', refreshVisiblePage)
    document.addEventListener('visibilitychange', refreshVisiblePage)

    return () => {
      isMounted = false
      window.clearInterval(interval)
      window.removeEventListener('focus', refreshVisiblePage)
      document.removeEventListener('visibilitychange', refreshVisiblePage)
    }
  }, [])

  return (
    <>
      <GiftsHero />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <GiftsClaim gifts={giftsData} />
      )}
    </>
  )
}

export default Home
