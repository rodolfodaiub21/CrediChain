from django.urls import path
from .views import register_user, list_pending_users, approve_user, login_user, LoanRequestView, user_wallet_info

urlpatterns = [
    path('register/', register_user, name='register-user'),
    path('pending-users/', list_pending_users, name='list-pending-users'),
    path('approve-user/<int:uid>/', approve_user, name='approve-user'),
    path('login/', login_user, name='login-user'),
    path('ask_loan/', LoanRequestView.as_view(), name='ask-loan'),
    path('user_wallet_info/', user_wallet_info, name='user-wallet-info'),  # <- Corregido aquí
]
