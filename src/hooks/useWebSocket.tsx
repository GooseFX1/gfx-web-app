import { useEffect } from 'react'

function useWebSocket<T>({ url, callback }) {
  useEffect(() => {
    if (!url) return
    const ws = new WebSocket(url)
    ws.onopen = () => {
      console.log(`Connected to ${url}`)
    }
    ws.onmessage = (event) => {
      console.log(`Message from ${url}:`, event.data)
      if (callback) {
        callback(JSON.parse(event.data) as T)
      }
    }
    return () => {
      ws.close()
      console.log(`Disconnected from ${url}`)
    }
  }, [url, callback])
}

export default useWebSocket
