import Province from '../Province.js'
import { sampleProvinceData } from '../util/data.js'

describe('Province 테스트', () => {
  it('shortfall', () => {
    const korea = new Province(sampleProvinceData()) // 픽스처 설정
    expect(korea.shortfall).toBe(5) // 검증
  })
})
