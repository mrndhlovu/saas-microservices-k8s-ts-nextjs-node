up: 
	skaffold dev
	
build: 
	cd $(f) && docker build . && docker push ndhlovu/$(d) -a

env: 
	kubectl create secret generic env-config --from-env-file=.env 

stan: 
	cd /boards/nats-test && kubectl port-forward 
	
controller:
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/cloud/deploy.yaml
	
init:
	make controller && make env