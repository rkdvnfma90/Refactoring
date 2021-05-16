# 매개변수 객체 만들기

## 배경

데이터 항목 여러개가 이 함수 ~ 저 함수 몰려다니는 경우 데이터 구조 하나로 모을 수 있다.
데이터 뭉치를 데이투 구조로 묶으면 데이터 사이의 관계가 명확해 지고, 매개변수의 수가 줄어든다.

<br/>
<br/>

## 절차

1. 적당한 데이터 구조가 없다면 새로 만든다. (클래스로 만들 수 도 있다.)
2. 테스트
3. 함수 선언 바꾸기로 새 데이터 구조를 매개변수로 추가한다.
4. 테스트
5. 함수 호출 시 새로운 데이터 구조를 넘기도록 수정한다.
6. 기존 매개변수를 사용하던 코드를 새 데이터 구조를 사용하도록 바꾼다.
7. 다 바꿨으면 기존 매개변수를 제거하고 테스트 한다.

<br/>
<br/>

## 예시

어떠한 범위를 벗어난 것이 있는지 검사하는 예시코드 이다.

```javascript
const station = {
  name: 'A01',
  readings: [
    { temp: 10, time: '2021-05-16 12:03' },
    { temp: 23, time: '2021-05-16 12:13' },
    { temp: 45, time: '2021-05-16 12:33' },
    { temp: 61, time: '2021-05-16 12:43' },
    { temp: 99, time: '2021-05-16 12:53' },
  ],
}
```

아래 코드는 정상 범위를 벗어난 측정값을 찾는 함수.

```javascript
function readingsOutsideRange(station, min, max) {
  return station.readings.filter((r) => r.temp < min || r.temp > max)
}

// 호출
alerts = readingsOutsideRange(
  station,
  operationPlan.tempFloor, // 최저온도
  operationPlan.tempCiling // 최고온도
)
```

<br/>
<br/>

호출 코드를 보면 operationPlan의 데이터 항목 2개를 쌍으로 가져와서 `readingsOutsideRange` 함수로 전달한다. 그리고 operationPlan은 범위의 시작과 끝 이름을 `tempFloor, tempCiling` 로 표현한다.이와 같은 범위라는 개념은 객체 하나로 묶어서 표현하는 것이 좋다.

<br/>
<br/>

```javascript
class NumberRange {
  constructor(min, max) {
    this._data = { min, max }
  }

  get min() {
    return this._data.min
  }

  get max() {
    return this._data.max
  }
}
```

<br/>
<br/>

그런다음 새로 만든 객체를 `readingsOutsideRange` 함수의 매개변수로 추가하자.

```javascript
function readingsOutsideRange(station, min, max, range) {
  return station.readings.filter((r) => r.temp < min || r.temp > max)
}
```

아직 까지 동작을 바꾸지 않았기에 테스트는 무사히 통과할 것이다.
이제 동작을 바꿔보자.

```javascript
const range = new NumberRange(operationPlan.tempFloor, operationPlan.tempCiling)

// 호출
alerts = readingsOutsideRange(station, range)

// 함수 동작 수정
function readingsOutsideRange(station, range) {
  return station.readings.filter(
    (r) => r.temp < range.min || r.temp > range.max
  )
}
```

이것으로 매개변수 객체 만들기는 끝났다.
하지만 여기서 좀 더 리팩토링을 한다면, `readingsOutsideRange`의 동작을 `NumberRange` 클래스 안으로 옮길수 있다.

```javascript
class NumberRange {
  constructor(min, max) {
    this._data = { min, max }
  }

  contains(arg) {
    return arg >= this.min && arc <= this.max
  }

  get min() {
    return this._data.min
  }

  get max() {
    return this._data.max
  }
}

function readingsOutsideRange(station, range) {
  return station.readings.filter((r) => !range.contains(r.temp))
}
```
