#!/bin/bash

echo "Deploying Portfolio Application to Kubernetes..."

# Change to the k8s directory
cd "$(dirname "$0")"

# Deploy in correct order
echo "1. Creating namespace..."
kubectl apply -f namespace.yaml

echo "2. Creating ConfigMap and Secret..."
kubectl apply -f configmap.yml
kubectl apply -f secret.yml

echo "3. Creating PersistentVolumeClaim..."
kubectl apply -f mysql-pvc.yml

echo "4. Deploying MySQL..."
kubectl apply -f mysql/

echo "5. Waiting for MySQL to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mysql -n portfolio-devops

echo "6. Deploying Backend..."
kubectl apply -f backend/

echo "7. Waiting for Backend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/portfolio-backend -n portfolio-devops

echo "8. Deploying Frontend..."
kubectl apply -f frontend/

echo "9. Deploying HPAs..."
kubectl apply -f hpas.yml

echo "Deployment complete!"
echo ""
echo "Check status with:"
echo "kubectl get all -n portfolio-devops"
echo ""
echo "Get external IP with:"
echo "kubectl get svc portfolio-frontend-service -n portfolio-devops"
