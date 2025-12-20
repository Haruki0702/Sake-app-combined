from rest_framework import serializers
from .models import Sake

class SakeSerializer(serializers.ModelSerializer):
    user=serializers.StringRelatedField(source="user.username")
    class Meta:
        model = Sake
        # 以前は fields = ['id', 'title'...] と書いていましたが、
        # 全てのフィールドを自動で対象にする書き方に変えます
        fields = '__all__'
        
        # 投稿時に user は自動設定するので、入力必須チェックから外す設定
        read_only_fields = ('user', 'created_at')