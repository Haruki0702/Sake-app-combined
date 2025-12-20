from django.shortcuts import render, get_object_or_404
from .models import Sake
from .forms import SakeForm
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .services import calculate_taste_profile

class IndexView(ListView):
    model=Sake
    template_name="sake_note/index.html"
    context_object_name="sake_list"
    ordering=["-created_at"]

class SakeCreateView(LoginRequiredMixin, CreateView):
    model=Sake
    form_class=SakeForm
    template_name="sake_note/sake_form.html"
    success_url=reverse_lazy("index")

    def form_valid(self, form):
        form.instance.user=self.request.user
        return super().form_valid(form)    

class SakeUpdateView(LoginRequiredMixin, UpdateView):
    model=Sake
    form_class=SakeForm
    template_name="sake_note/sake_form.html"
    success_url=reverse_lazy("index")

    def test_func(self):
        obj=self.get_object()
        return obj.user==self.request.user

class SakeDeleteView(LoginRequiredMixin, DeleteView):
    model=Sake
    template_name="sake_note/sake_confirm_delete.html"
    success_url=reverse_lazy("index")

    def test_func(self):
        obj=self.get_object()
        return obj.user==self.request.user

class SignUpView(CreateView):
    form_class = UserCreationForm
    template_name = "registration/signup.html"
    success_url = reverse_lazy("login")

class ProfileView(ListView):
    model=Sake
    template_name="sake_note/profile.html"
    context_object_name="sake_list"
    def get_queryset(self):
        self.target_user=get_object_or_404(User, username=self.kwargs["username"])
        return Sake.objects.filter(user=self.target_user).order_by("-created_at")
    def get_context_data(self, **kwargs):
        context=super().get_context_data(**kwargs)
        context["target_user"]=self.target_user
        context["radar_data"]=calculate_taste_profile(self.object_list)
        return context


