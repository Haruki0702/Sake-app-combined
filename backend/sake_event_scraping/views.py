from django.shortcuts import render
from .event_scraping import all_events
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response

def event_list(request):
    events=cache.get("sake_events")
    if not events:
        print("キャッシュなし。スクレイピング実行。")
        events=all_events()
        cache.set("sake_events", events, 60*60)
    else:
        print("キャッシュから読み込み")
    return render(request, "sake_event_scraping/event_list.html",{"events": events})

@api_view(['GET'])
def event_list_api(request):
    events=cache.get("sake_events")
    if not events:
        events=all_events()
        cache.set("sake_events", events, 60*60)
    return Response(events)


