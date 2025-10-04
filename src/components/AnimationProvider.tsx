'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initScrollAnimations } from '@/lib/animations'

/**
 * Animation Provider Component
 *
 * Initializes scroll animations globally using Intersection Observer API.
 * This component should be included in the root layout.
 *
 * Re-initializes animations on page navigation to ensure content visibility.
 */
export default function AnimationProvider() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize scroll animations when component mounts or pathname changes
    const cleanup = initScrollAnimations({
      rootMargin: '0px 0px -100px 0px', // Trigger 100px before viewport
      threshold: 0.1, // Trigger at 10% visibility
      once: true // Animate only once
    })

    // Cleanup observer on unmount or before re-initialization
    return cleanup
  }, [pathname]) // Re-initialize when pathname changes

  // This component doesn't render anything
  return null
}
