import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { verifyToken } from './middlewares/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isLocalhost = origin.startsWith('http://localhost:') || 
                        origin.startsWith('http://127.0.0.1:') || 
                        origin === 'http://localhost' || 
                        origin === 'http://127.0.0.1';
    const allowedOrigins = [
      'https://ideavault-d86b7.web.app',
      'https://ideavault-d86b7.firebaseapp.com',
      'https://b13-a09-murex.vercel.app'
    ];
    if (isLocalhost || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// MongoDB connection
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ideavault";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Mock Seeder Data for in-memory fallback
const fallbackIdeas = [
  {
    _id: new ObjectId(),
    title: "EcoSense: IoT Smart AgriTech Systems",
    shortDescription: "Revolutionizing crop yields and water conservation through real-time autonomous IoT sensors and deep neural networking forecasts.",
    detailedDescription: "EcoSense leverages custom soil-probe sensors transmitting nitrogen, phosphorus, potassium, and moisture parameters to an edge-computing gateway. Our neural algorithms compute custom irrigation metrics, lowering water usage by 40% while raising crop output by 25%. Perfect for mid-scale organic orchards and sustainable global co-ops.",
    category: "AI",
    tags: ["agritech", "sustain", "iot", "ai"],
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 85000,
    targetAudience: "Mid-scale organic farmers and smart farming co-operatives",
    problemStatement: "Traditional farms lose up to 50% of water inputs due to static timer schedules and suffer severe crop damage from delayed soil micro-nutrient detection.",
    proposedSolution: "Introduce autonomous cellular probe networks coupled with dynamic dashboards providing precise nutrient guidance.",
    userEmail: "demo@ideavault.com",
    userName: "Demo Innovator",
    userPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    likes: ["tester@ideavault.com", "user@ideavault.com"]
  },
  {
    _id: new ObjectId(),
    title: "DeFi Co-op Micro-Bonds Platform",
    shortDescription: "Empowering rural communities and local merchants to issue secure, collateral-backed micro-bonds with zero intermediary fees.",
    detailedDescription: "This Web3 platform facilitates the fractionalized tokenization of debt micro-bonds for localized merchants. Instead of facing 18%+ bank interest, businesses issue collateralized high-yield micro-bonds to neighborhood retail buyers. Backed by solid proof-of-reserves, driving credit accessibility forward.",
    category: "Fintech",
    tags: ["fintech", "web3", "defi", "coop"],
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 120000,
    targetAudience: "Small town cooperative merchants and neighborhood micro-lenders",
    problemStatement: "Traditional banking networks charge small-town co-ops high interest rates for simple working capital expansions, freezing regional growth.",
    proposedSolution: "Allow communities to pool collateral directly inside smart contract vaults, bypassing expensive brokers entirely.",
    userEmail: "finance@ideavault.com",
    userName: "Satoshi Builder",
    userPhoto: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    likes: ["demo@ideavault.com", "user@ideavault.com", "builder@ideavault.com"]
  },
  {
    _id: new ObjectId(),
    title: "XR Virtual Lab Classrooms",
    shortDescription: "Breaking spatial educational barriers by putting photorealistic virtual reality science laboratories in the hands of global students.",
    detailedDescription: "EcoVR is an immersive spatial curriculum providing high school physics, biology, and chemistry lab simulators in lightweight WebXR. Students perform molecular compound mixes, high-voltage physics experiments, and dissection simulations without physical supplies or hazardous setups.",
    category: "Education",
    tags: ["edtech", "vr", "xr", "science"],
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 45000,
    targetAudience: "Underfunded high schools and global remote learning systems",
    problemStatement: "High-quality laboratory apparatus is incredibly expensive, excluding millions of rural and underfunded students from crucial STEM validation work.",
    proposedSolution: "Design cross-platform lightweight WebXR lab simulations accessible via standard browsers or standalone headsets.",
    userEmail: "edu@ideavault.com",
    userName: "Prof. Einstein",
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: ["demo@ideavault.com", "tester@ideavault.com"]
  }
];

class MockCollection {
  constructor(name, initialData = []) {
    this.name = name;
    this.data = [...initialData];
  }

  async insertOne(doc) {
    const newDoc = { _id: new ObjectId(), ...doc };
    this.data.push(newDoc);
    return { success: true, insertedId: newDoc._id };
  }

  async insertMany(docs) {
    const newDocs = docs.map(doc => ({ _id: new ObjectId(), ...doc }));
    this.data.push(...newDocs);
    return { success: true, insertedCount: newDocs.length };
  }

  find(query = {}) {
    let results = [...this.data];
    
    if (query.title && query.title.$regex) {
      const regex = new RegExp(query.title.$regex, query.title.$options || 'i');
      results = results.filter(item => regex.test(item.title));
    }
    if (query.category && query.category !== 'All') {
      results = results.filter(item => item.category === query.category);
    }
    if (query.ideaId) {
      results = results.filter(item => item.ideaId === query.ideaId);
    }
    if (query.userEmail) {
      results = results.filter(item => item.userEmail === query.userEmail);
    }
    if (query._id) {
      results = results.filter(item => item._id.toString() === query._id.toString());
    }

    return {
      sort: (sortObj) => {
        const key = Object.keys(sortObj)[0];
        const order = sortObj[key];
        results.sort((a, b) => {
          if (a[key] < b[key]) return -1 * order;
          if (a[key] > b[key]) return 1 * order;
          return 0;
        });
        return {
          toArray: async () => results
        };
      },
      toArray: async () => results
    };
  }

  async findOne(query) {
    const results = await this.find(query).toArray();
    return results[0] || null;
  }

  async updateOne(query, updateDoc) {
    const item = await this.findOne(query);
    if (!item) return { modifiedCount: 0 };

    if (updateDoc.$set) {
      Object.assign(item, updateDoc.$set);
    }
    if (updateDoc.$addToSet) {
      const key = Object.keys(updateDoc.$addToSet)[0];
      const val = updateDoc.$addToSet[key];
      item[key] = item[key] || [];
      if (!item[key].includes(val)) {
        item[key].push(val);
      }
    }
    if (updateDoc.$pull) {
      const key = Object.keys(updateDoc.$pull)[0];
      const val = updateDoc.$pull[key];
      item[key] = item[key] || [];
      item[key] = item[key].filter(v => v !== val);
    }

    return { modifiedCount: 1 };
  }

  async deleteOne(query) {
    const item = await this.findOne(query);
    if (!item) return { deletedCount: 0 };
    this.data = this.data.filter(i => i._id.toString() !== item._id.toString());
    return { deletedCount: 1 };
  }

  async deleteMany(query) {
    let countBefore = this.data.length;
    if (query.ideaId) {
      this.data = this.data.filter(i => i.ideaId !== query.ideaId);
    }
    return { deletedCount: countBefore - this.data.length };
  }

  aggregate(pipeline) {
    let results = [...this.data];
    
    results = results.map(item => ({
      ...item,
      likesCount: item.likes?.length || 0
    }));

    results.sort((a, b) => {
      if (b.likesCount !== a.likesCount) {
        return b.likesCount - a.likesCount;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const limitStage = pipeline.find(stage => stage.$limit);
    if (limitStage) {
      results = results.slice(0, limitStage.$limit);
    }

    return {
      toArray: async () => results
    };
  }
}

let db;
let ideasCollection = new MockCollection("ideas", fallbackIdeas);
let commentsCollection = new MockCollection("comments", [
  {
    _id: new ObjectId(),
    ideaId: fallbackIdeas[0]._id.toString(),
    text: "This is brilliant! The 40% water reduction metric completely validates the capital cost. I recommend checking out regional grants for AgriTech validation.",
    userEmail: "tester@ideavault.com",
    userName: "Auditor Tester",
    userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date()
  }
]);

async function connectDB() {
  try {
    await client.connect();
    db = client.db("ideavault");
    ideasCollection = db.collection("ideas");
    commentsCollection = db.collection("comments");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.warn("MongoDB connection failed. Using in-memory fallback collections.");
  }
}
connectDB();


// Root endpoint
app.get('/', (req, res) => {
  res.send('IdeaVault Server is running successfully!');
});

// Authentication Endpoint: Generate JWT
app.post('/jwt', (req, res) => {
  const user = req.body; // should contain { email }
  if (!user || !user.email) {
    return res.status(400).send({ message: 'Email is required' });
  }
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || 'secret-key-1234', {
    expiresIn: '7d'
  });
  
  // Set in cookie and also return in JSON body for maximum client-side compatibility
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    })
    .send({ success: true, token });
});

// Logout endpoint to clear cookie
app.post('/logout', (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    })
    .send({ success: true, message: 'Logged out successfully' });
});

