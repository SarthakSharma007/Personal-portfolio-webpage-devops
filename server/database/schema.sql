-- database/schema.sql
-- Complete production schema for Portfolio + Admin Panel
-- Run this once on the Ubuntu server against portfolio_db

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- ============================================================
-- Users table (for admin login)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Projects table (extended with all admin panel columns)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack VARCHAR(500),
    github_link VARCHAR(255),
    demo_link VARCHAR(255),
    image_url VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    -- Extended columns used by Admin Panel
    slug VARCHAR(255),
    num VARCHAR(10),
    label VARCHAR(255),
    short_desc TEXT,
    gradient VARCHAR(500),
    accent_a VARCHAR(50),
    accent_b VARCHAR(50),
    hero BOOLEAN DEFAULT FALSE,
    difficulty_level ENUM('Basic','Intermediate','Advanced') DEFAULT 'Basic',
    images_json JSON,
    overview TEXT,
    problem TEXT,
    solution TEXT,
    tech_stack_json JSON,
    timeline_json JSON,
    learnings_json JSON,
    show_github BOOLEAN DEFAULT TRUE,
    show_demo BOOLEAN DEFAULT TRUE,
    show_details BOOLEAN DEFAULT TRUE,
    card_size VARCHAR(20) DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Skills table (extended with emoji, bg, category as VARCHAR)
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) NOT NULL,
    name VARCHAR(100),
    proficiency_level VARCHAR(50) DEFAULT 'Intermediate',
    level VARCHAR(50) DEFAULT 'Intermediate',
    -- category stored as VARCHAR (category_id from skill_categories)
    category VARCHAR(100) DEFAULT '',
    icon VARCHAR(255),
    emoji VARCHAR(10),
    bg VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Skill Categories table (used by admin panel blocks feature)
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    gradient VARCHAR(500),
    glow VARCHAR(100),
    textColor VARCHAR(50),
    span VARCHAR(10) DEFAULT 'half',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Certifications table
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cert_name VARCHAR(255) NOT NULL,
    -- 'name' alias supported by admin panel
    name VARCHAR(255),
    issuing_organization VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    credential_url VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Experiences table
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    technologies VARCHAR(500),
    type VARCHAR(50) DEFAULT 'Internship',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_experiences_company_title_start (company, title, start_date)
);

-- ============================================================
-- Education table
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    gpa DECIMAL(4,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_education_degree_inst_start (degree, institution, start_date)
);

-- ============================================================
-- Messages table (contact form submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Personal info table
-- ============================================================
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
    about_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Section Settings table (controls section headers & visibility)
-- Used by: /api/sectionSettings/:section
-- ============================================================
CREATE TABLE IF NOT EXISTS section_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_name VARCHAR(100) UNIQUE NOT NULL,
    subtitle VARCHAR(255),
    title VARCHAR(255),
    title_highlight VARCHAR(255),
    title_gradient VARCHAR(500),
    description TEXT,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- DEFAULT DATA INSERTS
-- ============================================================

-- Default admin user (password: admin123)
INSERT INTO users (name, email, password) VALUES
('Admin', 'admin@portfolio.com', '$2b$10$hElza9WQA4.dSfdD3.ond.QuQJbs0UZWlzr2LaBerMwX9CfetnUdK')
ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password);

-- Default personal info
INSERT INTO personal_info (id, full_name, title, email, phone, location, bio, github_url, linkedin_url, resume_url)
VALUES (
    1,
    'Sarthak Sharma',
    'DevOps Engineer',
    'sarthak@example.com',
    '+91-9876543210',
    'India',
    'I''m a highly driven Computer Science undergraduate with a strong foundation in DevOps and automation practices, passionate about building scalable and efficient systems. I''ve successfully automated CI/CD pipelines, reducing software release times by 95%, and have hands-on experience with Docker, Kubernetes, and AWS for cloud deployment and orchestration. My expertise also includes system observability using Prometheus and Grafana, and effective project tracking with Jira. Recognized as the 2nd runner-up in a National Hackathon, I bring strong problem-solving and leadership skills to every project.',
    'https://github.com/SarthakSharma007',
    'https://www.linkedin.com/in/sarthaksharmaprofile/',
    '/resume.pdf'
)
ON DUPLICATE KEY UPDATE
    full_name=VALUES(full_name),
    title=VALUES(title),
    email=VALUES(email);

-- Default section settings for Skills section
INSERT INTO section_settings (section_name, subtitle, title, title_highlight, title_gradient, description)
VALUES (
    'skills',
    'MY TOOLKIT',
    'Technologies & ',
    'Skills',
    'linear-gradient(135deg, #6366f1, #0ea5e9)',
    'A curated list of technologies and tools I work with.'
)
ON DUPLICATE KEY UPDATE
    subtitle=VALUES(subtitle),
    title=VALUES(title);

-- Default section settings for Projects section
INSERT INTO section_settings (section_name, subtitle, title, title_highlight, title_gradient, description)
VALUES (
    'projects',
    'WHAT I\'VE BUILT',
    'Featured ',
    'Projects',
    'linear-gradient(135deg, #6366f1, #ec4899)',
    'A selection of real-world projects I have designed and deployed.'
)
ON DUPLICATE KEY UPDATE
    subtitle=VALUES(subtitle),
    title=VALUES(title);
