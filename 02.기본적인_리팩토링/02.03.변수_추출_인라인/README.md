# 변수 추출 & 인라인

## 변수 추출하기

- 이와 반대되는 리팩토링 : 변수 인라인

```javascript
// Before
... 생략
return order.quantity * order.itemPrice -
    Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
    Math.min(order.quantity * order.itemPrice * 0.1, 100)
```

<br/>
<br/>

```javascript
... 생략
const basePrice = order.quantity * order.itemPrice
const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05
const shipping = Math.min(basePrice * 0.1, 100)

return basePrice - quantityDiscount + shipping
```

<br/>
<br/>

표현식이 너무 복잡하여 이해하기 어려울 때 지역변수를 활용하여 변수를 추출하면 코드의 목적을 훨씬 명확하게 드러낼 수 있다. 또한 이렇게 추출한 변수들은 디버깅을 할 때에도 도움이 된다.

<br/>
<br/>

### 절차

1. 추출하려는 표현식에 부작용은 없는지 확인
2. 불변 변수를 하나 선언하고 이름을 붙일 표현식의 복제본을 대입
3. 원본 표현식을 새로 만든 변수로 교체
4. 테스트
5. 표현식을 여러 곳에서 사용한다면 각각을 새로 만든 변수로 교체한다.
6. 하나 교체할 때 마다 테스트도 진행한다.

<br/>
<br/>

### 예시 (클래스 안에서 사용)

```javascript
// Before
class Order {
  #data

  constructor(aRecord) {
    this.#data = aRecord
  }

  get quantity() {
    return this.#data.quantity
  }

  get itemPrice() {
    return this.#data.itemPrice
  }

  get price() {
    return (
      order.quantity * order.itemPrice -
      Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
      Math.min(order.quantity * order.itemPrice * 0.1, 100)
    )
  }
}
```

<br/>
<br/>

추출하려는 이름 `price`는 가격을 계산한다는 메서드의 범위를 넘어, 주문을 표현하는 Order 클래스 전체에 적용된다. 이렇게 클래스 전체에 영향을 줄 때 변수가 아닌 메서드로 추출하는 것이 더 좋다.

<br/>
<br/>

```javascript
// After
class Order {
  #data

  constructor(aRecord) {
    this.#data = aRecord
  }

  get quantity() {
    return this.#data.quantity
  }

  get itemPrice() {
    return this.#data.itemPrice
  }

  get basePrice() {
    return this.quantity * this.itemPrice
  }

  get quantityDiscount() {
    return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05
  }

  get shipping() {
    return Math.min(this.basePrice * 0.1, 100)
  }

  get price() {
    return this.basePrice - this.quantityDiscount + this.shipping
  }
}
```

이렇게 하면 객체의 장점을 볼 수 있다. 객체는 특정 로직과 데이터를 외부와 공유하려 할 때 공유할 정보를 설명해주는 적당한 크기의 문맥이 된다. 위 코드처럼 간단한 경우는 그렇게 효과가 크지 않을 수도 있지만 덩치가 큰 클래스에서 공통 동작을 별도 이름으로 뽑아내서 추상화 하면 그 객체를 다룰 때 쉽게 활용이 가능하다.

<br/>
<br/>

## 변수 인라인

- 이와 반대되는 리팩토링 : 변수 추출

```javascript
// Before
let basePrice = anOrder.basePrice
return basePrice > 1000

// After
return anOrder.basePrice > 1000
```

<br/>
<br/>

### 배경

보통 변수는 함수 안에서 표현식을 가리키는 이름으로 쓰이며, 대체로 긍정적인 효과를 준다. 하지만 그 이름이 원래 표현식과 다를 바 없을 때도 있는데 이 경우는 변수를 인라인 하는 것이 좋다.
