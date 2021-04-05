class Producer {
  #province
  #cost
  #name
  #production

  constructor(province, data) {
    this.#province = province
    this.#cost = data.cost
    this.#name = data.name
    this.#production = data.production || 0
  }

  get name() {
    return this.#name
  }

  get cost() {
    return this.#cost
  }

  set cost(arg) {
    this.#cost = parseInt(arg)
  }

  get production() {
    return this.#production
  }

  set production(amountStr) {
    const amount = parseInt(amountStr)
    const newProduction = Number.isNaN(amount) ? 0 : amount

    this.#province.totalProduction += newProduction - this.#production
    this.#production = newProduction
  }
}

export default Producer
