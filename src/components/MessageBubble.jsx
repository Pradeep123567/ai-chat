import { useState } from 'react'
import MarkdownMessage from './MarkdownMessage'

function MessageBubble({ message, onRetry }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const copy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return <article className={`group flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
    {!isUser && <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-bold">AI</div>}
    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-gray-100'}`}>
      <MarkdownMessage content={message.content || (message.status === 'streaming' ? 'Thinking…' : '')} />
      {message.status === 'error' && <div className="mt-3 border-t border-red-400/30 pt-3 text-sm text-red-200">{message.error}<button onClick={onRetry} className="ml-3 underline hover:text-white">Retry</button></div>}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400"><time>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>{message.status === 'streaming' && <span className="animate-pulse text-emerald-300">Generating</span>}{message.content && <button onClick={copy} className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-white">{copied ? 'Copied' : 'Copy'}</button>}</div>
    </div>
  </article>
}

export default MessageBubble
