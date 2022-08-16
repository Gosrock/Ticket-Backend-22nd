![Frame 34257](https://user-images.githubusercontent.com/55226431/184820864-e8573a2b-b48d-4eb9-a5f7-25ecf7192ec6.png)



# 고스락 티켓 2.0<img src="https://user-images.githubusercontent.com/55226431/184821608-3b631082-fefa-48cf-b9d3-bf4902ddcbff.png" align=left width=100>

> 22번째 정기공연 [We are GOSROCK, Invites you] • <b>백엔드</b> 레포지토리

<img width="100%" alt="readme" src="https://user-images.githubusercontent.com/55226431/184882909-ff460464-c1d0-4c47-abd3-9c39c0520a98.png">


<br/><br/>



## ✨ 서비스 페이지

- <b>[https://gosrock.band](https://gosrock.band)</b>


<div>
<img src="https://user-images.githubusercontent.com/55226431/184898011-ab04c9e6-cc5d-4393-960b-80f00dbd3a00.gif" align='left' width="31%" >
<img src='https://user-images.githubusercontent.com/55226431/184899062-41d422ff-19f8-4ab7-993d-abd83bccf5db.gif' width='69%'>
</div>


<br/>


## 📢 기획 / 디자인
- [Figma](https://www.figma.com/file/J6HVLxWGuCFgAQUCdWBUsT/%EA%B3%A0%EC%8A%A4%EB%9D%BD-%ED%8B%B0%EC%BC%93%EC%98%88%EB%A7%A4?node-id=2026%3A6310)
- [Storybook](https://gosrock.github.io/Ticket-Front-22nd/?path=/story/common-inputform--%ED%9C%B4%EB%8C%80%ED%8F%B0%EB%B2%88%ED%98%B8-%EC%9E%85%EB%A0%A5)
- [[고스락 티켓 2.0] 기획, 디자인 개편](https://9yujin.tistory.com/56?category=1025360)

<br/>


## 📚 사용 스택

<div align="left">
<div>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
 <img src="https://img.shields.io/badge/Nestjs-D91313?style=flat-square&logo=nestjs&logoColor=white">
</div>
<div>
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=flat-square&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white">
<img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white">
</div>
<div>
<img src="https://img.shields.io/badge/ESlint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white">
 <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white">
  <img src="https://img.shields.io/badge/Slack-4A154B?style=flat-square&logo=slack&logoColor=white">
  
</div>
</div>


<br/><br/>


## 🔍 서버 개발 과정 포스팅
 - [찬진 : 두번째 고스락 티켓예매는 어떻게 달라졌을까요?](https://devnm.tistory.com/15)
 - [찬진 : 유저 role 기반 api 인가](https://devnm.tistory.com/16)
 - [찬진 : ValiationError 커스텀하기](https://devnm.tistory.com/17)
 - [찬진 : redis forRootAsync 모듈만들기](https://devnm.tistory.com/18)
 - [찬진 : transaction with repository](https://devnm.tistory.com/19)
 - [찬진 : rollback repository test](https://devnm.tistory.com/20)
 - [찬진 : 같은 코드 응답 데코레이터 만들기 시리즈](https://devnm.tistory.com/21)
 - [경민 : nestjs + socket.io 사용해서 실시간 공연 입장 시스템 구현하기](https://gengminy.tistory.com/23)


<br/>


## 📝 ERD

<img width="944" alt="KakaoTalk_Photo_2022-08-17-00-11-25" src="https://user-images.githubusercontent.com/13329304/184914851-f0d14bcc-9e76-4225-9a76-9458da71f7d6.png">


<br/>

## 📁 Project Structure

```shell
.github             # 도커 빌드 액션
.husky              # 깃 훅 프리티어관련
docker-compose.yml  # 로컬 개발환경 설정
src
├─auth              # 인증 관련 모듈 
├─common            # 공통 소스 디렉토리
│  ├─consts         # enum, 상수 정의
│  ├─decorators     # 성공,에러 스웨거 응답 데코레이터등
│  ├─dtos           # 페이지네이션,에러,성공등 공통 디티오
│  ├─errors         # 커스텀 에러정의
│  ├─exceptions     # exception 필터
│  ├─funcs          
│  ├─interceptors   # 성공응답 인터셉터
│  ├─pipes
│  └─utils
├─config            # configSerivce 커스텀 모듈
├─database          # 데이타 베이스 관련 모듈
│  ├─entities
│  ├─migrations
│  └─repositories
├─orders            # 주문관련 모듈
├─queue             # bull js 레디스 큐 모듈
├─redis             # 레디스 클라이언트 모듈
├─slack             # 관리자 인증, 슬랙 알림 모듈
├─sms               # naver sms 모듈
├─socket            # 실시간 입장확인 소켓 모듈
├─tickets           # 티켓 관련 모듈
└─users             # 유저,댓글 관련 모듈
```

<br/>

## 👀 서비스 화면

![고스락티켓22 drawio](https://user-images.githubusercontent.com/72291860/184826170-9d436c4a-ed41-4ba1-9e6e-a806dc0fad3e.png)


<br/>

## 💻 Developers

<table>
    <tr align="center">
        <td><B>Leader / Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Backend<B></td>
    </tr>
    <tr align="center">
        <td><B>이찬진<B></td>
        <td><B>김민준<B></td>
        <td><B>노경민<B></td>
        <td><B>김원진<B></td>
        <td><B>채승희<B></td>
    </tr>
    <tr align="center">
        <td>
            <img src="https://github.com/ImNM.png?size=100">
            <br>
            <a href="https://github.com/ImNM"><I>ImNM</I></a>
        </td>
        <td>
            <img src="https://github.com/sanbonai06.png?size=100">
            <br>
            <a href="https://github.com/sanbonai06"><I>sanbonai06</I></a>
        </td>
        <td>
            <img src="https://github.com/gengminy.png?size=100">
            <br>
            <a href="https://github.com/gengminy"><I>gengminy</I></a>
        </td>
        <td>
            <img src="https://github.com/kim-wonjin.png?size=100">
            <br>
            <a href="https://github.com/kim-wonjin"><I>kim-wonjin</I></a>
        </td>
        <td>
            <img src="https://github.com/chaeshee0908.png?size=100">
            <br>
            <a href="https://github.com/chaeshee0908"><I>chaeshee0908</I></a>
        </td>
    </tr>
</table>
