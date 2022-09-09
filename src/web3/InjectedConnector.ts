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
  private readonly provider: Ethereum | undefined

  constructor(args: AbstractConnectorArguments) {
    super(args)

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
    this.provider = window.ethereum
  }

  public async getProvider() {
    return this.provider
  }

  private getProviderSync() {
    return window.ethereum
  }

  private handleChainChanged(chainId: string | number): void {
    if (__DEV__) {
      console.log("Handling 'chainChanged' event with payload", chainId)
    }
    this.emitUpdate({ chainId, provider: this.getProviderSync() })
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
    const provider = this.getProviderSync()
    if (!provider) {
      throw new NoEthereumProviderError()
    }

    if (provider.on) {
      provider.on('chainChanged', this.handleChainChanged)
      provider.on('accountsChanged', this.handleAccountsChanged)
      provider.on('disconnect', this.handleDisconnect)
    }

    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await provider
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

    return { provider, ...(account ? { account } : {}) }
  }

  public async getChainId(): Promise<number | string> {
    const provider = this.getProviderSync()
    if (!provider) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await provider
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
    const provider = this.getProviderSync()
    if (!provider) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await provider
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
    const provider = this.getProviderSync()
    if (provider && provider.removeListener) {
      provider.removeListener('chainChanged', this.handleChainChanged)
      provider.removeListener('accountsChanged', this.handleAccountsChanged)
      provider.removeListener('disconnect', this.handleDisconnect)
    }
  }

  async isAuthorized(): Promise<boolean> {
    const provider = this.getProviderSync()
    if (!provider) {
      return false
    }

    try {
      return await provider
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
