import { useCallback, useRef, useState } from 'react'
import { makeId } from '../utils/ids'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

function readSseChunk(chunk, onToken) {
  for (const line of chunk.split('\n')) {
    if (!line.startsWith('data: ')) continue
    const data = line.slice(6).trim()
    if (!data || data === '[DONE]') continue
    try {
      const token = JSON.parse(data).choices?.[0]?.delta?.content
      if (token) onToken(token)
    } catch {
      // The next network chunk may complete this partial record.
    }
  }
}

export function useChatStream(dispatch) {
  const controllerRef = useRef(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const stop = useCallback(() => controllerRef.current?.abort(), [])

  const streamReply = useCallback(async (conversationId, history) => {
    const assistantId = makeId('msg')
    const controller = new AbortController()
    controllerRef.current = controller
    setIsStreaming(true)
    dispatch({ type: 'START_ASSISTANT_MESSAGE', payload: { conversationId, message: { id: assistantId, role: 'assistant', content: '', createdAt: Date.now(), status: 'streaming' } } })

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      if (!apiKey) throw new Error('Add VITE_GROQ_API_KEY to .env.local, then restart the dev server.')
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ model: 'openai/gpt-oss-20b', stream: true, messages: history.map(({ role, content }) => ({ role, content })) }),
      })
      if (!response.ok) throw new Error((await response.text()) || 'The AI request failed.')
      if (!response.body) throw new Error('Streaming is not supported by this browser.')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffered = ''
      while (true) {
        const { done, value } = await reader.read()
        buffered += decoder.decode(value ?? new Uint8Array(), { stream: !done })
        const records = buffered.split('\n\n')
        buffered = records.pop() ?? ''
        records.forEach((record) => readSseChunk(record, (token) => dispatch({ type: 'APPEND_TOKEN', payload: { conversationId, messageId: assistantId, token } })))
        if (done) break
      }
      readSseChunk(buffered, (token) => dispatch({ type: 'APPEND_TOKEN', payload: { conversationId, messageId: assistantId, token } }))
      dispatch({ type: 'FINISH_ASSISTANT_MESSAGE', payload: { conversationId, messageId: assistantId } })
    } catch (error) {
      if (error.name === 'AbortError') dispatch({ type: 'FINISH_ASSISTANT_MESSAGE', payload: { conversationId, messageId: assistantId } })
      else dispatch({ type: 'FAIL_ASSISTANT_MESSAGE', payload: { conversationId, messageId: assistantId, error: error.message } })
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
      setIsStreaming(false)
    }
  }, [dispatch])

  return { isStreaming, streamReply, stop }
}
