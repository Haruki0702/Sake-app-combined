import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Header' // これが読み込まれているか重要！
import SakeList from './SakeList'
import SakeDetail from './SakeDetail'
import Login from './Login'
import SakeForm from './SakeForm'
import SignUp from './SignUp'
import Profile from './Profile'
import EventList from './EventList'
import WebRanking from './WebRanking'
import SakeMap from './SakeMap'

function App() {
  return (
    <BrowserRouter>
      {/* ↓↓↓ ヘッダーコンポーネントがここにあるか確認 ↓↓↓ */}
      <Header />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<SakeList />} />
          <Route path="/sakes/:id" element={<SakeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<SakeForm />} />
          <Route path="/edit/:id" element={<SakeForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/web_ranking" element={<WebRanking />} />
          <Route path="/sake_map" element={<SakeMap />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App