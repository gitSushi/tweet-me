from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import login, logout


def login_view(request, *args, **kwargs):
  form = AuthenticationForm(request, data=request.POST or None)
  if form.is_valid():
    user_ = form.get_user()
    login(request, user_)
    return redirect("/")
  context = {
    "form": form,
    "btn_label": "Login",
    "title": "Login",
  }
  return render(request, "accounts/auth.html", context)


def logout_view(request, *args, **kwargs):
  if request.method == "POST":
    logout(request)
    return redirect("/login")
  context = {
    "form": None,
    "description": "Are you sure you want to logout ?",
    "btn_label": "Log out",
    "title": "Logout",
  }
  return render(request, "accounts/auth.html", context)


def register_view(request, *args, **kwargs):
  form = UserCreationForm(request.POST or None)
  if form.is_valid():
    # print(form.cleaned_data)
    user = form.save(commit=True)
    user.set_password(form.cleaned_data.get("password1"))
    # username = form.cleaned_data.get("username")
    # in other projects You will find how to send a confirmation e-mail to verify account
    login(request, user)
    return redirect("/")
  context = {
    "form": form,
    "btn_label": "Register",
    "title": "Register",
  }
  return render(request, "accounts/auth.html", context)
