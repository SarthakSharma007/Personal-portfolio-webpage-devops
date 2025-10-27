-- Sample data for Portfolio Database
USE portfolio_db;

-- Insert sample skills
INSERT INTO skills (skill_name, proficiency_level, category, icon) VALUES
-- Primary Skills
('Linux', 'Expert', 'Primary', '🐧'),
('Docker', 'Advanced', 'Primary', '🐳'),
('Kubernetes', 'Advanced', 'Primary', '☸️'),
('Jenkins', 'Advanced', 'Primary', '🔧'),
('Terraform', 'Advanced', 'Primary', '🏗️'),
('Azure', 'Advanced', 'Primary', '☁️'),
('Ansible', 'Advanced', 'Primary', '🔧'),
('AWS', 'Advanced', 'Primary', '☁️'),
('CI/CD', 'Advanced', 'Primary', '🔄'),
('Bash', 'Advanced', 'Primary', '💻'),

-- Other Skills
('Python', 'Advanced', 'Other', '🐍'),
('Java', 'Intermediate', 'Other', '☕'),
('Git', 'Expert', 'Other', '📚'),
('Prometheus', 'Intermediate', 'Other', '📊'),
('Grafana', 'Intermediate', 'Other', '📈'),
('MongoDB', 'Intermediate', 'Other', '🍃'),
('Redis', 'Intermediate', 'Other', '🔴'),
('Nginx', 'Advanced', 'Other', '🌐'),
('Elasticsearch', 'Intermediate', 'Other', '🔍'),
('Vagrant', 'Intermediate', 'Other', '📦');

-- Insert sample projects
-- (Replaced sample projects with the 3 from your Projects.js component)
INSERT INTO projects (title, description, tech_stack, github_link, demo_link, image_url, featured) VALUES
('Automated Node.js Application Deployment using CI/CD and Kubernetes', 
'This repository includes two key DevOps automation tasks completed during the Elevate Labs DevOps Internship. The first task focuses on automating Node.js application deployment using GitHub Actions and Docker Hub, where a CI/CD pipeline was configured to automatically build and push Docker images on every code update. The second task demonstrates deploying the same containerized Node.js application on a local Kubernetes cluster using Minikube, showcasing concepts like pods, deployments, services, and scaling. Together, these projects highlight a complete workflow from continuous integration to container orchestration.',
'JavaScript (Node.js), YAML, Bash, GitHub Actions, Docker, Docker Hub, Kubernetes, Minikube, kubectl, Git',
'https://github.com/sarthaksharma/devops-pipeline',
NULL,
NULL, 
TRUE),

('Automated DevOps Workflows using Shell Scripting', 
'This project is a lightweight and efficient Python-based automation tool designed to create compressed backups of files and folders. It automatically generates a .zip archive of a specified source directory and stores it in a chosen destination folder. The backup file is named with the current date, making it easy to track and manage multiple versions over time. This script is ideal for automating daily or periodic backups, organizing data efficiently, and ensuring file safety without the need for external software. It is simple to configure, extend, and integrate into larger automation workflows.',
'Python',
'https://github.com/SarthakSharma007/automated-backup.py.git',
NULL,
NULL, 
TRUE),

('DevOps Automation with Bash Scripting', 
'This repository showcases two automation projects built using Bash scripting to streamline DevOps workflows. The first project automates Django application deployment using Docker and Docker Compose, while the second project automates AWS EC2 instance creation using AWS CLI. Both scripts are designed for simplicity, reusability, and reliability — helping developers deploy and manage infrastructure seamlessly with minimal manual effort.',
'Bash (Shell Scripting), Docker, Docker Compose, Nginx, AWS CLI, EC2, Linux',
'https://github.com/SarthakSharma007/use-shell-scripting-to-deploy.git',
NULL,
NULL, 
TRUE);


-- Insert sample certifications
INSERT INTO certifications (cert_name, issuing_organization, issue_date, expiry_date, credential_id, credential_url, image_url) VALUES
('AWS Certified Solutions Architect - Associate',
'Amazon Web Services',
'2023-08-15',
'2026-08-15',
'AWS-SAA-123456',
'https://aws.amazon.com/verification',
NULL),

('Certified Kubernetes Administrator (CKA)',
'Cloud Native Computing Foundation',
'2023-06-20',
'2026-06-20',
'CKA-789012',
'https://cncf.io/certification/cka',
NULL),

('Docker Certified Associate',
'Docker Inc.',
'2023-04-10',
'2025-04-10',
'DCA-345678',
'https://docker.com/certification',
NULL),

