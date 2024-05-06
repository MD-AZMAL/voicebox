export interface Message {
  messageType: "REGISTERED" | "UNREGISTERED" | "STREAMAUDIO" | "MEMBERS";
  content: string;
  username: string;
  roomName: string;
}

export interface Room {
  name: string;
  createdBy: string;
  clients: { username: string; roomName: string }[];
}
