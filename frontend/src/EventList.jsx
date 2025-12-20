import { useState, useEffect } from 'react'

function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Backendで作ったスクレイピングAPIを叩く
    fetch('http://127.0.0.1:8000/events/api/')
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>イベント情報を取得中...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📅 日本酒イベント情報</h2>
      <p style={{ textAlign: 'center', fontSize: '0.8em', color: '#666' }}>出典: 日本酒カレンダー</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {events.map((event, index) => (
          <div key={index} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px', 
            background: '#fff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <div style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '5px' }}>
              {event.date}
            </div>
            
            <h3 style={{ margin: '5px 0 10px 0', fontSize: '1.2em' }}>
              <a href={event.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#333' }}>
                {event.title} ↗
              </a>
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#555', fontSize: '0.9em' }}>
              <span>📍</span>
              {event.place}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventList