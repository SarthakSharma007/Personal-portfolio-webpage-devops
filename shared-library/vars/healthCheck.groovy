def call(Map config) {
    def endpoints = config.endpoints
    def retries = config.retries ?: 5
    def delay = config.delay ?: 30
    
    try {
        echo "🏥 Running health checks..."
        
        endpoints.each { endpoint ->
            def name = endpoint.name
            def url = endpoint.url
            def expectedStatus = endpoint.expectedStatus ?: 200
            def timeout = endpoint.timeout ?: 60
            
            echo "Checking ${name}: ${url}"
            
            def success = false
            for (int i = 0; i < retries; i++) {
                try {
                    def response = sh(
                        script: "curl -s -o /dev/null -w '%{http_code}' --max-time ${timeout} ${url}",
                        returnStdout: true
                    ).trim()
                    
                    if (response == expectedStatus.toString()) {
                        echo "✅ ${name} is healthy (HTTP ${response})"
                        success = true
                        break
                    } else {
                        echo "⚠️ ${name} returned HTTP ${response}, expected ${expectedStatus}"
                    }
                } catch (Exception e) {
                    echo "⚠️ ${name} health check failed: ${e.getMessage()}"
                }
                
                if (i < retries - 1) {
                    echo "Retrying in ${delay} seconds..."
                    sleep(delay)
                }
            }
            
            if (!success) {
                error "❌ Health check failed for ${name} after ${retries} attempts"
            }
        }
        
        echo "✅ All health checks passed"
        
    } catch (Exception e) {
        echo "❌ Health check failed: ${e.getMessage()}"
        throw e
    }
}
