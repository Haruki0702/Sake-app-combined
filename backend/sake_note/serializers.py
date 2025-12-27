from rest_framework import serializers
from .models import Sake
from django.contrib.auth.models import User

class SakeSerializer(serializers.ModelSerializer):
    user=serializers.StringRelatedField(source="user.username")
    class Meta:
        model = Sake
        # 以前は fields = ['id', 'title'...] と書いていましたが、
        # 全てのフィールドを自動で対象にする書き方に変えます
        fields = '__all__'
        
        # 投稿時に user は自動設定するので、入力必須チェックから外す設定
        read_only_fields = ('user', 'created_at')

class UserSerializer(serializers.ModelSerializer):
    following_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'following_count', 'followers_count', 'is_following']

    def get_following_count(self, obj):
        return obj.following.count()

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.following.filter(id=obj.id).exists()
        return False