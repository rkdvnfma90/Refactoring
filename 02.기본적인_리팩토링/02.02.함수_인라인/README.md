# 함수 인라인

- 이와 반대되는 리팩토링 : 함수 추출하기

```javascript
// Before
function getRating(driver) {
  return moreThanFiveLateDeliveryies(dirver) ? 2 : 1
}

function moreThanFiveLateDeliveryies(driver) {
  return driver.numberOfLateDeliveries > 5
}
```

<br/>
<br/>

```javascript
// After
function getRating(driver) {
  return numberOfLateDeliveries > 5 ? 2 : 1
}
```

<br/>
<br/>

현재 이 책에서는 목적이 분명히 드러나는 이름의 짤막한 함수를 이용하기를 권장하고 있다. 이렇게 해야 코드가 명료해지고 이해하기 쉬워지기 때문이다.
하지만 때로는 함수 본문이 이름만큼 명확한 경우도 있다. 이럴 때에는 함수를 제거하는 것이 좋다.

또한 리팩토링 과정에서 잘못 추출한 함수들도 다시 인라인 한다.

<br/>
<br/>

## 절차

1. 다형 메서드 인지 확인한다.
   - 만약 해당 메서드가 서브클래스에서 오버라이드 하는 메서드 라면 인라인 하면 안된다.
2. 인라인할 함수를 호출하는 곳을 모두 찾는다.
3. 각 호출문을 함수 본문으로 교체한다.
4. 하나씩 교체할 때 마다 테스트를 진행한다.
   - 인라인 작업을 한 번에 처리하지 않아도 된다. 진행하다가 까다로운 부분이 있다면 일단 남겨두고 여유가 생길때 마다 진행하자
5. 원래 함수를 삭제한다.

<br/>
<br/>

## 예시

```javascript
// Before
function reportLines(aCustomer) {
  const lines = []
  gatherCustomerData(lines, aCustomer)
  return lines
}

function gatherCustomerData(out, aCustomer) {
  out.push(['name', aCustomer.name])
  out.push(['location', aCustomer.location])
}
```

위 코드를 보면 단순하게 잘라서 붙이는 방법으로는 gatherCustomerData 함수를 reportLines 함수에 인라인할 수 없다. 일단 실수하지 않기 위해 한 문장씩 옮기는 것이 좋다.

```javascript
// After
function reportLines(aCustomer) {
  const lines = []
  lines.push(['name', aCustomer.name])
  lines.push(['location', aCustomer.location])
  return lines
}

// function gatherCustomerData(out, aCustomer) {
//   out.push(['name', aCustomer.name])
//   out.push(['location', aCustomer.location])
// }
```
