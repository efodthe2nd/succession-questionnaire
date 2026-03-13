// components/FacebookPixel.tsx
'use client'
import { useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'

export default function FacebookPixel() {
  useEffect(() => {
    ReactPixel.init('3549499625109395')
    ReactPixel.pageView()
  }, [])

  return null
}