import random
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer, RegisterSerializer

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(user):
    otp = generate_otp()
    user.otp_code = otp
    user.save()
    
    subject = 'SecureLearn - Your Verification Code'
    message = f'Your verification code is: {otp}\n\nPlease enter this code to verify your account.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    
    try:
        send_mail(subject, message, email_from, recipient_list)
    except Exception as e:
        print(f"Error sending email: {e}")
        # In development, it's helpful to print the OTP if email fails
        print(f"--- OTP FOR {user.email} is {otp} ---")

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        send_otp_email(user)
        return Response({"message": "User registered successfully. OTP sent to email."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_view(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
    if user.otp_code == otp:
        user.is_verified = True
        user.otp_code = None
        user.save()
        
        tokens = get_tokens_for_user(user)
        return Response({
            "message": "Email verified successfully.",
            "user": UserSerializer(user).data,
            "access": tokens['access'],
            "refresh": tokens['refresh']
        }, status=status.HTTP_200_OK)
        
    return Response({"detail": "Invalid OTP code."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp_view(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        send_otp_email(user)
        return Response({"message": "OTP resent successfully."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Allow login by email as well
    if '@' in username:
        try:
            user_obj = User.objects.get(email=username)
            username = user_obj.username
        except User.DoesNotExist:
            pass
            
    user = authenticate(username=username, password=password)
    
    if user is not None:
        if not user.is_verified:
            return Response({"detail": "Please verify your email first."}, status=status.HTTP_403_FORBIDDEN)
            
        tokens = get_tokens_for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": tokens['access'],
            "refresh": tokens['refresh']
        }, status=status.HTTP_200_OK)
    
    return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_nickname_view(request):
    nickname = request.data.get('nickname')
    if not nickname:
        return Response({"detail": "Nickname is required."}, status=status.HTTP_400_BAD_REQUEST)
        
    user = request.user
    user.nickname = nickname
    user.save()
    
    return Response({"message": "Nickname set successfully.", "nickname": nickname}, status=status.HTTP_200_OK)

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)
    elif request.method == 'PATCH':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
