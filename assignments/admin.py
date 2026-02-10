from django.contrib import admin
from .models import Assignment


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "completed", "created_at")
    list_filter = ("completed", "owner")
    search_fields = ("title", "description")
