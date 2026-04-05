# Exodus Rush API Gateway

API Gateway for the Exodus Rush game. This service acts as the entry point for all client requests and routes traffic to the appropriate backend microservices.

## Overview

The API Gateway is built with Node.js and Express, providing a unified interface for accessing multiple backend services in the Exodus Rush game infrastructure.

## Architecture

- **Technology:** Node.js, Express, http-proxy-middleware
- **Port:** 8080
- **Purpose:** Route client requests to backend microservices

## Routes

| Method | Route | Target Service | Description |
|--------|-------|---------------|-------------|
| POST | `/sea/split` | sea-state-service:8080 | Split the sea for safe passage |
| GET | `/sea/status` | sea-state-service:8080 | Check sea state status |
| POST | `/character/move` | character-service:8081 | Move character position |
| GET | `/terrain/validate` | terrain-service:8082 | Validate terrain coordinates |
| POST | `/auth/login` | auth-service:8083 | Authenticate user |
| GET | `/health` | - | Health check endpoint |

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for containerization)
- kubectl (for Kubernetes deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables (optional):**
   ```bash
   export PORT=8080
   export SEA_STATE_SERVICE=http://localhost:8080
   export CHARACTER_SERVICE=http://localhost:8081
   export TERRAIN_SERVICE=http://localhost:8082
   export AUTH_SERVICE=http://localhost:8083
   ```

3. **Run the service:**
   ```bash
   npm start
   ```

4. **Run in development mode with auto-reload:**
   ```bash
   npm run dev
   ```

5. **Test the health endpoint:**
   ```bash
   curl http://localhost:8080/health
   ```

### Docker Build

1. **Build the Docker image:**
   ```bash
   docker build -t stealthymcstelath/exodus-rush-api-gateway:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:8080 stealthymcstelath/exodus-rush-api-gateway:latest
   ```

3. **Push to Docker Hub:**
   ```bash
   docker push stealthymcstelath/exodus-rush-api-gateway:latest
   ```

### Kubernetes Deployment

1. **Apply the deployment:**
   ```bash
   kubectl apply -f k8s/deployment.yaml
   ```

2. **Apply the service:**
   ```bash
   kubectl apply -f k8s/service.yaml
   ```

3. **Check deployment status:**
   ```bash
   kubectl get pods -l app=api-gateway
   kubectl get svc api-gateway
   ```

4. **View logs:**
   ```bash
   kubectl logs -l app=api-gateway -f
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8080 | Port the gateway listens on |
| SEA_STATE_SERVICE | http://sea-state-service:8080 | Sea state service endpoint |
| CHARACTER_SERVICE | http://character-service:8081 | Character service endpoint |
| TERRAIN_SERVICE | http://terrain-service:8082 | Terrain service endpoint |
| AUTH_SERVICE | http://auth-service:8083 | Auth service endpoint |
| NODE_ENV | production | Node environment |

## Features

- **Request Proxying:** Forwards requests to appropriate backend services
- **Error Handling:** Comprehensive error handling with meaningful error messages
- **Logging:** Request logging with Morgan and custom logging middleware
- **Health Checks:** Built-in health check endpoint for monitoring
- **CORS:** Enabled for cross-origin requests
- **Graceful Shutdown:** Handles SIGTERM signals properly
- **Security:** Runs as non-root user in container

## API Examples

### Split the Sea
```bash
curl -X POST http://localhost:8080/sea/split \
  -H "Content-Type: application/json" \
  -d '{"location": "red-sea", "power": 100}'
```

### Check Sea Status
```bash
curl http://localhost:8080/sea/status
```

### Move Character
```bash
curl -X POST http://localhost:8080/character/move \
  -H "Content-Type: application/json" \
  -d '{"x": 100, "y": 200}'
```

### Validate Terrain
```bash
curl "http://localhost:8080/terrain/validate?x=100&y=200"
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "moses", "password": "exodus"}'
```

### Health Check
```bash
curl http://localhost:8080/health
```

## Kubernetes Configuration

The service is deployed with:
- **Replicas:** 2 (for high availability)
- **Service Type:** LoadBalancer
- **Resource Limits:** 256Mi memory, 200m CPU
- **Health Probes:** Liveness and readiness probes configured

## Monitoring

The gateway includes:
- HTTP request logging (Morgan combined format)
- Custom request logging with timestamps
- Error logging for proxy failures
- Health endpoint for external monitoring

## Error Responses

All proxy errors return a 502 Bad Gateway response with details:
```json
{
  "error": "Bad Gateway",
  "message": "Unable to reach <service-name>",
  "service": "<service-name>"
}
```

## Development

### Project Structure
```
api-gateway/
├── src/
│   └── index.js          # Main application file
├── k8s/
│   ├── deployment.yaml   # Kubernetes deployment
│   └── service.yaml      # Kubernetes service
├── Dockerfile            # Container image definition
├── package.json          # Dependencies and scripts
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## License

MIT

## Author

StealthyMcstelath
