package internal

import (
	"bytes"
	"encoding/binary"
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

		if !ok {
			return
		}

		mux.Lock()
		c.Conn.WriteJSON(message)
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
		log.Println("RecieveMessage", string(m))
		mux.Unlock()

		if err != nil {
			log.Printf("error: %v", err)
			break
		}

		var message Message

		buf := &bytes.Buffer{}

		err = binary.Write(buf, binary.BigEndian, m)

		if err != nil {
			log.Printf("buffer error: %v", err)
			break
		}

		err = binary.Read(buf, binary.BigEndian, &message)

		log.Println("Unmarshalled message, ", message)
		log.Println("err", err)

		if err != nil {
			log.Printf("buffer error: %v", err)
			break
		}

		hub.Broadcast <- &message
	}
}
