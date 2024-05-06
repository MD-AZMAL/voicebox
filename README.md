# voicebox

Realtime voice chat applications, where users can create and join the voice room to chat. Built using NextJS, Golang

# Instructions to run localy

- Install the dependencies for the UI

```
cd ui/ & npm i
```

- Install the dependencies for backend

```
cd backend/ & go mod tidy
```

- Run the webserver

```
go run backend/cmd/main.go
```

- Run the UI

```
cd ui/
npm run dev
```

# Design choices

## UI

- Used shadcn ui for clean and modern look with Nexjs
- Used tailwind for styling
- Cleverly utilised the power of server components, react suspense for optimal performace
- Used web audio API for media and inbuilt web socket package for communicating with the server

## Backend

- Used golang with gorilla/websocket for high performace
- Used pool architecture to manage multiple rooms and track multiple clients
- Used go routines to handle various messages types for incomming websocket requests without blocking the main thread

# Major challenges

- Transmitting audio over to websocket was a challenge as typescript had issue handling the binary audio data. Solved it by converting the incomming media stream to chunks of base64 opus based encoded data, using this as string to transmit it in the websocket
- Websocket handler not dispatching messages sometimes. Solved it by using sync Locker to prevent issue of simultaneous Read and writes, further using go routines to increase the throughput
- Securing the websocket communication, as users can listen for other rooms they are not connected to. Solved it by tracking the associated clients with each room

# Salient features

- Easy to use UI, similar design to google meet
- Support multiple rooms, multiple clients, multiple clients in multiple rooms
- Instant feedback on user joining/leaving the room responsively
- Backend crud APIs for creating rooms, managed separately without affecting websocket processing
- go routine based worker pool and connection pool to track each client ad its connection information

# Future goals

- Switching to webRTC for better performance
- Snappy grid for incomming participants
- Muted/Unmuted/Speaking status
- using worker pool architecture in golang per client basis to further improve the throughput

# Submission Video

You can find the submission video in `__submission` directory or
[click here](/__submission/submission_video.mov)
