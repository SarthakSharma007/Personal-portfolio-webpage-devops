@Library('jenkins-shared-library-') _

pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = 'sarthaksharma007'
        FRONTEND_IMAGE = "${DOCKER_REPO}/portfolio-frontend"
        BACKEND_IMAGE = "${DOCKER_REPO}/portfolio-backend"
        MYSQL_IMAGE = "${DOCKER_REPO}/portfolio-mysql"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'
        DOCKER_CREDENTIAL_ID = 'docker-hub-credentials'
        SONAR_CREDENTIAL_ID = 'sonar-token'
        NAMESPACE = 'portfolio'
    }
    
    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['dev', 'staging', 'prod'],
            description: 'Select deployment environment'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip running tests'
        )
        booleanParam(
            name: 'FORCE_DEPLOY',
            defaultValue: false,
            description: 'Force deployment even if tests fail'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    gitCheckout([
                        branch: 'main',
                        url: 'https://github.com/SarthakSharma007/Personal-portfolio-webpage-devops.git'
                    ])
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('client') {
                    script {
                        nodejsBuild([
                            nodeVersion: '18',
                            buildCommand: 'npm ci && npm run build',
                            testCommand: params.SKIP_TESTS ? '' : 'npm test -- --coverage --watchAll=false'
                        ])
                    }
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('server') {
                    script {
                        nodejsBuild([
                            nodeVersion: '18',
                            buildCommand: 'npm ci',
                            testCommand: params.SKIP_TESTS ? '' : 'npm test'
                        ])
                    }
                }
            }
        }
        
        stage('Code Quality Analysis') {
            parallel {
                stage('SonarQube Analysis') {
                    steps {
                        script {
                            sonarQubeAnalysis([
                                projectKey: 'portfolio-devops',
                                projectName: 'Personal Portfolio DevOps',
                                sources: 'client/src,server',
                                exclusions: '**/node_modules/**,**/build/**,**/coverage/**'
                            ])
                        }
                    }
                }
                
                stage('Security Scan') {
                    steps {
                        script {
                            securityScan([
                                scanType: 'npm-audit',
                                directories: ['client', 'server']
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        script {
                            dockerBuild([
                                imageName: "${FRONTEND_IMAGE}:${BUILD_NUMBER}",
                                dockerfile: 'infra/docker/Dockerfile.frontend-from-build',
                                context: '.',
                                buildArgs: [:]
                            ])
                        }
                    }
                }
                
                stage('Build Backend Image') {
                    steps {
                        script {
                            dockerBuild([
                                imageName: "${BACKEND_IMAGE}:${BUILD_NUMBER}",
                                dockerfile: 'infra/docker/Dockerfile.backend',
                                context: '.',
                                buildArgs: [:]
                            ])
                        }
                    }
                }
                
                stage('Build MySQL Image') {
                    steps {
                        script {
                            dockerBuild([
                                imageName: "${MYSQL_IMAGE}:${BUILD_NUMBER}",
                                dockerfile: 'infra/docker/Dockerfile.mysql',
                                context: '.',
                                buildArgs: [:]
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Security Scan Images') {
            parallel {
                stage('Scan Frontend Image') {
                    steps {
                        script {
                            dockerSecurityScan([
                                imageName: "${FRONTEND_IMAGE}:${BUILD_NUMBER}",
                                severity: 'HIGH'
                            ])
                        }
                    }
                }
                
                stage('Scan Backend Image') {
                    steps {
                        script {
                            dockerSecurityScan([
                                imageName: "${BACKEND_IMAGE}:${BUILD_NUMBER}",
                                severity: 'HIGH'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Push Docker Images') {
            when {
                anyOf {
                    expression { return params.FORCE_DEPLOY }
                    expression { return currentBuild.result != 'FAILURE' }
                }
            }
            steps {
                script {
                    dockerPush([
                        images: [
                            "${FRONTEND_IMAGE}:${BUILD_NUMBER}",
                            "${BACKEND_IMAGE}:${BUILD_NUMBER}",
                            "${MYSQL_IMAGE}:${BUILD_NUMBER}"
                        ],
                        registry: DOCKER_REGISTRY,
                        credentialsId: DOCKER_CREDENTIAL_ID
                    ])
                    
                    // Tag as latest for main branch
                    if (env.BRANCH_NAME == 'main') {
                        dockerTag([
                            sourceImages: [
                                "${FRONTEND_IMAGE}:${BUILD_NUMBER}",
                                "${BACKEND_IMAGE}:${BUILD_NUMBER}",
                                "${MYSQL_IMAGE}:${BUILD_NUMBER}"
                            ],
                            targetTag: 'latest'
                        ])
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when {
                anyOf {
                    expression { return params.FORCE_DEPLOY }
                    expression { return currentBuild.result != 'FAILURE' }
                }
            }
            steps {
                script {
                    kubernetesDeployment([
                        namespace: NAMESPACE,
                        manifests: [
                            'infra/k8s/namespace.yaml',
                            'infra/k8s/secret.yml',
                            'infra/k8s/configmap.yml',
                            'infra/k8s/mysql-pvc.yml',
                            'infra/k8s/mysql/',
                            'infra/k8s/backend/',
                            'infra/k8s/frontend/',
                            'infra/k8s/hpas.yml'
                        ],
                        imageUpdates: [
                            [
                                file: 'infra/k8s/frontend/deployment.yaml',
                                container: 'frontend',
                                image: "${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                            ],
                            [
                                file: 'infra/k8s/backend/deployment.yaml',
                                container: 'backend',
                                image: "${BACKEND_IMAGE}:${BUILD_NUMBER}"
                            ],
                            [
                                file: 'infra/k8s/mysql/deployment.yaml',
                                container: 'mysql',
                                image: "${MYSQL_IMAGE}:${BUILD_NUMBER}"
                            ]
                        ],
                        kubeconfig: KUBECONFIG_CREDENTIAL_ID,
                        environment: params.DEPLOY_ENV
                    ])
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    healthCheck([
                        endpoints: [
                            [
                                name: 'Frontend Health',
                                url: "http://portfolio-frontend.${NAMESPACE}.svc.cluster.local",
                                expectedStatus: 200,
                                timeout: 300
                            ],
                            [
                                name: 'Backend Health',
                                url: "http://portfolio-backend.${NAMESPACE}.svc.cluster.local:5000/health",
                                expectedStatus: 200,
                                timeout: 300
                            ]
                        ]
                    ])
                }
            }
        }
        
        stage('Performance Tests') {
            when {
                expression { return params.DEPLOY_ENV == 'staging' || params.DEPLOY_ENV == 'prod' }
            }
            steps {
                script {
                    performanceTest([
                        testType: 'load',
                        targetUrl: "http://portfolio-frontend.${NAMESPACE}.svc.cluster.local",
                        duration: '5m',
                        users: 50,
                        rampUp: '2m'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up workspace
                cleanWs()
                
                // Archive artifacts
                archiveArtifacts artifacts: 'client/build/**/*', allowEmptyArchive: true
                
                // Publish test results if available
                if (!params.SKIP_TESTS) {
                    publishTestResults testResultsPattern: 'client/coverage/lcov.info'
                }
            }
        }
        
        success {
            script {
                sendNotification([
                    type: 'success',
                    message: "✅ Pipeline succeeded for ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    channels: ['slack', 'email'],
                    environment: params.DEPLOY_ENV
                ])
            }
        }
        
        failure {
            script {
                sendNotification([
                    type: 'failure',
                    message: "❌ Pipeline failed for ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    channels: ['slack', 'email'],
                    environment: params.DEPLOY_ENV,
                    includeLog: true
                ])
            }
        }
        
        unstable {
            script {
                sendNotification([
                    type: 'warning',
                    message: "⚠️ Pipeline unstable for ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    channels: ['slack'],
                    environment: params.DEPLOY_ENV
                ])
            }
        }
    }
}
