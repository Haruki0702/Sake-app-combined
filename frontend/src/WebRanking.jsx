import { useState, useEffect } from 'react'

function WebRanking() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Djangoで作った新しいAPIを叩く
    fetch('http://127.0.0.1:8000/web_ranking/api/')
      .then(res => {
        if (res.status === 202) {
          // データ取得中の場合、少し待ってから再試行
          setTimeout(() => {
            fetch('http://127.0.0.1:8000/web_ranking/api/')
              .then(res => res.json())
              .then(data => {
                setRankings(data)
                setLoading(false)
              })
              .catch(err => {
                console.error("取得エラー:", err)
                setLoading(false)
              })
          }, 2000) // 2秒待機
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (data) {
          setRankings(data)
          setLoading(false)
        }
      })
      .catch(err => {
        console.error("取得エラー:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>ランキング集計中...（SakeTimeから取得）</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>👑 世の中の日本酒ランキング</h2>
        <p style={{ fontSize: '0.8em', color: '#666' }}>出典: SAKETIME</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {rankings.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', alignItems: 'center', 
            padding: '15px', border: '1px solid #ddd', borderRadius: '8px',
            background: '#fff' 
          }}>
            {/* 順位バッジ */}
            <div style={{ 
                width: '40px', height: '40px', background: index < 3 ? '#ff5722' : '#757575', 
                color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', fontWeight: 'bold', marginRight: '15px', flexShrink: 0 
            }}>
                {index + 1}
            </div>

            {/* 情報エリア */}
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#333' }}>
                        {item.title} 
                    </a>
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>
                    {item.brand_info}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WebRanking