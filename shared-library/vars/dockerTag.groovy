def call(Map config) {
    def sourceImages = config.sourceImages
    def targetTag = config.targetTag
    
    try {
        echo "🏷️ Tagging Docker images with: ${targetTag}"
        
        sourceImages.each { sourceImage ->
            def imageName = sourceImage.split(':')[0]
            def targetImage = "${imageName}:${targetTag}"
            
            sh "docker tag ${sourceImage} ${targetImage}"
            sh "docker push ${targetImage}"
            
            echo "Tagged and pushed: ${targetImage}"
        }
        
        echo "✅ All images tagged and pushed successfully"
        
    } catch (Exception e) {
        echo "❌ Docker tagging failed: ${e.getMessage()}"
        throw e
    }
}
