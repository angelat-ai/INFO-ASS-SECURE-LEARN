from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    nickname = models.CharField(max_length=50, blank=True, null=True)
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