// --- IDEAS API ---

// 1. Create Idea (Private Route)
app.post('/ideas', verifyToken, async (req, res) => {
  try {
    const ideaData = req.body;
    // Inject user details from verified JWT and form input
    const newIdea = {
      ...ideaData,
      userEmail: req.user.email,
      createdAt: new Date(),
      likes: [] // default empty likes array
    };
    const result = await ideasCollection.insertOne(newIdea);
    res.status(201).send({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 2. Read All Ideas with Search & Filter
app.get('/ideas', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const cursor = ideasCollection.find(query).sort({ createdAt: -1 });
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 3. Get Trending Ideas (Limit 6, sorted by likes count / recency)
app.get('/ideas/trending', async (req, res) => {
  try {
    // MongoDB aggregation pipeline to sort by number of likes (likes array size) and creation date
    const pipeline = [
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } }
        }
      },
      {
        $sort: { likesCount: -1, createdAt: -1 }
      },
      {
        $limit: 6
      }
    ];
    const result = await ideasCollection.aggregate(pipeline).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 4. Get Single Idea Details
app.get('/ideas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid Idea ID' });
    }
    const query = { _id: new ObjectId(id) };
    const idea = await ideasCollection.findOne(query);
    if (!idea) {
      return res.status(404).send({ message: 'Idea not found' });
    }
    res.send(idea);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 5. Update Idea (Private Route, author only)
app.put('/ideas/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid Idea ID' });
    }
    const query = { _id: new ObjectId(id) };
    const idea = await ideasCollection.findOne(query);
    
    if (!idea) {
      return res.status(404).send({ message: 'Idea not found' });
    }
    
    if (idea.userEmail !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden: You can only edit your own ideas' });
    }

    const updatedData = req.body;
    // Don't overwrite author or createdAt details
    const updateDoc = {
      $set: {
        title: updatedData.title,
        shortDescription: updatedData.shortDescription,
        detailedDescription: updatedData.detailedDescription,
        category: updatedData.category,
        tags: updatedData.tags,
        imageUrl: updatedData.imageUrl,
        estimatedBudget: parseFloat(updatedData.estimatedBudget) || 0,
        targetAudience: updatedData.targetAudience,
        problemStatement: updatedData.problemStatement,
        proposedSolution: updatedData.proposedSolution,
        updatedAt: new Date()
      }
    };

    const result = await ideasCollection.updateOne(query, updateDoc);
    res.send({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 6. Delete Idea (Private Route, author only)
app.delete('/ideas/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid Idea ID' });
    }
    const query = { _id: new ObjectId(id) };
    const idea = await ideasCollection.findOne(query);
    
    if (!idea) {
      return res.status(404).send({ message: 'Idea not found' });
    }

    if (idea.userEmail !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden: You can only delete your own ideas' });
    }

    // Also delete any comments linked to this idea
    await commentsCollection.deleteMany({ ideaId: id });

    const result = await ideasCollection.deleteOne(query);
    res.send({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 7. Like / Bookmark Idea (Private Route)
app.put('/ideas/:id/like', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid Idea ID' });
    }
    const userEmail = req.user.email;
    const query = { _id: new ObjectId(id) };
    const idea = await ideasCollection.findOne(query);
    if (!idea) {
      return res.status(404).send({ message: 'Idea not found' });
    }

    const likes = idea.likes || [];
    let updateDoc;
    let action;

    if (likes.includes(userEmail)) {
      // Unlike
      updateDoc = { $pull: { likes: userEmail } };
      action = 'unliked';
    } else {
      // Like
      updateDoc = { $addToSet: { likes: userEmail } };
      action = 'liked';
    }

    await ideasCollection.updateOne(query, updateDoc);
    const updatedIdea = await ideasCollection.findOne(query);
    res.send({ success: true, action, likesCount: updatedIdea.likes?.length || 0, likes: updatedIdea.likes });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


// --- COMMENTS API ---

// 1. Get Comments for a Specific Idea
app.get('/ideas/:ideaId/comments', async (req, res) => {
  try {
    const ideaId = req.params.ideaId;
    const comments = await commentsCollection
      .find({ ideaId: ideaId })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(comments);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 2. Add Comment (Private Route)
app.post('/comments', verifyToken, async (req, res) => {
  try {
    const { ideaId, text, userName, userPhoto } = req.body;
    if (!ideaId || !text) {
      return res.status(400).send({ message: 'Idea ID and comment text are required' });
    }
    const newComment = {
      ideaId,
      text,
      userEmail: req.user.email,
      userName: userName || 'Anonymous',
      userPhoto: userPhoto || '',
      createdAt: new Date()
    };
    const result = await commentsCollection.insertOne(newComment);
    res.status(201).send({ success: true, comment: { ...newComment, _id: result.insertedId } });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 3. Edit Comment (Private Route, author only)
app.patch('/comments/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid Comment ID' });
    }
    const query = { _id: new ObjectId(id) };
    const comment = await commentsCollection.findOne(query);

    if (!comment) {
      return res.status(404).send({ message: 'Comment not found' });
    }

    if (comment.userEmail !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden: You can only edit your own comments' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).send({ message: 'Comment text is required' });
    }

    const result = await commentsCollection.updateOne(query, {
      $set: { text: text, updatedAt: new Date() }
    });
    res.send({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 4. Delete Comment (Private Route, author only)
app.delete('/comments/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid Comment ID' });
    }
    const query = { _id: new ObjectId(id) };
    const comment = await commentsCollection.findOne(query);

    if (!comment) {
      return res.status(404).send({ message: 'Comment not found' });
    }

    if (comment.userEmail !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden: You can only delete your own comments' });
    }

    const result = await commentsCollection.deleteOne(query);
    res.send({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


// --- USER DASHBOARD / ACTIVITY API ---

// 1. Get Ideas Posted by the Logged-In User (Private Route)
app.get('/my-ideas', verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const ideas = await ideasCollection
      .find({ userEmail: userEmail })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(ideas);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 2. Get User Interactions - Ideas that the user has commented on (Private Route)
app.get('/my-interactions', verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    // Find all comments by this user
    const userComments = await commentsCollection.find({ userEmail: userEmail }).toArray();
    
    // Get unique idea IDs from those comments
    const ideaIds = [...new Set(userComments.map(c => c.ideaId))];
    
    // Convert to ObjectIds for database lookup
    const objectIds = ideaIds
      .filter(id => ObjectId.isValid(id))
      .map(id => new ObjectId(id));
      
    if (objectIds.length === 0) {
      return res.send([]);
    }

    // Find the full idea documents for these ideas
    const commentedIdeas = await ideasCollection.find({ _id: { $in: objectIds } }).toArray();
    
    // Map them to include user's comments for each idea to show on dashboard
    const result = commentedIdeas.map(idea => {
      const commentsOnThisIdea = userComments.filter(c => c.ideaId === idea._id.toString());
      return {
        ...idea,
        userComments: commentsOnThisIdea
      };
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`IdeaVault Server listening on port ${port}`);
});
