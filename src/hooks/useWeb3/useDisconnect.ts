import { useCallback } from 'react'
import { useWeb3React } from '@/hooks'

export const useDisconnect = () => {
  const { deactivate } = useWeb3React()

  return useCallback(deactivate, [deactivate])
}
