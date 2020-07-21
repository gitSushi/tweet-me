from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse

from .models import Tweet

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