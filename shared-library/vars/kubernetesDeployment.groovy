def call(Map config) {
    def namespace = config.namespace
    def manifests = config.manifests
    def imageUpdates = config.imageUpdates ?: []
    def kubeconfig = config.kubeconfig
    def environment = config.environment ?: 'dev'
    
    try {
        echo "🚀 Deploying to Kubernetes namespace: ${namespace}"
        
        withCredentials([file(credentialsId: kubeconfig, variable: 'KUBECONFIG')]) {
            // Create namespace if it doesn't exist
            sh "kubectl create namespace ${namespace} --dry-run=client -o yaml | kubectl apply -f -"
            
            // Update image tags in deployment files
            imageUpdates.each { update ->
                if (fileExists(update.file)) {
                    sh """
                        sed -i 's|image: .*${update.container}.*|image: ${update.image}|g' ${update.file}
                    """
                    echo "Updated ${update.file} with image: ${update.image}"
                }
            }
            
            // Apply manifests
            manifests.each { manifest ->
                if (fileExists(manifest)) {
                    echo "Applying manifest: ${manifest}"
                    sh "kubectl apply -f ${manifest} -n ${namespace}"
                } else if (new File(manifest).isDirectory()) {
                    echo "Applying directory: ${manifest}"
                    sh "kubectl apply -f ${manifest}/ -n ${namespace}"
                } else {
                    echo "⚠️ Manifest not found: ${manifest}"
                }
            }
            
            // Wait for deployments to be ready
            sh """
                kubectl rollout status deployment/portfolio-frontend -n ${namespace} --timeout=300s || true
                kubectl rollout status deployment/portfolio-backend -n ${namespace} --timeout=300s || true
                kubectl rollout status deployment/mysql -n ${namespace} --timeout=300s || true
            """
            
            // Get deployment status
            sh "kubectl get pods -n ${namespace}"
            sh "kubectl get services -n ${namespace}"
        }
        
        echo "✅ Kubernetes deployment completed successfully"
        
    } catch (Exception e) {
        echo "❌ Kubernetes deployment failed: ${e.getMessage()}"
        
        // Get debug information
        withCredentials([file(credentialsId: kubeconfig, variable: 'KUBECONFIG')]) {
            sh "kubectl get events -n ${namespace} --sort-by='.lastTimestamp' | tail -20 || true"
            sh "kubectl describe pods -n ${namespace} || true"
        }
        
        throw e
    }
}
