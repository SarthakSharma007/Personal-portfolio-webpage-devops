def call(Map config) {
    def nodeVersion = config.nodeVersion ?: '18'
    def buildCommand = config.buildCommand ?: 'npm ci'
    def testCommand = config.testCommand ?: ''
    
    try {
        // Setup Node.js environment
        tool name: "NodeJS-${nodeVersion}", type: 'nodejs'
        
        echo "🔧 Installing dependencies..."
        sh buildCommand
        
        if (testCommand && testCommand.trim()) {
            echo "🧪 Running tests..."
            sh testCommand
        }
        
        echo "✅ Node.js build completed successfully"
        
    } catch (Exception e) {
        echo "❌ Node.js build failed: ${e.getMessage()}"
        throw e
    }
}
