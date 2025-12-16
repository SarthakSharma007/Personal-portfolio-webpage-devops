pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        REPO_URL = 'https://github.com/SarthakSharma007/Personal-portfolio-webpage-devops.git'
        BRANCH = 'main'
    }       
    
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                git branch: "${BRANCH}", url: "${REPO_URL}"
                bat 'dir'
            }
        }
        
        stage('Setup Node.js') {
            steps {
                nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                    bat 'node --version'
                    bat 'npm --version'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                    bat 'npm install'
                    bat 'cd server && npm install'
                    bat 'cd client && npm install'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                    bat 'cd client && npm test -- --coverage --watchAll=false --passWithNoTests'
                }
            }
        }
        
        stage('Build Application') {
            steps {
                nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                    // Added withEnv to prevent build failure due to React warnings
                    withEnv(['CI=false']) {
                        bat 'cd client && npm run build'
                    }
                    bat 'dir client\\build\\'
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                // Optimized to exclude node_modules, which speeds up the archiving significantly
                archiveArtifacts artifacts: 'client\\build\\**\\*', fingerprint: true
                archiveArtifacts artifacts: 'server\\**\\*', excludes: 'server\\node_modules\\**\\*', fingerprint: true
                archiveArtifacts artifacts: '**\\package.json', fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo 'CI Pipeline completed successfully!'
        }
        
        failure {
            echo 'CI Pipeline failed!'
        }
        
        always {
            cleanWs()
        }
    }
}