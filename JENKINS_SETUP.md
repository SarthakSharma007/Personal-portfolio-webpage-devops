# Jenkins CI/CD Pipeline Setup

This document explains how to set up and configure the Jenkins CI/CD pipeline for the Personal Portfolio DevOps project.

## Prerequisites

### Jenkins Plugins Required
- Pipeline
- Git
- Docker Pipeline
- Kubernetes CLI
- SonarQube Scanner
- Slack Notification
- Email Extension
- NodeJS

### Tools Required on Jenkins Agent
- Docker
- kubectl
- Node.js 18+
- SonarQube Scanner
- Trivy (for security scanning)
- k6 (for performance testing)

## Setup Instructions

### 1. Configure Shared Library

1. In Jenkins, go to **Manage Jenkins** → **Configure System**
2. Scroll to **Global Pipeline Libraries**
3. Add a new library with:
   - **Name**: `jenkins-shared-library-`
   - **Default version**: `main`
   - **Retrieval method**: Modern SCM
   - **Source Code Management**: Git
   - **Project Repository**: `https://github.com/SarthakSharma007/jenkins-shared-library-.git`

### 2. Create Jenkins Credentials

Create the following credentials in Jenkins:

#### Docker Hub Credentials
- **ID**: `docker-hub-credentials`
- **Type**: Username with password
- **Username**: Your Docker Hub username
- **Password**: Your Docker Hub password/token

#### Kubernetes Config
- **ID**: `kubeconfig`
- **Type**: Secret file
- **File**: Upload your kubeconfig file

#### SonarQube Token
- **ID**: `sonar-token`
- **Type**: Secret text
- **Secret**: Your SonarQube authentication token

### 3. Configure Global Tools

#### Node.js
- Go to **Manage Jenkins** → **Global Tool Configuration**
- Add NodeJS installation:
  - **Name**: `NodeJS-18`
  - **Version**: 18.x.x

#### SonarQube Scanner
- Add SonarQube Scanner installation:
  - **Name**: `SonarQube Scanner`
  - **Install automatically**: Check this option

### 4. Configure SonarQube Server

1. Go to **Manage Jenkins** → **Configure System**
2. Find **SonarQube servers** section
3. Add SonarQube server:
   - **Name**: `SonarQube`
   - **Server URL**: Your SonarQube server URL
   - **Server authentication token**: Select the `sonar-token` credential

### 5. Configure Slack Notifications (Optional)

1. Install Slack Notification plugin
2. Go to **Manage Jenkins** → **Configure System**
3. Find **Slack** section and configure:
   - **Workspace**: Your Slack workspace
   - **Credential**: Add Slack token credential
   - **Default channel**: `#devops-alerts`

## Pipeline Configuration

### Environment Variables

The pipeline uses these environment variables that can be configured:

```groovy
environment {
    DOCKER_REGISTRY = 'docker.io'                    // Docker registry URL
    DOCKER_REPO = 'sarthaksharma007'                 // Your Docker Hub username
    KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'          // Kubernetes config credential ID
    DOCKER_CREDENTIAL_ID = 'docker-hub-credentials'  // Docker Hub credential ID
    SONAR_CREDENTIAL_ID = 'sonar-token'              // SonarQube token credential ID
    NAMESPACE = 'portfolio'                          // Kubernetes namespace
}
```

### Pipeline Parameters

The pipeline supports these parameters:

- **DEPLOY_ENV**: Choose deployment environment (dev/staging/prod)
- **SKIP_TESTS**: Skip running tests (boolean)
- **FORCE_DEPLOY**: Force deployment even if tests fail (boolean)

## Pipeline Stages

### 1. Checkout
- Clones the repository using the shared library function
- Uses shallow clone for faster checkout

### 2. Build Frontend & Backend
- Installs Node.js dependencies
- Runs tests (unless skipped)
- Builds the React frontend
- Prepares the Node.js backend

### 3. Code Quality Analysis
- **SonarQube Analysis**: Code quality and security analysis
- **Security Scan**: NPM audit for dependency vulnerabilities

### 4. Build Docker Images
- Builds three Docker images in parallel:
  - Frontend (React app)
  - Backend (Node.js API)
  - MySQL (Database)

### 5. Security Scan Images
- Scans Docker images for vulnerabilities using Trivy
- Fails build in production if high-severity vulnerabilities found

### 6. Push Docker Images
- Pushes images to Docker registry
- Tags images as 'latest' for main branch

### 7. Deploy to Kubernetes
- Updates image tags in Kubernetes manifests
- Applies manifests to Kubernetes cluster
- Waits for deployments to be ready

### 8. Health Check
- Verifies application endpoints are responding
- Checks both frontend and backend health

### 9. Performance Tests
- Runs load tests using k6 (staging/prod only)
- Configurable user load and duration

## Shared Library Functions

The pipeline uses these custom shared library functions:

- `gitCheckout()`: Enhanced Git checkout with shallow clone
- `nodejsBuild()`: Node.js build with testing support
- `sonarQubeAnalysis()`: SonarQube code analysis
- `securityScan()`: Security vulnerability scanning
- `dockerBuild()`: Docker image building
- `dockerSecurityScan()`: Docker image security scanning
- `dockerPush()`: Docker image pushing to registry
- `dockerTag()`: Docker image tagging
- `kubernetesDeployment()`: Kubernetes deployment management
- `healthCheck()`: Application health verification
- `performanceTest()`: Load and performance testing
- `sendNotification()`: Multi-channel notifications

## Usage

### Creating a Jenkins Job

1. Create a new **Pipeline** job in Jenkins
2. In the pipeline configuration:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/SarthakSharma007/Personal-portfolio-webpage-devops.git`
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`

### Running the Pipeline

1. Click **Build with Parameters**
2. Select your desired environment and options
3. Click **Build**

### Monitoring

- Check the **Console Output** for detailed logs
- View **Blue Ocean** for visual pipeline representation
- Monitor Slack notifications for build status
- Check SonarQube dashboard for code quality metrics

## Troubleshooting

### Common Issues

1. **Docker build fails**: Ensure Docker is installed and running on Jenkins agent
2. **Kubernetes deployment fails**: Verify kubeconfig is valid and cluster is accessible
3. **SonarQube analysis fails**: Check SonarQube server connectivity and token validity
4. **Tests fail**: Review test output in console logs

### Debug Commands

```bash
# Check Docker images
docker images | grep portfolio

# Check Kubernetes pods
kubectl get pods -n portfolio

# Check Kubernetes events
kubectl get events -n portfolio --sort-by='.lastTimestamp'

# Check application logs
kubectl logs -f deployment/portfolio-frontend -n portfolio
kubectl logs -f deployment/portfolio-backend -n portfolio
```

## Security Considerations

- Store all sensitive data in Jenkins credentials
- Use least-privilege access for service accounts
- Regularly update base images and dependencies
- Monitor security scan results
- Implement proper RBAC in Kubernetes

## Customization

To customize the pipeline for your needs:

1. Modify environment variables in the Jenkinsfile
2. Update Docker image names and registry
3. Adjust Kubernetes namespace and manifests
4. Configure notification channels
5. Modify test commands and quality gates

## Support

For issues or questions:
1. Check Jenkins console output
2. Review this documentation
3. Check shared library functions
4. Verify all prerequisites are met
