import { useCallback } from 'react'
import { InjectedConnector } from '@/web3/InjectedConnector'
import { useWeb3React } from '@/hooks'

const connector = new InjectedConnector({ supportedChainIds: [1, 56, 97] })

export const useConnect = () => {
  const { activate } = useWeb3React()

  const connect = useCallback(() => {
    activate(connector, (error) => {
      console.log('activate error', error)
    })
  }, [activate])

  return connect
}
