export interface CarType {
  id: string
  mark: string
  model: string
  engine: {
    volume: number
    fuel: string
    transmission: string
    power: number
  }
  drive: string
  equipmentName: string
  price: number
  createdAt: string
}

export interface MarkModelsType {
  model: string
}

export interface GroupedMarksType {
  mark: string
  _count: {
    id: number
  }
}