('Microsoft Azure Fundamentals',
'Microsoft',
'2023-02-28',
NULL,
'MS-AZ900-456789',
'https://learn.microsoft.com/certifications',
NULL),

('HashiCorp Certified: Terraform Associate',
'HashiCorp',
'2DOM-01-15',
'2025-01-15',
'HCT-A-567890',
'https://hashicorp.com/certification',
NULL);

-- Insert sample experiences
INSERT INTO experiences (title, company, location, start_date, end_date, current, description, technologies, type) VALUES
('DevOps Engineer Intern',
'CloudTech Solutions',
'Bangalore, India',
'2023-06-01',
'2023-12-31',
FALSE,
'Assisted in setting up CI/CD pipelines using Jenkins and Docker. Managed cloud infrastructure on AWS and implemented monitoring solutions with Prometheus and Grafana. Automated deployment processes and improved system reliability.',
'AWS, Docker, Jenkins, Kubernetes, Terraform, Python',
'Internship'),

('Web Development Intern',
'Techno Hack',
'Remote',
'2023-01-01',
'2023-05-31',
FALSE,
'Developed responsive web applications using React.js and Node.js. Implemented RESTful APIs and integrated third-party services. Collaborated with a team of 5 developers to deliver high-quality software solutions.',
'React.js, Node.js, MongoDB, Express.js, Git',
'Internship'),

('Cloud Infrastructure Intern',
'DataFlow Systems',
'Mumbai, India',
'2022-08-01',
'2022-12-31',
FALSE,
'Worked on cloud migration projects and infrastructure automation. Implemented Infrastructure as Code using Terraform and managed containerized applications on Kubernetes.',
'AWS, Terraform, Kubernetes, Docker, Ansible',
'Internship'),

('DevOps Trainee',
'StartupXYZ',
'Delhi, India',
'2022-05-01',
'2022-07-31',
FALSE,
'Learned DevOps practices and tools. Assisted in setting up development environments and basic CI/CD pipelines. Gained hands-on experience with version control and deployment automation.',
'Git, Jenkins, Docker, Linux, Bash',
'Internship');

-- Insert sample education
INSERT INTO education (degree, institution, location, start_date, end_date, current, gpa, description) VALUES
('Bachelor of Technology in Computer Science Engineering',
'XXXXX University',
'India',
'2020-09-01',
'2024-06-30',
FALSE,
8.5,
'Specialized in software engineering, data structures, algorithms, and system design. Completed projects in web development, machine learning, and cloud computing. Active member of the Computer Science Society and participated in various coding competitions.'),

('Higher Secondary Education',
'ABC School',
'India',
'2018-04-01',
'2020-03-31',
FALSE,
9.2,
'Completed 12th grade with focus on Mathematics, Physics, and Chemistry. Participated in science exhibitions and won several awards for innovative projects.');

-- Insert sample personal info (update existing record)
UPDATE personal_info SET 
full_name = 'Sarthak Sharma',
title = 'DevOps Engineer',
email = 'sarthak@example.com',
phone = '+91-9876543210',
location = 'India',
bio = 'I am a passionate DevOps Engineer with expertise in cloud technologies, containerization, and automation. I love building scalable infrastructure and implementing CI/CD pipelines to streamline development workflows. My journey in technology started with a curiosity about how systems work, and it has evolved into a passion for creating efficient, reliable, and scalable solutions. I enjoy working with modern technologies like Kubernetes, Docker, Terraform, and cloud platforms to solve complex infrastructure challenges.',
github_url = 'https://github.com/sarthaksharma',
linkedin_url = 'https://linkedin.com/in/sarthaksharma',
resume_url = '/resume.pdf'
WHERE id = 1;

-- Insert sample contact messages
INSERT INTO messages (name, email, subject, message, read_status) VALUES
('John Doe',
'john.doe@example.com',
'Collaboration Opportunity',
'Hi Sarthak, I came across your portfolio and I am impressed with your DevOps skills. We have an exciting project that could benefit from your expertise. Would you be interested in discussing this opportunity?',
FALSE),

('Sarah Wilson',
'sarah.wilson@techcorp.com',
'Job Opportunity',
'Hello Sarthak, I am a recruiter at TechCorp and we are looking for a DevOps Engineer to join our team. Your experience with Kubernetes and cloud technologies aligns perfectly with our requirements. Please let me know if you are interested.',
FALSE),

('Mike Johnson',
'mike.j@startup.io',
'Freelance Project',
'Hi, I am the CTO of a startup and we need help setting up our cloud infrastructure. Your portfolio shows exactly what we need. Are you available for freelance work?',
TRUE);