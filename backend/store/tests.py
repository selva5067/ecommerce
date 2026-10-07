from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from store.models import Category, Product, Cart, Order


class StoreAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Category & Product
        self.category = Category.objects.create(name='Electronics', slug='electronics')
        self.product = Product.objects.create(
            name='Test Headphones',
            slug='test-headphones',
            price=99.99,
            stock=10,
            category=self.category
        )

        # Create Test User
        self.user = User.objects.create_user(username='testuser', password='password123')

    def test_get_categories(self):
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_products(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_login(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_authenticated_cart_flow(self):
        # Authenticate
        self.client.force_authenticate(user=self.user)

        # 1. Add item to cart
        add_res = self.client.post('/api/cart/', {'product_id': self.product.id, 'quantity': 2})
        self.assertEqual(add_res.status_code, status.HTTP_201_CREATED)

        # 2. Get cart
        cart_res = self.client.get('/api/cart/')
        self.assertEqual(cart_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(cart_res.data['items']), 1)

        # 3. Create Order from Cart
        order_res = self.client.post('/api/orders/', {'shipping_address': '123 Test St'})
        self.assertEqual(order_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.filter(user=self.user).count(), 1)
