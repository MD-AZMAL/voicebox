package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/MD-AZMAL/voicebox/internal"
)

func init() {
	internal.InitRoom()
}

func main() {

	mux := &sync.Mutex{}
	hub := internal.CreateHub()

	wsHandler := internal.CreateWsHandler(hub, mux)

	go hub.Run(mux)

	http.HandleFunc("/get-rooms", internal.GetRoomHandler)
	http.HandleFunc("/create-room", internal.CreateRoomHandler)
	http.HandleFunc("/delete-room", internal.DeleteRoomHandler)
	http.HandleFunc("/ws/register", wsHandler.RegisterClient)
	http.HandleFunc("/ws/unregister", wsHandler.UnRegisterClient)

	log.Println("Listening on port : ", 8080)

	err := http.ListenAndServe(":8080", nil)

	if err != nil {
		log.Fatal("Error while creating server: ", err)
	}

}
