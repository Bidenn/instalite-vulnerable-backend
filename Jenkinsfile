pipeline {
    agent any

    environment {
        scannerHome = tool 'jenkins-backend-tool'
    }

    stages {
        stage('SCM Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Bidenn/instalite-vulnerable-backend.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube Server') {
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Copy env-live to .env') {
            steps {
                sh '''
                if [ -f env-live ]; then
                    cp env-live .env
                    echo "env-live copied to .env successfully."
                else
                    echo "env-live file does not exist. Failing the stage."
                    exit 1
                fi
                '''
            }
        }

        stage('Remove Containers') {
            steps {
                // Bring down existing Docker containers
                sh 'docker-compose down || true'
            }
        }

        stage('Build and Start Containers') {
            steps {
                // Build and start containers
                sh 'docker-compose up --build -d'
            }
        }

        stage('Install npm Dependencies') {
            steps {
                // Execute npm install inside the running backend container
                sh 'docker exec app npm install'
                sh 'docker exec app npm install express'
            }
        }

        stage('ZAP Scan') {
            agent {
                docker {
                    image 'ghcr.io/zaproxy/zaproxy:stable' // Use the ZAP proxy Docker image
                    args '-u root --network host -v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:/zap/wrk:rw'
                }
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    // Perform ZAP baseline scan
                    sh 'zap-baseline.py -t http://localhost:5000 -r zapbaseline.html -x zapbaseline.xml'
                }
                // Copy and archive the ZAP scan results
                sh 'cp /zap/wrk/zapbaseline.html ./zapbaseline.html'
                sh 'cp /zap/wrk/zapbaseline.xml ./zapbaseline.xml'
                archiveArtifacts artifacts: 'zapbaseline.html'
                archiveArtifacts artifacts: 'zapbaseline.xml'
            }
        }
    }
}
