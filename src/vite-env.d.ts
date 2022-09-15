/// <reference types="vite/client" />

declare const __DEV__: boolean
declare const __TEST__: boolean

interface RequestArguments {
  method: string
  params?: unknown[] | object
}

type Listener = (...args: any[]) => void

interface Ethereum {
  request: (args: RequestArguments) => Promise<unknown>
  on?: (method: string, listener: Listener) => void
  removeListener?: (method: string, listener: Listener) => void
}

declare interface Window {
  ethereum?: Ethereum
  aaa: () => void
  bbb: () => void
}
