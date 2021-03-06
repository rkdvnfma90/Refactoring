# 함수 추출하기

```javascript
// Before
const printOwing = (invoice) => {
  printBanner()
  let outstanding = calculateOutstanding()

  // 세부 사항 출력
  console.log(`고객명 : ${invoice.customer}`)
  console.log(`채무액 : ${outstanding}`)
}
```

<br/>
<br/>

```javascript
// After
const printOwing = (invoice) => {
  printBanner()
  let outstanding = calculateOutstanding()
  printDetails(outstanding)

  const printDetails = (outstanding) => {
    console.log(`고객명 : ${invoice.customer}`)
    console.log(`채무액 : ${outstanding}`)
  }
}
```

<br/>
<br/>

코드 조각을 찾아 무슨 일을 하는지 파악한 다음, 독립된 함수로 추출하고 목적에 맞는 이름을 붙인다.
<br/>
<br/>

먼저 코드를 언제 독립된 함수로 묶어야 할지에 관한 의견은 수없이 많다.
길이를 기준으로 삼을 수 있고 (예를 들어 한 화면을 넘어가면 안된다는 규칙), 재사용성을 기준으로 할 수도 있다 (두 번 이상 사용될 코드는 함수로 만들고, 한 번만 쓰이는 코드는 인라인 상태로 둔다).
<br/>
<br/>

`목적과 구현을 분리`하는 방식도 있다. 코드를 보고 무슨일을 하는지 파악하는 데 한참 걸린다면 그 부분을 함수로 추출한 뒤 `무슨 일`에 걸맞는 이름을 짓는다.
<br/>
<br/>

함수엔 길이가 중요하지 않다. 단 한줄 짜리 함수라고 하여도!
이렇게 짧은 함수의 이점은 이름을 잘 지어야만 발휘되므로 이름 짓기에 더 신경쓰자.
<br/>
<br/>

1. 함수를 새로 만들고 목적을 잘 드러내는 이름을 붙인다 (`어떻게`가 아닌 `무엇`을 하는지가 드러나야 한다.)

   - 일단 함수로 추출하여 사용해 보고 효과가 크지 않으면 다시 원래 상태로 인라인 해도 된다.

2. 추출할 코드를 원본 함수에서 복사하여 새 함수에 붙여 넣는다.
3. 추출한 코드 중 원본 함수의 지역 변수를 참조하거나 추출한 함수의 유효범위를 벗어나는 변수는 없는지 검사한다. 만약 있다면 매개변수로 전달한다.
   - 원본 함수의 중첩 함수로 추출할 때는 이런 문제가 발생하지 않는다.
   - 사용은 하지만 값이 바뀌지 않는 변수는 대체로 매개변수로 전달하여 쉽게 처리할 수 있다.
   - 추출한 코드에서만 사용하는 변수가 추출한 함수 밖에 선언되어 있다면 추출한 함수 안에서 선언 하도록 수정한다.
   - 추출한 코드 안에서 값이 바뀌는 변수 중 값으로 전달되는 것들은 주의해서 처리한다. 이런 변수가 하나뿐이라면 추출한 코드를 질의 함수로 취급해서 그 반환값을 해당 변수에 대입한다.
   - 추출한 코드에서 값을 수정하는 지역 변수가 너무 많다면 함수 추출을 멈추고 변수 쪼개기나 임시 변수를 질의 함수로 바꾸기 같은 리팩토링을 적용해서 변수를 사용하는 코드를 단순하게 바꿔본다. 그 후 추출을 시도해보자.

<br/>
<br/>

---

<br/>
<br/>

## 유효 범위를 벗어나는 변수가 없을 때

간단한 코드에서는 함수 추출하기가 굉장히 쉽다.

```javascript
// Before
const printOwing = (invoice) => {
  let outstanding = 0

  console.log('***********')
  console.log('고객 채무')
  console.log('***********')

  // 미해결 채무를 계산한다.
  for (const o of invoice.order) {
    outstanding += o
  }

  // 마감일을 기록한다.
  const today = Clock.today
  invoice.dueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30
  )

  // 세부사항을 출력한다.
  console.log(`고객명 : ${invoice.customer}`)
  console.log(`채무액 : ${outstanding}`)
  console.log(`마감일 : ${invoice.dueDate.toLocaleDateString()}`)
}
```

<br/>
<br/>

