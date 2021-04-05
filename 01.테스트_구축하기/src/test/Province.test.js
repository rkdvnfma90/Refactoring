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
})
