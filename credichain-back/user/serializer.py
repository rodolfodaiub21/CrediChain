from rest_framework import serializers
from .models import PendingUser,VerifiedUser,LoanRequest,UserWalletInfo
from django.contrib.auth.hashers import make_password

class PendingUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = PendingUser
        fields = ['full_name', 'student_id', 'student_id_photo', 'email', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
class PendingUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingUser
        fields = ['uid', 'full_name', 'student_id', 'email', 'student_id_photo']

class LoanRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRequest
        fields = '__all__'

class UserWalletInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWalletInfo
        fields = ['student', 'walletaddress', 'balance', 'creditscore']