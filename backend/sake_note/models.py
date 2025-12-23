from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from .prefectures import Prefectures

class Sake(models.Model):
    SCORE_CHOICES=[
        (1, "*"),
        (2, "**"),
        (3, "***"),
        (4, "****"),
        (5, "*****"),
    ]

    title=models.CharField("銘柄", max_length=200)
    brewery=models.CharField("酒蔵", max_length=200, blank=True)
    score=models.IntegerField("評価", choices=SCORE_CHOICES, default=3)
    tasting_date=models.DateField("飲んだ日")
    image=models.ImageField("ラベル画像", upload_to="images/", blank=True, null=True)
    memo=models.TextField("メモ", blank=True)
    prefecture=models.CharField("都道府県", choices=Prefectures, blank=True, max_length=10)

    sweetness=models.IntegerField("甘み", default=3, validators=[MinValueValidator(1), MaxValueValidator(5)])
    acidity=models.IntegerField("酸味", default=3, validators=[MinValueValidator(1), MaxValueValidator(5)])
    umami=models.IntegerField("旨味", default=3, validators=[MinValueValidator(1), MaxValueValidator(5)])
    aroma=models.IntegerField("香り", default=3, validators=[MinValueValidator(1), MaxValueValidator(5)])
    aftertaste=models.IntegerField("後味", default=3, validators=[MinValueValidator(1), MaxValueValidator(5)])

    created_at=models.DateTimeField("作成日時", auto_now_add=True)
    user=models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="ユーザー")

    def __str__(self):
        return self.title
