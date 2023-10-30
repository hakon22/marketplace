install:
	npm -C backend ci && npm -C frontend ci

start:
	pm2 start "make start-backend" -n marketplace

start-local:
	npm run build --prefix backend && npm run start-local --prefix backend

start-backend:
	npm run start --prefix backend

start-frontend:
	npm run start --prefix frontend

test:
	npm test --prefix frontend

test-coverage:
	npm test --prefix frontend -- --coverage --coverageProvider=v8

.PHONY: test