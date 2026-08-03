# Nginx gateway

## Goal

Expose one browser origin while keeping the application as separate services:

```text
http://localhost:8080/          -> Vite client (client:3000)
http://localhost:8080/api/...   -> TypeScript API (server:8001)
http://localhost:8080/auth/...  -> TypeScript API (server:8001)
http://localhost:8080/dapi/...  -> Python Socket.IO debugger (debugger:8000)
```

Nginx is a reverse proxy. It does not combine the Python and TypeScript
processes; it gives them one public entry point. PostgreSQL remains private to
the Compose network.

## Local configuration

Create `nginx/nginx.dev.conf`:

```nginx
events {}

http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    upstream client_backend { server client:3000; }
    upstream api_backend { server server:8001; }
    upstream debugger_backend { server debugger:8000; }

    server {
        listen 80;
        server_name _;
        client_max_body_size 32k;

        location ^~ /api/ {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location ^~ /auth/ {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location ^~ /dapi {
            proxy_pass http://debugger_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $http_host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_buffering off;
            proxy_read_timeout 3600s;
        }

        location / {
            proxy_pass http://client_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $http_host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

Do not add a trailing URI to `proxy_pass`. The upstream must receive the
original `/api/...` or `/dapi/...` path. The `/dapi` location also needs the
WebSocket headers because Socket.IO can upgrade from HTTP polling to WebSocket.

Add the gateway to `docker-compose.yml`:

```yaml
nginx:
  image: nginx:1.30.4-alpine
  depends_on:
    - client
    - server
    - debugger
  ports:
    - "8080:80"
  volumes:
    - ./nginx/nginx.dev.conf:/etc/nginx/nginx.conf:ro
```

Use `expose` instead of host `ports` for `client`, `server`, and `debugger`:

```yaml
client:
  expose: ["3000"]

server:
  expose: ["8001"]

debugger:
  expose: ["8000"]
```

Set the server's trusted public origin to the gateway:

```yaml
PUBLIC_APP_ORIGIN: http://localhost:8080
```

## Client configuration

API calls and Socket.IO should default to the page's current origin:

```ts
export const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? '';
```

```ts
const configuredUrl = import.meta.env.VITE_DEBUGGER_URL;
const socket = configuredUrl
  ? io(configuredUrl, { path: '/dapi' })
  : io({ path: '/dapi' });
```

Keep `VITE_SERVER_URL` and `VITE_DEBUGGER_URL` as optional overrides for direct
backend development. A direct override also requires temporarily publishing
that backend port. Do not set either variable in the normal gateway flow.

Restrict the Python Socket.IO `cors_allowed_origins` setting to the gateway
origin (`http://localhost:8080` locally and the HTTPS site origin in
production); do not leave `*` in a public deployment.

## Verification

```sh
docker compose run --rm nginx nginx -t
docker compose config
docker compose up --build

curl -i http://localhost:8080/api/retrieveWorkspaces
curl -i "http://localhost:8080/dapi/?EIO=4&transport=polling"
```

The migration must exit successfully, the TypeScript server must listen on
`8001`, and the Socket.IO handshake should return a payload beginning with
`0{"sid":...}`. Open the application at `http://localhost:8080`.

## Production

`client/Dockerfile.prod` already serves the built client with Nginx. For
production, put the `/api`, `/auth`, and `/dapi` proxy locations in
`client/nginx.conf`, keep all upstream containers on the same network, and keep
the SPA fallback:

```nginx
location / {
    try_files $uri /index.html;
}
```

Use the deployed HTTPS origin for `PUBLIC_APP_ORIGIN` and the debugger's
allowed origin.

## Security boundary

The debugger compiles and executes user-provided C code. Nginx does not make
that execution safe. Before exposing `/dapi` publicly, require authentication,
rate and connection limits, process/resource limits, and an enabled sandbox.
Snapshot capture and restore must remain independent of debugger state.
