import React from 'react'
import { createRoot } from 'react-dom/client'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import App from '@/App'
import '@/style/index.scss'

const getLibrary = (provider: any) => {
  return new Web3Provider(provider)
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  // <Web3ReactProvider getLibrary={getLibrary}>
  <App />,
  // </Web3ReactProvider>,
)
