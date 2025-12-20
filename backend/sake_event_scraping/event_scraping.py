import requests
from bs4 import BeautifulSoup

def get_sake_events(page_url):
    events = []
    try:
        response = requests.get(page_url, timeout=10)
        response.encoding = response.apparent_encoding
        soup = BeautifulSoup(response.text, 'html.parser')

        # 1. すべてのイベントパネル（div class="panel panel-default"）を取得
        panels = soup.find_all('div', class_='panel panel-default')
        
        for panel in panels:
            try:
                # --- タイトルの取得 ---
                # panel-headingの中にあるaタグを探す
                heading = panel.find('div', class_='panel-heading')
                if heading:
                    heading_links = heading.find_all('a')
                    # 「aタグが3つあるうちの2つ目」という情報に基づく
                    if len(heading_links) >= 2:
                        title_tag = heading_links[1]
                        title = title_tag.get_text(strip=True)
                        link = title_tag.get('href')

                        link = "https://nihonshucalendar.com/" + link
                    else:
                        continue # タイトルがない場合はスキップ
                else:
                    continue

                # --- 日付と場所の取得 ---
                # list-groupの中にあるliタグを探す
                ul_group = panel.find('ul', class_='list-group')
                if ul_group:
                    lis = ul_group.find_all('li')
                    
                    # 1つ目のliが日時
                    date = ""
                    if len(lis) >= 1:
                        # "日時" などのラベルが含まれる場合があるので、そのまま取得
                        date = lis[0].get_text(strip=True)
                        # 余分な「日時」という文字を消したい場合は以下のように置換を使う
                        # date = date.replace('日時', '').replace('：', '').strip()

                    # 2つ目のliの中のaタグが場所
                    place = ""
                    if len(lis) >= 2:
                        place_tag = lis[1].find('a')
                        if place_tag:
                            place = place_tag.get_text(strip=True)
                        else:
                            # aタグがない場合の保険（テキストだけ取る）
                            place = lis[1].get_text(strip=True)

                # リストに追加
                events.append({
                    'date': date,
                    'title': title,
                    'place': place,
                    'link': link
                })
            except Exception as e:
                # 1つのイベントで失敗しても、他は取得し続ける
                print(f"パースエラー（スキップします）: {e}")
                continue

    except Exception as e:
        print(f"全体エラー: {e}")
        return []

    return events

def all_events():
    all_events_list=[]
    for i in range(16):
        page_url="https://nihonshucalendar.com/coming_event_recommended.php?page="+str(i+1)
        all_events_list.extend(get_sake_events(page_url))
    sorted_events=sorted(all_events_list, key=lambda x: x['date'])
    return sorted_events

# テスト実行用
if __name__ == "__main__":
    data = get_sake_events()
    print(f"\n=== {len(data)} 件取得しました ===")
    for i, event in enumerate(data[:len(data)]): # 最初の3件だけ表示
        print(f"[{i+1}] \n 日付：{event['date']} \n イベント名：{event['title']} \n 場所：{event['place']} \n リンク：{event['link']}\n")