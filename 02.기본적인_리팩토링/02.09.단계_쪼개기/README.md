# 단계 쪼개기

## Before & After

### Before

```javascript
const orderData = orderString.split(\/s+/);
const productPrice = priceList[orderData[0].split('-')[1]];
const orderPrice = parseInt(orderData[1]) * productPrice;
```

### After

```javascript
const orderRecord = parseOrder(order);
const orderPrice = price(orderRecord, priceList);

function parseOrder(aString) {
  const values = aString.split(\/s+/);
  return ({
    productID : values[0].split('-')[1],
    quantity : parseInt(values[1])
  });
}

function price(order, priceList) {
  return order.quantity * priceList[order.productID];
}
```

<br/>
<br/>

## 배경

서로 다른 두 대상을 한꺼번에 다루는 코드가 있다면 각각을 별개 모듈로 나누는 것이 좋다. 그 이유는 코드를 수정해야 할 때 두 대상을 동시에 생각할 필요 없이 하나에만 집중하기 위함이다. 모듈이 잘 분리되어 있다면 다른 모듈의 상세 내용은 기억하지 못해도 원하는 대로 수정을 마칠 수 있다.

<br/>

분리하는 가장 간편한 방법중 하나는 동작을 연이은 두 단계로 쪼개는 것이다. 예를 들어 입력 받는 값이 처리하는 로직에 적합하지 않은 형태로 들어오는 경우를 예로 생각해본다. 이럴 때는 본 작업에 들어가기 전에 입력값을 다루기 편한 형태로 가공한다. 아니면 로직을 순차적인 단계들로 분리해도 된다.

<br/>
<br/>

## 절차

1. 두 번째 단계에 해당하는 코드를 독립 함수로 추출한다.
2. 테스트
3. 중간 데이터 구조를 만들어서 앞에서 추출한 함수의 인수로 추가한다.
4. 테스트
5. 추출한 두 번째 단계 함수의 매개변수를 하나씩 검토한다.
6. 첫 번째 단계 코드를 함수로 추출하면서 중간 데이터 구조를 반환하도록 만든다.

<br/>
<br/>

## 예시

상품의 결제 금액을 계산하는 코드로 예시를 들어보겠다.

```javascript
function priceOrder(product, quantity, shippingMethod) {
  /* 상품 정보 이용 */
  const basePrice = product.basePrice * quantity;
  const discount =
    Math.max(quantity - product.discountThreshold, 0) *
    product.basePrice *
    product.discountRate;

  /* 배송 정보 이용 */
  const shippingPerCase =
    basePrice > shippingMethod.discountThreshold
      ? shippingMethod.discountFee
      : shippingMethod.feePerCase;
  const shippingCost = quantity * shippingPerCase;
  const price = basePrice - discount + shippingCost;

  return price;
}
```

위 코드를 보면 계산이 두 단계로 이루어져 있음을 알 수 있다. 앞의 몇 줄은 상품 정보를 이용하여 상품 가격을 계산하고, 뒤의 코드는 배송 정보를 이용하여 배송비를 계산한다. 나중에 상품 가격과 배송비 계산을 더 복잡하게 만드는 변경이 생긴다면 이 코드는 두 단계로 나누는 것이 좋다.

<br/>
<br/>

1번 절차 : 배송비 계산 부분을 함수로 추출한다.

```javascript
function priceOrder(product, quantity, shippingMethod) {
  const basePrice = product.basePrice * quantity;
  const discount =
    Math.max(quantity - product.discountThreshold, 0) *
    product.basePrice *
    product.discountRate;
  const price = applyShipping(basePrice, shippingMethod, quantity, discount);
  return price;
}

// 두 번째 단계를 처리하는 함수
function applyShipping(basePrice, shippingMethod, quantity, discount) {
  const shippingPerCase =
    basePrice > shippingMethod.discountThreshold
      ? shippingMethod.discountFee
      : shippingMethod.feePerCase;
  const shippingCost = quantity * shippingPerCase;
  const price = basePrice - discount + shippingCost;

  return price;
}
```

3번 절차 : 첫 번째 단계와 두 번째 단계가 주고받을 중간 데이터 구조를 만든다.

```javascript
function priceOrder(product, quantity, shippingMethod) {
  const basePrice = product.basePrice * quantity;
  const discount =
    Math.max(quantity - product.discountThreshold, 0) *
    product.basePrice *
    product.discountRate;
  const priceData = {}; // 중간 데이터 구조

  // priceData
  const price = applyShipping(
    priceData,
    basePrice,
    shippingMethod,
    quantity,
    discount
  );
  return price;
}

// priceData 매개변수로 추가
function applyShipping(
  priceData,
  basePrice,
  shippingMethod,
  quantity,
  discount
) {
  const shippingPerCase =
    basePrice > shippingMethod.discountThreshold
      ? shippingMethod.discountFee
      : shippingMethod.feePerCase;
  const shippingCost = quantity * shippingPerCase;
  const price = basePrice - discount + shippingCost;

  return price;
}
```

5번 절차 : applyShipping()에 전달되는 다양한 매개변수를 살펴보면, basePrice는 첫 번째 단계를 수행하는 코드에서 생성된다. 따라서 중간 데이터 구조로 옮기고 매개변수 목록에서 제거한다. 그 다음 나오는 quantity는 첫 번째 단계에서 사용하기 하지만 여기서 생성된 것은 아니다. 그래서 그냥 매개변수에 놔두어도 되지만 중간 데이터 구조에 담을 수도 있다. discount도 처리해주자.

```javascript
function priceOrder(product, quantity, shippingMethod) {
  const basePrice = product.basePrice * quantity;
  const discount =
    Math.max(quantity - product.discountThreshold, 0) *
    product.basePrice *
    product.discountRate;
  const priceData = {
    basePrice: basePrice,
    quantity: quantity,
    discount: discount,
  }; // 중간 데이터 구조

  // priceData
  const price = applyShipping(priceData, shippingMethod);
  return price;
}

// priceData 매개변수로 추가
function applyShipping(priceData, shippingMethod) {
  const shippingPerCase =
    priceData.basePrice > shippingMethod.discountThreshold
      ? shippingMethod.discountFee
      : shippingMethod.feePerCase;
  const shippingCost = priceData.quantity * shippingPerCase;
  const price = priceData.basePrice - priceData.discount + shippingCost;

  return price;
}
```

6번 절차 : 매개변수들을 모두 처리하면 중간 데이터 구조가 완성이 된다. 이제 첫 번째 단계 코드를 함수로 추출하고 이 데이터 구조를 반환하게 해보자.

```javascript
function priceOrder(product, quantity, shippingMethod) {
  const priceData = calculatePricingData(product, quantity);
  return applyShipping(priceData, shippingMethod);
}

// 첫 번째 단계를 처리하는 함수
function calculatePricingData(product, quantity) {
  const basePrice = product.basePrice * quantity;
  const discount =
    Math.max(quantity - product.discountThreshold, 0) *
    product.basePrice *
    product.discountRate;

  return {
    basePrice: basePrice,
    quantity: quantity,
    discount: discount,
  };
}

// 두 번째 단계를 처리하는 함수
function applyShipping(priceData, shippingMethod) {
  const shippingPerCase =
    priceData.basePrice > shippingMethod.discountThreshold
      ? shippingMethod.discountFee
      : shippingMethod.feePerCase;
  const shippingCost = priceData.quantity * shippingPerCase;

  return priceData.basePrice - priceData.discount + shippingCost;
}
```
