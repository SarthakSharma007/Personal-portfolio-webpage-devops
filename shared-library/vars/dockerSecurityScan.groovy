def call(Map config) {
    def imageName = config.imageName
    def severity = config.severity ?: 'HIGH'
    def scanner = config.scanner ?: 'trivy'
    
    try {
        echo "🔍 Scanning Docker image for vulnerabilities: ${imageName}"
        
        switch(scanner) {
            case 'trivy':
                sh """
                    trivy image --severity ${severity} --format json --output ${imageName.replaceAll('[^a-zA-Z0-9]', '_')}-scan.json ${imageName}
                    trivy image --severity ${severity} ${imageName}
                """
                break
                
            case 'clair':
                sh """
                    clair-scanner --ip \$(hostname -I | awk '{print \$1}') ${imageName}
                """
                break
                
            default:
                echo "Unknown scanner: ${scanner}"
        }
        
        echo "✅ Docker security scan completed for: ${imageName}"
        
    } catch (Exception e) {
        echo "❌ Docker security scan failed: ${e.getMessage()}"
        // Don't fail the build for security scan failures in non-prod environments
        if (env.DEPLOY_ENV == 'prod') {
            throw e
        } else {
            echo "⚠️ Continuing build despite security scan failure in ${env.DEPLOY_ENV} environment"
        }
    }
}
