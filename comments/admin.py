from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("assignment", "author", "created_at")
    search_fields = ("content",)
