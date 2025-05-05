from django.http import JsonResponse
from django.contrib.auth import get_user_model

def create_superuser(request):
    User = get_user_model()
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "ZemenAdmin", "ZemenRestaurant123")
        return JsonResponse({"status": "Superuser created."})
    return JsonResponse({"status": "Superuser already exists."})
