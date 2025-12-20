import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    re_password: '' // パスワード確認用（Djoserの仕様で必要になる場合があるため用意）
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // パスワード一致確認
    if (formData.password !== formData.re_password) {
        alert('パスワードが一致しません')
        return
    }
    
    // Djoserのユーザー作成APIを叩く
    try {
        const response = await fetch('http://127.0.0.1:8000/auth/users/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password
            })
        })

        if (response.ok) {
            alert('アカウントを作成しました！ログイン画面へ移動します。')
            navigate('/login')
        } else {
            const errorData = await response.json()
            console.error(errorData)
            // エラー内容をアラートで見せる（例: パスワードが短すぎる等）
            alert('登録失敗: ' + JSON.stringify(errorData))
        }
    } catch (err) {
        alert('サーバーエラーが発生しました')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>📝 新規アカウント登録</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>ユーザー名:</label>
          <input type="text" name="username" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>パスワード (8文字以上):</label>
          <input type="password" name="password" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>パスワード (確認):</label>
          <input type="password" name="re_password" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border:'none' }}>登録する</button>
      </form>
      <p style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link to="/login">ログインはこちら</Link>
      </p>
    </div>
  )
}

export default SignUp