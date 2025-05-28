import { useEffect } from 'react'

function useWebSocket<T>({ url, callback }) {
  useEffect(() => {
    if (!url) return
    const ws = new WebSocket(url)
    ws.onopen = () => {
      console.log(`Connected to ${url}`)
    }
    ws.onmessage = (event: MessageEvent<T>) => {
      console.log(`Message from ${url}:`, event.data)
      if (callback) {
        callback(event.data)
      }
    }
    return () => {
      ws.close()
      console.log(`Disconnected from ${url}`)
    }
  }, [url, callback])
}

export default useWebSocket
