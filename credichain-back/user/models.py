from django.db import models

class PendingUser(models.Model):
    uid =models.AutoField(primary_key=True)
    full_name=models.CharField(max_length=255)
    student_id=models.CharField(max_length=255,unique= True)
    wallet_address=models.CharField(max_length=255,unique=True) 
    email=models.CharField(max_length=255, unique= True)
    student_id_photo = models.ImageField(upload_to='student/photos')
    def __str__(self):
        return f"{self.full_name} (pending)" 