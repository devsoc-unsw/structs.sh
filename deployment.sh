rsync -avz --exclude 'debugger/src/__pycache__' --exclude 'client/node_modules' --exclude '.git'  --exclude '.env' \
-e "ssh -i ~/.ssh/structs-deploy.pem" \
. ubuntu@ec2-3-25-92-212.ap-southeast-2.compute.amazonaws.com:~/app
