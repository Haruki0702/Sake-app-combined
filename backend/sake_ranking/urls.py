from django.urls import path
from . import views

urlpatterns=[
    path("", views.ranking_list, name="sake_ranking"),
    path("api/", views.ranking_list_api, name="sake_ranking_api"),
]