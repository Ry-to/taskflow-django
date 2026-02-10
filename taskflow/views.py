from django.views.generic import TemplateView
from datetime import date

from assignments.models import Assignment


class HomeView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        today = date.today()
        user = self.request.user
        if user.is_authenticated:
            qs = Assignment.objects.filter(owner=user, due_date=today)
        else:
            qs = Assignment.objects.filter(due_date=today)
        total = qs.count()
        completed = qs.filter(completed=True).count()
        percent = round((completed / total) * 100) if total > 0 else 0
        remaining = total - completed
        ctx.update(
            {
                "today_total": total,
                "today_completed": completed,
                "today_percent": percent,
                "today_remaining": remaining,
            }
        )
        return ctx
