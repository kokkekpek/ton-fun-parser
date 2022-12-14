import Koa from 'koa'
import Router from '@koa/router'
import { Logger } from 'winston'
import { Db } from 'mongodb'
import { headers } from './headers'
import { health } from './method/health'
import { state } from './method/state'
import { summary } from './method/summary'
import { players } from './method/players'
import { bets } from './method/bets'
import { LogError } from '../log'

interface ApiConfig {
  port: number
  betsMaxLimit: number
}

export function api (logger: Logger, db: Db, config: ApiConfig): void {
  const app: Koa = new Koa()
  const router: Router = new Router()

  headers(app)

  health(router)
  state(router, db)
  summary(router, db)
  players(router, db)
  bets(router, db, config.betsMaxLimit)

  try {
    app.use(router.middleware()).listen(config.port)
  } catch (e: any) {
    logger.error(LogError.API_INITIALIZATION_FAILED, { data: e })
  }
}
