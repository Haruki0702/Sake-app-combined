import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function SakeForm() {
  const navigate = useNavigate()
  const { id } = useParams() // URLからIDを取得（編集モード用）
  
  // 入力データを管理する箱
  const [formData, setFormData] = useState({
    title: '',
    brewery: '',
    score: 3,
    tasting_date: new Date().toISOString().split('T')[0], // 今日の日付
    prefecture: "",
    sweetness: 3,
    acidity: 3,
    bitterness: 3,
    aroma: 3,
    body: 3,
    memo: '',
    image: null // 画像ファイル用
  })

  // 画面が開かれた時の処理
  useEffect(() => {
    // IDがあるなら「編集モード」なので、既存データを取ってくる
    if (id) {
      fetch(`http://127.0.0.1:8000/api/sakes/${id}/`)
        .then(res => res.json())
        .then(data => {
          // 画像はセキュリティ上、再セットできないのでnullのままにする
          setFormData({ ...data, image: null })
        })
        .catch(err => console.error("データ取得エラー:", err))
    }
  }, [id])

  // 入力欄が変更された時の処理
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      // 画像ファイルの場合
      setFormData({ ...formData, [name]: files[0] })
    } else {
      // 普通の文字や数字の場合
      setFormData({ ...formData, [name]: value })
    }
  }

  // 送信ボタンが押された時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 1. トークンを取得（ログインしてないと送れない）
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('ログインしてください！')
      navigate('/login')
      return
    }

    // 2. 送信データの準備 (画像を送るために FormData を使う)
    const uploadData = new FormData()
    // formDataの中身を一つずつ詰め込む
    Object.keys(formData).forEach(key => {
        // 画像が選択されていない場合は送らない（既存の画像を消さないため）
        if (key === 'image' && formData[key] === null) return
        uploadData.append(key, formData[key])
    })
    // 投稿者(user)はDjango側で自動設定するので送らなくてOK

    // 3. APIの宛先とメソッドを決める
    const url = id 
      ? `http://127.0.0.1:8000/api/sakes/${id}/` // 編集用URL
      : 'http://127.0.0.1:8000/api/sakes/'       // 新規作成用URL
    
    const method = id ? 'PUT' : 'POST'

    // 4. 送信！
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          // ★重要: 認証トークンをヘッダーに乗せる
          'Authorization': `JWT ${token}`,
          // ※ FormDataを送る時は 'Content-Type': 'application/json' を書いてはいけない！
        },
        body: uploadData
      })

      if (response.ok) {
        alert(id ? '更新しました！' : '登録しました！')
        navigate('/') // 一覧に戻る
      } else {
        const errorData = await response.json()
        console.error("送信エラー:", errorData)
        alert('エラーが発生しました。コンソールを確認してください。')
      }
    } catch (err) {
      console.error("通信エラー:", err)
      alert('サーバーに接続できませんでした。')
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>{id ? '🍶 記録の編集' : '🍶 新規投稿'}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 基本情報 */}
        <div style={{ marginBottom: '15px' }}>
          <label>銘柄名:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ display:'block', width:'100%', padding:'8px' }} />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>蔵元:</label>
          <input type="text" name="brewery" value={formData.brewery} onChange={handleChange} style={{ display:'block', width:'100%', padding:'8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>都道府県:</label>
          <option value="">都道府県を選択</option>
          <select name="prefecture" value={formData.prefecture} onChange={handleChange} style={{ display:'block', width:'100%', padding:'8px' }}>
            <option value="">都道府県を選択</option>
            <option value="北海道">北海道</option>
            <option value="青森県">青森県</option>
            <option value="岩手県">岩手県</option>
            <option value="宮城県">宮城県</option>
            <option value="秋田県">秋田県</option>
            <option value="山形県">山形県</option>
            <option value="福島県">福島県</option>
            <option value="茨城県">茨城県</option>
            <option value="栃木県">栃木県</option>
            <option value="群馬県">群馬県</option>
            <option value="埼玉県">埼玉県</option>
            <option value="千葉県">千葉県</option>
            <option value="東京都">東京都</option>
            <option value="神奈川県">神奈川県</option>
            <option value="新潟県">新潟県</option>
            <option value="富山県">富山県</option>
            <option value="石川県">石川県</option>
            <option value="福井県">福井県</option>
            <option value="山梨県">山梨県</option>
            <option value="長野県">長野県</option>
            <option value="岐阜県">岐阜県</option>
            <option value="静岡県">静岡県</option>
            <option value="愛知県">愛知県</option>
            <option value="三重県">三重県</option>
            <option value="滋賀県">滋賀県</option>
            <option value="京都府">京都府</option>
            <option value="大阪府">大阪府</option>
            <option value="兵庫県">兵庫県</option>
            <option value="奈良県">奈良県</option>
            <option value="和歌山県">和歌山県</option>
            <option value="鳥取県">鳥取県</option>
            <option value="島根県">島根県</option>
            <option value="岡山県">岡山県</option>
            <option value="広島県">広島県</option>
            <option value="山口県">山口県</option>
            <option value="徳島県">徳島県</option>
            <option value="香川県">香川県</option>
            <option value="愛媛県">愛媛県</option>
            <option value="高知県">高知県</option>
            <option value="福岡県">福岡県</option>
            <option value="佐賀県">佐賀県</option>
            <option value="長崎県">長崎県</option>
            <option value="熊本県">熊本県</option>
            <option value="大分県">大分県</option>
            <option value="宮崎県">宮崎県</option>
            <option value="鹿児島県">鹿児島県</option>
            <option value="沖縄県">沖縄県</option>  
          </select>
        </div>

        {/* 味覚パラメータ（スライダーで入力） */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            {['sweetness', 'acidity', 'umami', 'aroma', 'aftertaste'].map(item => (
                <div key={item}>
                    <label>{item} (1-5): {formData[item]}</label>
                    <input 
                        type="range" 
                        name={item} 
                        min="1" max="5" 
                        value={formData[item]} 
                        onChange={handleChange} 
                        style={{ width: '100%' }}
                    />
                </div>
            ))}
        </div>

        {/* 評価と日付 */}
        <div style={{ marginBottom: '15px' }}>
          <label>総合評価 (1-5): {formData.score}</label>
          <input type="range" name="score" min="1" max="5" value={formData.score} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>飲んだ日:</label>
          <input type="date" name="tasting_date" value={formData.tasting_date} onChange={handleChange} style={{ display:'block', width:'100%', padding:'8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>画像:</label>
          <input type="file" name="image" onChange={handleChange} accept="image/*" />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {id ? '更新する' : '登録する'}
        </button>
      </form>
    </div>
  )
}

export default SakeForm