```javascript
// After
const printOwing = (invoice) => {
  let outstanding = 0

  // 배너 출력 로직을 함수로 추출
  printBanner()

  // 미해결 채무를 계산한다.
  for (const o of invoice.order) {
    outstanding += o
  }

  // 마감일을 기록한다.
  const today = Clock.today
  invoice.dueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30
  )

  // 세부사항 출력 로직을 함수로 추출
  printDetails()

  const printDetails = (outstanding) => {
    console.log(`고객명 : ${invoice.customer}`)
    console.log(`채무액 : ${outstanding}`)
    console.log(`마감일 : ${invoice.dueDate.toLocaleDateString()}`)
  }
}

const printBanner = () => {
  console.log('***********')
  console.log('고객 채무')
  console.log('***********')
}
```

<br/>
<br/>

---

<br/>
<br/>

## 지역 변수를 사용할 때

지역 변수와 관련하여 가장 간단한 경우는 변수를 사용하지만 다른 값을 다시 대입하지는 않을 경우이다.
이 경우 지역 변수들을 그냥 매개변수로 넘기면 된다.

<br/>
<br/>

```javascript
const printOwing = (invoice) => {
  let outstanding = 0

  // 배너 출력 로직을 함수로 추출
  printBanner()

  // 미해결 채무를 계산한다.
  for (const o of invoice.order) {
    outstanding += o
  }

  // 마감일 설정 로직을 함수로 추출
  recordDuteDate(invoice)

  // 세부사항 출력 로직을 함수로 추출
  printDetails(invoice, outstanding)

  // 이전의 예시와 다르게 지역 변수를 매개변수로 전달했다. (invoice 추가)
  const printDetails = (invoice, outstanding) => {
    console.log(`고객명 : ${invoice.customer}`)
    console.log(`채무액 : ${outstanding}`)
    console.log(`마감일 : ${invoice.dueDate.toLocaleDateString()}`)
  }
}

const printBanner = () => {
  console.log('***********')
  console.log('고객 채무')
  console.log('***********')
}

const recordDuteDate = (invoice) => {
  const today = Clock.today
  invoice.dueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30
  )
}
```

<br/>
<br/>

---

<br/>
<br/>

## 지역 변수의 값을 변경할 때

지역 변수에 값을 대입하게 되면 복잡해 진다. 만약에 매개변수에 값을 대입하는 코드를 발견한다면 곧바로 그 변수를 쪼개서 임시 변수를 새로 하나 만들어 그 변수에 대입한다. 대입 대상이 되는 임시 변수는 크게 2가지로 나눌 수 있다.

1. 변수가 추출된 코드 안에서만 사용될 때 : 이 변수는 추출된 코드 안에서만 존재한다. 변수가 초기화되는 지점과 실제로 사용되는 지점이 떨어져 있다면 문장 슬라이드하기를 활용하여 변수 조작을 모두 한곳에 처리하도록 모아두면 편하다.

2. 변수가 추출한 함수 밖에서 사용될 때 : 이럴 때는 변수에 대입된 새 값을 반환해야 한다.

```javascript
const printOwing = (invoice) => {
  // 배너 출력 로직을 함수로 추출
  printBanner()

  let outstanding = calculateOutstanding(invoice)

  // 마감일 설정 로직을 함수로 추출
  recordDuteDate(invoice)

  // 세부사항 출력 로직을 함수로 추출
  printDetails(invoice, outstanding)

  // 이전의 예시와 다르게 지역 변수를 매개변수로 전달했다. (invoice 추가)
  const printDetails = (invoice, outstanding) => {
    console.log(`고객명 : ${invoice.customer}`)
    console.log(`채무액 : ${outstanding}`)
    console.log(`마감일 : ${invoice.dueDate.toLocaleDateString()}`)
  }
}

const printBanner = () => {
  console.log('***********')
  console.log('고객 채무')
  console.log('***********')
}

const recordDuteDate = (invoice) => {
  const today = Clock.today
  invoice.dueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30
  )
}

const calculateOutstanding = (invoice) => {
  // 맨 위에 있던 선언문을 이 위치로 이동시킨다. (문장 슬라이드)
  let outstanding = 0
  for (const o of invoice.order) {
    outstanding += o
  }

  // 수정된 값 반환
  return outstanding
}
```

1. 선언문을 변수가 사용되는 코드 근처로 슬라이드 한다.
2. 추출할 부분을 새로운 함수로 복사한다.
3. outstanding의 선언문을 추출할 코드 앞으로 옮겼기 때문에 매개변수로 전달하지 않아도 된다. 추출한 코드에서 값이 변경된 변수는 outstanding 뿐이다. 따라서 이 값을 반환한다.
