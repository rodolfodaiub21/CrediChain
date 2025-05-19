from rest_framework import serializers
from .models import PendingUser

class PendingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingUser