from rest_framework import serializers
from .models import Sake

class SakeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Sake
        fields=[
            "id",
            "title",
            "brewery",
            "score",
            "tasting_date",
            "image",
            "memo",
            "sweetness",
            "acidity",
            "umami",
            "aroma",
            "aftertaste",
            "created_at",
            "user",
        ]