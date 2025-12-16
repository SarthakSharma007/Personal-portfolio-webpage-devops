def call(Map config) {
    def scanType = config.scanType ?: 'npm-audit'
    def directories = config.directories ?: ['.']
    
    try {
        echo "🔒 Running security scan..."
        
        switch(scanType) {
            case 'npm-audit':
                directories.each { dir ->
                    if (fileExists("${dir}/package.json")) {
                        echo "Scanning ${dir} for vulnerabilities..."
                        dir(dir) {
                            sh '''
                                npm audit --audit-level=moderate --json > audit-results.json || true
                                if [ -s audit-results.json ]; then
                                    echo "Security vulnerabilities found in ${PWD}"
                                    cat audit-results.json
                                fi
                            '''
                        }
                    }
                }
                break
                
            case 'trivy':
                sh '''
                    trivy fs --format json --output trivy-results.json .
                    if [ -s trivy-results.json ]; then
                        echo "Trivy scan results:"
                        cat trivy-results.json
                    fi
                '''
                break
                
            default:
                echo "Unknown scan type: ${scanType}"
        }
        
        echo "✅ Security scan completed"
        
    } catch (Exception e) {
        echo "❌ Security scan failed: ${e.getMessage()}"
        throw e
    }
}
