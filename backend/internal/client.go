package internal

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

func (c *Client) sendToSocket(m *Message) {
	c.Mux.Lock()
	defer func() {
		c.Mux.Unlock()
	}()

	err := c.Conn.WriteJSON(m)
	if err != nil {
		log.Println("Error in writing complete ", err)
	}
}

func (c *Client) readFromSocket() (int, []byte, error) {
	c.Mux.Lock()
	defer c.Mux.Unlock()
	t, m, err := c.Conn.ReadMessage()
	return t, m, err
}

func (c *Client) SendMessage() {
	defer func() {
		c.Conn.Close()
	}()

	for {
		message, ok := <-c.Messages

		if !ok {
			return
		}

		c.sendToSocket(message)

	}
}

func (c *Client) ReadMessage(hub *Hub) {
	defer func() {
		hub.Unregister <- &UnRegisterClientBody{
			Username: c.Username,
			RoomName: c.RoomName,
		}
		c.Conn.Close()
	}()

	for {
		_, m, err := c.readFromSocket()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Println("Error reading from socket", err)
			}
			break
		}

		var message Message

		err = json.Unmarshal(m, &message)

		if err != nil {
			log.Println("json marshalling error", err)
			break
		}

		hub.Broadcast <- &message
	}
}
