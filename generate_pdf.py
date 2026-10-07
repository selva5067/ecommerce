import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

pdf_filename = r"c:\Users\ELCOT\Downloads\ecommerce-main\ecommerce-main\ShopEasy_MERN_Interview_Prep_Guide.pdf"

doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=40,
    leftMargin=40,
    topMargin=40,
    bottomMargin=40
)

styles = getSampleStyleSheet()

# Custom styles
primary_color = colors.HexColor('#4f46e5')
dark_color = colors.HexColor('#0f172a')
muted_color = colors.HexColor('#64748b')

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=24,
    leading=28,
    textColor=dark_color,
    alignment=0,
    spaceAfter=6
)

subtitle_style = ParagraphStyle(
    'DocSubTitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=12,
    leading=16,
    textColor=primary_color,
    spaceAfter=15
)

h1_style = ParagraphStyle(
    'Heading1_Custom',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=15,
    leading=19,
    textColor=primary_color,
    spaceBefore=16,
    spaceAfter=8,
    keepWithNext=True
)

h2_style = ParagraphStyle(
    'Heading2_Custom',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=16,
    textColor=dark_color,
    spaceBefore=10,
    spaceAfter=4,
    keepWithNext=True
)

body_style = ParagraphStyle(
    'Body_Custom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=dark_color,
    spaceAfter=6
)

qa_question = ParagraphStyle(
    'QA_Question',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10.5,
    leading=14,
    textColor=colors.HexColor('#1e1b4b'),
    spaceBefore=8,
    spaceAfter=4,
    keepWithNext=True
)

qa_answer = ParagraphStyle(
    'QA_Answer',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=dark_color,
    spaceAfter=8
)

prob_title = ParagraphStyle(
    'Prob_Title',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    textColor=colors.HexColor('#991b1b'),
    spaceBefore=10,
    spaceAfter=4,
    keepWithNext=True
)

code_style = ParagraphStyle(
    'Code_Text',
    parent=styles['Normal'],
    fontName='Courier',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor('#334155'),
    spaceAfter=4
)

story = []

# Title & Header
story.append(Paragraph("ShopEasy — MERN Stack Interview Guide", title_style))
story.append(Paragraph("Comprehensive Project Overview, Technical Q&A, and Engineering Challenges Solved", subtitle_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=0, spaceAfter=15))

# Section 1: Overview
story.append(Paragraph("1. Project Architecture & Tech Stack", h1_style))
overview_text = (
    "<b>ShopEasy</b> is an enterprise-grade full-stack e-commerce web application built on the <b>MERN Stack</b> "
    "(MongoDB, Express.js, React 18, Node.js). It implements modern e-commerce user workflows including product "
    "catalog discovery, category filtering, price sorting, real-time live search, JWT-based authentication, "
    "a slide-out Quick Cart Drawer, free shipping threshold progress tracking, promo discount codes, multi-step checkout, "
    "and interactive order history tracking timelines."
)
story.append(Paragraph(overview_text, body_style))

stack_data = [
    [Paragraph("<b>Layer</b>", body_style), Paragraph("<b>Technology Used</b>", body_style), Paragraph("<b>Key Responsibilities</b>", body_style)],
    [Paragraph("<b>MongoDB (Cloud)</b>", body_style), Paragraph("MongoDB Atlas + Mongoose ODM", body_style), Paragraph("NoSQL schemas for Users, Categories, Products, Carts, Orders", body_style)],
    [Paragraph("<b>Express.js</b>", body_style), Paragraph("Node.js REST API Server", body_style), Paragraph("Routing, JWT Auth middleware, input validation, CORS", body_style)],
    [Paragraph("<b>React 18</b>", body_style), Paragraph("React SPA + Context API", body_style), Paragraph("Hooks, Glassmorphism UI, Lucide icons, Toast alerts, Drawer", body_style)],
    [Paragraph("<b>Node.js</b>", body_style), Paragraph("Asynchronous Runtime", body_style), Paragraph("Event-driven server listening on port 8000", body_style)]
]

t = Table(stack_data, colWidths=[120, 160, 250])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#eef2ff')),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
    ('PADDING', (0,0), (-1,-1), 6),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t)
story.append(Spacer(1, 14))

# Section 2: Core Interview Q&A
story.append(Paragraph("2. Top Technical Interview Questions & Answers", h1_style))

