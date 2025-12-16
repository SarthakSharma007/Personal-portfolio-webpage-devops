pipeline {
    agent any

    environment {
        DEPLOY_PATH = 'D:\\ComputerScience\\Project\\Devops\\Deployment project 2'
        SERVER_PORT = '5000'
        CLIENT_PORT = '4578'
    }

    stages {

        stage('Download Artifacts') {
            steps {
                copyArtifacts(
                    projectName: 'Portfolio-CI-Pipeline',
                    selector: lastSuccessful(),
                    target: '.'
                )
            }
        }

        stage('Prepare Deployment') {
            steps {
                bat 'if not exist deploy\\client mkdir deploy\\client'
                bat 'if not exist deploy\\server mkdir deploy\\server'

                bat 'xcopy /E /I /Y client\\build deploy\\client'
                bat 'xcopy /E /I /Y server deploy\\server'

                bat '''
                    cd deploy\\server
                    if exist node_modules rmdir /s /q node_modules
                    call npm install --omit=dev
                '''

                writeFile file: 'deploy\\start.bat', text: """
@echo off
echo Starting Backend...
cd /d "%~dp0server"
start "Backend" /b cmd /c "node server.js > ..\\server.log 2>&1"

echo Starting Frontend...
cd /d "%~dp0client"
start "Frontend" /b cmd /c "npx serve -s . -l ${CLIENT_PORT} > ..\\client.log 2>&1"

exit /b 0
"""
            }
        }

        stage('Deploy to Production') {
    steps {
        input message: 'Deploy to Production?', ok: 'Deploy'

        script {

            // Kill ports (safe)
            bat '''
                for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a
                for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4578') do taskkill /F /PID %%a
                exit /b 0
            '''

            // ✅ SAFE PROCESS KILL (NO cmd.exe)
            bat '''
                taskkill /F /IM node.exe >nul 2>&1
                taskkill /F /IM npx.cmd  >nul 2>&1
                exit /b 0
            '''

            sleep(time: 5, unit: 'SECONDS')

            bat 'if exist "%DEPLOY_PATH%\\server\\.env" copy /Y "%DEPLOY_PATH%\\server\\.env" server_env_backup'

            bat '''
                if exist "%DEPLOY_PATH%" (
                    rmdir /s /q "%DEPLOY_PATH%" || exit /b 0
                )
                mkdir "%DEPLOY_PATH%"
            '''

            bat 'xcopy /E /I /Y deploy "%DEPLOY_PATH%"'

            bat 'if exist server_env_backup copy /Y server_env_backup "%DEPLOY_PATH%\\server\\.env"'

            withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
                bat 'cd /d "%DEPLOY_PATH%" && start /min start.bat'
            }

            env.SHOULD_CHECK_HEALTH = 'true'
        }
    }
}


        stage('Health Check') {
            when {
                environment name: 'SHOULD_CHECK_HEALTH', value: 'true'
            }
            steps {
                script {
                    echo 'Waiting for backend to start...'

                    retry(5) {
                        sleep(time: 10, unit: 'SECONDS')
                        bat '''
powershell -NoProfile -Command "try { $res = Invoke-WebRequest -Uri http://localhost:5000/health -UseBasicParsing; if ($res.StatusCode -ne 200) { exit 1 } } catch { exit 1 }"
'''
                    }

                    echo 'Backend health check passed'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
