up: 
	skaffold dev


env: 
	kubectl create secret generic mongo-port --from-env-file=.env && kubectl create secret generic mongo-uri --from-env-file=.env && kubectl create secret generic jwt-secret --from-env-file=.env  && kubectl create secret generic natsconfig --from-env-file=.env 

reset: 
	minikube delete
	
stan: 
	cd /boards/nats-test && kubectl port-forward 