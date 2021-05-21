# 여러 함수 변환함수로 묶기

## 배경

소프트웨어는 데이터를 입력받아서 여러가지 정보를 도출한다.
도출된 정보는 여러 곳에서 사용되는데 사용되는 곳 마다 같은 도출 로직이 반복되기도 한다.
이러한 도출 작업들을 한데로 모아두면 검색과 갱신을 일관된 장소에서 처리할 수 있고 중복을 막을 수 있다.
이렇게 하기 위한 방법으로 `변환함수`를 사용할 수 있다.

`변환함수`란 ?
원본 데이터를 입력받아서 필요한 정보를 모두 도출한 뒤 각각을 출력 데이터의 필드에 넣어 반환한다.
이렇게 해두면 도출 과정을 검토할 일이 생겼을 때 변환 함수만 살펴보면 된다.

이 리팩토링 대신 `여러 함수 클래스로 묶기` 리팩토링으로 처리해도 된다.
하지만 `원본 데이터가 코드안에서 갱신` 되는 경우엔 클래스로 묶는편이 더 낫다.
변환함수로 묶으면 가공한 데이터를 새로운 레코드에 저장하므로 원본 데이터가 수정되면
일관성이 깨질 수 있기 때문이다.

<br/>
<br/>

## 절차

1. 변환할 레코드를 입력받아서 값을 그대로 반환하는 변환 함수를 만든다.
   - 이 작업은 깊은 복사로 처리하는 것이 좋다. 원본 레코드를 바꾸지 않아야 하기 때문이다.
2. 묶을 함수 중 하나를 골라서 본문 코드를 변환 함수로 옮기고 처리 결과를 레코드에 새 필드로 기록한다.
   - 로직이 복잡하다면 함수 추출하기 부터 진행한다.
3. 테스트
4. 나머지 관련 함수도 위 과정에 따라 처리한다.

<br/>
<br/>

## 예시

사용자가 마신 차(tea)의 양을 측정하는 것으로 예를 들겠다.

```javascript
reading = { customer: 'ab', quantity: 10, month: 5, year: 2021 };
```

코드 곳곳에서 다양한 방식으로 차 소비량을 계산한다고 했을 때 아래 코드는 사용자에게 요금을 부과하기 위해 기본요금을 계산 하는 코드이다.

```javascript
// 고객 1
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
```

세금을 부과할 소비량을 계산하는 코드도 필요하다.

```javascript
// 고객 2
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
const taxableCharge = Math.max(0, base - taxThreshold(aReading.year));
```

이와 같이 계산 코드가 여러 곳에서 반복된다고 가정했을 때 중복 코드는 나중에 로직을 수정할 때 골치를 썩인다.
이를 해결하는 방법으로 다양한 파생 정보 계산 로직을 모두 하나의 변환 단계로 모을 수 있다.

1. 우선 입력 객체를 그대로 복사해 변환하는 변환함수를 만든다.

```javascript
function enrichReading(original) {
  const result = _.cloneDeep(original); // lodash의 deep copy
  return result;
}
```

2. 이제 변경하려는 계산 로직 중 하나를 고른다. 이 계산 로직에 측정값을 전달하기 전에 부가 정보를 덧붙이도록 수정한다.

```javascript
// 고객 3
const rawReading = acquireReading(); // 미가공 측정값
const aReading = enrichReading(rawReading);
const baseChargeAmount = calculateBaseCharge(aReading);

function enrichReading(original) {
  const result = _.cloneDeep(original); // lodash의 deep copy
  result.baseCharge = calculateBaseCharge(result); // 미가공 측정값에 기본 소비량을 부가 정보로 덧붙임
  return result;
}
```

아래와 같이 사용한다.

```javascript
// 고객 3
const rawReading = acquireReading(); // 미가공 측정값
const aReading = enrichReading(rawReading);
const baseChargeAmount = aReading.baseCharge;

function enrichReading(original) {
  const result = _.cloneDeep(original); // lodash의 deep copy
  result.baseCharge = calculateBaseCharge(result); // 미가공 측정값에 기본 소비량을 부가 정보로 덧붙임
  return result;
}
```

고객 1도 추가한 필드를 사용하도록 한다.

```javascript
// 고객 1
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
const baseCharge = aReading.baseCharge;
```

이제 세금을 부과할 소비량 계산으로 넘어가서 가장 먼저 변환 함수부터 끼워 넣는다.

```javascript
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
const taxableCharge = Math.max(
  0,
  aReading.baseCharge - taxThreshold(aReading.year)
);

// taxableCharge 에 base를 인라인 한다.
```

그런 다음 계산 코드를 변환 함수로 옮긴다.

```javascript
function enrichReading(original) {
  const result = _.cloneDeep(original);
  result.baseCharge = calculateBaseCharge(result);
  result.taxableCharge = Math.max(
    0,
    result.baseCharge - taxThreshold(result.year)
  );
  return result;
}
```

이제 새로 만든 필드를 사용하도록 원본 코드를 수정한다.

```javascript
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
const taxableCharge = aReading.taxableCharge;
```
