/// <reference types="vite/client" />

declare const __DEV__: boolean
declare const __TEST__: boolean

interface RequestArguments {
  method: string
  params?: unknown[] | object
}

interface Ethereum {
  request: (args: RequestArguments) => Promise<unknown>
  on?: (method: string, listener: (...args: any[]) => void) => void
  removeListener?: (method: string, listener: (...args: any[]) => void) => void
}

declare interface Window {
  ethereum?: Ethereum
}
