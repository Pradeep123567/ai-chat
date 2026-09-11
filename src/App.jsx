import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import { chatReducer, initialState } from './state/chatReducer'
import { makeId } from './utils/ids'
import { usePersistedReducer } from './hooks/useLocalStorage'
import { useChatStream } from './hooks/useChatStream'

function App() {
  const [state, dispatch] = usePersistedReducer(chatReducer, initialState)
  const { isStreaming, streamReply, stop } = useChatStream(dispatch)

  const activeConversation = state.conversations.find(
    (c) => c.id === state.activeConversationId
  )

  const handleNewChat = () => dispatch({ type: 'NEW_CONVERSATION' })

  const handleSelectChat = (id) =>
    dispatch({ type: 'SELECT_CONVERSATION', payload: { id } })

  const handleDeleteChat = (id) =>
    dispatch({ type: 'DELETE_CONVERSATION', payload: { id } })

  const handleSend = (content) => {
    if (!state.activeConversationId) return

    const message = {
      id: makeId('msg'),
      role: 'user',
      content,
      createdAt: Date.now(),
      status: 'complete',
    }

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        conversationId: state.activeConversationId,
        message,
      },
    })
    streamReply(state.activeConversationId, [...(activeConversation?.messages ?? []), message])
  }

  const handleRetry = () => {
    if (!state.activeConversationId || isStreaming) return
    const messages = activeConversation?.messages ?? []
    const lastUserIndex = messages.map((message) => message.role).lastIndexOf('user')
    if (lastUserIndex >= 0) streamReply(state.activeConversationId, messages.slice(0, lastUserIndex + 1))
  }

  return (
    <div className="h-screen flex bg-gray-950 text-white overflow-hidden">
      <Sidebar
        conversations={state.conversations}
        activeId={state.activeConversationId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatWindow
        messages={activeConversation?.messages ?? []}
        onSend={handleSend}
        onStop={stop}
        onRetry={handleRetry}
        disabled={!state.activeConversationId}
        isStreaming={isStreaming}
      />
    </div>
  )
}

export default App
