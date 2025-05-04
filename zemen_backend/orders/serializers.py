from rest_framework import serializers
from .models import Order, OrderItem, Reservation

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['item_name', 'quantity', 'price_per_item']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)  # <-- read_only, since this is for viewing
    delivery_address = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'name', 'phone', 'special_request', 'total_price', 'order_type',
            'street', 'city', 'state', 'zip', 'delivery_address', 'status', 'created_at', 'items'
        ]

    def get_delivery_address(self, obj):
        if obj.order_type == "delivery":
            return f"{obj.street}, {obj.city}, {obj.state} {obj.zip}"
        return None

    def validate(self, data):
        order_type = data.get("order_type")

        if order_type == "delivery":
            street = data.get("street")
            city = data.get("city")
            state = data.get("state")
            zip_code = data.get("zip")

            if not street or not city or not state or not zip_code:
                raise serializers.ValidationError("Delivery address is required for delivery orders.")
            
            if len(zip_code) < 5:
                raise serializers.ValidationError("Zip code must be at least 5 characters.")

        return data

    def create(self, validated_data):
        items_data = self.context['request'].data.get('items', [])
        order = Order.objects.create(**validated_data)

        for item in items_data:
            OrderItem.objects.create(order=order, **item)

        return order

    


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'