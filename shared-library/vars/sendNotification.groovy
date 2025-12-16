def call(Map config) {
    def type = config.type ?: 'info'
    def message = config.message
    def channels = config.channels ?: ['slack']
    def environment = config.environment ?: 'dev'
    def includeLog = config.includeLog ?: false
    
    try {
        echo "📢 Sending ${type} notification: ${message}"
        
        def color = getColorForType(type)
        def emoji = getEmojiForType(type)
        
        channels.each { channel ->
            switch(channel) {
                case 'slack':
                    sendSlackNotification(message, color, emoji, environment, includeLog)
                    break
                    
                case 'email':
                    sendEmailNotification(message, type, environment, includeLog)
                    break
                    
                case 'teams':
                    sendTeamsNotification(message, color, environment)
                    break
                    
                default:
                    echo "Unknown notification channel: ${channel}"
            }
        }
        
        echo "✅ Notifications sent successfully"
        
    } catch (Exception e) {
        echo "❌ Failed to send notification: ${e.getMessage()}"
        // Don't fail the build for notification failures
    }
}

def getColorForType(type) {
    switch(type) {
        case 'success': return 'good'
        case 'failure': return 'danger'
        case 'warning': return 'warning'
        default: return '#439FE0'
    }
}

def getEmojiForType(type) {
    switch(type) {
        case 'success': return '✅'
        case 'failure': return '❌'
        case 'warning': return '⚠️'
        default: return 'ℹ️'
    }
}

def sendSlackNotification(message, color, emoji, environment, includeLog) {
    def attachment = [
        color: color,
        title: "${emoji} Jenkins Pipeline Notification",
        text: message,
        fields: [
            [title: "Job", value: env.JOB_NAME, short: true],
            [title: "Build", value: env.BUILD_NUMBER, short: true],
            [title: "Environment", value: environment, short: true],
            [title: "Branch", value: env.BRANCH_NAME ?: 'main', short: true]
        ],
        footer: "Jenkins CI/CD",
        ts: System.currentTimeMillis() / 1000
    ]
    
    if (includeLog) {
        attachment.fields.add([title: "Console Log", value: env.BUILD_URL + "console", short: false])
    }
    
    slackSend(
        channel: '#devops-alerts',
        attachments: [attachment]
    )
}

def sendEmailNotification(message, type, environment, includeLog) {
    def subject = "${type.toUpperCase()}: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}"
    def body = """
${message}

Job: ${env.JOB_NAME}
Build: ${env.BUILD_NUMBER}
Environment: ${environment}
Branch: ${env.BRANCH_NAME ?: 'main'}
Build URL: ${env.BUILD_URL}
"""
    
    if (includeLog) {
        body += "\nConsole Log: ${env.BUILD_URL}console"
    }
    
    emailext(
        subject: subject,
        body: body,
        to: 'devops-team@company.com'
    )
}

def sendTeamsNotification(message, color, environment) {
    office365ConnectorSend(
        webhookUrl: env.TEAMS_WEBHOOK_URL,
        message: message,
        color: color,
        status: "Pipeline ${currentBuild.currentResult}",
        factDefinitions: [
            [name: "Job", template: env.JOB_NAME],
            [name: "Build", template: env.BUILD_NUMBER],
            [name: "Environment", template: environment],
            [name: "Branch", template: env.BRANCH_NAME ?: 'main']
        ]
    )
}
