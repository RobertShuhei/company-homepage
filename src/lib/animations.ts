'use client'

/**
 * Animation Utilities for Global Genex Inc. Website
 *
 * Provides Intersection Observer-based scroll animations
 * for enhanced user experience with performance optimization.
 */

interface AnimationOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

const defaultOptions: AnimationOptions = {
  root: null,
  rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
  threshold: 0.1, // Trigger when 10% of element is visible
  once: true // Animate only once (unobserve after animation)
}

/**
 * Initialize scroll animations for elements with .animate-on-scroll class
 *
 * @param options - Intersection Observer options
 * @returns Function to disconnect the observer
 */
export function initScrollAnimations(options: AnimationOptions = {}): () => void {
  if (typeof window === 'undefined') {
    return () => {} // Return no-op function for SSR
  }

  const observerOptions = { ...defaultOptions, ...options }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add is-visible class to trigger animation
        entry.target.classList.add('is-visible')

        // Unobserve element if once: true
        if (observerOptions.once) {
          observer.unobserve(entry.target)
        }
      } else if (!observerOptions.once) {
        // Remove is-visible class when element exits viewport (if once: false)
        entry.target.classList.remove('is-visible')
      }
    })
  }, observerOptions)

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll('.animate-on-scroll')
  animatedElements.forEach((el) => observer.observe(el))

  // Return disconnect function for cleanup
  return () => observer.disconnect()
}

/**
 * Add animation classes to an element programmatically
 *
 * @param element - DOM element to animate
 * @param animationType - Type of animation (fade-in-up, fade-in-left, fade-in-right, scale-in)
 * @param delay - Optional delay in milliseconds (0-500ms recommended)
 */
export function addScrollAnimation(
  element: HTMLElement,
  animationType: 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'scale-in',
  delay: number = 0
): void {
  element.classList.add('animate-on-scroll', animationType)

  if (delay > 0 && delay <= 500) {
    const staggerClass = `stagger-${Math.ceil(delay / 100)}`
    element.classList.add(staggerClass)
  }
}

/**
 * Create a staggered animation effect for a group of elements
 *
 * @param elements - Array or NodeList of elements to animate
 * @param animationType - Type of animation
 * @param staggerDelay - Delay between each element in milliseconds (default: 100ms)
 */
export function staggerAnimation(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  animationType: 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'scale-in',
  staggerDelay: number = 100
): void {
  const elementsArray = Array.from(elements)

  elementsArray.forEach((element, index) => {
    const delay = index * staggerDelay
    addScrollAnimation(element, animationType, delay)
  })
}

/**
 * Hook to initialize animations on component mount (for Next.js App Router)
 *
 * Usage in a Client Component:
 * ```tsx
 * 'use client'
 * import { useEffect } from 'react'
 * import { initScrollAnimations } from '@/lib/animations'
 *
 * export default function MyComponent() {
 *   useEffect(() => {
 *     const cleanup = initScrollAnimations()
 *     return cleanup // Cleanup on unmount
 *   }, [])
 *
 *   return <div className="animate-on-scroll fade-in-up">Content</div>
 * }
 * ```
 */
export function useScrollAnimations(options: AnimationOptions = {}) {
  if (typeof window === 'undefined') return

  const cleanup = initScrollAnimations(options)

  // Return cleanup function for useEffect
  return cleanup
}

/**
 * Check if user prefers reduced motion (accessibility)
 *
 * @returns boolean - true if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Conditionally apply animation based on user's motion preference
 *
 * @param element - DOM element
 * @param animationType - Type of animation
 * @param delay - Optional delay
 */
export function addAccessibleAnimation(
  element: HTMLElement,
  animationType: 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'scale-in',
  delay: number = 0
): void {
  if (!prefersReducedMotion()) {
    addScrollAnimation(element, animationType, delay)
  } else {
    // If reduced motion is preferred, just ensure element is visible
    element.style.opacity = '1'
  }
}
