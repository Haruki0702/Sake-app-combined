import { useState, useEffect } from 'react' // useState, useEffectを追加
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('') // ユーザー名を入れる箱
  const token = localStorage.getItem('access_token')
  const isLoggedIn = !!token

  // 画面が表示された時に、自分の情報をAPIに取りに行く
  useEffect(() => {
    if (isLoggedIn) {
        fetch('http://127.0.0.1:8000/auth/users/me/', {
            headers: {
                'Authorization': `JWT ${token}`
            }
        })
        .then(res => {
            if (res.ok) return res.json()
            throw new Error('Failed')
        })
        .then(data => setUsername(data.username))
        .catch(() => {
            // トークンが期限切れ等の場合
            localStorage.removeItem('access_token')
        })
    }
  }, [isLoggedIn, token])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    alert('ログアウトしました')
    window.location.href = '/login'
  }

  const btnStyle = { /* ...以前と同じ... */ 
    textDecoration: 'none', padding: '8px 15px', borderRadius: '4px', fontSize: '0.9em', fontWeight: 'bold', marginLeft: '10px'
  }

  return (
    <header style={{ /* ...以前と同じ... */ background: '#fff', borderBottom: '1px solid #ddd', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h1 style={{ margin: 0, fontSize: '1.5em' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>🍶 日本酒ノート</Link>
      </h1>

      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/events" style={{ ...btnStyle, color: '#555' }}>📅 イベント</Link>
        <Link to="/web_ranking" style={{ ...btnStyle, color: '#e91e63' }}>🌎 世間の評価</Link>
        <Link to="/users" style={{ ...btnStyle, color: '#28a745' }}>👥 ユーザー</Link>

        {isLoggedIn ? (
          <>
            <Link to="/create" style={{ ...btnStyle, background: '#007bff', color: 'white' }}>🖊 新規投稿</Link>
            
            {/* ↓↓ ユーザー名の表示リンク ↓↓ */}
            <Link to={`/profile/${username}`} style={{ marginLeft: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
                👤 {username}
            </Link>
            <Link to="/sake_map" style={{ ...btnStyle, color: '#e91e63' }}>🗺 制覇マップ</Link>

            <button onClick={handleLogout} style={{ ...btnStyle, background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>🚪 ログアウト</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ ...btnStyle, background: '#28a745', color: 'white' }}>🔐 ログイン</Link>
            {/* ↓↓ 新規登録へのリンク ↓↓ */}
            <Link to="/signup" style={{ ...btnStyle, background: '#17a2b8', color: 'white' }}>📝 登録</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header