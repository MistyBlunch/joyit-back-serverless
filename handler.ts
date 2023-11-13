import { CardTokenizationController } from './src/controllers/card-tokenization.controller'
import { RedisCardRepository } from './src/model/repositories/card.repository'
import { CardRepository } from './src/model/repositories/interfaces/card.repository.interface'
import { CardTokenizationService } from './src/services/card-tokenization.service'
import { BearerTokenService } from './src/services/shared/bearertoken.service'
import { CardService } from './src/services/shared/card.service'

async function main() {
  const cardRepository: CardRepository = new RedisCardRepository()

  const cardService = new CardService()
  const cardTokenizationService = new CardTokenizationService(cardService, cardRepository)
  const bearerTokenService = new BearerTokenService()
  const cardTokenizationController = new CardTokenizationController(
    cardTokenizationService,
    cardService,
    bearerTokenService
  )

  module.exports.createToken = cardTokenizationController.createToken
  module.exports.findByToken = cardTokenizationController.findByToken
}

main()