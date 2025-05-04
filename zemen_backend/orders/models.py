from django.db import models


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    special_request = models.TextField(blank=True)
    order_type = models.CharField(max_length=20, choices=[("pickup", "Pickup"), ("delivery", "Delivery")])
    street = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=50, blank=True)
    zip = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")  # <-- NEW FIELD

    def __str__(self):
        return f"{self.name} - {self.order_type} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    item_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price_per_item = models.DecimalField(max_digits=6, decimal_places=2)


class Reservation(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    people_count = models.PositiveIntegerField()
    special_request = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled')
    ], default='pending')

    def __str__(self):
        return f"{self.name} - {self.reservation_date} {self.reservation_time}"