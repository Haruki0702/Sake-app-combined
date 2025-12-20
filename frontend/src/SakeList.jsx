import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // リンク用タグ
import styles from './SakeList.module.css'

function SakeList() {
  const [sakes, setSakes] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sakes/')
      .then(res => res.json())
      .then(data => setSakes(data))
  }, [])

  return (
    <div className={styles.container}>
      <h1>🍶 日本酒リスト</h1>
      {sakes.map(sake => (
        <div key={sake.id} className={styles.card}>
           {/* 画像表示部分は省略...前のコードと同じ */}
          <div className={styles.content}>
            {/* リンクに変更: クリックすると /sakes/1 等へ飛ぶ */}
            <h2 className={styles.title}>
              <Link to={`/sakes/${sake.id}`}>{sake.title}</Link>
            </h2>
            <p style={{ fontSize: '0.8em', color: '#888', margin: '0' }}>
                投稿者: {sake.user}
            </p>
            <p className={styles.brewery}>{sake.brewery}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
export default SakeList