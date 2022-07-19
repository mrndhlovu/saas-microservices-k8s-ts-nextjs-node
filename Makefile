up: 
	skaffold dev
	
init: 
	cd accounts-service && npm install && cd ../auth-service && npm install && cd ../board-service && npm install && cd ../client && npm install && cd ../email-service && npm install && cd ../payments-service  && npm install && cd ..	

start: 
	cd accounts-service && npm run start && cd ../auth-service && npm run start && cd ../board-service && npm run start && cd ../client && npm run start && cd ../email-service && npm run start && cd ../payments-service  && npm run start && cd ..


env: 
	kubectl create secret generic mongo-port --from-env-file=.env && kubectl create secret generic mongo-uri --from-env-file=.env && kubectl create secret generic jwt-secret --from-env-file=.env  && kubectl create secret generic natsconfig --from-env-file=.env 

reset: 
	minikube delete

stan: 
	cd /boards/nats-test && kubectl port-forward 