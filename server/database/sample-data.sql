-- database/sample-data.sql
USE portfolio_db;

-- Insert sample skills (cleaned names; icons removed)
INSERT INTO skills (skill_name, proficiency_level, category) VALUES
('Linux', 'Expert', 'Primary'),
('Docker', 'Advanced', 'Primary'),
('Kubernetes', 'Advanced', 'Primary'),
('Jenkins', 'Advanced', 'Primary'),
('Terraform', 'Advanced', 'Primary'),
('Azure', 'Advanced', 'Primary'),
('Ansible', 'Advanced', 'Primary'),
('AWS', 'Advanced', 'Primary'),
('CI/CD', 'Advanced', 'Primary'),
('Bash', 'Advanced', 'Primary'),
('Python', 'Advanced', 'Other'),
('Java', 'Intermediate', 'Other'),
('Git', 'Expert', 'Other'),
('Prometheus', 'Intermediate', 'Other'),
('Grafana', 'Intermediate', 'Other'),
('MongoDB', 'Intermediate', 'Other'),
('Redis', 'Intermediate', 'Other'),
('Nginx', 'Advanced', 'Other'),
('Elasticsearch', 'Intermediate', 'Other'),
('Vagrant', 'Intermediate', 'Other');

-- Insert sample projects (3 projects)
INSERT INTO projects (title, description, tech_stack, github_link, demo_link, image_url, featured) VALUES
('Automated Node.js Application Deployment using CI/CD and Kubernetes',
'Automated Node.js application deployment using GitHub Actions, Docker and Kubernetes (Minikube). Includes CI/CD pipeline and deployment manifests.',
'JavaScript (Node.js), GitHub Actions, Docker, Kubernetes, Minikube',
'https://github.com/sarthaksharma/devops-pipeline',
NULL,
NULL,
TRUE),
('Automated DevOps Workflows using Shell/Python Scripting',
'Automation scripts for backups and DevOps tasks that can be scheduled or run manually to streamline workflows.',
'Python, Bash, Shell scripting',
'https://github.com/SarthakSharma007/automated-backup.py',
NULL,
NULL,
TRUE),
('DevOps Automation with Bash Scripting',
'Bash scripts to automate deployments, infrastructure tasks and basic AWS CLI workflows.',
'Bash, Docker, Docker Compose, Nginx, AWS CLI',
'https://github.com/SarthakSharma007/use-shell-scripting-to-deploy',
NULL,
NULL,
TRUE);

-- Insert sample certifications (fixed date)
INSERT INTO certifications (cert_name, issuing_organization, issue_date, expiry_date, credential_id, credential_url, image_url) VALUES
('AWS Certified Solutions Architect - Associate', 'Amazon Web Services', '2023-08-15', '2026-08-15', 'AWS-SAA-123456', 'https://aws.amazon.com/verification', NULL),
('Certified Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation', '2023-06-20', '2026-06-20', 'CKA-789012', 'https://cncf.io/certification/cka', NULL),
('Docker Certified Associate', 'Docker Inc.', '2023-04-10', '2025-04-10', 'DCA-345678', 'https://docker.com/certification', NULL),
('Microsoft Azure Fundamentals', 'Microsoft', '2023-02-28', NULL, 'MS-AZ900-456789', 'https://learn.microsoft.com/certifications', NULL),
('HashiCorp Certified: Terraform Associate', 'HashiCorp', '2024-01-15', '2025-01-15', 'HCT-A-567890', 'https://hashicorp.com/certification', NULL);

-- Insert sample experiences
INSERT INTO experiences (title, company, location, start_date, end_date, current, description, technologies, type) VALUES
('DevOps Engineer Intern', 'CloudTech Solutions', 'Bangalore, India', '2023-06-01', '2023-12-31', FALSE, 'Assisted in setting up CI/CD pipelines using Jenkins and Docker. Managed cloud infrastructure on AWS and implemented monitoring solutions with Prometheus and Grafana.', 'AWS, Docker, Jenkins, Kubernetes, Terraform, Python', 'Internship'),
('Web Development Intern', 'Techno Hack', 'Remote', '2023-01-01', '2023-05-31', FALSE, 'Developed responsive web applications using React.js and Node.js. Implemented RESTful APIs and integrated third-party services.', 'React.js, Node.js, MongoDB, Express.js, Git', 'Internship'),
('Cloud Infrastructure Intern', 'DataFlow Systems', 'Mumbai, India', '2022-08-01', '2022-12-31', FALSE, 'Worked on cloud migration projects and infrastructure automation.', 'AWS, Terraform, Kubernetes, Docker, Ansible', 'Internship'),
('DevOps Trainee', 'StartupXYZ', 'Delhi, India', '2022-05-01', '2022-07-31', FALSE, 'Learned DevOps practices and tools. Assisted in setting up development environments and basic CI/CD pipelines.', 'Git, Jenkins, Docker, Linux, Bash', 'Internship');

-- Insert sample education
INSERT INTO education (degree, institution, location, start_date, end_date, current, gpa, description) VALUES
('Bachelor of Technology in Computer Science Engineering', 'XXXXX University', 'India', '2020-09-01', '2024-06-30', FALSE, 8.5, 'Specialized in software engineering, data structures, algorithms, and system design.'),
('Higher Secondary Education', 'ABC School', 'India', '2018-04-01', '2020-03-31', FALSE, 9.2, 'Completed 12th grade with focus on Mathematics, Physics, and Chemistry.');

-- Update personal_info (correct links)
UPDATE personal_info SET 
full_name = 'Sarthak Sharma',
title = 'DevOps Engineer',
email = 'sarthak@example.com',
phone = '+91-9876543210',
location = 'India',
bio = 'I am a passionate DevOps Engineer with expertise in cloud technologies, containerization, and automation. I love building scalable infrastructure and implementing CI/CD pipelines to streamline development workflows.',
github_url = 'https://github.com/SarthakSharma007',
linkedin_url = 'https://www.linkedin.com/in/sarthaksharmaprofile/',
resume_url = '/resume.pdf'
WHERE id = 1;
