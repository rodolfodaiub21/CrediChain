from rest_framework.decorators import api_view,parser_classes
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.response import Response
from rest_framework import status
from .serializer import PendingUserSerializer,PendingUserListSerializer,LoanRequestSerializer
from .models import PendingUser,VerifiedUser,UserActivityLog,LoanRequest,UserWalletInfo
from django.contrib.auth.hashers import make_password,check_password
from rest_framework.views import APIView

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def register_user(request):
    serializer = PendingUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Usuario registrado con éxito"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_pending_users(request):
    pending_users = PendingUser.objects.all()
    serializer = PendingUserListSerializer(pending_users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def approve_user(request, uid):
    try:
        pending_user = PendingUser.objects.get(uid=uid)
    except PendingUser.DoesNotExist:
        return Response({"error": "Usuario pendiente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Crear usuario verificado con los datos necesarios
    VerifiedUser.objects.create(
        student_id=pending_user.student_id,
        email=pending_user.email,
        password=pending_user.password  # Ya está hasheado
    )
    # Eliminar el usuario pendiente
    pending_user.delete()

    return Response({"message": "Usuario aprobado y movido a verificados"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def login_user(request):
    student_id = request.data.get('studentID')
    password = request.data.get('password')

    try:
        user = VerifiedUser.objects.get(student_id=student_id)
    except VerifiedUser.DoesNotExist:
        return Response({"message": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if check_password(password, user.password):
        UserActivityLog.objects.create(
            student_id=student_id,
            action="Logged in"
        )
        return Response({"message": "Login exitoso", "student_id": user.student_id,"username":user.username}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Contraseña incorrecta"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def log_action(request):
    student_id = request.data.get('student_id')
    action = request.data.get('action')

    UserActivityLog.objects.create(
        student_id=student_id,
        action=action
    )

    return Response({"message": "Acción registrada"})

class LoanRequestView(APIView):
    def post(self, request):
        serializer = LoanRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        loans = LoanRequest.objects.all().order_by('-created_at')
        serializer = LoanRequestSerializer(loans, many=True)
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)
@api_view(['POST'])
def user_wallet_info(request):
    print("DEBUG request.data:", request.data)

    student_id = request.data.get("student_id")
    wallet_address = request.data.get("wallet_address")
    balance = request.data.get("balance")
    credit_score = request.data.get("credit_score")

    if not student_id or not wallet_address:
        return Response({"error": "Faltan datos"}, status=400)

    try:
        student = VerifiedUser.objects.get(student_id=student_id)
    except VerifiedUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=404)

    obj, created = UserWalletInfo.objects.update_or_create(
        student=student,
        defaults={
            "walletaddress": wallet_address,
            "balance": balance,
            "creditscore": credit_score
        }
    )

    return Response({"message": "Wallet vinculada correctamente"}, status=201)
