sudo curl -L "https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


sudo apt-get update
sudo apt-get install docker.io -y
sudo systemctl start docker


rsync -avz --exclude 'debugger/src/__pycache__' --exclude 'client/node_modules' --exclude '.git'  --exclude '.env' \
-e "ssh -i ~/.ssh/struct-deploy.pem" \
. ubuntu@ec2-54-80-88-177.compute-1.amazonaws.com:~/app
