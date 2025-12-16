def call(Map config) {
    def testType = config.testType ?: 'load'
    def targetUrl = config.targetUrl
    def duration = config.duration ?: '2m'
    def users = config.users ?: 10
    def rampUp = config.rampUp ?: '30s'
    
    try {
        echo "⚡ Running ${testType} test against: ${targetUrl}"
        
        switch(testType) {
            case 'load':
                sh """
                    k6 run --vus ${users} --duration ${duration} --ramp-up-duration ${rampUp} - <<EOF
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function() {
    let response = http.get('${targetUrl}');
    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 2s': (r) => r.timings.duration < 2000,
    });
    sleep(1);
}
EOF
                """
                break
                
            case 'stress':
                sh """
                    artillery quick --count ${users} --num ${duration.replaceAll('[^0-9]', '')} ${targetUrl}
                """
                break
                
            default:
                echo "Unknown test type: ${testType}"
        }
        
        echo "✅ Performance test completed"
        
    } catch (Exception e) {
        echo "❌ Performance test failed: ${e.getMessage()}"
        // Don't fail the build for performance test failures in dev environment
        if (env.DEPLOY_ENV == 'prod') {
            throw e
        } else {
            echo "⚠️ Continuing build despite performance test failure in ${env.DEPLOY_ENV} environment"
        }
    }
}
