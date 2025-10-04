'use client'

import { useEffect } from 'react'
import { initScrollAnimations } from '@/lib/animations'

/**
 * Animation Provider Component
 *
 * Initializes scroll animations globally using Intersection Observer API.
 * This component should be included in the root layout.
 */
export default function AnimationProvider() {
  useEffect(() => {
    // Initialize scroll animations when component mounts
    const cleanup = initScrollAnimations({
      rootMargin: '0px 0px -100px 0px', // Trigger 100px before viewport
      threshold: 0.1, // Trigger at 10% visibility
      once: true // Animate only once
    })

    // Cleanup observer on unmount
    return cleanup
  }, [])

  // This component doesn't render anything
  return null
}
