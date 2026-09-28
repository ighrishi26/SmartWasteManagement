from rest_framework.authtoken.models import Token
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .permissions import get_user_role
from .role_permissions import ROLE_PERMISSIONS
from .serializers import LoginSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.validated_data["user"]

    token, created = Token.objects.get_or_create(
        user=user
    )

    role = get_user_role(user)

    permissions = ROLE_PERMISSIONS.get(
        role,
        ROLE_PERMISSIONS["Viewer"],
    )

    return Response({
        "success": True,
        "token": token.key,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role,
            "permissions": permissions,
        },
    })


@api_view(["GET"])
def current_user(request):
    user = request.user

    role = get_user_role(user)

    permissions = ROLE_PERMISSIONS.get(
        role,
        ROLE_PERMISSIONS["Viewer"],
    )

    return Response({
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role,
            "permissions": permissions,
        },
    })