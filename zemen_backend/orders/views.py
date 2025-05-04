from rest_framework import generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAdminUser
from rest_framework.authtoken.models import Token
from .models import Order
from .serializers import OrderSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .models import Order, OrderItem, Reservation
import logging
import stripe
from django.conf import settings
from .serializers import OrderSerializer 
from .serializers import ReservationSerializer
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY") 

logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_profile(request):
    return Response({
        "username": request.user.username
    })

# Admin login view
class AdminLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'username': token.user.username})
    

# Admin reservation list
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_reservation_list(request):
    reservations = Reservation.objects.all().order_by('-created_at')
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


# Admin reservation update (confirm/cancel)
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_reservation_update(request, pk):
    try:
        reservation = Reservation.objects.get(pk=pk)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=404)

    status_value = request.data.get("status")
    if status_value not in ["pending", "confirmed", "cancelled"]:
        return Response({"error": "Invalid status"}, status=400)

    reservation.status = status_value
    reservation.save()

    serializer = ReservationSerializer(reservation)
    return Response(serializer.data)

# Admin order list view
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_order_list(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

@api_view(['POST'])
def submit_order(request):
    data = request.data
    order = Order.objects.create(
        name=data.get("name"),
        phone=data.get("phone"),
        order_type=data.get("order_type"),
        special_request=data.get("special_request", ""),
        total_price=data.get("total_price"),
        street=data.get("street", ""),
        city=data.get("city", ""),
        state=data.get("state", ""),
        zip=data.get("zip", "")
    )

    for item in data.get("items", []):
        OrderItem.objects.create(
            order=order,
            item_name=item["name"],
            quantity=item["quantity"],
            price_per_item=item["price"]
        )

    serializer = OrderSerializer(order)
    return Response(serializer.data)



@api_view(["POST"])
def create_payment_intent(request):
    try:
        amount = request.data.get("amount")  # This should be in cents
        if not amount:
            return Response({"error": "Amount is required"}, status=400)

        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency="usd",
            automatic_payment_methods={"enabled": True},
        )

        return Response({"client_secret": intent.client_secret})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    

class ReservationCreateView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer