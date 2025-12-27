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
        # スクレイピング実行中のロックを確認
        if cache.get("sake_events_lock"):
            # 他のプロセスが実行中なので、キャッシュが空でも待機
            return Response({"message": "データ取得中です。しばらくお待ちください。"}, status=202)
        
        # ロックを設定
        cache.set("sake_events_lock", True, 300)  # 5分間ロック
        
        try:
            events=all_events()
            if events:
                cache.set("sake_events", events, 6*60*60)  # 6時間キャッシュ
        finally:
            # ロック解除
            cache.delete("sake_events_lock")
    
    return Response(events)


