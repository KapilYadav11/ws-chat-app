import { useState, useEffect } from 'react'

const App = () => {
  const [message, setMessage] = useState(["hi there , building a chat app"]);
  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:3000");
    ws.onmessage =  (event) => {
      setMessage(m => [...m, event.data])

    }
  }, [])
  return (
    <div className='h-screen bg-black'>
      <div className='h-[95vh]'>
        {message.map(message => <div>{message}</div>)}
      </div>
      <div className='w-full bg-white flex p-4'>
        <input className='flex-1'></input>
        <button className='bg-purple-400 text-white'>Send Message</button>
      </div>
      
    </div>
  )
}

export default App