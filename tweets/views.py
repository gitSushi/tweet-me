from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.utils.http import is_safe_url
from django.conf import settings
import random

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

def home_view (request, *args, **kwargs):
  '''
  print(args) # -> ()
  print(kwargs) # -> {'tweet_id': 12}
  '''
  #return HttpResponse('<title>Hell to the title</title><h1>Hello Test One !</h1>')
  username = None
  if request.user.is_authenticated:
    username = request.user.username
  template = "pages/home.html"
  context = { 
    "h1": "hello HTML tweetme2/templates/pages",
    "username": username
  }
  status = 200
  return render(request, template, context, status=status)

def tweets_list_view (request, *args, **kwargs):
  template = "tweets/list.html"
  return render(request, template)

def tweets_detail_view (request, tweet_id, *args, **kwargs):
  template = "tweets/detail.html"
  context = { "tweet_id": tweet_id }
  return render(request, template, context)

def tweets_profile_view (request, username, *args, **kwargs):
  template = "tweets/profile.html"
  context = { "profile_username": username }
  return render(request, template, context)