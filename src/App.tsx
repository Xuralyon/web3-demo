import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button
        className={'m-2 p-2 border rounded text-red-500 font-bold'}
        onClick={() => setCount((v) => v + 1)}
      >
        count is {count}
      </button>
      <button
        id="test-a"
        className={'m-2 p-2 border rounded text-red-500 font-bold'}
        onClick={() => window.ethereum?.request({ method: 'eth_requestAccounts' })}
      >
        0
      </button>
      <button
        id="test-b"
        className={'m-2 p-2 border rounded text-red-500 font-bold'}
        onClick={() => window.bbb()}
      >
        0
      </button>
    </>
  )
}

export default App
