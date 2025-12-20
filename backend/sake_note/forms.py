from django import forms
from .models import Sake

class SakeForm(forms.ModelForm):
    class Meta:
        model = Sake
        fields = ['title', 'brewery', 'score', 'tasting_date', 'image',  'memo', 'sweetness', 'acidity', 'umami', 'aroma', 'aftertaste']
        widgets={
            "tasting_date": forms.NumberInput(attrs={"type":"date"}),
            "sweetness": forms.NumberInput(attrs={"min":1, "max":5}),
            "acidity": forms.NumberInput(attrs={"min":1, "max":5}),
            "umami": forms.NumberInput(attrs={"min":1, "max":5}),
            "aroma": forms.NumberInput(attrs={"min":1, "max":5}),
            "aftertaste": forms.NumberInput(attrs={"min":1, "max":5}),
        }
