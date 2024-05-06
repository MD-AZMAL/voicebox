package internal

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func CreateWsHandler(h *Hub, m *sync.Mutex) *WsHandler {
	return &WsHandler{
		hub: h,
		mux: m,
	}
}

func (h *WsHandler) RegisterClient(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		http.Error(w, "Unable to upgrade to websockets", http.StatusBadRequest)
		return
	}

	username := r.URL.Query().Get("username")
	roomName := r.URL.Query().Get("roomName")

	client := &Client{
		Conn:     conn,
		Username: username,
		RoomName: roomName,
		Messages: make(chan *Message),
	}

	log.Println(client)

	h.hub.Register <- client

	// go client.SendMessage(h.mux)
	go client.ReadMessage(h.hub, h.mux)
}

func (h *WsHandler) UnRegisterClient(w http.ResponseWriter, r *http.Request) {
	_, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		http.Error(w, "Unable to upgrade to websockets", http.StatusBadRequest)
		return
	}

	username := r.URL.Query().Get("username")
	roomName := r.URL.Query().Get("roomName")

	c := UnRegisterClientBody{
		Username: username,
		RoomName: roomName,
	}

	h.hub.Unregister <- &c
}
