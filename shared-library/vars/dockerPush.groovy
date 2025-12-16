def call(Map config) {
    def images = config.images
    def registry = config.registry ?: 'docker.io'
    def credentialsId = config.credentialsId
    
    try {
        echo "📤 Pushing Docker images to registry: ${registry}"
        
        withCredentials([usernamePassword(credentialsId: credentialsId, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh "echo \$DOCKER_PASS | docker login ${registry} -u \$DOCKER_USER --password-stdin"
            
            images.each { image ->
                echo "Pushing ${image}..."
                sh "docker push ${image}"
            }
        }
        
        echo "✅ All Docker images pushed successfully"
        
    } catch (Exception e) {
        echo "❌ Docker push failed: ${e.getMessage()}"
        throw e
    } finally {
        sh "docker logout ${registry} || true"
    }
}
