# Makefile for managing both backend and frontend services

# Variables
BACKEND_DIR = cmd
FRONTEND_DIR = frontend

# Default target
all: run-backend run-frontend

# Backend targets
run-backend:
	cd $(BACKEND_DIR) && go run main.go

build-backend:
	cd $(BACKEND_DIR) && go build -o ../bin/server main.go

test-backend:
	cd $(BACKEND_DIR) && go test ./...

# Frontend targets
run-frontend:
	cd $(FRONTEND_DIR) && npm run dev

install-frontend:
	cd $(FRONTEND_DIR) && npm install

# Combined targets
run-dev: 
	make -j 2 run-backend run-frontend

# Clean up
clean:
	rm -rf bin/
	cd $(FRONTEND_DIR) && rm -rf node_modules/

.PHONY: all run-backend build-backend test-backend run-frontend install-frontend run-dev clean