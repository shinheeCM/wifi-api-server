# wifi-api-server

```
    git add .
    git commit -m "server.js"
    git remote add origin https://github.com/shinheeCM/wifi-api-server.git
    git push -u origin main
    git checkout main
    git pull
    git merge master --allow-unrelated-histories
    git push origin main
```

# run node
```
    npm i
    sudo npm start
```

# APIS
```
    curl http://localhost:3000/api/wifi-networks
    curl http://localhost:3000/api/system-info

```

# docker build
```
    docker build -t wonbot/shinheeagv:wifi-api-server .
    docker run -d -p 3000:3000 --name wifi-api-container --rm --privileged wonbot/shinheeagv:wifi-api-server
    docker kill wifi-api-container
    docker rm wifi-api-container
    docker push wonbot/shinheeagv:wifi-api-server
    docker pull wonbot/shinheeagv:wifi-api-server
```
