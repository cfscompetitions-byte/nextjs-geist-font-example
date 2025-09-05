## Detailed Plan for QueueAway - Smart Queue Management Backend System

### Overview
This plan outlines the steps to create a backend system for QueueAway, focusing on token booking via WhatsApp, queue management, notifications, and admin features. The backend will be built using Node.js with Express.js, utilizing a mock WhatsApp integration and a local SQLite database for development.

### Step-by-Step Outline of Changes

#### 1. Project Structure
Create a new directory for the backend system within the existing Next.js project:
```
/project/sandbox/user-workspace/backend
```

#### 2. Initialize Node.js Project
- Navigate to the backend directory and initialize a new Node.js project:
  ```bash
  cd backend
  npm init -y
  ```

#### 3. Install Required Dependencies
Install the necessary packages:
```bash
npm install express sqlite3 body-parser cors jsonwebtoken dotenv
```

#### 4. Create Directory Structure
Create the following directory structure for the backend:
```
/backend
  
├── config/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── .env
  ├── server.js
```

#### 5. Configure Environment Variables
Create a `.env` file in the backend directory to store sensitive information:
```plaintext
JWT_SECRET=your_jwt_secret
DATABASE_URL=sqlite:./database.db
```

#### 6. Set Up Database
- Create a `database.js` file in the `config` directory to handle database connections:
```javascript
// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS citizens (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, token_id TEXT, queue_status TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS queues (id INTEGER PRIMARY KEY, token_list TEXT, status TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
  db.run("CREATE TABLE IF NOT EXISTS offices (id INTEGER PRIMARY KEY, location TEXT, queue_capacity INTEGER)");
});

module.exports = db;
```

#### 7. Create Server
- Set up the Express server in `server.js`:
```javascript
// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const citizenRoutes = require('./routes/citizenRoutes');
app.use('/api/citizens', citizenRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 8. Create Routes
- Create a `citizenRoutes.js` file in the `routes` directory to handle citizen-related endpoints:
```javascript
// backend/routes/citizenRoutes.js
const express = require('express');
const router = express.Router();
const { bookToken, getTokenStatus } = require('../controllers/citizenController');

router.post('/book', bookToken);
router.get('/status/:tokenId', getTokenStatus);

module.exports = router;
```

#### 9. Create Controllers
- Create a `citizenController.js` file in the `controllers` directory to handle the logic for booking tokens and checking status:
```javascript
// backend/controllers/citizenController.js
const db = require('../config/database');

exports.bookToken = (req, res) => {
  const { name, phone } = req.body;
  const tokenId = generateTokenId(); // Implement token ID generation logic
  const queueStatus = 'waiting';

  db.run("INSERT INTO citizens (name, phone, token_id, queue_status) VALUES (?, ?, ?, ?)", [name, phone, tokenId, queueStatus], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ tokenId });
  });
};

exports.getTokenStatus = (req, res) => {
  const { tokenId } = req.params;

  db.get("SELECT queue_status FROM citizens WHERE token_id = ?", [tokenId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Token not found' });
    }
    res.status(200).json({ queueStatus: row.queue_status });
  });
};

function generateTokenId() {
  return 'TOKEN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}
```

#### 10. Implement Error Handling
- Add error handling middleware in `server.js`:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

#### 11. Testing the API
- Use Postman or curl to test the API endpoints:
```bash
# Start the server
node server.js

# Test booking a token
curl -X POST http://localhost:5000/api/citizens/book -H "Content-Type: application/json" -d '{"name": "John Doe", "phone": "1234567890"}'

# Test getting token status
curl http://localhost:5000/api/citizens/status/TOKEN-XXXXXXX
```

### UI Considerations
- A simple web-based dashboard can be created using the existing Next.js frontend to manage queues.
- Use Tailwind CSS for styling, ensuring a modern and responsive design.
- Implement forms for booking tokens and displaying queue status.

### Summary
- Set up a Node.js backend with Express.js for QueueAway.
- Implement SQLite for local development and create necessary database tables.
- Create RESTful API endpoints for booking tokens and checking status.
- Add error handling and test the API using curl.
- A simple UI can be built using Next.js and Tailwind CSS for managing queues.

This plan provides a comprehensive approach to building the backend system for QueueAway, ensuring scalability and security while allowing for future enhancements.
