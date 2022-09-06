import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

export type SendReturnResult = { result: any }
export type SendReturn = any

function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
  return Object.hasOwn(sendReturn, 'result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on window.ethereum.'
  }
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class InjectedConnector extends AbstractConnector {
  constructor(args: AbstractConnectorArguments) {
    super(args)

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  private handleChainChanged(chainId: string | number): void {
    if (__DEV__) {
      console.log("Handling 'chainChanged' event with payload", chainId)
    }
    this.emitUpdate({ chainId, provider: window.ethereum })
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (__DEV__) {
      console.log("Handling 'accountsChanged' event with payload", accounts)
    }
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleDisconnect(code: number, reason: string): void {
    if (__DEV__) {
      console.log("Handling 'disconnect' event with payload", code, reason)
    }
    this.emitDeactivate()
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    if (window.ethereum.on) {
      window.ethereum.on('chainChanged', this.handleChainChanged)
      window.ethereum.on('accountsChanged', this.handleAccountsChanged)
      window.ethereum.on('disconnect', this.handleDisconnect)
    }

    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await window.ethereum
        .request({
          method: 'eth_requestAccounts',
        })
        .then((sendReturn) => parseSendReturn(sendReturn)[0])
    } catch (error) {
      if (error.code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful')
    }

    return { provider: window.ethereum, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    return window.ethereum
  }

  public async getChainId(): Promise<number | string> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await window.ethereum
        .request({
          method: 'eth_chainId',
        })
        .then(parseSendReturn)
    } catch {
      warning(false, 'eth_chainId was unsuccessful')
    }

    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await window.ethereum
        .request({
          method: 'eth_accounts',
        })
        .then((sendReturn) => parseSendReturn(sendReturn)[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful')
    }

    return account
  }

  public deactivate() {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('chainChanged', this.handleChainChanged)
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
      window.ethereum.removeListener('disconnect', this.handleDisconnect)
    }
  }

  async isAuthorized(): Promise<boolean> {
    if (!window.ethereum) {
      return false
    }

    try {
      return await window.ethereum
        .request({
          method: 'eth_accounts',
        })
        .then((sendReturn) => {
          return parseSendReturn(sendReturn).length > 0
        })
    } catch {
      return false
    }
  }
}
