import { Card } from "../../card.model";

export interface CardRepository {
  saveCard(token: string, card: Card): Promise<void>
  getCard(token: string): Promise<Card | null>
}