from django.urls import path
from . import views
from sake_note import api_views

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path("create/", views.SakeCreateView.as_view(), name="sake_create"),
    path("<int:pk>/update/", views.SakeUpdateView.as_view(), name="update"),
    path("<int:pk>/delete/", views.SakeDeleteView.as_view(), name="delete"),
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("profile/<str:username>/", views.ProfileView.as_view(), name="profile"),
    path("api/profile/<str:username>/", api_views.user_profile_api, name="user_profile_api"),
    path("api/sakes/", api_views.SakeListAPI.as_view(), name="sake_list_api"),
    path("api/sakes/<int:pk>/", api_views.SakeDetailAPI.as_view(), name="sake_detail_api"),
    path("api/sake_map/", api_views.sake_map_api, name="sake_map_api"),
]