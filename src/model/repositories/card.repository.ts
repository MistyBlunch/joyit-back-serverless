import { RedisClientType, RedisModules, RedisScripts, createClient } from "@redis/client";
import { Card } from "../card.model";
import { CardRepository } from "./interfaces/card.repository.interface";
import { RedisFunctions } from "redis";

export class RedisCardRepository implements CardRepository {
  client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>

  constructor() {
    this.client = createClient()
    this.initializeClient()
  }

  async saveCard(token: string, card: Card): Promise<void> {
    card.cvv = null;
    await this.client.set(token, JSON.stringify(card), {
      EX: 900,
    })
  }

  async getCard(token: string): Promise<Card | null> {
    const card = await this.client.get(token)
    if (card)
      return JSON.parse(card)

    return null
  }

  private async initializeClient() {
    this.client = await this.client.connect()
  }
}