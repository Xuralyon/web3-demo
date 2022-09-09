import SafeEventEmitter from '@metamask/safe-event-emitter'

export class EthereumProvider extends SafeEventEmitter implements Ethereum {
  async request(args: RequestArguments) {
    if (args.method === 'eth_requestAccounts') {
      return ['0xF2Bbb2B46162cB3a1ab2868C67582B2050699c6b']
    }

    if (args.method === 'eth_accounts') {
      return ['0xF2Bbb2B46162cB3a1ab2868C67582B2050699c6b']
    }

    if (args.method === 'eth_chainId') {
      return 56
    }

    if (args.method === 'eth_getBalance') {
      const balance = `${Math.random() * +'543895438923978412'}`
      console.log({ balance })
      return balance
    }
  }
}

window.ethereum = undefined
window.ethereum = new EthereumProvider()
