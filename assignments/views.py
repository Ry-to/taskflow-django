from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView,
)
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Assignment
from .forms import AssignmentForm
from comments.forms import CommentForm


class AssignmentListView(ListView):
    model = Assignment
    template_name = "assignments/index.html"
    context_object_name = "assignments"
    ordering = ["-created_at"]


class AssignmentDetailView(DetailView):
    model = Assignment
    template_name = "assignments/detail.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["comment_form"] = CommentForm()
        return ctx


class AssignmentCreateView(LoginRequiredMixin, CreateView):
    model = Assignment
    form_class = AssignmentForm
    template_name = "assignments/form.html"

    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)


class AssignmentUpdateView(LoginRequiredMixin, UpdateView):
    model = Assignment
    form_class = AssignmentForm
    template_name = "assignments/form.html"


class AssignmentDeleteView(LoginRequiredMixin, DeleteView):
    model = Assignment
    template_name = "assignments/confirm_delete.html"
    success_url = reverse_lazy("assignments:index")


def toggle_complete(request, pk):
    assignment = get_object_or_404(Assignment, pk=pk)
    assignment.completed = not assignment.completed
    assignment.save()
    return redirect("assignments:index")


def add_comment(request, pk):
    assignment = get_object_or_404(Assignment, pk=pk)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.assignment = assignment
            if request.user.is_authenticated:
                comment.author = request.user
            comment.save()
    return redirect("assignments:detail", pk=pk)


# convenience view names for urls
index = AssignmentListView.as_view()
detail = AssignmentDetailView.as_view()
create = AssignmentCreateView.as_view()
update = AssignmentUpdateView.as_view()
delete = AssignmentDeleteView.as_view()
