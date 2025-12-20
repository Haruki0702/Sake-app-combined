from rest_framework import generics
from .models import Sake
from .serializers import SakeSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .services import calculate_taste_profile
from rest_framework import permissions
from .permission import IsOwnerOrReadOnly

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
    