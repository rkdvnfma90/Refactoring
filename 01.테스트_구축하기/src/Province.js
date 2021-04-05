import Producer from './Producer.js'

class Province {
  #name
  #producers
  #totalProduction
  #demand
  #price

  constructor(doc) {
    this.#name = doc.name
    this.#producers = []
    this.#totalProduction = 0
    this.#demand = doc.demand
    this.#price = doc.Province
    doc.producers.forEach((data) => this.addProducer(new Producer(this, data)))
  }

  addProducer(arg) {
    this.#producers.push(arg)
    this.#totalProduction += arg.production
  }

  get name() {
    return this.#name
  }

  get producers() {
    return this.#producers
  }

  get totalProduction() {
    return this.#totalProduction
  }

  set totalProduction(arg) {
    this.#totalProduction = arg
  }

  get demand() {
    return this.#demand
  }

  set demand(arg) {
    this.#demand = parseInt(arg)
  }

  get price() {
    return this.#price
  }

  set price(arg) {
    this.#price = parseInt(arg)
  }

  // 생산 부족분 계산
  get shortfall() {
    return this.demand - this.totalProduction
  }

  // 수익 계산
  get profit() {
    return this.demandValue - this.demandCost
  }

  get demandValue() {
    return this.satisfiedDemand * this.price
  }

  get satisfiedDemand() {
    return Math.min(this.demand, this.totalProduction)
  }

  get demandCost() {
    let remainingDemand = this.demand
    let result = 0

    this.producers
      .sort((a, b) => a.cost - b.cost)
      .forEach((p) => {
        const contribution = Math.min(remainingDemand, p.production)
        remainingDemand -= contribution
        result += contribution * p.cost
      })

    return result
  }
}

export default Province
