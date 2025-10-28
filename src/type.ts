export interface Room {
  id: string
  name: string
  capacity: number
  active?: boolean
}

export interface Booking {
  id: string
  roomId: string
  roomName?: string
  bookedBy: string
  date: string
  time: string
  createdAt: string
}
