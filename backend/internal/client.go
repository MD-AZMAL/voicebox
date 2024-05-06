package internal

import (
	"encoding/json"
	"log"
	"sync"
)

func (c *Client) SendMessage(mux *sync.Mutex) {
	defer func() {
		c.Conn.Close()
	}()

	for {
		message, ok := <-c.Messages
		log.Println("SendMessage", message)
		log.Println(c)

		if !ok {
			return
		}

		mux.Lock()
		err := c.Conn.WriteJSON(message)
		log.Println(err, "err")
		mux.Unlock()

	}
}

func (c *Client) ReadMessage(hub *Hub, mux *sync.Mutex) {
	defer func() {
		log.Println("In defer reciveve message")
		hub.Unregister <- &UnRegisterClientBody{
			Username: c.Username,
			RoomName: c.RoomName,
		}
		c.Conn.Close()
	}()

	for {
		mux.Lock()
		_, m, err := c.Conn.ReadMessage()
		// log.Println("RecieveMessage", string(m))
		mux.Unlock()

		if err != nil {
			log.Printf("error: %v", err)
			break
		}

		var message Message

		err = json.Unmarshal(m, &message)

		if err != nil {
			log.Printf("json error: %v", err)
			break
		}

		log.Println("Parsed Message", message.MessageType)

		hub.Broadcast <- &message
	}
}
