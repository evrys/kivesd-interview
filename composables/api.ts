import { delay as _delay } from 'lodash-es'
import rawEmployeesData from '../assets/data.json'

async function delay(amount: number) {
  return new Promise(resolve => {
    _delay(resolve, amount)
  })
}

class KIVesDAPI {
  async login(password: string) {
    // Simulate login request
    await delay(1000)
    if (password !== 'KiVesd') {
      throw new Error('Invalid password')
    } else {
      return parseAndCleanEmployeeData(rawEmployeesData)
    }
  }
}

export const api = new KIVesDAPI()