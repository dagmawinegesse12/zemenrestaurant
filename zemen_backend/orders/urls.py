from django.urls import path
from .views import OrderCreateView
from .views import submit_order, create_payment_intent, admin_order_list, AdminLoginView, ReservationCreateView, admin_reservation_list,admin_reservation_update, admin_profile

urlpatterns = [
    path("submit/", submit_order, name="submit_order"),
    path("create-intent/", create_payment_intent, name="create_payment_intent"),
    path("admin/login/", AdminLoginView.as_view(), name="admin_login"),
    path("admin/orders/", admin_order_list, name="admin_order_list"),   
    path("admin/reservations/", admin_reservation_list, name="admin_reservation_list"),
    path("admin/reservations/<int:pk>/", admin_reservation_update, name="admin_reservation_update"),
    path("reservations/", ReservationCreateView.as_view(), name="reservation_create"),
    path("profile/", admin_profile, name="admin_profile"),


]
