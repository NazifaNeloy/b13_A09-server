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
  origin: [
    'http://localhost:5173',
    'https://ideavault-d86b7.web.app', // placeholder for hosting
    'https://ideavault-d86b7.firebaseapp.com'
  ],
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

let db, ideasCollection, commentsCollection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("ideavault");
    ideasCollection = db.collection("ideas");
    commentsCollection = db.collection("comments");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
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
