# user/scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from user.tasks import update_all_scores

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_all_scores, "interval", minutes=1)
    scheduler.start()
    print("⏱️ Credit score scheduler iniciado cada 1 minutos.")