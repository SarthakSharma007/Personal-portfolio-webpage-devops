def call(Map config) {
    def projectKey = config.projectKey
    def projectName = config.projectName ?: projectKey
    def sources = config.sources ?: '.'
    def exclusions = config.exclusions ?: '**/node_modules/**'
    
    try {
        withSonarQubeEnv('SonarQube') {
            sh """
                sonar-scanner \
                -Dsonar.projectKey=${projectKey} \
                -Dsonar.projectName='${projectName}' \
                -Dsonar.sources=${sources} \
                -Dsonar.exclusions=${exclusions} \
                -Dsonar.javascript.lcov.reportPaths=client/coverage/lcov.info \
                -Dsonar.coverage.exclusions=**/*.test.js,**/*.spec.js
            """
        }
        
        // Wait for quality gate
        timeout(time: 5, unit: 'MINUTES') {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') {
                echo "⚠️ SonarQube Quality Gate failed: ${qg.status}"
                if (config.failOnQualityGate != false) {
                    error "Pipeline aborted due to quality gate failure"
                }
            } else {
                echo "✅ SonarQube Quality Gate passed"
            }
        }
        
    } catch (Exception e) {
        echo "❌ SonarQube analysis failed: ${e.getMessage()}"
        throw e
    }
}
