function ConversationItem({ conversation, isActive, onSelect, onDelete }) {
  const handleClick = () => onSelect(conversation.id)

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(conversation.id)
  }

  return (
    <div
      onClick={handleClick}
      className={`group flex items-center justify-between px-3 py-2 rounded-md mb-1 text-sm cursor-pointer transition-colors ${
        isActive
          ? 'bg-gray-800 text-white'
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
      }`}
    >
      <div className="truncate font-medium flex-1">
        {conversation.title}
      </div>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 ml-2 transition-opacity"
        aria-label="Delete conversation"
      >
        ✕
      </button>
    </div>
  )
}

export default ConversationItem