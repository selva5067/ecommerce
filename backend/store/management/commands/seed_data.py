from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils.text import slugify
from store.models import Category, Product


class Command(BaseCommand):
    help = 'Seed the database with comprehensive sample categories, products, and admin user'

    def handle(self, *args, **options):
        # 1. Create Default Admin Superuser if not present
        admin_user, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@shopeasy.com'})
        if created:
            admin_user.set_password('admin123')
            admin_user.is_superuser = True
            admin_user.is_staff = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Default superuser created (admin / admin123).'))

        # 2. Seed Categories & Products
        data = {
            'Electronics': [
                (
                    'Wireless Noise-Canceling Headphones',
                    199.99,
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                    'Experience high-fidelity audio with active noise-canceling, 30-hour battery life, and ultra-comfortable ear cushions.'
                ),
                (
                    'Smart Fitness Watch Series X',
                    149.99,
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
                    'Track workouts, monitor heart rate and sleep, receive notifications, and enjoy a vibrant AMOLED touchscreen display.'
                ),
                (
                    'Portable Waterproof Bluetooth Speaker',
                    49.99,
                    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
                    '360-degree immersive sound with deep bass. IPX7 waterproof rating perfect for outdoor adventures and pool parties.'
                ),
                (
                    'Ergonomic Wireless Mechanical Keyboard',
                    119.99,
                    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
                    'Customizable RGB backlighting, tactile mechanical switches, multi-device Bluetooth pairing, and long-lasting battery.'
                ),
                (
                    'Ultra-Fast USB-C Fast Charger Hub',
                    29.99,
                    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
                    '65W GaN fast charger with 4 ports to power your phone, laptop, and accessories simultaneously.'
                ),
            ],
            'Fashion & Apparel': [
                (
                    'Premium Organic Cotton T-Shirt',
                    24.99,
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
                    'Crafted from 100% breathable organic cotton. Classic tailored fit that stays comfortable all day long.'
                ),
                (
                    'Vintage Denim Outerwear Jacket',
                    79.99,
                    'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800&auto=format&fit=crop&q=80',
                    'Timeless washed denim style featuring heavy-duty brass buttons and spacious front chest pockets.'
                ),
                (
                    'Lightweight Performance Running Shoes',
                    99.99,
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
                    'Engineered mesh upper with responsive foam cushioning for superior energy return and maximum road comfort.'
                ),
                (
                    'Classic Polarized Sunglasses',
                    39.99,
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
                    'UV400 protection with lightweight polycarbonate frame. Elegant unisex design suitable for any occasion.'
                ),
            ],
            'Home & Kitchen': [
                (
                    'Programmable Espresso & Coffee Machine',
                    129.99,
                    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
                    'Brew barista-quality espresso, lattes, and cappuccinos right at home with built-in milk frother and timer.'
                ),
                (
                    'Pro-Grade Non-Stick Cookware Set',
                    89.99,
                    'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=800&auto=format&fit=crop&q=80',
                    'Durable 10-piece cookware set featuring PFOA-free non-stick coating and heat-resistant silicone handles.'
                ),
                (
                    'Minimalist LED Desk Lamp with Wireless Charging',
                    44.99,
                    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
                    'Touch control with 5 color modes, dimmable brightness levels, auto-off timer, and built-in Qi wireless charging pad.'
                ),
            ],
            'Gadgets & Accessories': [
                (
                    'HD Drone with 4K Camera & GPS',
                    249.99,
                    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
                    'Foldable quadcopter featuring auto-return, follow-me tracking, 25 minutes flight time, and stunning 4K video.'
                ),
                (
                    'Leather Minimalist RFID Wallet',
                    29.99,
                    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
                    'Genuine top-grain leather with quick pop-up card mechanism and advanced RFID blocking technology.'
                ),
            ]
        }

        total_created = 0
        for cat_name, products in data.items():
            category, _ = Category.objects.get_or_create(
                name=cat_name, defaults={'slug': slugify(cat_name)}
            )
            for name, price, image, desc in products:
                Product.objects.update_or_create(
                    slug=slugify(name),
                    defaults={
                        'name': name,
                        'category': category,
                        'price': price,
                        'stock': 35,
                        'image': image,
                        'description': desc,
                        'is_active': True,
                    },
                )
                total_created += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {total_created} products across {len(data)} categories.'))