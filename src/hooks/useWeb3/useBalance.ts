import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@/hooks'
import { useState } from 'react'

export const useBalance = () => {
  const { account, active, library } = useWeb3React()
  const [balance, setBalance] = useState('0')

  if (active && library) {
    library.getBalance(account as string).then((rs) => {
      setBalance(formatEther(rs))
    })
  }

  return balance
}
