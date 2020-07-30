from django.db import models
from django.conf import settings
import random

User = settings.AUTH_USER_MODEL

class TweetLike(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  # Tweet in str because class is below
  tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
  timestamp = models.DateTimeField(auto_now_add=True)

class Tweet(models.Model):
  '''
  These object's properties are the only ones django will accept to save() in db.sqlite3
  or
  maps to SQL data
  '''
  # also blank and null in case we tweet only an img
  content = models.TextField(blank=True, null=True)
  likes = models.ManyToManyField(User, related_name='tweet_user', blank=True, through=TweetLike)
  # a path to image is stored here, not img itself
  # blank means not required in Django and null means not required in the database
  image = models.FileField(upload_to='images/', blank=True, null=True)
  timestamp = models.DateTimeField(auto_now_add=True)
  '''
  # on_delete=models... means :
  #if user deleted -> 

  # ...CASCADE means :
  # all this user's tweets are also deleted

  # null=True, ...SET_NULL means :
  # tweets are kept and set user to null
  '''
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  '''
  # in admin would list tweets by content instead of Tweet object (id)
  # string represention of the object
  def __str__(self):
    return self.content
  '''

  class Meta:
    '''
    onload all tweets newest to oldest
    '''
    ordering = ['-id']

  def serialize(self):
    return {
      "id": self.id,
      "content": self.content,
      "likes": random.randint(0, 373),
    }
