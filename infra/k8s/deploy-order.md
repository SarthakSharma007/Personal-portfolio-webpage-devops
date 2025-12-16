# Kubernetes Deployment Order

Deploy the resources in this order to avoid dependency issues:

1. **Namespace**
   ```bash
   kubectl apply -f namespace.yaml
   ```

2. **ConfigMap and Secret**
   ```bash
   kubectl apply -f configmap.yml
   kubectl apply -f secret.yml
   ```

3. **PersistentVolumeClaim**
   ```bash
   kubectl apply -f mysql-pvc.yml
   ```

4. **MySQL Database**
   ```bash
   kubectl apply -f mysql/
   ```

5. **Backend Service**
   ```bash
   kubectl apply -f backend/
   ```

6. **Frontend Service**
   ```bash
   kubectl apply -f frontend/
   ```

7. **Horizontal Pod Autoscalers (Optional)**
   ```bash
   kubectl apply -f hpas.yml
   ```

## Deploy All at Once
```bash
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yml
kubectl apply -f secret.yml
kubectl apply -f mysql-pvc.yml
kubectl apply -f mysql/
kubectl apply -f backend/
kubectl apply -f frontend/
kubectl apply -f hpas.yml
```

## Verify Deployment
```bash
kubectl get all -n portfolio-devops
kubectl get pvc -n portfolio-devops
kubectl get secrets -n portfolio-devops
```
