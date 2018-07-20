#!/bin/bash -xe
export namespace=greeter
kubectl create ns ${namespace} || true
kubectl create secret generic greeter-mongo --from-literal=username=${MONGO_USER} --from-literal=password=${MONGO_PASS} --namespace=${namespace}
kubectl create -f deployment.yaml --namespace=${namespace}
kubectl create -f service.yaml --namespace=${namespace}
kubectl create -f prod-cert.yaml --namespace=${namespace}
kubectl create -f ingress-ssl.yaml --namespace=${namespace}


