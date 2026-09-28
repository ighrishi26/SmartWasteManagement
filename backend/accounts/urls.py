from django.urls import path

from . import views


urlpatterns = [
    path(
        "login/",
        views.login,
        name="login",
    ),
    path(
        "me/",
        views.current_user,
        name="current-user",
    ),
]