package internal

import (
	"encoding/json"
	"net/http"
)

var (
	Rooms map[string]*Room
)

func InitRoom() {
	if Rooms == nil {

		Rooms = make(map[string]*Room, 0)

		Rooms["default"] = &Room{
			Name:      "default",
			CreatedBy: "",
			Clients:   make(map[string]*Client),
		}
	}
}

func GetRooms() []RoomResponse {
	roomsResponse := make([]RoomResponse, 0)

	for _, v := range Rooms {
		clientsResponse := make([]ClientResponse, 0)

		for _, c := range v.Clients {
			clientsResponse = append(clientsResponse, ClientResponse{
				Username: c.Username,
				RoomName: c.RoomName,
			})
		}

		roomsResponse = append(roomsResponse, RoomResponse{
			Name:      v.Name,
			CreatedBy: v.CreatedBy,
			Clients:   clientsResponse,
		})
	}

	return roomsResponse
}

func GetRoomHandler(w http.ResponseWriter, r *http.Request) {

	roomsJson, err := json.Marshal(GetRooms())

	if err != nil {
		http.Error(w, "JSON parse error", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(roomsJson)
}

type CreateRoomBody struct {
	Name      string `json:"name"`
	CreatedBy string `json:"createdBy"`
}

func CreateRoom(roomBody CreateRoomBody) bool {
	newRoom := Room{
		Name:      roomBody.Name,
		CreatedBy: roomBody.CreatedBy,
		Clients:   make(map[string]*Client),
	}

	Rooms[newRoom.Name] = &newRoom

	return true
}

func CreateRoomHandler(w http.ResponseWriter, r *http.Request) {
	var newRoom CreateRoomBody

	err := json.NewDecoder(r.Body).Decode(&newRoom)

	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if ok := CreateRoom(newRoom); ok {
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("{\"created\": true}"))
		return
	}

	http.Error(w, "Unable to create", http.StatusBadRequest)

}

type DeleteRoomBody struct {
	Name     string `json:"name"`
	Username string `json:"username"`
}

func DeleteRoom(roomToDelete DeleteRoomBody) bool {
	if val, ok := Rooms[roomToDelete.Name]; ok && val.CreatedBy == roomToDelete.Username {

		delete(Rooms, roomToDelete.Name)
		return true
	}

	return false

}

func DeleteRoomHandler(w http.ResponseWriter, r *http.Request) {

	var deleteRoomData DeleteRoomBody

	err := json.NewDecoder(r.Body).Decode(&deleteRoomData)

	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if ok := DeleteRoom(deleteRoomData); ok {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("{\"deleted\": true}"))

		return
	}

	http.Error(w, "Unable to delete", http.StatusBadRequest)
}

func GetConnectedClients(roomName string) []string {
	clientsResponse := make([]string, 0)

	for _, c := range Rooms[roomName].Clients {
		clientsResponse = append(clientsResponse, c.Username)
	}

	return clientsResponse
}
