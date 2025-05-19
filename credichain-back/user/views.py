from django.shortcuts import render
from rest_framework.decorators import api_view,parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializer import PendingUserSerializer

# Create your views here.
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def register_user(request):
    serializer = PendingUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Usuario registrado como pendiente"}, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)