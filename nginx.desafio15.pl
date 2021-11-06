#upstream api {
#	server localhost:8082;
#	server localhost:8083;
#	server localhost:8084;
#	server localhost:8085;
#}

server {
	
  listen 81;
  listen [::]:81;
  server_name localhost;

	location / {
		proxy_pass http://localhost:8081; 
		proxy_http_version 1.1; 
		proxy_set_header Upgrade $http_upgrade; 
		proxy_set_header Connection 'upgrade'; 
		proxy_set_header Host $host; 
		proxy_cache_bypass $http_upgrade; 
	}

	location /api {
		proxy_pass http://api; 
		proxy_http_version 1.1; 
		proxy_set_header Upgrade $http_upgrade; 
		proxy_set_header Connection 'upgrade'; 
		proxy_set_header Host $host; 
		proxy_cache_bypass $http_upgrade; 
	}
}