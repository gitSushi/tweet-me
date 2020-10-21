from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.utils.http import is_safe_url
from django.conf import settings
import random

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from .serializers import (
  TweetSerializer,
  TweetActionSerializer,
  TweetCreateSerializer
  )

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


@api_view(['POST'])
# @authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated]) # check REST API course for more
def tweet_create_view(request, *args, **kwargs):
  '''
  Changed to -> to work with react
  '''
  # serializer = TweetCreateSerializer(data=request.POST)
  serializer = TweetCreateSerializer(data=request.data)
  if serializer.is_valid(raise_exception=True):
    serializer.save(user = request.user)
    # return JsonResponse(serializer.data, status=201)
    return Response(serializer.data, status=201)
  # return JsonResponse({}, status=400)
  return Response({}, status=400)

@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):
  qs = Tweet.objects.all()
  serializer = TweetSerializer(qs, many=True)
  return Response(serializer.data, status=200)

@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
  qs = Tweet.objects.filter(id=tweet_id)
  if not qs.exists():
    return Response({}, status=404)
  obj = qs.first()
  serializer = TweetSerializer(obj)
  return Response(serializer.data, status=200)

@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
  qs = Tweet.objects.filter(id=tweet_id)
  if not qs.exists():
    return Response({}, status=404)
  qs = qs.filter(user=request.user)
  if not qs.exists():
    return Response({"message": "You cannot delete this tweet"}, status=401)
  obj = qs.first()
  obj.delete()
  return Response({"message": "Tweet removed"}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tweet_action_view(request, *args, **kwargs):
  '''
  Id is required -> new serializer
  Action options : like, unlike, retweet
  '''
  user = request.user
  serializer = TweetActionSerializer(data=request.data)
  if serializer.is_valid(raise_exception=True):
    data = serializer.validated_data
    tweet_id = data.get("id")
    action = data.get("action")
    content = data.get("content")
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
      return Response({}, status=404)
    obj = qs.first()
    if action == "like":
      obj.likes.add(user)
      serializer = TweetSerializer(obj)
      return Response(serializer.data, status=200)
    elif action == "unlike":
      obj.likes.remove(user)
      serializer = TweetSerializer(obj)
      return Response(serializer.data, status=200)
    elif action == "retweet":
      new_tweet = Tweet.objects.create(user=user, parent=obj, content=content)
      serializer = TweetSerializer(new_tweet)
      return Response(serializer.data, status=201)
  return Response({}, status=200)

'''
To avoid mutiple clicks (requests) use the tweet_action instead
'''
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tweet_like_toggle_view(request, tweet_id, *args, **kwargs):
  qs = Tweet.objects.filter(id=tweet_id)
  if not qs.exists():
    return Response({}, status=404)
  obj = qs.first()
  if request.user in obj.likes.all():
    obj.likes.remove(request.user)
  else:
    obj.likes.add(request.user)
  return Response({"message": "Tweet removed"}, status=200)

'''
Note the big reduction in code from pure django bellow to Django REST framework above
'''

def tweet_list_view_pure_django(request, *args, **kwargs):
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

def tweet_detail_view_pure_django(request, tweet_id, *args, **kwargs):
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

def tweet_create_view_pure_django(request, *args, **kwargs):
  '''
  REST API Create view -> Django REST Framework
  '''
  '''
  25 lines of code just to create one object of only Create in a CRUD
  DRF is going to simplify that
  '''
  user = request.user
  if not request.user.is_authenticated:
    user = None
    if request.is_ajax:
      return JsonResponse({}, status=401)
    return redirect(settings.LOGIN_URL)
  # django has a way to tell if a request is ajax
  # print('is_ajax : ', request.is_ajax())
  form = TweetForm(request.POST or None)
  next_url = request.POST.get('next' or None)
  if form.is_valid():
    obj = form.save(commit=False)
    obj.user = user
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