from django.urls import path
from . import views

urlpatterns=[
    path("", views.event_list, name="event_list"),
    path("api/", views.event_list_api, name="event_list_api"),
]