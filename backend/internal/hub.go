package internal

import (
	"log"
)

func CreateHub() *Hub {
	return &Hub{
		Register:   make(chan *Client),
		Unregister: make(chan *UnRegisterClientBody),
		Broadcast:  make(chan *Message, 1024),
	}
}

func (h *Hub) Run() {

	for {
		select {
		case c := <-h.Register:
			log.Println("in register", c)
			var message Message

			log.Println("dasdsad")
			if r, ok := Rooms[c.RoomName]; ok {
				log.Println(r, "ROOM", c, "CLIENT")
				if _, ok := r.Clients[c.Username]; !ok {
					r.Clients[c.Username] = c

					message = Message{
						MessageType: REGISTERED,
						RoomName:    c.RoomName,
						Username:    c.Username,
					}

				}
			}

			h.Broadcast <- &message

			log.Println("Still in register")

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
			log.Println("Recived broadcast : ", m)
			if r, ok := Rooms[m.RoomName]; ok {

				for _, c := range r.Clients {
					if c.Username != m.Username {
						c.Conn.WriteJSON(m)
					}

				}
			}
		}
	}
}
