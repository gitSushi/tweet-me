from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.utils.http import is_safe_url
import random

from django.conf import settings

from .models import Tweet
from .forms import TweetForm

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

def home_view (request, *args, **kwargs):
  '''
  print(args) # -> ()
  print(kwargs) # -> {'tweet_id': 12}
  '''
  #return HttpResponse('<title>Hell to the title</title><h1>Hello Test One !</h1>')
  template = "pages/home.html"
  context = { "h1": "hello HTML tweetme2/templates/pages" }
  status = 200
  return render(request, template, context, status=status)



def tweet_list_view(request, *args, **kwargs):
  qs = Tweet.objects.all()
  # instead of looping here it can be done in models
  # tweets_list = [{"id": x.id, "content": x.content, "likes": random.randint(0, 1561)} for x in qs]
  tweets_list = [x.serialize() for x in qs]
  data = {
    "isUser": False,
    "response": tweets_list
  }
  return JsonResponse(data)
  
'''
following is a dynamic view
'''
'''
def tweet_detail_view(request, tweet_id, *args, **kwargs):
  try:
    obj = Tweet.objects.get(id=tweet_id)
  except:
    raise Http404
  return HttpResponse(f"<h1>Hello {tweet_id} - {obj.content}</h1>")
'''
'''
turned into a REST API (it returns json data)
'''

def tweet_detail_view(request, tweet_id, *args, **kwargs):
  data = {
    "id": tweet_id,
  }
  status = 200
  try:
    obj = Tweet.objects.get(id=tweet_id)
    data['content'] = obj.content
  except:
    data['message'] = "Not Found"
    status = 404

  return JsonResponse(data, status=status)

def tweet_create_view(request, *args, **kwargs):
  # django has a way to tell if a request is ajax
  # print('is_ajax : ', request.is_ajax())
  form = TweetForm(request.POST or None)
  next_url = request.POST.get('next' or None)
  if form.is_valid():
    obj = form.save(commit=False)
    obj.save()
    if request.is_ajax:
      return JsonResponse(obj.serialize(), status=201) # 201 == created items
    # security measure for redirect
    if next_url != None and is_safe_url(next_url, ALLOWED_HOSTS):
      return redirect(next_url)
    form = TweetForm()
  if form.errors:
    if request.is_ajax:
      return JsonResponse(form.errors, status=400)
  template = "components/form.html"
  context = {"form": form}
  return render(request, template, context)