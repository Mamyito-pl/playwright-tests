shell:
	docker exec -it playwright-tests-playwright-service-1 bash
build:
	docker buildx build --platform linux/amd64 -t ghcr.io/dmytrotus/node22:playwright .
push:
	docker push ghcr.io/dmytrotus/node22:playwright
