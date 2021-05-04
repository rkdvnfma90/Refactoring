# 변수 캡슐화하기

## 배경

리팩토링은 프로그램의 요소를 조작하는 일이고, 함수는 데이터보다 다루기가 쉽다.
함수를 사용한다는 것은 대체로 호출한다는 뜻이고 함수의 이름을 바꾸거나 다른 모듈로 옮기기는 어렵지가 않다.
반대로 데이터는 함수보다 다루기가 까다로운데 그 이유는 이런식으로 처리할 수 없기 때문이다.
데이터는 참조하는 모든 부분을 한 번에 바꿔야 코드가 제대로 동작한다.
유효범위가 좁은 데이터는 어렵지 않지만 유효범위가 넓어질수록 어렵다.
그래서 전역 데이터를 사용하는 것을 조심스럽게 여겨야 한다.

<br/>
<br/>

접근할 수 있는 범위가 넓은 데이터를 옮길 때는 먼저 그 데이터로의 접근을 독접하는 함수를 만드는 식으로 캡슐화 하는 것이 가장 좋은 방법일 때가 많다.
데이터를 변경하고 사용하는 코드를 감시할 수 있는 확실한 통로가 되기 때문에 데이터 변경 전 검증이나 변경 후 추가 로직을 쉽게 넣을 수 있다.
데이터의 범위가 넓을 수록 캡슐화 해야 한다.
불변 데이터는 캡슐화할 이유가 적다. 데이터가 변경될 일이 없기 때문이다.

<br/>
<br/>

## 절차

1. 변수로 접근과 갱신을 전담하는 캡슐화 함수들을 만든다.
2. 정적 검사를 수행한다.
3. 변수를 직접 참조하던 부분을 캡슐화 함수 호출로 바꾼다. 하나씩 바꿀때 마다 테스트 진행.
4. 변수의 접근 범위를 제한한다.
5. 테스트

<br/>
<br/>

## 예시

전역 변수에 아래와 같이 중요한 데이터가 담겨져 있다고 가정해보자.

```javascript
let defaultOwner = { firstName: 'Gildong', lastName: 'Hong' }
```

당연히 참조하는 코드가 있을 것이다.

```javascript
car.owner = defaultOwner
```

갱신하는 코드도 있을 것이다.

```javascript
defaultOwner = { firstName: 'Minsu', lastName: 'Kim' }
```

<br/>
<br/>

절차 1번 - 기본적인 캡슐화를 위해 가장 먼저 데이터를 읽고 쓰는 함수부터 정의한다.

```javascript
function getDefaultOwner() {
  return defaultOwner
}

function setDefaultOwner(owner) {
  defaultOwner = owner
}
```

<br/>
<br/>

절차 3번 - defaultOwner를 참조하는 코드를 찾아서 방금 만든 getter 함수를 호출하도록 고친다. 대입문은 setter 함수로 바꾼다.

```javascript
car.owner = getDefaultOwner()

setDefaultOwner({ firstName: 'Minsu', lastName: 'Kim' })
```

<br/>
<br/>

절차 4번 - 모든 참조를 수정했다면 변수의 가시 범위를 제한한다. 그러면 미처 발견하지 못한 참조가 없는지 확인할 수 있고 나중에 수정하는 코드에서도 이 변수에 직접 접근하지 못하게 만들 수 있다. 자바스크립트의 경우 변수와 접근자 메서드를 같은 파일로 옮기고 접근자만 export 하면 된다.

```javascript
// defaultOwner.js 파일
let defaultOwner = { firstName: 'Gildong', lastName: 'Hong' }

export function getDefaultOwner() {
  return defaultOwner
}

export function setDefaultOwner(owner) {
  defaultOwner = owner
}
```

<br/>
<br/>

## 값 캡슐화 하기

방금 시행한 기본 캡슐화를 사용하면 그 구조로의 접근이나 구조 자체를 다시 대입하는 행위는 제어할 수 있다. 하지만 필드 값을 변경하는 일은 제어할 수 없다.

```javascript
const owner1 = getDefaultOwner()
const owner2 = getDefaultOwner()

owner2.lastName = 'Choi'
```

getter가 데이터의 복제본을 반환하도록 수정하면 이 문제를 해결할 수 있다.

```javascript
// defaultOwner.js 파일
let defaultOwner = { firstName: 'Gildong', lastName: 'Hong' }

export function getDefaultOwner() {
  return { ...defaultOwner }
}

export function setDefaultOwner(owner) {
  defaultOwner = owner
}
```
