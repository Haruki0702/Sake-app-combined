import { useState, useEffect } from 'react'
// 作ったCSSをインポート (styles という変数に格納される)
import styles from './SakeList.module.css'

function App() {
  const [sakes, setSakes] = useState([])

  // 画面が開かれた瞬間にDjangoへデータを取りに行く
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sakes/')
      .then(res => res.json())
      .then(data => setSakes(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className={styles.container}>
      <h1>🍶 日本酒リスト (React版)</h1>
      
      {sakes.map(sake => (
        <div key={sake.id} className={styles.card}>
          {/* 画像がある場合のみ表示 (DjangoのURLを補完) */}
          {sake.image && (
            <img 
              src={`http://127.0.0.1:8000${sake.image}`} 
              alt={sake.title} 
              className={styles.image}
            />
          )}
          
          <div className={styles.content}>
            <h2 className={styles.title}>{sake.title}</h2>
            <p className={styles.brewery}>
              蔵元: {sake.brewery} | 評価: {'★'.repeat(sake.score)}
            </p>
            <p>甘味: {sake.sweetness} / 酸味: {sake.acidity}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App