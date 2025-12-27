import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

function SakeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sake, setSake] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // データ取得
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/sakes/${id}/`)
      .then(res => res.json())
      .then(data => setSake(data))
      .catch(err => console.error("エラー:", err))
  }, [id])
    // 現在のユーザー情報取得
    const token = localStorage.getItem('access_token')
    if (token) {
        fetch('http://127.0.0.1:8000/auth/users/me/', {
            headers: {
                'Authorization': `JWT ${token}`
            }
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => setCurrentUser(data.username))
    }

  // 削除ボタンが押された時の処理
  const handleDelete = async () => {
    if (!window.confirm('本当に削除してよろしいですか？')) return

    const token = localStorage.getItem('access_token')
    if (!token) {
        alert('削除するにはログインが必要です')
        return
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/sakes/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${token}`
            }
        })

        if (response.ok) {
            alert('削除しました')
            navigate('/') // 一覧に戻る
        } else {
            alert('削除に失敗しました（権限がない可能性があります）')
        }
    } catch (err) {
        console.error(err)
    }
  }

  if (!sake) return <div>読み込み中...</div>
  const isMyPost = currentUser && (currentUser === sake.user);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
          <Link to="/">← 一覧に戻る</Link>
      </div>
      
      <h1>{sake.title} <small style={{ fontSize: '0.6em', color: '#666' }}>({sake.brewery})</small></h1>
      <p style={{ color: '#555' }}>投稿者<Link to={`/profile/${sake.user}`}>{sake.user}</Link></p>
      {sake.image && (
        <img 
          src={sake.image.startsWith('http') ? sake.image : `http://127.0.0.1:8000${sake.image}`} 
          width="100%" 
          style={{ borderRadius: '8px', marginBottom: '20px', objectFit: 'cover', maxHeight: '400px' }} 
        />
      )}

      {/* 詳細データ */}
      <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <p><strong>銘柄:</strong>{sake.title}</p>
        <p><strong>蔵元:</strong>{sake.brewery}</p>
        <p><strong>都道府県:</strong> {sake.prefecture}</p>
        <p><strong>日付:</strong> {sake.tasting_date}</p>
        
        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #ddd' }} />
        <p><strong>総合評価:</strong> {'★'.repeat(sake.score)}({sake.score}/5)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>甘味: {sake.sweetness}</div>
            <div>酸味: {sake.acidity}</div>
            <div>旨味: {sake.umami}</div>
            <div>香り: {sake.aroma}</div>
            <div>後味: {sake.aftertaste}</div>
        </div>
        
        {sake.memo && (
            <div style={{ marginTop: '15px' }}>
                <strong>メモ:</strong><br/>
                {sake.memo}
            </div>
        )}
      </div>

      {/* ↓↓↓ ここに追加：操作ボタンエリア ↓↓↓ */}
    {isMyPost && (
          <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <Link 
                to={`/edit/${sake.id}`} 
                style={{ 
                    padding: '10px 20px', 
                    background: '#007bff', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '4px' 
                }}
              >
                ✏️ 編集する
              </Link>

              <button 
                onClick={handleDelete}
                style={{ 
                    padding: '10px 20px', 
                    background: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                }}
              >
                🗑 削除する
              </button>
          </div>
      )}
      {/* ↑↑↑ 修正ここまで ↑↑↑ */}
    </div>
  )
}

export default SakeDetail