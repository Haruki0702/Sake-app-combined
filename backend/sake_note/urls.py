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
    path("api/sake_map/<str:username>/", api_views.sake_map_api, name="user_sake_map_api"),
    path("api/sakes/following/", api_views.FollowingSakesAPI.as_view(), name="following_sakes_api"),
    path("api/users/", api_views.UserListAPI.as_view(), name="user_list_api"),
    path("api/users/<int:user_id>/follow/", api_views.follow_user_api, name="follow_user_api"),
    path("api/users/<str:username>/following/", api_views.following_list_api, name="following_list_api"),
    path("api/users/<str:username>/followers/", api_views.followers_list_api, name="followers_list_api"),
]