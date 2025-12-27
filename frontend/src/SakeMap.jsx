import { useState, useEffect } from 'react'

function SakeMap() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
        setLoading(false)
        return
    }
    fetch('http://127.0.0.1:8000/api/sake_map/', {
        headers: { 'Authorization': `JWT ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCounts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getColor = (count) => {
    if (count === 0) return "#f5f5f5"  // 非常に薄い灰色
    if (count === 1) return "#ffe6e6"  // 非常に薄い赤
    if (count === 2) return "#ffcccc"  // 薄い赤
    if (count === 3) return "#ffaaaa"  // 中薄い赤
    if (count === 4) return "#ff8888"  // 中赤
    if (count === 5) return "#ff6666"  // やや濃い赤
    if (count === 6) return "#ff4444"  // 濃い赤
    if (count === 7) return "#ff2222"  // より濃い赤
    if (count === 8) return "#ff0000"  // 鮮やかな赤
    if (count === 9) return "#dd0000"  // 暗い赤
    if (count === 10) return "#bb0000" // より暗い赤
    if (count === 11) return "#990000" // さらに暗い赤
    if (count === 12) return "#770000" // 濃い赤
    if (count === 13) return "#550000" // 非常に濃い赤
    if (count === 14) return "#330000" // ほぼ黒に近い赤
    return "#110000" // 15本以上: 最も濃い赤
  }

  if (loading) return <div>読み込み中...</div>

  const sortedPrefs = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>🇯🇵 日本酒制覇マップ</h2>
      
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', marginTop: '20px', padding: '20px' }}>
        <h3>飲んだ都道府県ランキング</h3>
        {sortedPrefs.length === 0 ? (
          <p>まだ記録がありません。</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            {sortedPrefs.map(([pref, count]) => (
              <div key={pref} style={{ 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px', 
                backgroundColor: getColor(count),
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                {pref}: {count}本
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SakeMap