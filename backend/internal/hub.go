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

					h.Broadcast <- &message
				}
			}

			connectedClients := GetConnectedClients(c.RoomName)

			membersJson, err := json.Marshal(connectedClients)

			if err != nil {
				log.Println("Json marshalling error", err)
				break
			}

			memberMessage := Message{
				MessageType: MEMBERS,
				RoomName:    c.RoomName,
				Username:    c.Username,
				Content:     string(membersJson),
			}

			h.Broadcast <- &memberMessage

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
			if r, ok := Rooms[m.RoomName]; ok {

				for _, c := range r.Clients {
					if m.MessageType == MEMBERS {
						if c.Username == m.Username {
							// TODO: figure why write go routine is getting haulted (maybe becoz of unsafe read/write)
							// c.Messages <- m
							c.Conn.WriteJSON(m)
						}
					} else {
						if c.Username != m.Username {
							// TODO: figure why write go routine is getting haulted (maybe becoz of unsafe read/write)
							// c.Messages <- m
							c.Conn.WriteJSON(m)

						}
					}

				}
			}

		}
	}
}
