package internal

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Room struct {
	Name      string             `json:"name"`
	CreatedBy string             `json:"createdBy"`
	Clients   map[string]*Client `json:"clients"`
}

type RoomResponse struct {
	Name      string           `json:"name"`
	CreatedBy string           `json:"createdBy"`
	Clients   []ClientResponse `json:"clients"`
}

type Client struct {
	Conn     *websocket.Conn
	Username string `json:"username"`
	RoomName string `json:"room"`
	Messages chan *Message
	Mux      *sync.Mutex
}

type ClientResponse struct {
	Username string `json:"username"`
	RoomName string `json:"room"`
}

type MessageType string

const (
	REGISTERED   MessageType = "REGISTERED"
	UNREGISTERED MessageType = "UNREGISTERED"
	STREAMAUDIO  MessageType = "STREAMAUDIO"
	MEMBERS      MessageType = "MEMBERS"
	MICMUTED     MessageType = "MICMUTED"
	MICSTARTED   MessageType = "MICSTARTED"
)

type Message struct {
	MessageType MessageType `json:"messageType"`
	Content     string      `json:"content"`
	RoomName    string      `json:"roomName"`
	Username    string      `json:"username"`
}

type Hub struct {
	Register      chan *Client
	Unregister    chan *UnRegisterClientBody
	Broadcast     chan *Message
	SelfBroadcast chan *Message
}

type WsHandler struct {
	hub *Hub
	mux *sync.Mutex
}

type UnRegisterClientBody struct {
	Username string `json:"username"`
	RoomName string `json:"roomName"`
}

type RegisterClientBody struct {
	Username string `json:"username"`
	RoomName string `json:"roomName"`
}
