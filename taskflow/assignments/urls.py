from django.urls import path
from . import views

app_name = "assignments"
urlpatterns = [
    # 一覧
    path("", views.index, name="index"),
]
