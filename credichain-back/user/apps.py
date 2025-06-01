# user/apps.py
from django.apps import AppConfig

class UserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "user"

    def ready(self):
        from .scheduler import start_scheduler
        start_scheduler()