from django.shortcuts import render
from .ranking_scraping import get_sake_ranking
from django.core.cache import cache

def ranking_list(request):
    ranking=cache.get("sake_ranking")
    if not ranking:
        print("キャッシュなし。スクレイピング実行。")
        ranking=get_sake_ranking("https://www.saketime.jp/ranking/")
        cache.set("sake_ranking", ranking, 60*60)
    else:
        print("キャッシュから読み込み")
    return render(request, "sake_ranking/ranking_list.html",{"ranking": ranking})

# Create your views here.
