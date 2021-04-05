import Province from '../Province.js'
import { sampleProvinceData } from '../util/data.js'

describe('Province 테스트', () => {
  let korea
  beforeEach(() => {
    korea = new Province(sampleProvinceData()) // 픽스처 설정
  })

  it('shortfall', () => {
    expect(korea.shortfall).toBe(5) // 검증
  })

  it('profit', () => {
    expect(korea.profit).toBe(230) // 검증
  })

  it('change production', () => {
    korea.producers[0].production = 20
    expect(korea.shortfall).toBe(-6)
    expect(korea.profit).toBe(292)
  })

  it('zero demand', () => {
    korea.demand = 0
    expect(korea.shortfall).toBe(-25)
    expect(korea.profit).toBe(0)
  })

  it('negative demand', () => {
    korea.demand = -1
    expect(korea.shortfall).toBe(-26)
    expect(korea.profit).toBe(-10)
  })

  it('empty string demand', () => {
    korea.demand = ''
    expect(korea.shortfall).toBeNaN()
    expect(korea.profit).toBeNaN()
  })
})

describe('No producers 테스트', () => {
  let noProducers
  beforeEach(() => {
    const data = {
      name: 'No producers',
      producers: [],
      demand: 30,
      price: 20,
    }

    noProducers = new Province(data)
  })

  it('shortfall', () => {
    expect(noProducers.shortfall).toBe(30)
  })

  it('profit', () => {
    expect(noProducers.profit).toBe(0)
  })
})
