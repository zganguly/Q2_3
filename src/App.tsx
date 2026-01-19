import { useState } from 'react'
import './App.css'
import { UserList } from './components/user-list'
import { PostList } from './components/post-list'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(110deg, #f8fafc 60%, #e4e1fa 100%)',
        padding: '3rem 0',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '2.2rem',
          fontSize: '2.7rem',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #7d5fff, #00c6fb)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1.5px',
          textShadow: '0 3px 17px #b4b5c390'
        }}
      >
        User and Post Listings With Filter
      </h1>      
      <div
        style={{width: '100%'}}
      >
        <UserList />
      </div>
      <div
        style={{width: '100%'}}
      >
        <PostList />
      </div>      
    </div>
  )
}

export default App
