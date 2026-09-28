from rest_framework.permissions import BasePermission


def get_user_role(user):
    if user.is_superuser:
        return "Administrator"

    groups = list(
        user.groups.values_list("name", flat=True)
    )

    if groups:
        return groups[0]

    return "Viewer"


class RolePermission(BasePermission):
    """
    Base permission for SmartWaste role-based access.
    """

    allowed_roles = []

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role = get_user_role(request.user)

        return role in self.allowed_roles


class AdministratorPermission(RolePermission):
    allowed_roles = ["Administrator"]


class OperatorPermission(RolePermission):
    allowed_roles = [
        "Administrator",
        "Operator",
    ]


class ViewerPermission(RolePermission):
    allowed_roles = [
        "Administrator",
        "Operator",
        "Viewer",
    ]