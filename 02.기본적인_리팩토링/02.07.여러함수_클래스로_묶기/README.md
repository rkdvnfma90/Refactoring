# 여러 함수 클래스로 묶기

## 배경

함수 호출 시 인수로 전달되는 공통 데이터를 중심으로 엮이는 함수 무리가 있다면 클래스 하나로 묶을 수 있다. 클래스로 묶으면 이 함수들이 공유하는 공통의 환경을 더 명확하게 표현할 수 있고 각 함수에 전달되는 인수를 줄여서 객체 안에서의 함수 호출을 간결하게 만들 수 있다.

<br/>
<br/>

## 절차

1. 함수들이 공유하는 공통 데이터를 캡슐화 한다. (매개변수 객체 만들기)
2. 공통 레코드를 사용하는 함수 각각을 새 클래스로 옮긴다.
3. 데이터를 조작하는 로직들은 함수로 추출해서 새 클래스로 옮긴다.

<br/>
<br/>

## 예시

어떠한 측정값을 아래의 객체 형태로 기록한다고 해보자.

```javascript
reading = { customer: 'aB', quantity: 50, month: 5, year: 2021 }
```

이러한 데이터로 비슷한 연산을 수행하는 부분이 많아서, 기본요금을 계산하는 코드를 찾아봤다.

```javascript
// 고객 1
const aReading = acquireReading()
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity

// 고객 2 - 여기서도 기본요금 계산 공식이 똑같이 등장한다.
const aReading = acquireReading()
const base = baseRate(aReading.month, aReading.year) * aReading.quantity
const taxableCharge = Math.max(0, base - taxThreshold(aReading.year))

// 고객 3
const aReading = acquireReading()
const basicChargeAmount = calculateBaseCharge(aReading)

function calculateBaseCharge(aReading) {
  return baseRate(aReading.month, aReading.year) * aReading.quantity
}
```

이 경우 1,2번 고객도 3번의 `calculateBaseCharge` 함수를 사용하도록 고칠 수 있을 것이다.

<br/>
<br/>

## 절차

1. 먼저 레코드를 클래스로 변환하기 위해 레코드를 캡슐화 한다.

```javascript
class Reading {
  #customer
  #quantity
  #month
  #year

  constructor(data) {
    this.#customer = data.customer
    this.#quantity = data.quantity
    this.#month = data.month
    this.#year = data.year
  }

  get customer() {
    return this.#customer
  }
  get quantity() {
    return this.#quantity
  }
  get month() {
    return this.#month
  }
  get year() {
    return this.#year
  }
}
```

2. 이미 만들어져 있는 `calculateBaseCharge` 먼저 옮긴다. 새 클래스를 사용하려면 데이터를 얻자마자 객체로 만들어야 한다.

```javascript
// 고객 3
const rawReading = acquireReading()
const aReading = new Reading(rawReading)
const basicChargeAmount = calculateBaseCharge(aReading)
```

그 다음 `calculateBaseCharge` 함수를 Reading 클래스로 옮기고 원한다면 이름을 변경한다. (`baseCharge`)

```javascript
class Reading {
  #customer
  #quantity
  #month
  #year

  constructor(data) {
    this.#customer = data.customer
    this.#quantity = data.quantity
    this.#month = data.month
    this.#year = data.year
  }

  baseCharge() {
    return baseRate(this.month, this.year) * this.quantity
  }

  get customer() {
    return this.#customer
  }
  get quantity() {
    return this.#quantity
  }
  get month() {
    return this.#month
  }
  get year() {
    return this.#year
  }
}

// 고객 3
const rawReading = acquireReading()
const aReading = new Reading(rawReading)
const basicChargeAmount = aReading.baseCharge
```

이제 1,2번 고객에서 중복된 계산 코드를 고쳐 메소드를 호출하게 한다.

```javascript
// 1번 고객
const rawReading = acquireReading()
const aReading = new Reading(rawReading)
const baseCharge = aReading.baseCharge

// 2번 고객
const rawReading = acquireReading()
const aReading = new Reading(rawReading)
const taxableCharge = Math.max(
  0,
  aReading.baseCharge - taxThreshold(aReading.year)
)
```

3. 이어서 세금을 부과할 소비량을 계산하는 코드를 함수로 추출하여 Reading 클래스로 옮긴다.

```javascript
class Reading {
  #customer
  #quantity
  #month
  #year

  constructor(data) {
    this.#customer = data.customer
    this.#quantity = data.quantity
    this.#month = data.month
    this.#year = data.year
  }

  baseCharge() {
    return baseRate(this.month, this.year) * this.quantity
  }

  taxableChargeFn() {
    return Math.max(0, this.baseCharge - taxThreshold(this.year))
  }

  get customer() {
    return this.#customer
  }
  get quantity() {
    return this.#quantity
  }
  get month() {
    return this.#month
  }
  get year() {
    return this.#year
  }
}
```

파생데이터 모두 필요한 시점에 계산되게 만들었으니 저장된 데이터를 갱신하더라도 문제 생길 일 없다. 프로그램의 다른 부분에서 데이터를 갱신할 가능성이 꽤 있을 땐 클래스로 묶어두면 큰 도움이 된다.
