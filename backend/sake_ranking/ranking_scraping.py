import requests
from bs4 import BeautifulSoup
import time

def get_sake_ranking(page_url):
    ranking = []
    # サイトに拒否されないよう、ブラウザのふりをするヘッダー
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(page_url, headers=headers, timeout=5)
        response.encoding = response.apparent_encoding
        soup = BeautifulSoup(response.text, "html.parser")

        # 1. すべての content クラスを持つ div を取得
        contents = soup.find_all("div", class_="content")
        
        for content in contents:
            # 2. その中の li (clearfix ranking) を「すべて」取得
            items = content.find_all("li", class_="clearfix ranking")
            
            for item in items:
                try:
                    # --- 銘柄名とリンクの取得 ---
                    # div(headline clearfix) > h2 > a > span
                    headline_div = item.find("div", class_="headline clearfix")
                    if not headline_div:
                        continue
                        
                    a_tag = headline_div.find("h2").find("a")
                    link = "https://www.saketime.jp" + a_tag.get("href")
                    # span の中のテキスト（銘柄名）を取得
                    title = a_tag.find("span").get_text(strip=True)

                    # --- 場所（ブランド情報）の取得 ---
                    # div(col-center) > p(brand_info)
                    col_center = item.find("div", class_="col-center")
                    brand_info = col_center.find("p", class_="brand_info").get_text(strip=True)

                    ranking.append({
                        "title": title,
                        "brand_info": brand_info,
                        "link": link
                    })
                except AttributeError as e:
                    # 指定したタグが見つからない場合はスキップ
                    continue

    except Exception as e:
        print(f"全体エラー: {e}")
        
    return ranking

if __name__ == "__main__":
    url = "https://www.saketime.jp/ranking/"
    data = get_sake_ranking(url)
    
    print(f"{len(data)} 件取得しました\n")
    for i, item in enumerate(data, 1):
        print(f"{i}位: {item['title']}")
        print(f"   情報: {item['brand']}")
        print(f"   URL : {item['link']}")