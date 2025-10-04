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
INSERT INTO projects (title, description, tech_stack, github_link, demo_link, image_url, featured) VALUES
('DevOps CI/CD Pipeline', 
'Implemented a complete CI/CD pipeline using Jenkins, Docker, and Kubernetes for automated deployment of microservices. The pipeline includes automated testing, security scanning, and blue-green deployment strategy.',
'Jenkins, Docker, Kubernetes, AWS, Terraform, Python',
'https://github.com/sarthaksharma/devops-pipeline',
'https://demo.sarthaksharma.com',
NULL, TRUE),

('Cloud Infrastructure Automation', 
'Built an automated cloud infrastructure using Terraform and Ansible for provisioning and configuration management. The infrastructure includes auto-scaling groups, load balancers, and monitoring setup.',
'Terraform, Ansible, AWS, Python, Bash',
'https://github.com/sarthaksharma/cloud-infra',
NULL,
NULL, TRUE),

('Container Orchestration Platform', 
'Developed a container orchestration platform using Kubernetes with custom operators and monitoring solutions. Includes Prometheus, Grafana, and custom dashboards for application metrics.',
'Kubernetes, Prometheus, Grafana, Go, Helm',
'https://github.com/sarthaksharma/k8s-platform',
NULL,
NULL, TRUE),

('Monitoring & Alerting System', 
'Created a comprehensive monitoring and alerting system using Prometheus, Grafana, and custom alerting rules. Includes custom dashboards and automated incident response.',
'Prometheus, Grafana, AlertManager, Python, Docker',
'https://github.com/sarthaksharma/monitoring-system',
NULL,
NULL, TRUE),

('Microservices Architecture', 
'Designed and implemented a microservices architecture with service mesh using Istio. Includes API gateway, service discovery, and distributed tracing.',
'Docker, Kubernetes, Istio, Go, gRPC',
'https://github.com/sarthaksharma/microservices-arch',
'https://microservices-demo.sarthaksharma.com',
NULL, FALSE),

('Infrastructure as Code', 
'Created reusable Terraform modules for AWS infrastructure provisioning. Includes VPC, subnets, security groups, and auto-scaling configurations.',
'Terraform, AWS, CloudFormation, Python',
'https://github.com/sarthaksharma/terraform-modules',
NULL,
NULL, FALSE);

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
'2023-01-15',
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
