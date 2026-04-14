# MongoDB + R2 + Node.js Backend Implementation Plan

## Phase 1: Backend Setup (Days 1-3)

### Day 1: Project Structure & Dependencies

```bash
# Create backend directory
mkdir backend
cd backend
npm init -y

# Install dependencies
npm install express mongoose dotenv cors helmet
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install socket.io jsonwebtoken bcryptjs
npm install express-rate-limit express-validator
npm install -D nodemon typescript @types/node @types/express
```

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   ├── r2.js             # Cloudflare R2 setup
│   │   └── oauth.js          # Google OAuth config
│   ├── models/
│   │   ├── Product.js        # Product schema
│   │   ├── User.js           # User schema
│   │   └── Order.js          # Order schema
│   ├── routes/
│   │   ├── auth.js           # OAuth routes
│   │   ├── products.js       # Product CRUD
│   │   ├── upload.js         # R2 upload
│   │   └── admin.js          # Admin routes
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── admin.js          # Admin check
│   │   └── upload.js         # File validation
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── uploadController.js
│   ├── services/
│   │   ├── r2Service.js      # R2 operations
│   │   └── socketService.js  # Socket.io logic
│   └── server.js             # Entry point
├── .env
└── package.json
```

---

## Phase 2: Database Setup (Day 2)

### MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier
   - Create cluster (M0 Free)

2. **Configure Database**
   ```javascript
   // src/config/database.js
   const mongoose = require('mongoose');
   
   const connectDB = async () => {
     try {
       await mongoose.connect(process.env.MONGODB_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       });
       console.log('✅ MongoDB connected');
     } catch (error) {
       console.error('❌ MongoDB connection failed:', error);
       process.exit(1);
     }
   };
   
   module.exports = connectDB;
   ```

3. **Product Schema**
   ```javascript
   // src/models/Product.js
   const mongoose = require('mongoose');
   
   const productSchema = new mongoose.Schema({
     name: { type: String, required: true },
     description: String,
     price: { type: Number, required: true },
     oldPrice: Number,
     category: { type: String, required: true },
     sizes: [String],
     color: String,
     tag: String,
     stock: { type: Number, default: 0 },
     inStock: { type: Boolean, default: true },
     imageUrl: { type: String, required: true },
     hoverImageUrl: String,
     createdAt: { type: Date, default: Date.now },
     updatedAt: { type: Date, default: Date.now }
   });
   
   module.exports = mongoose.model('Product', productSchema);
   ```

---

## Phase 3: Cloudflare R2 Setup (Day 3)

### R2 Configuration

1. **Create R2 Bucket**
   - Go to Cloudflare Dashboard
   - Navigate to R2
   - Create bucket: `starmenspark-products`
   - Enable public access

2. **Get API Credentials**
   - Create API token
   - Note: Account ID, Access Key ID, Secret Access Key

3. **R2 Service**
   ```javascript
   // src/config/r2.js
   const { S3Client } = require('@aws-sdk/client-s3');
   const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
   const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
   
   const r2Client = new S3Client({
     region: 'auto',
     endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
     credentials: {
       accessKeyId: process.env.R2_ACCESS_KEY_ID,
       secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
     },
   });
   
   // Generate presigned URL for upload
   async function getUploadUrl(key, contentType) {
     const command = new PutObjectCommand({
       Bucket: process.env.R2_BUCKET_NAME,
       Key: key,
       ContentType: contentType,
     });
     
     return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
   }
   
   // Get public URL
   function getPublicUrl(key) {
     return `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;
   }
   
   module.exports = { r2Client, getUploadUrl, getPublicUrl };
   ```

---

## Phase 4: Authentication (Days 4-5)

### Google OAuth Setup

1. **Google Cloud Console**
   - Create project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Auth Routes**
   ```javascript
   // src/routes/auth.js
   const express = require('express');
   const router = express.Router();
   const jwt = require('jsonwebtoken');
   const { OAuth2Client } = require('google-auth-library');
   
   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
   
   // Google OAuth login
   router.post('/google', async (req, res) => {
     try {
       const { token } = req.body;
       
       const ticket = await client.verifyIdToken({
         idToken: token,
         audience: process.env.GOOGLE_CLIENT_ID,
       });
       
       const payload = ticket.getPayload();
       
       // Find or create user
       let user = await User.findOne({ email: payload.email });
       
       if (!user) {
         user = await User.create({
           email: payload.email,
           name: payload.name,
           picture: payload.picture,
           role: 'customer',
         });
       }
       
       // Generate JWT
       const jwtToken = jwt.sign(
         { userId: user._id, role: user.role },
         process.env.JWT_SECRET,
         { expiresIn: '7d' }
       );
       
       res.json({ token: jwtToken, user });
     } catch (error) {
       res.status(401).json({ error: 'Authentication failed' });
     }
   });
   
   module.exports = router;
   ```

3. **Auth Middleware**
   ```javascript
   // src/middleware/auth.js
   const jwt = require('jsonwebtoken');
   
   const authMiddleware = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     
     if (!token) {
       return res.status(401).json({ error: 'No token provided' });
     }
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (error) {
       res.status(401).json({ error: 'Invalid token' });
     }
   };
   
   const adminMiddleware = (req, res, next) => {
     if (req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Admin access required' });
     }
     next();
   };
   
   module.exports = { authMiddleware, adminMiddleware };
   ```

---

## Phase 5: Product APIs (Days 6-7)

### Product Routes

```javascript
// src/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    
    const query = category ? { category, inStock: true } : { inStock: true };
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    // Emit socket event for real-time update
    req.app.get('io').emit('product:created', product);
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Emit socket event
    req.app.get('io').emit('product:updated', product);
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Emit socket event
    req.app.get('io').emit('product:deleted', product._id);
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
```

---

## Phase 6: Image Upload (Day 8)

### Upload Routes

```javascript
// src/routes/upload.js
const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getUploadUrl, getPublicUrl } = require('../config/r2');
const crypto = require('crypto');

// Get presigned upload URL
router.post('/presigned-url', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    
    // Validate content type
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'Only images allowed' });
    }
    
    // Generate unique key
    const key = `products/${crypto.randomUUID()}-${fileName}`;
    
    // Get presigned URL
    const uploadUrl = await getUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);
    
    res.json({ uploadUrl, publicUrl, key });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

module.exports = router;
```

---

## Phase 7: Socket.io Real-time (Day 9)

### Socket Setup

```javascript
// src/services/socketService.js
const socketIO = require('socket.io');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  return io;
}

module.exports = { initializeSocket };
```

---

## Phase 8: Main Server (Day 10)

### Server Entry Point

```javascript
// src/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const { initializeSocket } = require('./services/socketService');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);
app.set('io', io);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## Environment Variables

```env
# .env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/starmenspark

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=starmenspark-products

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# JWT
JWT_SECRET=your_super_secret_key_change_this

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## Timeline Summary

- **Day 1-3**: Backend setup + MongoDB + R2
- **Day 4-5**: OAuth authentication
- **Day 6-7**: Product CRUD APIs
- **Day 8**: Image upload with R2
- **Day 9**: Socket.io real-time
- **Day 10**: Testing & deployment

**Total: 10 days (2 weeks with buffer)**

---

## Next Steps

1. Create backend folder
2. Install dependencies
3. Set up MongoDB Atlas
4. Set up Cloudflare R2
5. Implement authentication
6. Build APIs
7. Add Socket.io
8. Deploy backend
9. Update frontend to use new APIs
10. Test everything

**Ready to start? Let me know and I'll create the actual code files.**
