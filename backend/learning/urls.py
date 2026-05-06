from django.urls import path
from . import views

urlpatterns = [
    # API endpoints handled by learning app
    path('quiz/result/', views.submit_quiz_result_view, name='quiz_result'),
    path('lessons/', views.lessons_dummy_view, name='lessons_list'),
    path('lessons/<int:id>/', views.lessons_dummy_view, name='lesson_detail'),
    path('quiz/<int:lesson_id>/', views.quiz_dummy_view, name='quiz_detail'),
]
