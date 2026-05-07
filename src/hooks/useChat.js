import { useState, useRef, useCallback } from 'react'

const SUGGESTED_QUESTIONS = [
  "What are the symptoms of Type 2 diabetes?",
  "How can I lower my blood pressure naturally?",
  "What is the difference between a cold and the flu?",
  "What foods should I avoid with high cholesterol?",
  "How much sleep does an adult need?",
  "What are common signs of vitamin D deficiency?",
]

const DISCLAIMER = "This information is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider for diagnosis and treatment."


export function useChat() {
  const [messages, setMessages]       = useState([])
  const [input, setInput]             = useState('')
  const [isStreaming, setIsStreaming]  = useState(false)
  const [streamingId, setStreamingId] = useState(null)
  const abortRef                      = useRef(null)
  const msgIdRef                      = useRef(0)

  const nextId = () => ++msgIdRef.current

 const API_URL = 'https://mediquery-backend-wb9o.onrender.com/api/chat'

const sendMessage = useCallback(async (text) => {
  const query = text.trim()

  if (!query || isStreaming) return
const history = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const userMsg = {
    id: nextId(),
    role: 'user',
    content: query,
    ts: new Date(),
  }

  const aiId = nextId()

  const aiMsg = {
    id: aiId,
    role: 'assistant',
    content: '',
    ts: new Date(),
    streaming: true,
  }



  setMessages((prev) => [...prev, userMsg, aiMsg])
abortRef.current = new AbortController();
  setInput('')
  setIsStreaming(true)
  setStreamingId(aiId)

  const payloadMessages = [
    ...history,
    {
      role: 'user',
      content: query,
    },
  ]

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: payloadMessages,
      }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let buffer = ''
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const parts = buffer.split('\n\n')
      buffer = parts.pop()

      for (let part of parts) {
        if (part.startsWith('data: ')) {
          const data = part.replace('data: ', '').trim()

          if (data === '[DONE]') {
            setIsStreaming(false)
            setStreamingId(null)

            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiId
                  ? { ...m, streaming: false }
                  : m
              )
            )

            return
          }

          try {
            const parsed = JSON.parse(data)

            if (parsed.text) {

              for (let char of parsed.text) {
                if (!abortRef.current || abortRef.current.signal.aborted) break;
                fullText += char

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiId
                      ? {
                          ...m,
                          content: fullText,
                        }
                      : m
                  )
                )

                await new Promise((res) =>
                  setTimeout(res, 8)
                )
              }
            }
          } catch (err) {
            console.error('Parse error:', err)
          }
        }
      }
    }
  } catch (err) {
    console.error(err)

    setMessages((prev) =>
      prev.map((m) =>
        m.id === aiId
          ? {
              ...m,
              content: `Error: ${err.message}`,
              streaming: false,
            }
          : m
      )
    )

    setIsStreaming(false)
    setStreamingId(null)
  }
}, [messages, isStreaming])

  const stopStreaming = useCallback(() => {
  if (abortRef.current) {
    abortRef.current.abort();
    abortRef.current = null; 
  }

  setMessages(prev => prev.map(m =>
    m.streaming ? { ...m, streaming: false } : m
  ))
  setIsStreaming(false);
  setStreamingId(null);
}, []);

  const clearMessages = useCallback(() => {
    stopStreaming()
    setMessages([])
  }, [stopStreaming])

  return {
    messages, input, setInput,
    isStreaming, streamingId,
    sendMessage, stopStreaming, clearMessages,
    suggestedQuestions: SUGGESTED_QUESTIONS,
    disclaimer: DISCLAIMER,
  }
}
