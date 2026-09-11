import { useEffect, useReducer } from 'react'

export function loadChatState(initialState) {
  try {
    const saved = localStorage.getItem('ai-chat-state')
    if (!saved) return initialState
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed.conversations)) return initialState
    return { conversations: parsed.conversations, activeConversationId: parsed.activeConversationId ?? null }
  } catch {
    return initialState
  }
}

export function usePersistedReducer(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState, loadChatState)
  useEffect(() => { localStorage.setItem('ai-chat-state', JSON.stringify(state)) }, [state])
  return [state, dispatch]
}
