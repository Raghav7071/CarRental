#!/bin/bash

# Ensure the working AWS CLI is used
AWS_CLI=~/Library/Python/3.12/bin/aws
export AWS_DEFAULT_REGION="us-east-1"
export AWS_ACCOUNT_ID="192665532834"
export ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"

echo "Logging in to AWS ECR..."
$AWS_CLI ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_URI

echo "======================"
echo "Building and Pushing CLIENT..."
echo "======================"
cd client
docker build -t car-rental-client .
docker tag car-rental-client:latest $ECR_URI/car-rental-client:latest
docker push $ECR_URI/car-rental-client:latest
cd ..

echo "======================"
echo "Creating SERVER ECR Repository..."
echo "======================"
# Attempt to create the server repository if it doesn't exist
$AWS_CLI ecr create-repository --repository-name car-rental-server || true

echo "======================"
echo "Building and Pushing SERVER..."
echo "======================"
cd server
docker build -t car-rental-server .
docker tag car-rental-server:latest $ECR_URI/car-rental-server:latest
docker push $ECR_URI/car-rental-server:latest
cd ..

echo "======================"
echo "✅ Both images pushed successfully!"
echo "======================"
