from django.db import models
from django.utils.timezone import now
import string
import random

class PendingUser(models.Model):
    uid =models.AutoField(primary_key=True)
    full_name=models.CharField(max_length=255)
    student_id=models.CharField(max_length=255,unique= True) 
    email=models.CharField(max_length=255, unique= True)
    password=models.CharField(max_length=255,blank=True,null=True)
    student_id_photo = models.ImageField(upload_to='student/photos')
    def __str__(self):
        return f"{self.full_name} (pending)"
 
class VerifiedUser(models.Model):
    student_id = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.username:
            prefix = "super_cake_"
            suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
            self.username = prefix + suffix
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username    

class UserActivityLog(models.Model):
    student_id = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.student_id} - {self.action} - {self.timestamp}"


class UserWalletInfo(models.Model):
    student = models.OneToOneField(VerifiedUser, on_delete=models.CASCADE, to_field='student_id')
    walletaddress = models.CharField(max_length=255, unique=True)
    balance = models.DecimalField(max_digits=18, decimal_places=6, default=0)
    creditscore = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.student_id} - {self.walletaddress}"   
class LoanRequest(models.Model):
    student_id = models.CharField(max_length=255)
    wallet_address = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    deadline = models.DateField()
    description = models.TextField(blank=True)

    # NUEVOS CAMPOS PARA CUOTAS
    is_installment = models.BooleanField(default=False)  # True si es a cuotas
    number_of_installments = models.IntegerField(null=True, blank=True)
    installment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    status = models.CharField(max_length=50, default="pending")  # pending, accepted, paid
    lender_wallet = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.student_id} requested {self.amount} ETH - {self.status}"