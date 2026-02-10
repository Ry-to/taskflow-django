from django.urls import path
from . import views

app_name = "assignments"
urlpatterns = [
    path("", views.index, name="index"),
    path("create/", views.create, name="create"),
    path("<int:pk>/", views.detail, name="detail"),
    path("<int:pk>/edit/", views.update, name="update"),
    path("<int:pk>/delete/", views.delete, name="delete"),
    path("<int:pk>/toggle/", views.toggle_complete, name="toggle"),
    path("<int:pk>/comments/add/", views.add_comment, name="add_comment"),
]
