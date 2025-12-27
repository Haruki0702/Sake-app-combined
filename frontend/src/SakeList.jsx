import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // リンク用タグ
import styles from './SakeList.module.css'

function SakeList() {
  const [sakes, setSakes] = useState([])
  const [filter, setFilter] = useState('all') // 'all' or 'following'

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    let url = 'http://127.0.0.1:8000/api/sakes/'
    
    if (filter === 'following' && token) {
      url = 'http://127.0.0.1:8000/api/sakes/following/'
    }

    const headers = token ? { 'Authorization': `JWT ${token}` } : {}
    
    fetch(url, { headers })
      .then(res => res.json())
      .then(data => setSakes(data))
  }, [filter])

  return (
    <div className={styles.container}>
      <h1>🍶 日本酒リスト</h1>
      
      {/* フィルターボタン */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            background: filter === 'all' ? '#007bff' : '#f8f9fa',
            color: filter === 'all' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          すべての投稿
        </button>
        <button 
          onClick={() => setFilter('following')}
          style={{
            padding: '8px 16px',
            background: filter === 'following' ? '#007bff' : '#f8f9fa',
            color: filter === 'following' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          フォロー中の投稿
        </button>
      </div>

      {sakes.map(sake => (
        <div key={sake.id} className={styles.card}>
           {/* 画像表示部分は省略...前のコードと同じ */}
          <div className={styles.content}>
            {/* リンクに変更: クリックすると /sakes/1 等へ飛ぶ */}
            <h2 className={styles.title}>
              <Link to={`/sakes/${sake.id}`}>{sake.title}</Link>
            </h2>
            <p style={{ fontSize: '0.8em', color: '#888', margin: '0' }}>
                投稿者: <Link to={`/profile/${sake.user}`}>{sake.user}</Link>
            </p>
            <p className={styles.brewery}>{sake.brewery}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
export default SakeList