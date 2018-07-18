def namespace = "greeter"
def label = "mypod-${UUID.randomUUID().toString()}"
podTemplate(label: label, serviceAccount: "jenkins", cloud: "example", yaml: """
apiVersion: v1 
kind: Pod 
metadata: 
    name: jenkins-slave-nodejs 
spec: 
    containers: 
      - name: jnlp 
        image: tlitovsk/jenkins-jnlp:latest
        imagePullPolicy: Always
        env: 
          - name: DOCKER_HOST 
            value: tcp://localhost:2375 
      - name: dind-daemon 
        image: docker:18-dind 
        resources: 
            requests: 
                cpu: 20m 
                memory: 512Mi 
        securityContext: 
            privileged: true 
        volumeMounts: 
          - name: docker-graph-storage 
            mountPath: /var/lib/docker 
    volumes: 
      - name: docker-graph-storage 
        emptyDir: {}
"""
)
{
    node(label) {
        try {
            stage('Checkout'){
                checkout scm
            }

            parallel lint :{
                stage('Lint Dockerfiles')
                {
                    sh 'dockerlint Dockerfile'
                    sh 'dockerlint TestContainer/Dockerfile'
                }
            } , test :{
                stage('Test'){
                    sh 'node -v'
                    sh 'npm install'
                    withCredentials([usernamePassword(credentialsId: 'mongo-greeter', passwordVariable: 'MONGO_PASS', usernameVariable: 'MONGO_USER')]) {
                        env.MONGO_HOST='mongo-mongodb.mongo.svc.cluster.local'
                        sh 'printenv'
                        sh 'npm test'
                    }
                    junit('junit.xml')
                }
            }
            if (env.BRANCH_NAME != 'master') {
                stage ('SonarQube analysis')
                {
                    withSonarQubeEnv('QubeR') {
                    // requires SonarQube Scanner for Maven 3.2+
                        sh '/usr/lib/node_modules/sonarqube-scanner/dist/bin/sonar-scanner'
                    }
                }
            }
            stage('Build'){
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub'){
                        shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
                        def hello_image = docker.build("tlitovsk/greeter:${shortCommit}")
                        currentBuild.result = "SUCCESS"
                        hello_image.push()
                    }
            }
        }
        catch (err) {
            currentBuild.result = "FAILURE"
            shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
            testNamespace = "${namespace}-${shortCommit}-${BUILD_NUMBER}"
            sh "kubectl delete ns ${testNamespace} || true"
            throw err
        }

    }
}