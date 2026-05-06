from rest_framework import serializers
from .models import UserProgress, EarnedBadge

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['lesson_id', 'score', 'completed', 'xp_earned', 'completed_at']

class EarnedBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EarnedBadge
        fields = ['badge_id', 'earned_at']
