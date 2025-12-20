from django.urls import path
from . import views

urlpatterns=[
    path("", views.ranking_list, name="sake_ranking"),
]