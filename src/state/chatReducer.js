import { makeId } from '../utils/ids'

export const initialState = {
  conversations: [],
  activeConversationId: null,
}

export function chatReducer(state, action) {
  switch (action.type) {
    case 'NEW_CONVERSATION': {
      const newConv = {
        id: makeId('conv'),
        title: 'New chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      return {
        ...state,
        conversations: [newConv, ...state.conversations],
        activeConversationId: newConv.id,
      }
    }

    case 'SELECT_CONVERSATION': {
      return {
        ...state,
        activeConversationId: action.payload.id,
      }
    }

    case 'DELETE_CONVERSATION': {
      const remaining = state.conversations.filter(
        (c) => c.id !== action.payload.id
      )
      const wasActive = state.activeConversationId === action.payload.id
      return {
        ...state,
        conversations: remaining,
        activeConversationId: wasActive
          ? remaining[0]?.id ?? null
          : state.activeConversationId,
      }
    }

    case 'ADD_MESSAGE': {
      const { conversationId, message } = action.payload
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                updatedAt: Date.now(),
                title:
                  conv.messages.length === 0 && message.role === 'user'
                    ? message.content.slice(0, 30)
                    : conv.title,
              }
            : conv
        ),
      }
    }

    case 'START_ASSISTANT_MESSAGE': {
      const { conversationId, message } = action.payload
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, message], updatedAt: Date.now() }
            : conv
        ),
      }
    }

    case 'APPEND_TOKEN': {
      const { conversationId, messageId, token } = action.payload
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                updatedAt: Date.now(),
                messages: conv.messages.map((message) =>
                  message.id === messageId ? { ...message, content: message.content + token } : message
                ),
              }
            : conv
        ),
      }
    }

    case 'FINISH_ASSISTANT_MESSAGE':
    case 'FAIL_ASSISTANT_MESSAGE': {
      const { conversationId, messageId, error } = action.payload
      const status = action.type === 'FINISH_ASSISTANT_MESSAGE' ? 'complete' : 'error'
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                updatedAt: Date.now(),
                messages: conv.messages.map((message) =>
                  message.id === messageId ? { ...message, status, ...(error ? { error } : {}) } : message
                ),
              }
            : conv
        ),
      }
    }

    default:
      return state
  }
}
