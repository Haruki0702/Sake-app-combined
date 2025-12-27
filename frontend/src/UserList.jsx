import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/users/', {
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access_token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("取得エラー:", err)
        setLoading(false)
      })
  }, [])

  const handleFollow = async (userId, isFollowing) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/follow/`, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('access_token')}`
        }
      })

      if (response.ok) {
        // フォロー状態を更新
        setUsers(users.map(user =>
          user.id === userId
            ? { ...user, is_following: !isFollowing }
            : user
        ))
      }
    } catch (err) {
      console.error("フォローエラー:", err)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>読み込み中...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>👥 ユーザー一覧</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {users.map(user => (
          <div key={user.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <Link
                to={`/profile/${user.username}`}
                style={{
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  color: '#007bff'
                }}
              >
                {user.username}
              </Link>
              <div style={{ color: '#666', marginTop: '5px' }}>
                フォロー中: {user.following_count} | フォロワー: {user.followers_count}
              </div>
            </div>

            <button
              onClick={() => handleFollow(user.id, user.is_following)}
              style={{
                padding: '8px 16px',
                background: user.is_following ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {user.is_following ? 'フォロー解除' : 'フォロー'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserList