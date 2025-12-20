from django.db.models import Avg

def calculate_taste_profile(sake_queryset):
    if not sake_queryset.exists():
        return {
            "sweetness": 0,
            "acidity": 0,
            "umami": 0,
            "aroma": 0,
            "aftertaste": 0,
        }
    total_score_weight=0
    weighted_sums={
        "sweetness": 0,
        "acidity": 0,
        "umami": 0,
        "aroma": 0,
        "aftertaste": 0,
    }
    for sake in sake_queryset:
        weight=sake.score
        total_score_weight+=weight
        weighted_sums["sweetness"]+=sake.sweetness*weight
        weighted_sums["acidity"]+=sake.acidity*weight
        weighted_sums["umami"]+=sake.umami*weight
        weighted_sums["aroma"]+=sake.aroma*weight
        weighted_sums["aftertaste"]+=sake.aftertaste*weight
    if total_score_weight==0:
        return {
            "sweetness": 0,
            "acidity": 0,
            "umami": 0,
            "aroma": 0,
            "aftertaste": 0,
        }
    radar_data={
        "sweetness": round(weighted_sums["sweetness"]/total_score_weight, 2),
        "acidity": round(weighted_sums["acidity"]/total_score_weight, 2),
        "umami": round(weighted_sums["umami"]/total_score_weight, 2),
        "aroma": round(weighted_sums["aroma"]/total_score_weight, 2),
        "aftertaste": round(weighted_sums["aftertaste"]/total_score_weight, 2),
    }
    return radar_data