package internal

import (
	"encoding/json"
	"log"
	"sync"
)

func CreateHub() *Hub {
	return &Hub{
		Register:      make(chan *Client),
		Unregister:    make(chan *UnRegisterClientBody),
		Broadcast:     make(chan *Message, 1024),
		SelfBroadcast: make(chan *Message, 1024),
	}
}

func (h *Hub) Run(mux *sync.Mutex) {

	for {
		select {
		case c := <-h.Register:
			var message Message

			if r, ok := Rooms[c.RoomName]; ok {
				if _, ok := r.Clients[c.Username]; !ok {
					r.Clients[c.Username] = c

					message = Message{
						MessageType: REGISTERED,
						RoomName:    c.RoomName,
						Username:    c.Username,
					}

				}
			}

			connectedClients := GetConnectedClients(c.RoomName)

			membersJson, err := json.Marshal(connectedClients)

			if err != nil {
				log.Println("Json parse error", err)
				break
			}

			selfMessage := Message{
				MessageType: MEMBERS,
				RoomName:    c.RoomName,
				Username:    c.Username,
				Content:     string(membersJson),
			}

			log.Println(selfMessage)

			h.SelfBroadcast <- &selfMessage
			h.Broadcast <- &message

		case c := <-h.Unregister:
			var message Message

			if r, ok := Rooms[c.RoomName]; ok {
				if rc, ok := r.Clients[c.Username]; ok {
					if len(r.Clients) != 0 {
						message = Message{
							MessageType: UNREGISTERED,
							RoomName:    c.RoomName,
							Username:    c.Username,
						}
					}

					delete(r.Clients, c.Username)
					close(rc.Messages)
				}
			}

			h.Broadcast <- &message

		case m := <-h.Broadcast:
			log.Println("in broadcast ", m.MessageType)
			if r, ok := Rooms[m.RoomName]; ok {

				for _, c := range r.Clients {
					if c.Username != m.Username {
						// mux.Lock()
						// c.Messages <- m
						c.Conn.WriteJSON(m)
						// mux.Unlock()

					}

				}
			}

		case m := <-h.SelfBroadcast:
			log.Println("in self broadcast ", m.MessageType)

			if r, ok := Rooms[m.RoomName]; ok {

				for _, c := range r.Clients {
					if c.Username == m.Username {
						// mux.Lock()

						// c.Messages <- m
						c.Conn.WriteJSON(m)
						// mux.Unlock()

					}

				}
			}
		}
	}
}
