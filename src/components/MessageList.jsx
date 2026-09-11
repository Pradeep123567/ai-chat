import { useAutoScroll } from '../hooks/useAutoScroll'
import MessageBubble from './MessageBubble'

function MessageList({ messages, onRetry }) {
  const { containerRef, onScroll } = useAutoScroll(messages)
  return <section ref={containerRef} onScroll={onScroll} className="flex-1 overflow-y-auto"><div className="max-w-3xl mx-auto px-4 py-8 space-y-6">{messages.map((message) => <MessageBubble key={message.id} message={message} onRetry={onRetry} />)}</div></section>
}

export default MessageList
