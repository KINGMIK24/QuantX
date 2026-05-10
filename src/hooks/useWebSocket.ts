import { useEffect, useRef, useCallback } from 'react'

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const ws = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        reconnectAttempts.current = 0
      }

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        onMessage(data)
      }

      ws.current.onerror = () => {
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          setTimeout(connect, 1000 * reconnectAttempts.current)
        }
      }

      ws.current.onclose = () => {
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(connect, 1000 * reconnectAttempts.current)
        }
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }, [url, onMessage])

  useEffect(() => {
    connect()
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  return {
    send: (message: any) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message))
      }
    },
  }
}
