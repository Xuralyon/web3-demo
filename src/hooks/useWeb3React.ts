import { useWeb3React as useWeb3ReactBase } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

export const useWeb3React = useWeb3ReactBase<Web3Provider>
