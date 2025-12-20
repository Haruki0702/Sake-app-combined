from django.shortcuts import render
from .ranking_scraping import get_sake_ranking
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response

def ranking_list(request):
    ranking=cache.get("sake_ranking")
    if not ranking:
        print("キャッシュなし。スクレイピング実行。")
        ranking=get_sake_ranking("https://www.saketime.jp/ranking/")
        cache.set("sake_ranking", ranking, 60*60)
    else:
        print("キャッシュから読み込み")
    return render(request, "sake_ranking/ranking_list.html",{"ranking": ranking})

@api_view(['GET'])
def ranking_list_api(request):
    """
    SakeTimeのランキングをスクレイピングしてJSONで返すAPI
    """
    # 1. キャッシュを確認
    ranking = cache.get("sake_ranking")
    
    if not ranking:
        print("キャッシュなし。Webからスクレイピング実行...")
        # スクレイピング実行
        ranking = get_sake_ranking("https://www.saketime.jp/ranking/")
        
        # 2. キャッシュに保存 (60分 = 3600秒)
        # データが取れなかった場合(空リスト)はキャッシュしない方が安全
        if ranking:
            cache.set("sake_ranking", ranking, 60 * 60)
    else:
        print("キャッシュから高速読み込み")

    # 3. JSONとしてレスポンス (renderではなくResponseを使う)
    return Response(ranking)
