# 캡슐화

모듈을 분리하는 가장 중요한 기준은 각 모듈이 자신을 제외한 다른 부분에 드러내지 않아야 할 비밀을 얼마나 잘 숨기느냐 이다.

캡슐화 할 수 있는 대표적인 데이터 구조는 `레코드`와 `컬렉션`이다. 물론 `기본형 데이터`도 객체로 바꾸어 캡슐화할 수 있다.

클래스는 본래 정보를 숨기는 용도로 설계되었다. 내부 정보뿐만 아니라 클래스 사이의 연결 관계 또한 숨길 수 있다. 이 용도로는 `위임 숨기기`가 있다. 그렇지만 너무 많이 숨기려고 하면 인터페이스가 비대해질 여지가 크기 때문에 이와 반대되는 기법인 `중개자 제거하기`가 있다.

가장 큰 캡슐화 단위는 클래스와 모듈이지만 `함수`도 구현을 캡슐화 할 수 있다.