import ConversationItem from './ConversationItem'

function Sidebar({
  conversations,
  activeId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md font-medium transition-colors"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs text-gray-500 px-2 py-1 uppercase tracking-wider">
          Recent
        </div>

        {conversations.length === 0 && (
          <div className="text-sm text-gray-500 px-2 py-4 text-center">
            No conversations yet.
          </div>
        )}

        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeId}
            onSelect={onSelectChat}
            onDelete={onDeleteChat}
          />
        ))}
      </div>
    </aside>
  )
}

export default Sidebar