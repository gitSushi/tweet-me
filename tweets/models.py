from django.db import models

class Tweet(models.Model):
  '''
  These object's properties are the only ones django will accept to save() in db.sqlite3
  '''
  # also blank and null in case we tweet only an img
  content = models.TextField(blank=True, null=True)
  # a path to image is stored here, not img itself
  # blank means not required in Django and null means not required in the database
  image = models.FileField(upload_to='images/', blank=True, null=True)
