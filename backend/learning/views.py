from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserProgress, EarnedBadge
from .serializers import UserProgressSerializer, EarnedBadgeSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress_view(request):
    progress = UserProgress.objects.filter(user=request.user)
    data = {}
    for p in progress:
        data[p.lesson_id] = {
            "completed": p.completed,
            "score": p.score,
            "xp": p.xp_earned,
            "completedAt": p.completed_at
        }
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_badges_view(request):
    badges = EarnedBadge.objects.filter(user=request.user)
    return Response([b.badge_id for b in badges])

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz_result_view(request):
    lesson_id = request.data.get('lessonId')
    score = request.data.get('score', 0)
    xp_earned = request.data.get('xp', 0)
    earned_badges = request.data.get('earnedBadges', [])
    
    # Save progress
    progress, created = UserProgress.objects.update_or_create(
        user=request.user,
        lesson_id=lesson_id,
        defaults={
            'completed': True,
            'score': max(score, UserProgress.objects.filter(user=request.user, lesson_id=lesson_id).first().score if not created and UserProgress.objects.filter(user=request.user, lesson_id=lesson_id).exists() else score),
            'xp_earned': xp_earned
        }
    )
    
    # Save badges
    for badge_id in earned_badges:
        EarnedBadge.objects.get_or_create(user=request.user, badge_id=badge_id)
        
    return Response({"message": "Result saved successfully."})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lessons_dummy_view(request, id=None):
    # Let the frontend use its local LESSONS_DATA
    return Response([])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quiz_dummy_view(request, lesson_id):
    # Let the frontend use its local QUIZ_DATA
    return Response([])
