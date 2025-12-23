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
    if (count >= 10) return "#800000"
    if (count >= 5)  return "#cc0000"
    if (count >= 1)  return "#ff9999"
    return "#eee"
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