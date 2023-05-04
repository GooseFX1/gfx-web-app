class Aborter {
  signals: Map<string, AbortController>
  constructor() {
    this.signals = new Map()
  }

  /**
   * Get a signal from the map
   * @param key unique string to identify the signal e.g https://public-api.solscan.io/token/holders?tokenAddress=0x...
   * @returns AbortSignal or null if the key does not exist
   */
  getSignal = (key: string): AbortSignal | null => {
    if (!this.signals.has(key)) {
      return null
    }
    return this.signals.get(key).signal
  }
  /**
   * Add a signal into the map - if the key already exists, abort the previous signal
   * @param key unique string to identify the signal e.g https://public-api.solscan.io/token/holders?tokenAddress=0x...
   */
  addSignal = (key: string): AbortSignal => {
    if (this.signals.has(key)) {
      this.signals.get(key).abort()
    }
    const controller = new AbortController()
    this.signals.set(key, controller)
    return controller.signal
  }
  /**
   * Abort a signal if it exists
   * @param keys parameters of strings to identify the signal e.g https://public-api.solscan.io/token/holders?...
   * @returns true if the signal was aborted, false if the signal does not exist
   */
  abortSignal = (...keys: string[]): void => {
    for (const key of keys) {
      if (!this.signals.has(key)) {
        console.warn('KEY DOES NOT EXIST', key)
        continue
      }
      this.signals.get(key).abort()
      this.removeSignal(key)
    }
  }
  abortBulkWithPrefix = (prefix: string): void => {
    for (const key of this.signals.keys()) {
      if (key.startsWith(prefix) && this.signals.has(key)) {
        this.signals.get(key).abort()
        this.removeSignal(key)
      }
    }
  }
  /**
   * Remove a signal from the map
   * @param key unique string to identify the signal e.g https://public-api.solscan.io/token/holders?tokenAddress=0x...
   */
  removeSignal = (key: string): void => {
    if (this.signals.has(key)) {
      this.signals.delete(key)
    }
  }
}

const aborter = new Aborter()
Object.freeze(aborter)
export { aborter }
