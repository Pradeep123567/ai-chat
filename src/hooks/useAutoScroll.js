import { useEffect, useRef } from 'react'

export function useAutoScroll(messages) {
  const containerRef = useRef(null)
  const isNearBottomRef = useRef(true)
  const onScroll = () => {
    const element = containerRef.current
    if (element) isNearBottomRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 96
  }
  useEffect(() => {
    const element = containerRef.current
    if (element && isNearBottomRef.current) element.scrollTop = element.scrollHeight
  }, [messages])
  return { containerRef, onScroll }
}