qas = [
    (
        "Q1: Can you explain the end-to-end architecture of your application?",
        "<b>Answer:</b> ShopEasy follows a decoupled Client-Server architecture. The frontend is a React 18 Single Page Application (SPA) "
        "that uses Axios to communicate with a RESTful Express server over HTTP/HTTPS. The Node/Express backend interacts with a "
        "MongoDB Atlas cloud database using Mongoose ODM models. Authentication is managed using JSON Web Tokens (JWT). "
        "State on the client side is encapsulated cleanly in React Context API modules (AuthContext, CartContext, ToastContext)."
    ),
    (
        "Q2: How is user authentication implemented and secured?",
        "<b>Answer:</b> Authentication uses JWT Bearer Tokens. Upon login (or registration), the Express server verifies credentials using bcryptjs "
        "hash comparison and issues both an Access Token (short-lived, 1-day) and a Refresh Token (7-day). These tokens are stored securely in localStorage. "
        "An Axios request interceptor attaches the bearer token header (`Authorization: Bearer <access_token>`) to protected endpoints. "
        "If an access token expires (401 response), an Axios response interceptor seamlessly invokes `/api/auth/refresh/` to obtain a new access token without interrupting the user's workflow."
    ),
    (
        "Q3: Why did you choose React Context API instead of Redux?",
        "<b>Answer:</b> For an e-commerce application of this scope, React Context API provides clean, native state management without the boilerplate "
        "and overhead of Redux or Redux Toolkit. We organized context into focused domains: `AuthContext` (JWT user profile state), `CartContext` "
        "(live cart synchronization), and `ToastContext` (app-wide feedback messages). This keeps component re-renders minimal and code maintenance straightforward."
    ),
    (
        "Q4: How did you model MongoDB schemas for cart items and order histories?",
        "<b>Answer:</b> Carts are modeled with embedded subdocument arrays referencing the Product model (`items: [{ product: ObjectId, quantity: Number }]`), "
        "allowing atomic updates. For Orders, we deliberately saved <i>snapshots</i> of product names, prices, and quantities directly into the Order subdocuments. "
        "This ensures historical financial data consistency even if product catalog prices change in the future."
    ),
    (
        "Q5: How do search, category filtering, and sorting work on the backend?",
        "<b>Answer:</b> The Express `/api/products` route reads query parameters (`category`, `search`, `slug`, `ordering`). MongoDB regex queries "
        "perform case-insensitive text search across name, description, and slug fields, while Mongoose `.populate('category')` resolves category names. "
        "Sorting is handled directly at the database layer via `.sort({ price: 1 })` or `.sort({ createdAt: -1 })` for fast execution."
    )
]

for q, a in qas:
    story.append(Paragraph(q, qa_question))
    story.append(Paragraph(a, qa_answer))

story.append(Spacer(1, 10))

# Section 3: Engineering Challenges & Solved Problems
story.append(Paragraph("3. Real Engineering Challenges & Problems Solved", h1_style))
story.append(Paragraph("Use these real technical problems in your interview when asked: <i>'What was a difficult bug or challenge you solved?'</i>", body_style))

probs = [
    (
        "Challenge 1: Historical Order Price Consistency vs. Dynamic Catalog Changes",
        "<b>Problem:</b> If a store product price is updated (e.g. Headphones price changed from $199 to $249), simply referencing the Product ObjectId in past orders would alter the total of past user orders.<br/>"
        "<b>Solution:</b> Implemented a snapshot-based Order subdocument model (`orderItemSchema`). When an order is created, the server copies `product_name`, `price` at purchase time, and `quantity` directly into the order record, decoupling order transactions from dynamic product catalog updates."
    ),
    (
        "Challenge 2: Graceful JWT Expiration & Seamless Auto-Refresh Interceptor",
        "<b>Problem:</b> Active users experiencing sudden 401 Unauthorized errors mid-checkout when their short-lived access tokens expired.<br/>"
        "<b>Solution:</b> Designed an automatic token refresh queue using Axios response interceptors (`client.js`). When a 401 response is caught, the interceptor pauses outgoing requests, sends the refresh token to `/api/auth/refresh/`, updates `access_token` in localStorage, and re-executes the original failed request invisibly to the user."
    ),
    (
        "Challenge 3: Race Conditions & Unhandled 500 Server Errors in Cart Operations",
        "<b>Problem:</b> Rapid item quantity increments from the UI sent invalid or missing product IDs to the server, triggering unhandled server exceptions.<br/>"
        "<b>Solution:</b> Added robust guard validation middleware on Express cart endpoints (`get_object_or_404` equivalent). Verified product existence and stock availability before performing atomic `$inc` updates, returning structured 400/404 JSON responses instead of server crashes."
    ),
    (
        "Challenge 4: Multi-Environment Database Connectivity (Local vs. Cloud Atlas)",
        "<b>Problem:</b> Ensuring the application runs effortlessly across local offline development setups and live cloud deployment clusters.<br/>"
        "<b>Solution:</b> Implemented environment variable configuration (`dotenv`) with automatic fallback handling in `server.js` and `seed.js`. Created an automated CLI database seeder script to populate 14 high-res items, categories, and admin credentials across any MongoDB environment."
    )
]

for title, desc in probs:
    story.append(Paragraph(title, prob_title))
    story.append(Paragraph(desc, body_style))

story.append(Spacer(1, 14))

# Section 4: Scalability & Next Steps
story.append(Paragraph("4. System Scalability & Future Architecture Expansion", h1_style))
scale_text = (
    "When asked: <i>'How would you scale this application to 1,000,000 active users?'</i><br/>"
    "• <b>Caching Layer:</b> Integrate Redis for caching frequent product catalog queries and user session states.<br/>"
    "• <b>Database Scaling:</b> Implement MongoDB Read Replicas and Sharding based on user geographical region.<br/>"
    "• <b>Asset Delivery:</b> Serve product images via Cloudinary / Amazon S3 CDN.<br/>"
    "• <b>Payment Gateway:</b> Integrate Stripe & PayPal Webhook events for async payment settlement.<br/>"
    "• <b>Load Balancing:</b> Deploy Node Express servers in Docker containers behind an NGINX load balancer."
)
story.append(Paragraph(scale_text, body_style))

# Build Document
doc.build(story)
print(f"Successfully generated PDF: {pdf_filename}")
