from rest_framework import viewsets, generics, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, CartSerializer, CartItemSerializer,
    OrderSerializer, RegisterSerializer, UserSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None  # Return all categories without pagination limit for header/filters


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'slug']
    search_fields = ['name', 'description', 'slug']
    ordering_fields = ['price', 'created_at', 'name']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class RegisterView(generics.CreateAPIView):
    queryset = None
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)
        return Response(CartSerializer(cart).data)

    def post(self, request):
        """Add an item to the cart: { product_id, quantity }"""
        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')

        if not product_id:
            return Response({'detail': 'product_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id, is_active=True)
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            return Response({'detail': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        item.quantity = item.quantity + quantity if not created else quantity
        item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = get_object_or_404(cart.items, id=item_id)
        quantity = int(request.data.get('quantity', item.quantity))
        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = get_object_or_404(cart.items, id=item_id)
        item.delete()
        return Response(CartSerializer(cart).data)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head']

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        shipping_address = request.data.get('shipping_address', '')
        if isinstance(shipping_address, str) and not shipping_address.strip():
            shipping_address = 'Standard Delivery Address'

        order = Order.objects.create(
            user=request.user,
            shipping_address=shipping_address,
            total=cart.total,
        )
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                price=item.product.price,
                quantity=item.quantity,
            )
            item.product.stock = max(item.product.stock - item.quantity, 0)
            item.product.save()

        cart.items.all().delete()
        order.status = 'paid'  # Instant verification for demo purposes
        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
