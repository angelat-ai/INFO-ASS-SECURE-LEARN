from django.db import models
from django.conf import settings

class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    lesson_id = models.IntegerField()
    score = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    xp_earned = models.IntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson_id')

class EarnedBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    badge_id = models.CharField(max_length=50)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge_id')
