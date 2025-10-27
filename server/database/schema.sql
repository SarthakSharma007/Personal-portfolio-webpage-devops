-- database/schema.sql
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Users table (for admin login)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack VARCHAR(255) NOT NULL,
    github_link VARCHAR(255),
    demo_link VARCHAR(255),
    image_url VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate',
    category ENUM('Primary', 'Other') DEFAULT 'Other',
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cert_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    credential_url VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    technologies VARCHAR(255),
    type ENUM('Internship', 'Full-time', 'Part-time', 'Contract') DEFAULT 'Internship',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    gpa DECIMAL(3,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal info table
CREATE TABLE IF NOT EXISTS personal_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    resume_url VARCHAR(255),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password) VALUES
('Admin', 'admin@portfolio.com', '$2b$10$hElza9WQA4.dSfdD3.ond.QuQJbs0UZWlzr2LaBerMwX9CfetnUdK')
ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password);

-- Insert default personal info (if not exists)
INSERT INTO personal_info (id, full_name, title, email, phone, location, bio, github_url, linkedin_url, resume_url)
VALUES (1, 'Sarthak Sharma', 'DevOps Engineer', 'sarthak@example.com', '+91-9876543210', 'India', 'I am a passionate DevOps Engineer with expertise in cloud technologies, containerization, and automation.', 'https://github.com/SarthakSharma007', 'https://www.linkedin.com/in/sarthaksharmaprofile/', '/resume.pdf')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), title=VALUES(title), email=VALUES(email);
