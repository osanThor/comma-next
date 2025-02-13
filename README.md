<div align='center'>
  <a href="https://comma-one.vercel.app">
    <img src="https://github.com/user-attachments/assets/f79e7575-30ee-4c93-b4ff-77716e221569" width="340" />
      
  </a>
</div>

<br/>

![Thumbnail](https://github.com/user-attachments/assets/b0a56a57-818f-4b4a-9b88-ae4729d90d02)

- 배포 URL : https://comma.given-log.com
- `Vue.js` 프로젝트 `Next.JS`와 `Typescript`로 마이그레이션
- 이전 팀 프로젝트 README : https://github.com/osanThor/Comma

<br>

## ⭐️ 프로젝트 소개 - 추억을 깨우는 즐거운 쉼표

- COMMA는 고물가, 직장 생활, 학업 등으로 지친 현대인들에게 잠깐의 여유를 제공하고, 어린 시절 오락실의 감성을 되살릴 수 있는 공간을 제공합니다. 스트레스 해소와 심리적 위안을 목표로, 향수를 자극하는 경험과 새로운 소셜 연결을 동시에 제공하는 미니게임 & 커뮤니티 플랫폼입니다.
- 누구나 쉽게 접근할 수 있는 간단한 미니게임을 통해 짧은 시간 동안 스트레스를 해소하고 성취감을 느낄 수 있습니다.
- 과거 오락실의 추억을 떠올리게 하는 디자인과 콘텐츠로 사용자들에게 향수를 불러일으킵니다.
- 게임을 통해 사용자 간 소셜 연결을 지원하며, 공통된 관심사를 기반으로 한 커뮤니티 형성을 돕습니다.
- 단순한 게임 플랫폼을 넘어 사람들과 교류하며 즐거움을 공유할 수 있는 공간을 제공합니다.


<br>

## ⚙️ 기술 스택

![npm](https://img.shields.io/badge/npm-10.8.3-%23CB3837?logo=npm)
![next](https://img.shields.io/badge/next-3.5.13-%23000000?logo=nextdotjs)
![typescript](https://img.shields.io/badge/typescript-5-%233178C6?logo=typescript)
![tailwind](https://img.shields.io/badge/tailwind-3.4.17-%2306B6D4?logo=tailwindcss)

**라이브러리**  
![supabase](https://img.shields.io/badge/supabase-2.6.0-%233FCF8E?logo=supabase)
![tailwind-merge](https://img.shields.io/badge/tailwind%20merge-2.6.0-%2306B6D4?logo=tailwindcss)
![swiper](https://img.shields.io/badge/swiper-11.1.15-%23104E8B?logo=swiper)

**협업툴**  
[![My Skills](https://skillicons.dev/icons?i=supabase,figma,github,notion&theme=light)](https://skillicons.dev)


<br/>

## ✏️ 커밋 컨벤션

- 🚨 Fix: [수정 대상] - [수정 내용]
- ✨ Feat: 새로운 기능 추가, 사용자 입장에서 변화가 있을 경우
- 🎉 Init: 프로젝트 초기 생성
- 📝 Chore: 그 외 자잘한 수정에 대한 커밋, 주석, 의존성 설치, 리드미 수정
- 💄 Style: CSS, styled-component 스타일 관련 변경
- 🔨 Refactor: 코드 리팩토링에 대한 커밋, 사용자 입장에서 변화가 없는 코드, 파일명 폴더명 변경 및 이동
- 🗑️ Remove: 파일을 삭제하는 작업만 수행하는 경우
- ♻️ Format: 코드 포맷팅 변경에 관련된 작업

<br/>

## 🗂️ 폴더 구조
  
    📦comma
     ┣ 📂public
     ┃ ┣ 📂assets
     ┃ ┃ ┣ 📂fonts
     ┃ ┃ ┣ 📂images
     ┃ ┃ ┃ ┣ 📂banner
     ┃ ┃ ┃ ┣ 📂bg
     ┃ ┃ ┃ ┃ ┗ 📂main
     ┃ ┃ ┃ ┣ 📂game
     ┃ ┃ ┃ ┃ ┣ 📂bounceBall
     ┃ ┃ ┃ ┃ ┣ 📂flappy
     ┃ ┃ ┃ ┃ ┣ 📂profile
     ┃ ┃ ┃ ┃ ┣ 📂shooting
     ┃ ┃ ┃ ┃ ┗ 📂tetris
     ┃ ┃ ┃ ┣ 📂icons
     ┃ ┃ ┃ ┗ 📂login
     ┃ ┃ ┗ 📂sounds
     ┃ ┗ 📂meta
     ┗ 📂src
       ┣ 📂app
       ┃ ┣ 📂(auth)
       ┃ ┃ ┗ 📂login
       ┃ ┣ 📂(main)
       ┃ ┃ ┣ 📂game
       ┃ ┃ ┃ ┗ 📂[name]
       ┃ ┃ ┃   ┗ 📂play
       ┃ ┃ ┣ 📂post
       ┃ ┃ ┃ ┣ 📂[id]
       ┃ ┃ ┃ ┃ ┗ 📂edit
       ┃ ┃ ┃ ┗ 📂write
       ┃ ┃ ┣ 📂user
       ┃ ┃ ┃ ┣ 📂[...slug]
       ┃ ┃ ┃ ┗ 📂edit
       ┣ 📂classes
       ┃ ┣ 📂flappy
       ┃ ┣ 📂shooting
       ┃ ┗ 📂tetris
       ┣ 📂components
       ┃ ┣ 📂common
       ┃ ┃ ┗ 📂icons
       ┃ ┣ 📂game
       ┃ ┣ 📂post
       ┃ ┣ 📂post-editor
       ┃ ┗ 📂user
       ┣ 📂constants
       ┣ 📂containers
       ┃ ┣ 📂auth
       ┃ ┣ 📂common
       ┃ ┃ ┗ 📂header
       ┃ ┣ 📂game
       ┃ ┣ 📂game-over
       ┃ ┣ 📂game-view
       ┃ ┣ 📂main
       ┃ ┣ 📂post
       ┃ ┣ 📂post-editor
       ┃ ┗ 📂user
       ┣ 📂contexts
       ┣ 📂hooks
       ┣ 📂layouts
       ┣ 📂lib
       ┃ ┗ 📂supabase
       ┣ 📂services
       ┣ 📂stores
       ┣ 📂types
       ┗ 📂utils

<br/>

## 🔨 업그레이드

### SEO 



<br>

## 🔥 트러블슈팅

### 모니터 주사율에 따른 게임 속도 차이

**문제** <br/> 모니터 주사율(Hz)에 따라 게임 속도가 다르게 보이는 현상이 발생함. 프레임 기반 업데이트를 사용하여, 주사율이 높은 모니터에서 게임이 더 빠르게 실행됨.

**원인** <br/> 프레임 기반으로 게임 로직이 실행될 경우, 초당 프레임 수(Frame Rate)에 따라 업데이트 횟수가 달라짐.
예를 들어, 60Hz 모니터에서는 1초에 60번 업데이트되지만, 144Hz 모니터에서는 144번 업데이트되어 속도가 증가

**해결** <br/> **Delta Time**을 사용한 시간 기반 업데이트
**Delta Time**은 각 프레임 사이의 시간 간격을 측정하여, 이 값을 바탕으로 게임 오브젝트의 이동 속도나 애니메이션 속도를 보정하는 방식이다.

**수정된 로직** <br/>
`requestAnimationFrame`의 `timestamp` 값을 활용해 이전 프레임과 현재 프레임 사이의 시간 차이를 계산
게임 오브젝트 이동 속도(`speed * deltaTime`)를 적용하여, 초당 일정한 속도로 움직이도록 보정

```js
let lastFrameTime = 0; // 이전 프레임의 시간 저장

function main(timestamp) {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const deltaTime = (timestamp - lastFrameTime) / 1000; // 밀리초 → 초로 변환
  lastFrameTime = timestamp;

  if (!Enemy.isGameOver) {
    update(deltaTime);
    render();
    requestId.value = requestAnimationFrame(main);
  } else {
    stop();
    stopAllMusic();
    emits("open-game-over", score.value, currentTime.value);
    cancelAnimationFrame(requestId.value);
  }
}
```
