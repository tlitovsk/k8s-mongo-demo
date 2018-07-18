#!/bin/bash -xe
#To get the root password run:
export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace mongo mongo-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)
export POD_NAME=$(kubectl get pods --namespace mongo -l "app=mongodb" -o jsonpath="{.items[1].metadata.name}")
kubectl port-forward --namespace mongo $POD_NAME 27017:27017 &
