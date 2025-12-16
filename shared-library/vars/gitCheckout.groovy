def call(Map config) {
    checkout([
        $class: 'GitSCM',
        branches: [[name: config.branch ?: 'main']],
        userRemoteConfigs: [[
            url: config.url,
            credentialsId: config.credentialsId ?: ''
        ]],
        extensions: [
            [$class: 'CleanBeforeCheckout'],
            [$class: 'CloneOption', depth: config.depth ?: 1, shallow: true]
        ]
    ])
    
    echo "✅ Successfully checked out ${config.branch ?: 'main'} from ${config.url}"
}
