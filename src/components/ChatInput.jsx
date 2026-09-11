import { useState } from 'react'

function ChatInput({ onSend, onStop, disabled, isStreaming }) {
  const [text, setText] = useState('')

  const canSend = text.trim().length > 0 && !disabled && !isStreaming

  const handleSubmit = () => {
    if (!canSend) return
    onSend(text.trim())
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-gray-800 bg-gray-950 p-4">
      <div className="max-w-3xl mx-auto flex gap-2 items-end">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            disabled ? 'Create a new chat to start' : 'Send a message...'
          }
          className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-emerald-600 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isStreaming ? (
          <button onClick={onStop} className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-lg font-medium transition-colors">Stop</button>
        ) : (
          <button onClick={handleSubmit} disabled={!canSend} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium transition-colors">Send</button>
        )}
      </div>
    </div>
  )
}

export default ChatInput
