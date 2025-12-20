from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    所有者だけが編集・削除を許可されるカスタム権限
    """
    def has_object_permission(self, request, view, obj):
        # 読むだけ(GET, HEAD, OPTIONS)なら誰でもOK
        if request.method in permissions.SAFE_METHODS:
            return True

        # 書き込み(PUT, DELETE)は、オブジェクトの所有者(user)と
        # リクエストした人(request.user)が一致する時だけOK
        return obj.user == request.user