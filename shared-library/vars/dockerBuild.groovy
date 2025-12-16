def call(Map config) {
    def imageName = config.imageName
    def dockerfile = config.dockerfile ?: 'Dockerfile'
    def context = config.context ?: '.'
    def buildArgs = config.buildArgs ?: [:]
    
    try {
        echo "🐳 Building Docker image: ${imageName}"
        
        def buildArgsString = ""
        buildArgs.each { key, value ->
            buildArgsString += "--build-arg ${key}=${value} "
        }
        
        sh """
            docker build ${buildArgsString} \
                -f ${dockerfile} \
                -t ${imageName} \
                ${context}
        """
        
        // Verify image was built
        sh "docker images ${imageName}"
        
        echo "✅ Docker image built successfully: ${imageName}"
        
    } catch (Exception e) {
        echo "❌ Docker build failed: ${e.getMessage()}"
        throw e
    }
}
