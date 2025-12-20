from django.shortcuts import render
from .event_scraping import all_events
from django.core.cache import cache

def event_list(request):
    events=cache.get("sake_events")
    if not events:
        print("キャッシュなし。スクレイピング実行。")
        events=all_events()
        cache.set("sake_events", events, 60*60)
    else:
        print("キャッシュから読み込み")
    return render(request, "sake_event_scraping/event_list.html",{"events": events})

# Create your views here.
