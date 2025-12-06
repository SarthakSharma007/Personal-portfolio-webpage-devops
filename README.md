https://sarthaksharma007.github.io/

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevOps Portfolio Website</title>

<h1>DevOps Portfolio Website</h1>

<p>This is the README for my DevOps Portfolio Website project.</p>

</head>
<body>

  <h1>DevOps Portfolio Website</h1>
  <p>A modern, responsive, and dynamic portfolio website built with the MERN-style stack (React, Node.js, Express, MySQL) for showcasing DevOps engineering skills, projects, and experience.</p>

  <h2>🚀 Live Demo</h2>
  <p><a href="https://your-portfolio-domain.com">View Live Portfolio</a></p>

  <h2>📋 Table of Contents</h2>
  <ul>
    <li>Features</li>
    <li>Tech Stack</li>
    <li>Project Structure</li>
    <li>Installation</li>
    <li>Configuration</li>
    <li>Database Setup</li>
    <li>Running the Application</li>
    <li>API Endpoints</li>
    <li>Customization</li>
    <li>Deployment</li>
    <li>Contributing</li>
    <li>License</li>
  </ul>

  <h2>✨ Features</h2>

  <h3>Frontend Features</h3>
  <ul>
    <li><strong>Modern UI/UX</strong>: Clean, responsive design with smooth animations</li>
    <li><strong>Interactive Sections</strong>: Home, About, Skills, Experience, Education, Certifications, Projects, Contact</li>
    <li><strong>Dynamic Content</strong>: All content is fetched from the database via APIs</li>
    <li><strong>Responsive Design</strong>: Optimized for desktop, tablet, and mobile devices</li>
    <li><strong>Smooth Scrolling</strong>: Navigation with smooth scroll to sections</li>
    <li><strong>Contact Form</strong>: Functional contact form with validation</li>
    <li><strong>Loading States</strong>: Proper loading indicators and error handling</li>
  </ul>

  <h3>Backend Features</h3>
  <ul>
    <li><strong>RESTful APIs</strong>: Complete CRUD operations for all portfolio data</li>
    <li><strong>Authentication</strong>: JWT-based admin authentication</li>
    <li><strong>Database Integration</strong>: MySQL database with proper schema</li>
    <li><strong>Security</strong>: Helmet, CORS, rate limiting, and input validation</li>
    <li><strong>Error Handling</strong>: Comprehensive error handling and logging</li>
    <li><strong>File Upload</strong>: Support for image uploads (ready for implementation)</li>
  </ul>

  <h3>Database Features</h3>
  <ul>
    <li><strong>Structured Schema</strong>: Well-designed database with proper relationships</li>
    <li><strong>Sample Data</strong>: Pre-populated with sample portfolio data</li>
    <li><strong>Admin Management</strong>: User management for content updates</li>
    <li><strong>Contact Messages</strong>: Store and manage contact form submissions</li>
  </ul>

  <h2>🛠 Tech Stack</h2>

  <h3>Frontend</h3>
  <ul>
    <li>React 18: Modern React with hooks and functional components</li>
    <li>React Router: Client-side routing</li>
    <li>Framer Motion: Smooth animations and transitions</li>
    <li>Axios: HTTP client for API calls</li>
    <li>React Icons: Beautiful icon library</li>
    <li>CSS3: Modern CSS with Flexbox and Grid</li>
    <li>Responsive Design: Mobile-first approach</li>
  </ul>

  <h3>Backend</h3>
  <ul>
    <li>Node.js: JavaScript runtime</li>
    <li>Express.js: Web application framework</li>
    <li>MySQL: Relational database</li>
    <li>JWT: JSON Web Tokens for authentication</li>
    <li>Bcrypt: Password hashing</li>
    <li>Helmet: Security middleware</li>
    <li>CORS: Cross-origin resource sharing</li>
    <li>Rate Limiting: API rate limiting</li>
  </ul>

  <h3>Development Tools</h3>
  <ul>
    <li>Nodemon: Development server auto-restart</li>
    <li>Concurrently: Run multiple commands simultaneously</li>
    <li>ESLint: Code linting</li>
    <li>Prettier: Code formatting</li>
  </ul>

  <h2>📁 Project Structure</h2>
  <pre>
portfolio/
│
├── client/                     # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/         # React Components
│   │   │   ├── Navbar.js
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Skills.js
│   │   │   ├── Experience.js
│   │   │   ├── Education.js
│   │   │   ├── Certifications.js
│   │   │   ├── Projects.js
│   │   │   ├── Contact.js
│   │   │   ├── Footer.js
│   │   │   └── ScrollToTop.js
│   │   ├── services/           # API Services
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── database/
│   │   ├── schema.sql         # Database schema
│   │   └── sample-data.sql    # Sample data
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/                # API Routes
│   │   ├── projects.js
│   │   ├── skills.js
│   │   ├── certifications.js
│   │   ├── experiences.js
│   │   ├── education.js
│   │   ├── messages.js
│   │   ├── personalInfo.js
│   │   └── auth.js
│   ├── server.js              # Main server file
│   ├── package.json
│   └── env.example            # Environment variables example
│
└── README.md
  </pre>

  <h2>🚀 Installation</h2>

  <h3>Prerequisites</h3>
  <ul>
    <li>Node.js (v16 or higher)</li>
    <li>MySQL (v8.0 or higher)</li>
    <li>Git</li>
  </ul>

  <h3>Clone the Repository</h3>
  <pre>
git clone https://github.com/yourusername/devops-portfolio.git
cd devops-portfolio
  </pre>

  <h3>Install Dependencies</h3>
  <pre>
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
  </pre>

  <h2>⚙️ Configuration</h2>

  <h3>Environment Variables</h3>
  <pre>
# Copy the environment example
cp server/env.example server/.env

# Update .env file
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123
  </pre>

  <h2>🗄️ Database Setup</h2>
  <pre>
# Create MySQL Database
CREATE DATABASE portfolio_db;

# Run Database Schema
mysql -u root -p portfolio_db < server/database/schema.sql

# Insert Sample Data (Optional)
mysql -
