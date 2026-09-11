import MessageList from './MessageList'
import ChatInput from './ChatInput'

function ChatWindow({ messages, onSend, onStop, onRetry, disabled, isStreaming }) {
  const isEmpty = !messages || messages.length === 0

  return (
    <main className="flex-1 flex flex-col">
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-5xl mb-4">💬</div>
            <div className="text-lg">
              {disabled
                ? 'Create a new chat to start'
                : 'Send a message to begin'}
            </div>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} onRetry={onRetry} />
      )}
      <ChatInput onSend={onSend} onStop={onStop} disabled={disabled} isStreaming={isStreaming} />
    </main>
  )
}

export default ChatWindow
