from rest_framework import generics
from .models import Sake
from .serializers import SakeSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .services import calculate_taste_profile
from rest_framework import permissions
from .permission import IsOwnerOrReadOnly
from django.db.models import Count

class SakeListAPI(generics.ListCreateAPIView):
    queryset = Sake.objects.all().order_by("created_at")
    serializer_class = SakeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SakeDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sake.objects.all()
    serializer_class = SakeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

@api_view(['GET'])
def user_profile_api(request, username):
    target_user=get_object_or_404(User, username=username)
    sakes=Sake.objects.filter(user=target_user).order_by("-tasting_date")
    radar_data=calculate_taste_profile(sakes)
    serializer = SakeSerializer(sakes, many=True)
    return Response({
        "username": target_user.username,
        "radar_data": radar_data,
        "sake_count": sakes.count(),
        "sakes": serializer.data,
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def sake_map_api(request):
    data=Sake.objects.filter(user=request.user).values("prefecture").annotate(count=Count("id"))
    response_data={}
    for item in data:
        pref_nam=item["prefecture"]
        count=item["count"]
        if pref_nam:
            response_data[pref_nam]=count
    return Response(response_data)

class FollowingSakesAPI(generics.ListAPIView):
    serializer_class = SakeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ログインユーザーがフォローしているユーザーの投稿を取得
        following_users = self.request.user.following.all()
        return Sake.objects.filter(user__in=following_users).order_by("-created_at")

class UserListAPI(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def follow_user_api(request, user_id):
    target_user = get_object_or_404(User, id=user_id)
    if request.user == target_user:
        return Response({'error': '自分自身をフォローできません'}, status=400)

    if request.user.following.filter(id=target_user.id).exists():
        request.user.following.remove(target_user)
        return Response({'message': 'フォロー解除しました'})
    else:
        request.user.following.add(target_user)
        return Response({'message': 'フォローしました'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def following_list_api(request, username):
    target_user = get_object_or_404(User, username=username)
    following = target_user.following.all()
    serializer = UserSerializer(following, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def followers_list_api(request, username):
    target_user = get_object_or_404(User, username=username)
    followers = target_user.followers.all()
    serializer = UserSerializer(followers, many=True, context={'request': request})
    return Response(serializer.data)