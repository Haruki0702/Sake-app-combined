from rest_framework import generics
from .models import Sake
from .serializers import SakeSerializer

class SakeListAPI(generics.ListCreateAPIView):
    queryset = Sake.objects.all().order_by("-tasting_date")
    serializer_class = SakeSerializer
    