from django import forms
from .models import Assignment


class AssignmentForm(forms.ModelForm):
    class Meta:
        model = Assignment
        fields = ["title", "description", "due_date", "completed"]
        widgets = {
            "due_date": forms.DateInput(
                attrs={
                    "type": "date",
                    "placeholder": "例: 2026-02-11（YYYY-MM-DD）",
                }
            ),
            "description": forms.Textarea(attrs={"rows": 4}),
        }
        help_texts = {
            "due_date": "入力が必要な場合は YYYY-MM-DD 形式で入力してください。",
        }
