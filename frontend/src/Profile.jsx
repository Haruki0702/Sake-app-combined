import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
// グラフ用ライブラリのインポート
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

// Chart.jsを使うための準備（おまじない）
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

function Profile() {
  const { username } = useParams()
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/profile/${username}/`)
      .then(res => res.json())
      .then(data => setProfileData(data))
      .catch(err => console.error(err))
  }, [username])

  if (!profileData) return <div style={{textAlign:'center', marginTop:'50px'}}>読み込み中...</div>

  // グラフの設定データ
  const radarData = {
    labels: ['甘味', '酸味', '旨味', '香り', '後味'],
    datasets: [
      {
        label: '好みの傾向',
        data: [
          profileData.radar_data.sweetness,
          profileData.radar_data.acidity,
          profileData.radar_data.umami,
          profileData.radar_data.aroma,
          profileData.radar_data.aftertaste,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  }

  // グラフのオプション（軸の最大値などを設定）
  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
        pointLabels: {
            font: { size: 14 }
        }
      },
    },
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* ユーザーヘッダー */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>👤 {profileData.username}</h1>
        <p style={{ color: '#666' }}>記録数: {profileData.sake_count} 件</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', justifyContent: 'center' }}>
        
        {/* 左側：レーダーチャート */}
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '450px' }}>
            <h3 style={{ textAlign: 'center' }}>🍶 味の好み分析</h3>
            <Radar data={radarData} options={radarOptions} />
        </div>

        {/* 右側：最近の記録リスト */}
        <div style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📝 最近の記録</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                {profileData.sakes.length === 0 ? (
                    <p>まだ記録がありません。</p>
                ) : (
                    profileData.sakes.map(sake => (
                        <div key={sake.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* サムネイル画像（あれば） */}
                            {sake.image && (
                                <img 
                                    src={`http://127.0.0.1:8000${sake.image}`} 
                                    alt={sake.title} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                                />
                            )}
                            <div>
                                <Link to={`/sakes/${sake.id}`} style={{ fontWeight: 'bold', fontSize: '1.1em', textDecoration: 'none', color: '#007bff' }}>
                                    {sake.title}
                                </Link>
                                <div style={{ fontSize: '0.9em', color: '#555' }}>
                                    {sake.brewery} <span style={{ color: 'gold', marginLeft: '10px' }}>{'★'.repeat(sake.score)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  )
}

export default Profile