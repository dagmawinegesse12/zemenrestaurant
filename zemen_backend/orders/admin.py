from django.contrib import admin
from .models import Order, OrderItem, Reservation

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'order_type', 'total_price', 'status', 'created_at')
    list_filter = ('order_type', 'status', 'created_at')
    inlines = [OrderItemInline]


admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(Reservation)
