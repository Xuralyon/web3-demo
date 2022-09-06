import React from 'react'
import { useBalance, useConnect, useDisconnect, useWeb3React } from '@/hooks'

const CHAIN = {
  1: {
    symbol: 'ETH',
  },
  56: {
    symbol: 'BNB',
  },
}

const ConnectContent = () => {
  const { account, chainId } = useWeb3React()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const balance = useBalance()

  if (account) {
    return (
      <div className={'flex items-center'}>
        <div className={'mr-2 font-bold'}>
          <div>account: {account}</div>
          <div>
            balance: {balance} {CHAIN[chainId as number].symbol}
          </div>
        </div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return <button onClick={connect}>Connect Wallet</button>
}

const Header = () => {
  return (
    <div className={'h-16 px-4 border-b shadow flex items-center justify-between'}>
      <div className={'header'}>Web3 DApp Demo</div>
      <ConnectContent />
    </div>
  )
}

export default Header
