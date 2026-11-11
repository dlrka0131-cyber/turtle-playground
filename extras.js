// 거북이 코딩 놀이터 — 차시별로 새로 넣거나 바꾼 내용
// lesson.js 가 이 파일을 읽어서 각 차시의 원래 미션 목록에 끼워 넣거나 통째로 다시 짠다.
// 번호는 모두 "원래 차시 파일의 미션 순서(0부터)"다. 화면에 보이는 미션 번호와 다르다.
//
//   rebuild   b => [...]  원래 미션 배열 b 를 받아 새 목록을 돌려준다 (차시 흐름을 통째로 다시 짤 때. 1차시)
//   insert    [[번호, 미션]]  그 원래 미션 "바로 앞"에 끼워 넣는다
//   challenge 도전 미션. 마지막 자유 미션 바로 앞에 들어간다
//   review    복습 미션. 미리보기 바로 다음에 들어간다
//   clues     { 번호: 글 }  원래 미션의 1단계 "생각 힌트" (정답 힌트는 원래 hint 를 쓴다)
//   talk      { 번호: 글 }  원래 미션의 설명을 바꾼다 (설명이 정답을 그대로 말해 주던 곳)
//   recall    { 번호: [[원래 줄, 새 줄]] }  원래 미션의 한 줄을 다른 줄로 바꾼다
//   showPrep  true 면 거북이 데려오기 3줄을 접지 않고 펼쳐서 보여 준다
//
// 미션 종류(kind): 없음 = 코드 카드(따라 쓰기 type · 직접 쓰기 write · 빈칸 blank)
//   goal   흐린 목표 그림과 같은 그림이 나오면 통과 (고치기·바꾸기·조립하기·빈 화면에서 만들기)
//   pick   한글 설명을 보고 알맞은 코드를 순서대로 골라 넣는다
//   order  섞인 줄을 ▲▼ 로 옮겨 순서를 맞춘다
// 객관식은 쓰지 않는다. (찍게 되기 때문)

(function () {
  const P = { prep: true };
  const G = (given, note) => ({ given, note });
  const B = (blank, answers, note) => ({ blank, answers, note });
  const BOX = (...box) => ({ box });
  const START = G('t.penup(); t.goto(-250, 0); t.pendown()');
  const SQUARE = [G('def square():'), BOX(G('for i in range(4):'), BOX(G('t.forward(100)'), G('t.left(90)')))];
  const NEW_TURTLE = '🐢 새 거북이를 만드는 주문이에요. <b>"거북이"</b>를 영어로 쓰되, <b>첫 글자만 큰 글자</b>로 써요!';
  const DOWN_KEY = '🧭 방향 숫자는 오른쪽 0, 위 90, 왼쪽 180 … <b>90씩 커져요.</b> 아래는?<br>⌨️ 키 이름은 Up(위)의 <b>반대말</b>이고, 첫 글자는 큰 글자예요.';

  window.LESSON_EXTRAS = {
    1: {
      clues: {
        7: '🔺 세모는 변이 3개예요. 한 바퀴(360)를 변의 수로 나눠 보세요. <b>360 ÷ 3 = ?</b>',
        8: '⭐ 뾰족한 끝이 5개! 도는 숫자는 세모(120)보다 커요. <b>140과 150 사이</b>에서 찾아보세요.',
        9: '⬡ 육각형은 변이 6개예요. <b>360 ÷ 6 = ?</b>',
      },
    },
    2: {
      review: {
        title: '네모 그리기',
        talk: '지난 시간에 네모를 그렸죠? 네모는 <b>몇 번</b> 반복하고, <b>어떤 단어</b>로 왼쪽으로 돌았나요?',
        lines: [P, B('for i in range(@):', ['4'], '몇 번?'), BOX(G('t.forward(100)'), B('t.@(90)', ['left'], '왼쪽으로 돌기'))],
        clue: '⬜ 네모는 변이 몇 개죠? 그만큼 반복해요.<br>↩️ "왼쪽"은 영어로 <b>l</b> 로 시작하는 4글자예요.',
      },
    },
    3: {
      review: {
        title: '색칠하기',
        talk: '지난 시간에 배운 <b>색칠 시작</b>과 <b>색칠 끝</b>을 기억하나요? 빨간 동그라미를 칠해 보세요.',
        lines: [P, G('t.color("red")'), B('t.@()', ['begin_fill'], '색칠 시작!'), G('t.circle(60)'), B('t.@()', ['end_fill'], '색칠 끝!')],
      },
    },
    4: {
      review: {
        title: '펜 들고 내리기',
        talk: '가운데가 <b>끊어진 선</b>을 그려요. 지난 시간에 배운 펜 <b>들기</b>와 <b>내리기</b>를 기억해 보세요!',
        lines: [P, START, G('t.forward(100)'), B('t.@()', ['penup'], '펜 들기'), G('t.forward(100)'), B('t.@()', ['pendown'], '펜 내리기'), G('t.forward(100)')],
      },
    },
    5: {
      review: {
        title: '나만의 명령',
        talk: '지난 시간에 <b>새 명령을 만드는 단어</b>와 <b>명령을 부르는 방법</b>을 배웠어요. 기억해서 채워 보세요!',
        lines: [P, B('@ square():', ['def'], '"square" 명령 만들기'), BOX(G('for i in range(4):'), BOX(G('t.forward(100)'), G('t.left(90)'))), B('@()', ['square'], '네모 명령 실행!')],
      },
      clues: {
        4: '🌸 한 번에 45씩 돌아요. 45를 <b>몇 번</b> 더해야 한 바퀴 360이 될까요?',
        5: '🌼 한 바퀴는 360이에요. <b>360 ÷ 12 = ?</b>',
      },
    },
    6: {
      review: {
        title: '네모로 꽃 피우기',
        talk: '네모를 <b>8번</b> 그려서 꽃을 만들었죠? 8번 만에 딱 한 바퀴를 돌려면 한 번에 얼마씩 돌아야 할까요?',
        lines: [P, G('t.speed(0)'), ...SQUARE, G('for i in range(8):'), BOX(G('square()'), B('t.left(@)', ['45'], '얼마나 돌까?'))],
        clue: '🌸 한 바퀴는 360이에요. <b>360 ÷ 8 = ?</b>',
      },
      talk: {
        5: '이번엔 <b>아래로</b> 가요. 위 명령을 보고 빈칸 2개를 채워 보세요.<br>방향 숫자 실험에서 <b>아래쪽</b>은 몇이었죠? 키 이름은 Up 의 <b>반대말</b>이에요.',
      },
      clues: { 5: DOWN_KEY },
      challenge: {
        title: '왼쪽으로 가는 명령 ⬅️',
        talk: '<b>← 키</b>를 누르면 왼쪽으로 가게 만들어요.<br>왼쪽 방향 숫자, 키와 명령을 <b>연결하는 단어</b>, 키 이름까지 스스로!',
        lines: [P, G('def go_left():'), BOX(B('t.setheading(@)', ['180'], '왼쪽을 봐!'), G('t.forward(50)')), B('turtle.@(go_left, "@")', ['onkey', 'Left'], '← 키 → go_left'), G('turtle.listen()')],
        clue: '🧭 방향 숫자: 오른쪽 0, 위 90, <b>왼쪽은?</b>, 아래 270<br>🔗 연결하는 단어는 <b>on</b> 으로 시작해요. 키 이름은 "왼쪽"의 영어, 첫 글자는 큰 글자!',
      },
    },
    7: {
      review: {
        title: '키와 명령 연결하기',
        talk: '지난 시간에 ↑ 키와 명령을 <b>연결</b>하고, 마지막에 <b>귀를 열었죠?</b> 두 단어를 기억해 보세요!',
        lines: [P, G('def go_up():'), BOX(G('t.setheading(90)'), G('t.forward(50)')), B('turtle.@(go_up, "Up")', ['onkey'], '↑ 키를 누르면 go_up!'), B('turtle.@()', ['listen'], '귀 열기!')],
      },
      clues: {
        2: '⬇️ 위 빈칸: 펜 들기는 penup 이었죠? 내리기는 <b>pen</b> 뒤에 "아래"라는 영어가 붙어요.<br>⌨️ 아래 빈칸: 설명에 나온 <b>키 이름 한 글자!</b>',
        3: '🧽 위 빈칸: "지우기"는 <b>c</b> 로 시작하는 5글자예요. 📒 단어장을 열어 보세요.<br>⌨️ 아래 빈칸: 설명에 나온 <b>키 이름 한 글자!</b>',
      },
      challenge: {
        title: '굵은 펜 키 🖍️',
        talk: '<b>b 키</b>를 누르면 펜이 굵어지게 만들어요.<br>펜 굵기를 바꾸는 단어는 <b>2차시</b>에서 배웠어요. 키를 연결하는 단어도 떠올려 보세요!',
        base: 1,
        edits: [
          ['def pen_up():', G('def big_pen():')],
          ['t.penup()', B('t.@(10)', ['pensize'], '펜 굵기 10')],
          ['turtle.onkey(pen_up, "u")', B('turtle.@(big_pen, "b")', ['onkey'], 'b 키 → 굵은 펜')],
        ],
        clue: '🖍️ 굵기 단어는 <b>pen</b> 으로 시작하고 "크기(size)"가 붙어요.<br>🔗 연결하는 단어는 <b>on</b> 으로 시작해요.',
      },
    },
    8: {
      review: {
        title: '지우개 키',
        talk: '선을 그린 뒤 <b>c 키</b>로 지울 수 있게 해요. <b>지우기</b> 단어와 <b>귀 열기</b> 단어를 기억해 보세요!',
        lines: [P, G('t.forward(150)'), G('def erase():'), BOX(B('t.@()', ['clear'], '그림 지우기')), G('turtle.onkey(erase, "c")'), B('turtle.@()', ['listen'], '귀 열기!')],
      },
      challenge: {
        title: '도장 20번 찍기 🐾',
        talk: '아무 데나 도장을 <b>20번</b> 찍어요.<br>숫자를 <b>뽑는 단어</b>와, 뽑은 자리로 <b>가는 단어</b>를 스스로 써 보세요!',
        lines: [P, G('import random'), G('t.penup()'), B('for i in range(@):', ['20'], '몇 번?'),
          BOX(B('x = random.@(-250, 250)', ['randint'], '가로 숫자 뽑기'), G('y = random.randint(-150, 150)'), B('t.@(x, y)', ['goto'], '그 자리로 가!'), G('t.stamp()'))],
      },
    },
    9: {
      review: {
        title: '랜덤 도장',
        talk: '주사위로 가로 자리를 뽑아 도장을 찍었죠? <b>숫자 뽑기</b> 단어와 <b>도장 찍기</b> 단어를 기억해 보세요!',
        lines: [P, G('import random'), G('t.penup()'), B('x = random.@(-200, 200)', ['randint'], '숫자 뽑아서 x 상자에'), G('t.goto(x, 0)'), B('t.@()', ['stamp'], '도장 쾅!')],
      },
      challenge: {
        title: '클릭하면 동그라미 ⭕',
        talk: '클릭한 곳에 <b>동그라미</b>가 그려지는 마법을 만들어요.<br>클릭한 자리로 <b>가는 단어</b>와, 클릭과 마법을 <b>연결하는 단어</b>를 써 보세요!',
        lines: [P, G('t.color("purple")'), G('def magic(x, y):'), BOX(G('t.penup()'), B('t.@(x, y)', ['goto'], '클릭한 자리로!'), G('t.pendown()'), G('t.circle(20)')), B('turtle.@(magic)', ['onscreenclick'], '클릭하면 magic!')],
      },
    },
    10: {
      review: {
        title: '마우스 마법',
        talk: '클릭한 곳에 도장을 찍는 마법이에요. <b>도장 단어</b>와, 클릭했을 때 부를 <b>명령 이름</b>을 채워 보세요!',
        lines: [P, G('t.penup()'), G('def magic(x, y):'), BOX(G('t.goto(x, y)'), B('t.@()', ['stamp'], '도장 쾅!')), B('turtle.onscreenclick(@)', ['magic'], '클릭하면 어떤 명령?')],
      },
      challenge: {
        title: '상자 이름으로 그리기 📦',
        talk: '이번엔 숫자를 쓰면 안 돼요! 빈칸 2개에 <b>상자 이름</b>을 써서, 맨 윗줄 숫자만 바꾸면 도형이 바뀌게 만들어요.',
        lines: [P, G('t.color("red")'), G('n = 6', 'n 상자에 6 넣기'), B('for i in range(@):', ['n'], '상자 속 숫자만큼 반복'), BOX(G('t.forward(80)'), B('t.left(360 / @)', ['n'], '360 ÷ 상자 속 숫자'))],
        clue: '📦 맨 윗줄을 보세요. 숫자 6이 들어 있는 <b>상자의 이름</b>은 무엇인가요? 그 글자를 그대로 써요.',
      },
    },
    11: {
      review: {
        title: '몇 각형?',
        talk: '<b>n</b> 상자의 숫자만큼 변이 있는 도형을 그려요. 도는 숫자는 <b>한 바퀴</b>를 n 으로 나눈 거였죠?',
        lines: [P, G('n = 8'), G('for i in range(n):'), BOX(G('t.forward(60)'), B('t.left(@ / n)', ['360'], '한 바퀴 ÷ n'))],
        clue: '🔄 빙글 한 바퀴는 몇이었죠? 1차시부터 계속 나눴던 그 숫자예요!',
      },
      clues: { 5: '➖ 더하기(+)의 반대 기호예요. 키보드 숫자 0 바로 옆에 있어요.' },
      challenge: {
        title: '세모 달팽이 🔺🌀',
        talk: '이번엔 <b>세모 모양</b>으로 커지는 달팽이예요.<br>걷는 길이는 <b>상자 이름</b>으로, 도는 숫자는 <b>세모</b>에 맞게 써 보세요!',
        lines: [P, G('t.speed(0)'), G('size = 10'), G('for i in range(40):'), BOX(B('t.forward(@)', ['size'], '상자 속 숫자만큼'), B('t.left(@)', ['120'], '세모는 얼마나 돌까?'), G('size = size + 6'))],
        clue: '📦 첫 빈칸은 숫자가 아니라 <b>상자 이름</b>이에요.<br>🔺 둘째 빈칸: <b>360 ÷ 3 = ?</b>',
      },
    },
    12: {
      review: {
        title: '커지는 달팽이',
        talk: '<b>size</b> 상자의 숫자를 점점 키워서 달팽이를 그렸죠? 빈칸 2개를 채워 보세요.',
        lines: [P, G('t.speed(0)'), G('size = 20'), G('for i in range(20):'), BOX(B('t.forward(@)', ['size'], '상자 속 숫자만큼'), G('t.left(90)'), B('size = size @ 10', ['+'], '숫자 키우기'))],
        clue: '📦 첫 빈칸은 <b>상자 이름</b>이에요.<br>➕ 둘째 빈칸은 숫자를 <b>키우는 기호</b> 한 글자!',
      },
      clues: {
        4: '🎫 반복 줄 <b>for i in range(3)</b> 을 보세요. 0, 1, 2 로 바뀌는 글자가 무엇이죠?',
        5: '🚂 colors 기차 안의 색깔 낱말을 하나씩 세어 보세요.',
      },
      challenge: {
        title: '4칸 기차 🚃',
        talk: '색깔이 <b>4칸</b>인 기차예요. 몇 번 반복할지, 그리고 색을 꺼낼 <b>기차 이름</b>을 스스로 써 보세요!',
        lines: [P, START, G('colors = ["red", "gold", "green", "blue"]'), B('for i in range(@):', ['4'], '몇 번?'),
          BOX(B('t.color(@[i])', ['colors'], '기차의 i번 칸 색'), G('t.begin_fill()'), G('t.circle(30)'), G('t.end_fill()'), G('t.penup()'), G('t.forward(80)'), G('t.pendown()'))],
        clue: '🚃 첫 빈칸: 기차 칸을 세어 보세요.<br>🚂 둘째 빈칸: 위에서 만든 <b>기차의 이름</b>이에요. (= 기호 왼쪽을 보세요)',
      },
    },
    13: {
      review: {
        title: '색깔 기차',
        talk: '기차에서 <b>blue</b> 를 꺼내 파란 동그라미를 그려요. blue 는 <b>몇 번 칸</b>일까요? (번호는 어디서부터 셌죠?)',
        lines: [P, G('colors = ["red", "green", "blue"]'), B('t.color(colors[@])', ['2'], '몇 번 칸?'), G('t.begin_fill()'), G('t.circle(60)'), G('t.end_fill()')],
        clue: '🚂 칸 번호는 1이 아니라 <b>0부터</b> 세요! red 가 0번이에요.',
      },
      clues: { 5: '🔄 칸이 3개일 때는 <b>% 3</b> 이었어요. 칸이 2개면?' },
      challenge: {
        title: '4색 구슬 12개 📿',
        talk: '색깔 <b>4가지</b>가 돌고 도는 구슬 줄이에요.<br><b>나머지 기호</b>와 <b>나누는 수</b>를 스스로 써 보세요!',
        lines: [P, START, G('colors = ["red", "gold", "green", "blue"]'), G('for i in range(12):'),
          BOX(B('t.color(colors[i @ @])', ['%', '4'], '돌고 도는 번호의 색'), G('t.begin_fill()'), G('t.circle(15)'), G('t.end_fill()'), G('t.penup()'), G('t.forward(40)'), G('t.pendown()'))],
        clue: '🍬 첫 빈칸은 <b>나머지</b>를 구하는 기호예요. (숫자 5 키와 같이 있어요)<br>🔢 둘째 빈칸은 <b>기차의 칸 수</b>예요.',
      },
    },
    14: {
      review: {
        title: '돌고 도는 번호',
        talk: '<b>0 1 0 1 0 1</b> 이 나오게 하려면 몇으로 나눈 나머지를 써야 할까요?',
        lines: [G('for i in range(6):'), BOX(B('print(i % @)', ['2'], '나누는 수'))],
        clue: '🔄 나오는 숫자가 0, 1 <b>두 가지</b>예요. 3으로 나누면 0, 1, 2 세 가지가 나왔죠?',
      },
      clues: { 6: '🌸 첫 빈칸은 <b>잎사귀 수</b>예요. 둘째 빈칸은 <b>360 ÷ 잎사귀 수</b>!' },
      challenge: {
        title: '잎사귀 6장 🍀',
        talk: '잎사귀가 <b>6장</b>인 꽃이에요.<br>바깥 반복, 안쪽 반복(잎사귀 한 장), 다음 잎 자리로 도는 숫자까지 모두 스스로!',
        lines: [P, G('t.speed(0)'), G('t.color("purple")'), B('for i in range(@):', ['6'], '잎사귀 몇 장?'),
          BOX(B('for j in range(@):', ['2'], '조각 몇 개가 잎사귀 한 장?'), BOX(G('t.circle(100, 90)'), G('t.left(90)')), B('t.left(@)', ['60'], '다음 잎 자리로'))],
        clue: '🍃 잎사귀 한 장은 동그라미 조각 <b>2개</b>로 만들었어요.<br>🔄 다음 잎 자리로 도는 숫자는 <b>360 ÷ 잎사귀 수</b>예요.',
      },
    },
    15: {
      review: {
        title: '잎사귀 한 장',
        talk: '동그라미 조각 <b>2개</b>로 잎사귀 한 장을 만들었죠? 반복 횟수와 조각의 각도를 채워 보세요.',
        lines: [P, G('t.speed(0)'), G('t.color("green")'), G('t.begin_fill()'), B('for j in range(@):', ['2'], '조각 몇 개?'), BOX(B('t.circle(100, @)', ['90'], '1/4 조각'), G('t.left(90)')), G('t.end_fill()')],
        clue: '🍕 동그라미 한 바퀴는 360이에요. 1/4 조각은 <b>360 ÷ 4 = ?</b>',
      },
      clues: { 5: '📖 설명을 다시 읽어 보세요. 숫자가 나와 있어요! (10칸 × <b>?</b>번 = 400칸)' },
      challenge: {
        title: '벽 지킴이 완성하기 🧱',
        talk: '벽에 닿으면 돌아오는 코드를 <b>처음부터</b> 완성해요.<br>"만약에", "보다 크면", 그리고 뒤로 도는 숫자까지 스스로!',
        base: 5,
        edits: [
          ['for i in range(@):', G('for i in range(40):')],
          ['if t.xcor() > 120:', B('@ t.xcor() @ 120:', ['if', '>'], '만약에 120보다 크면')],
          ['t.right(180)', B('t.right(@)', ['180'], '뒤로 돌기!')],
        ],
        clue: '🤔 "만약에"는 영어로 <b>2글자</b>예요. "보다 크다"는 <b>기호 한 글자</b>!<br>🔄 뒤로 돌기는 <b>반 바퀴</b>예요. 360의 절반은?',
      },
    },
    16: {
      review: {
        title: '만약에',
        talk: '거북이가 150만큼 갔어요. 가로 위치가 120보다 크면 "벽이다!"라고 말하게 해요. <b>"만약에"</b>는 영어로 뭐였죠?',
        lines: [P, G('t.forward(150)'), B('@ t.xcor() > 120:', ['if'], '만약에 120보다 크면'), BOX(G('print("벽이다!")'))],
      },
      clues: {
        3: '⬇️ 위쪽 벽이 90이에요. 아래쪽 벽은 같은 숫자에 <b>마이너스(-)</b>를 붙여요.',
        5: '🧱 오른쪽 벽 150 ↔ 왼쪽 벽은? 위쪽 벽 90 ↔ 아래쪽 벽은? <b>마이너스(-)</b>를 붙여요.',
      },
      challenge: {
        title: '위·아래 벽 스스로 지키기 ↕️',
        talk: '위·아래로 왔다 갔다 하는 코드를 완성해요.<br><b>세로 위치</b>를 알려 주는 단어, <b>"아니면 만약에"</b>, 아래쪽 벽 숫자까지 스스로!',
        base: 3,
        edits: [
          ['if t.ycor() > 90:', B('if t.@() > 90:', ['ycor'], '세로 위치가 90보다 크면')],
          ['elif t.ycor() < @:', B('@ t.ycor() < @:', ['elif', '-90'], '아니면 만약에 아래쪽 벽이면')],
        ],
        clue: '↕️ 가로 위치는 xcor, <b>세로 위치</b>는 x 대신 다른 글자예요.<br>🙅 "아니면 만약에"는 <b>el</b> 로 시작하는 4글자! 아래쪽 벽은 90에 마이너스를 붙여요.',
      },
    },
    17: {
      review: {
        title: '아니면 만약에',
        talk: '오른쪽 벽(100)과 왼쪽 벽(-100) 사이를 왔다 갔다 해요. <b>"아니면 만약에"</b>는 영어로 뭐였죠?',
        lines: [P, G('t.speed(0)'), G('for i in range(60):'), BOX(G('t.forward(10)'), G('if t.xcor() > 100:'), BOX(G('t.right(180)')), B('@ t.xcor() < -100:', ['elif'], '아니면 만약에 왼쪽 벽이면'), BOX(G('t.right(180)')))],
      },
      challenge: {
        title: '재료를 넣는 네모 ⬜',
        talk: '크기를 재료로 받는 <b>square</b> 명령을 만들어요.<br>재료 칸 이름을 <b>두 군데</b>에 똑같이 쓰고, 큰 네모는 명령 이름을 써서 불러 보세요!',
        lines: [P, G('t.color("blue")'), B('def square(@):', ['size'], '재료 칸 이름'), BOX(G('for i in range(4):'), BOX(B('t.forward(@)', ['size'], '재료만큼 앞으로'), G('t.left(90)'))),
          G('square(50)', '작은 네모'), B('@(120)', ['square'], '큰 네모')],
        clue: '🥣 별 명령에서 쓴 재료 칸 이름과 같아요. "크기"라는 뜻의 영어 4글자!<br>⬜ 마지막 빈칸은 위에서 만든 <b>명령 이름</b>이에요.',
      },
    },
    18: {
      review: {
        title: '재료를 넣는 명령',
        talk: '<b>star</b> 명령은 재료(크기)를 받아요. 안쪽에서 그 재료를 쓰려면 빈칸에 무엇을 써야 할까요?',
        lines: [P, G('t.color("gold")'), G('def star(size):'), BOX(G('for i in range(5):'), BOX(B('t.forward(@)', ['size'], '재료만큼 앞으로'), G('t.left(144)'))), G('star(80)')],
        clue: '🥣 명령을 만드는 줄 <b>def star(…)</b> 의 괄호 안을 보세요. 그 이름을 그대로 써요.',
      },
      challenge: {
        title: '게임 제목 쓰기 🎮',
        talk: '화면 위쪽 한가운데에 <b>게임 제목</b>을 써요.<br>자리로 <b>가는 단어</b>, 글씨 <b>쓰는 단어</b>, <b>가운데 맞춤</b>까지 스스로!',
        lines: [P, G('t.hideturtle()'), G('t.penup()'), B('t.@(0, 50)', ['goto'], '(0, 50) 자리로!'), G('t.color("blue")'),
          B('t.@("My Game", align="@", font=("Arial", 30, "bold"))', ['write', 'center'], '가운데 맞춰 글씨 쓰기')],
      },
    },
    19: {
      review: {
        title: '글씨 쓰기',
        talk: '화면에 큰 글씨로 <b>Hello!</b> 를 써요. 글씨를 쓰는 단어를 기억해 보세요!',
        lines: [P, G('t.penup()'), G('t.goto(-100, 0)'), B('t.@("Hello!", font=("Arial", 30, "bold"))', ['write'], '글씨 쓰기')],
      },
      talk: {
        3: '점수를 올리는 줄은 <b>11차시</b>에서 배운 "상자 숫자 키우기"예요.<br>빈칸에 알맞은 <b>기호</b>를 써서 점수를 5점 올려 보세요. <code>t.clear()</code> 는 이전 글씨를 지워요.',
      },
      recall: { 3: [['score = score + 5', B('score = score @ 5', ['+'], '점수 올리기! (10 → 15)')]] },
      clues: { 3: '➕ 숫자를 <b>키우는 기호</b> 한 글자예요.' },
      challenge: {
        title: '2점씩 쌓는 점수판 🧮',
        talk: '5번 반복하면서 점수를 <b>2점씩</b> 올려요.<br>올리는 <b>기호</b>, 이전 글씨 <b>지우기</b>, 글씨 속에 넣을 <b>상자 이름</b>까지 스스로!',
        lines: [P, G('t.hideturtle()'), G('t.penup()'), G('score = 0'), G('for i in range(5):'),
          BOX(B('score = score @ 2', ['+'], '2점 올리기'), B('t.@()', ['clear'], '이전 글씨 지우기'), B('t.write(f"Score: {@}", font=("Arial", 24, "bold"))', ['score'], '점수 글씨 쓰기'))],
        clue: '🧽 "지우기"는 <b>c</b> 로 시작하는 5글자예요.<br>🔗 중괄호 { } 안에는 점수가 들어 있는 <b>상자 이름</b>을 써요.',
      },
    },
    20: {
      review: {
        title: '점수 글씨',
        talk: '점수를 5점 올려서 화면에 써요. 글씨 속 <b>{ }</b> 안에는 무엇을 넣어야 점수가 보일까요?',
        lines: [P, G('score = 10'), G('score = score + 5'), B('t.write(f"Score: {@}", font=("Arial", 24, "bold"))', ['score'], '점수 글씨 쓰기')],
        clue: '🔗 중괄호 { } 안에는 점수가 들어 있는 <b>상자 이름</b>을 써요. 맨 윗줄을 보세요!',
      },
      recall: {
        3: [['t2.goto(-150, -40)', B('t2.@(-150, -40)', ['goto'], 't2 는 아래쪽 레인 출발선')]],
        4: [['t2.forward(random.randint(1, 20))', B('t2.@(random.randint(1, 20))', ['forward'], 't2 달리기')]],
      },
      clues: { 5: '📖 설명을 다시 읽어 보세요. 몇 번 반복하라고 했죠?' },
      challenge: {
        title: '경주 코드 스스로 완성하기 🏁',
        talk: '세 마리 경주를 스스로 완성해요.<br>주사위 <b>상자 이름</b>, 둘째 <b>선수 이름</b>, 앞으로 <b>달리는 단어</b>를 채워 보세요!',
        base: 6,
        edits: [
          ['import random', B('import @', ['random'], '주사위 상자 열기')],
          ['t2.forward(random.randint(1, 12))', B('@.forward(random.randint(1, 12))', ['t2'], '둘째 선수 달리기')],
          ['t3.forward(random.@(1, 12))', B('t3.@(random.randint(1, 12))', ['forward'], 't3 달리기')],
        ],
        clue: '🎲 주사위 상자 이름은 아래 줄의 <b>…….randint</b> 앞에 있어요.<br>🐢 선수 이름은 t, <b>?</b>, t3 순서예요.',
      },
    },
    21: {
      review: {
        title: '두 번째 거북이',
        talk: '파란 거북이 <b>t2</b> 를 새로 만들어요. 거북이를 만드는 주문을 기억하나요?',
        lines: [P, G('t.color("red")'), B('t2 = turtle.@()', ['Turtle'], '두 번째 거북이!'), G('t2.shape("turtle")'), G('t2.color("blue")'), G('t2.penup()'), G('t2.goto(0, -40)')],
        clue: NEW_TURTLE,
      },
      recall: { 1: [['coin = turtle.Turtle()', B('coin = turtle.@()', ['Turtle'], '코인 만들기!')]] },
      clues: {
        1: NEW_TURTLE,
        5: '📏 앞 미션에서 "만약에 거리가 <b>?</b> 보다 작으면"의 숫자를 떠올려 보세요.',
      },
      challenge: {
        title: '코인 먹기 스스로 완성하기 🪙',
        talk: '거북이가 코인 가까이 가면 코인이 사라지게 해요.<br>"만약에", <b>거리 재는 단어</b>, <b>숨기는 단어</b>를 스스로 써 보세요!',
        base: 4,
        edits: [
          ['if t.distance(coin) < 20:', B('@ t.@(coin) < 20:', ['if', 'distance'], '만약에 거리가 20보다 작으면')],
          ['coin.hideturtle()', B('coin.@()', ['hideturtle'], '코인 숨기기')],
        ],
      },
    },
    22: {
      review: {
        title: '거리 재기',
        talk: '거북이와 코인 사이 <b>거리</b>를 재서 말해요. 거리를 재는 단어를 기억해 보세요!',
        lines: [P, G('t.penup()'), G('coin = turtle.Turtle()'), G('coin.shape("circle")'), G('coin.color("gold")'), G('coin.penup()'), G('coin.goto(100, 0)'), B('print(t.@(coin))', ['distance'], '코인까지 거리는?')],
      },
      clues: { 4: '📏 21차시에서 코인을 먹었다고 인정한 거리예요. <b>10보다 크고 30보다 작아요.</b>' },
      challenge: {
        title: '10점씩 올리기 🔟',
        talk: '<b>add</b> 명령을 한 번 부를 때마다 <b>10점</b>씩 오르게 해요. 두 번 부르면 20이 나와야 해요!<br>밖의 상자를 쓰겠다는 단어도 스스로 써 보세요.',
        base: 1,
        edits: [
          ['global score', B('@ score', ['global'], '밖의 score 를 쓸게요!')],
          ['score = score + 1', B('score = score + @', ['10'], '한 번에 몇 점?')],
        ],
      },
    },
    23: {
      review: {
        title: '명령 안에서 점수 올리기',
        talk: '명령 <b>안</b>에서 밖에 있는 score 상자를 바꾸려면, 맨 윗줄에 어떤 단어가 필요했죠?',
        lines: [G('score = 0'), G('def add():'), BOX(B('@ score', ['global'], '밖의 score 를 쓸게요!'), G('score = score + 1')), G('add()'), G('add()'), G('print(score)')],
      },
      talk: {
        4: '이제 방향키로 <b>도망쳐요!</b> 방향키 코드는 6차시에서 만든 거예요.<br>타이머 단어를 한 번 더 써 보고, 마지막에는 <b>귀 열기</b>가 필요해요. 6차시에서 배운 단어를 떠올려 보세요!',
      },
      recall: {
        4: [['turtle.ontimer(chase, 100)', B('turtle.@(chase, 100)', ['ontimer'], '0.1초 뒤에 chase 또 해!')]],
        5: [['turtle.ontimer(chase, 100)', G('turtle.ontimer(chase, 100)', '0.1초 뒤에 chase 또 해!')]],
      },
      challenge: {
        title: '쫓아오는 좀비 스스로 만들기 🧟',
        talk: '좀비가 계속 쫓아오는 코드를 스스로 완성해요.<br>나를 <b>쳐다보는 단어</b>, <b>타이머 단어</b>, 타이머가 다시 부를 <b>명령 이름</b>을 채워 보세요!',
        base: 3,
        edits: [
          ['enemy.setheading(enemy.towards(t))', B('enemy.setheading(enemy.@(t))', ['towards'], '나를 쳐다봐!')],
          ['turtle.ontimer(chase, 100)', B('turtle.@(@, 100)', ['ontimer', 'chase'], '0.1초 뒤에 또 해!')],
        ],
        clue: '👀 "~쪽으로"라는 뜻의 영어, <b>to</b> 로 시작해요. 📒 단어장을 열어 보세요.<br>⏱️ 타이머 단어는 <b>on</b> 으로 시작해요. 다시 부를 명령은 지금 만들고 있는 <b>바로 그 명령</b>이에요!',
      },
    },
    24: {
      review: {
        title: '쳐다보기',
        talk: '좀비가 나를 <b>쳐다보고</b> 다가오게 해요. 쳐다보는 방향을 알려 주는 단어를 기억해 보세요!',
        lines: [P, G('t.penup()'), G('t.goto(100, 60)'), G('enemy = turtle.Turtle()'), G('enemy.color("green")'), B('enemy.setheading(enemy.@(t))', ['towards'], '나를 쳐다봐!'), G('enemy.forward(80)')],
        clue: '👀 "~쪽으로"라는 뜻의 영어예요. <b>to</b> 로 시작하는 7글자!',
      },
      recall: { 1: [['if enemy.distance(t) < 20:', B('if enemy.@(t) < 20:', ['distance'], '만약에 좀비가 20보다 가까우면')]] },
      challenge: {
        title: '게임 오버 스스로 완성하기 💀',
        talk: '잡히면 GAME OVER, 아니면 계속 쫓아오는 코드를 완성해요.<br>"만약에", <b>거리 재는 단어</b>, "아니면"을 스스로 써 보세요!',
        base: 3,
        edits: [['if enemy.distance(t) < 20:', B('@ enemy.@(t) < 20:', ['if', 'distance'], '만약에 좀비가 20보다 가까우면')]],
      },
    },
    25: {
      review: {
        title: '아니면',
        talk: '점수가 10보다 크지 <b>않으면</b> "작은 점수"라고 말해요. <b>"아니면"</b>은 영어로 뭐였죠?',
        lines: [G('score = 5'), G('if score > 10:'), BOX(G('print("큰 점수")')), B('@:', ['else'], '아니면'), BOX(G('print("작은 점수")'))],
      },
      recall: {
        1: [['body = turtle.Turtle()', B('body = turtle.@()', ['Turtle'], '몸통 만들기!')]],
        5: [['snakes[0].color("red")', B('snakes[@].color("red")', ['0'], '머리는 빨간색!')]],
      },
      clues: {
        1: NEW_TURTLE,
        5: '🚂 맨 앞 칸의 번호예요. 번호는 1이 아니라 <b>어디서부터</b> 셌죠?',
      },
      challenge: {
        title: '꼬리 색 바꾸기 🐍',
        talk: '5칸짜리 뱀을 만들고, 이번엔 <b>꼬리(맨 마지막 칸)</b>를 파란색으로 칠해요.<br>기차에 <b>붙이는 단어</b>와 꼬리의 <b>칸 번호</b>를 스스로! (번호는 0부터 세요)',
        base: 5,
        edits: [
          ['snakes.append(body)', B('snakes.@(body)', ['append'], '기차에 붙이기')],
          ['snakes[0].color("red")', B('snakes[@].color("blue")', ['4'], '꼬리는 파란색!')],
        ],
        clue: '🚂 붙이는 단어는 <b>ap</b> 로 시작해요. 📒 단어장을 열어 보세요.<br>🔢 5칸의 번호는 0, 1, 2, 3, <b>?</b>',
      },
    },
    26: {
      review: {
        title: '기차에 붙이기',
        talk: '빈 기차에 몸통 한 칸을 <b>붙이고</b>, 기차가 <b>몇 칸</b>인지 말해요. 두 단어를 기억해 보세요!',
        lines: [G('snakes = []'), G('body = turtle.Turtle()'), G('body.shape("circle")'), G('body.color("green")'), B('snakes.@(body)', ['append'], '기차에 붙이기'), B('print(@(snakes))', ['len'], '칸이 몇 개?')],
        clue: '🚂 붙이는 단어는 <b>ap</b> 로 시작하는 6글자예요.<br>📏 칸 수를 세는 단어는 "길이(length)"를 줄인 <b>3글자</b>예요.',
      },
      recall: { 1: [['print(len(snakes))', B('print(@(snakes))', ['len'], '칸이 몇 개?')]] },
      clues: {
        1: '📏 칸 수를 세는 단어는 "길이(length)"를 줄인 <b>3글자</b>예요. 설명에도 나와 있어요!',
        3: '⬇️ 거꾸로 세려면 "하나씩 줄이기"가 필요해요. 1 앞에 <b>기호 하나</b>를 붙여요.',
      },
      challenge: {
        title: '따라오는 뱀 스스로 만들기 🐍',
        talk: '꼬리부터 앞 칸 자리로 옮기고, 머리를 한 칸 전진시켜요.<br><b>거꾸로 세기</b>, <b>바로 앞 칸 번호</b>, <b>머리 번호</b>를 스스로 써 보세요!',
        base: 4,
        edits: [
          ['for i in range(len(snakes) - 1, 0, -1):', B('for i in range(len(snakes) - 1, 0, @):', ['-1'], '꼬리부터 거꾸로')],
          ['snakes[i].goto(snakes[i-1].xcor(), snakes[i-1].ycor())', B('snakes[i].goto(snakes[@].xcor(), snakes[i-1].ycor())', ['i-1'], '앞 칸 자리로!')],
          ['snakes[0].forward(20)', B('snakes[@].forward(20)', ['0'], '머리가 한 칸 앞으로')],
        ],
        clue: '⬇️ 거꾸로 세기는 1 앞에 <b>마이너스</b>!<br>🚃 i번 칸의 <b>바로 앞 칸</b>은 i 에서 1을 뺀 번호예요. 같은 줄 오른쪽을 보세요.<br>🐍 머리는 맨 앞 칸, 번호는 <b>0부터</b>!',
      },
    },
    27: {
      review: {
        title: '거꾸로 세기',
        talk: '<b>3, 2, 1</b> 이 나오게 거꾸로 세요. 마지막 빈칸에 무엇을 써야 하나씩 줄어들까요?',
        lines: [B('for i in range(3, 0, @):', ['-1'], '3부터 1까지 거꾸로'), BOX(G('print(i)'))],
        clue: '⬇️ "하나씩 줄이기"예요. 1 앞에 <b>마이너스(-)</b>를 붙여요.',
      },
      talk: {
        4: '위로 가는 중에는 아래로, 아래로 가는 중에는 위로 못 돌게 해요.<br>위(90)와 아래(270)는 서로 <b>반대</b>예요. 어느 빈칸에 어느 숫자가 들어갈까요?',
      },
      recall: { 1: [['turtle.onkey(go_up, "Up")', B('turtle.@(go_up, "Up")', ['onkey'], '↑ 키 → go_up')]] },
      clues: {
        2: DOWN_KEY,
        4: '🧭 방향 숫자는 위 90, 아래 270이에요. 줄 옆의 <b>회색 설명</b>을 읽고 알맞은 숫자를 골라 보세요.',
      },
      challenge: {
        title: '오른쪽 키 스스로 만들기 ➡️',
        talk: '<b>→ 키</b>로 오른쪽을 보게 만들어요. 단, <b>왼쪽(180)</b>으로 가는 중에는 못 돌게 막아야 해요!<br>막을 방향 숫자, 볼 방향 숫자, 키 이름을 스스로!',
        base: 3,
        edits: [
          ['def go_left():', G('def go_right():')],
          ['if snakes[0].heading() != 0:', B('if snakes[0].heading() != @:', ['180'], '왼쪽을 보고 있지 않으면')],
          ['snakes[0].setheading(180)', B('snakes[0].setheading(@)', ['0'], '오른쪽을 봐!')],
          ['turtle.onkey(go_left, "Left")', B('turtle.onkey(go_right, "@")', ['Right'], '→ 키')],
        ],
        clue: '🧭 방향 숫자: <b>오른쪽 0</b>, 위 90, <b>왼쪽 180</b>, 아래 270<br>⌨️ 키 이름은 "오른쪽"의 영어, 첫 글자는 큰 글자!',
      },
    },
    28: {
      review: {
        title: '방향키 연결',
        talk: '↑ 키를 누르면 위로 가게 해요. <b>위쪽 방향 숫자</b>와 <b>키 이름</b>을 기억해 보세요!',
        lines: [P, G('def go_up():'), BOX(B('t.setheading(@)', ['90'], '위쪽을 봐!'), G('t.forward(50)')), B('turtle.onkey(go_up, "@")', ['Up'], '↑ 키'), G('turtle.listen()')],
        clue: '🧭 방향 숫자: 오른쪽 0, <b>위는?</b>, 왼쪽 180, 아래 270<br>⌨️ 키 이름은 "위"의 영어 2글자, 첫 글자는 큰 글자!',
      },
      recall: { 1: [['food = turtle.Turtle()', B('food = turtle.@()', ['Turtle'], '사과 만들기!')]] },
      clues: { 1: NEW_TURTLE },
      challenge: {
        title: '자라는 뱀 스스로 만들기 🆕',
        talk: '새 몸통을 <b>꼬리 끝 자리</b>에 놓고 기차에 붙여요.<br>맨 끝 칸을 가리키는 <b>번호</b>와, 기차에 <b>붙이는 단어</b>를 스스로!',
        base: 3,
        edits: [
          ['body.goto(snakes[-1].xcor(), snakes[-1].ycor())', B('body.goto(snakes[@].xcor(), snakes[@].ycor())', ['-1', '-1'], '꼬리 끝 자리에 놓기')],
          ['snakes.append(body)', B('snakes.@(body)', ['append'], '기차에 붙이기')],
        ],
        clue: '🚃 맨 끝 칸은 "뒤에서 첫 번째"예요. 1 앞에 <b>마이너스(-)</b>를 붙여요. 두 빈칸에 같은 것을 써요!<br>🚂 붙이는 단어는 <b>ap</b> 로 시작하는 6글자예요.',
      },
    },
    29: {
      review: {
        title: '사과까지 거리',
        talk: '거북이와 사과 사이 <b>거리</b>가 100보다 작으면 "사과가 가까워요!"라고 말해요. 거리를 재는 단어는?',
        lines: [P, G('food = turtle.Turtle()'), G('food.shape("circle")'), G('food.color("red")'), G('food.penup()'), G('food.goto(60, 0)'), B('if t.@(food) < 100:', ['distance'], '거리가 100보다 작으면'), BOX(G('print("사과가 가까워요!")'))],
      },
      talk: {
        5: '이제 다 합쳐요! 한 칸 움직일 때마다 <b>벽에 닿았나? 몸통을 물었나?</b> 를 확인하고, 하나라도 맞으면 죽은 거예요!<br>죽었으면 GAME OVER, 아니면 계속 기어가요. 빈칸 4개를 채워 보세요!',
      },
      clues: {
        4: '📖 설명을 다시 읽어 보세요. 거리가 <b>몇</b>보다 작으면 물은 거라고 했죠?',
        5: '🧱 첫 줄 빈칸 3개는 모두 같은 단어, <b>"또는"</b>이에요.<br>💀 마지막 빈칸은 "맞다"는 뜻의 영어! 첫 글자는 큰 글자 <b>T</b>.',
      },
      challenge: {
        title: '몸통 물었나 스스로 확인하기 😱',
        talk: '머리가 몸통에 닿았는지 확인해요.<br>머리(0번)를 뺀 <b>몸통만</b> 꺼내는 번호와, <b>거리 재는 단어</b>를 스스로 써 보세요!',
        base: 4,
        edits: [
          ['for body in snakes[1:]:', B('for body in snakes[@:]:', ['1'], '몸통만 하나씩!')],
          ['if snakes[0].distance(body) < @:', B('if snakes[0].@(body) < 10:', ['distance'], '머리가 몸통에 닿았으면')],
        ],
        clue: '🐍 머리는 0번이에요. 몸통은 <b>그 다음 번호</b>부터 끝까지!<br>📏 거리 재는 단어는 <b>di</b> 로 시작하는 8글자예요.',
      },
    },
    30: {
      review: {
        title: '또는, 맞다/아니다',
        talk: '오른쪽 벽 <b>또는</b> 왼쪽 벽을 넘었으면 죽은 거예요. "또는"과 "맞다"를 영어로 써 보세요!',
        lines: [G('x = 200'), G('dead = False'), B('if x > 140 @ x < -140:', ['or'], '오른쪽 벽 또는 왼쪽 벽이면'), BOX(B('dead = @', ['True'], '죽었다!')), G('print(dead)')],
        clue: '🧱 "또는"은 영어로 <b>2글자</b>예요.<br>💀 "맞다"는 윗줄 False 의 반대말! 첫 글자는 큰 글자 <b>T</b>.',
      },
      recall: { 2: [['turtle.onscreenclick(t.goto)', B('turtle.@(t.goto)', ['onscreenclick'], '클릭하면 그리기!')]] },
      challenge: {
        title: '그림판 스스로 조립하기 🎨',
        talk: '끌어서 그리고, c 키로 지우는 그림판을 스스로 완성해요.<br><b>지우기</b>, <b>끌기</b>, <b>귀 열기</b> 단어 3개를 채워 보세요!',
        base: 3,
        edits: [
          ['t.ondrag(t.goto)', B('t.@(t.goto)', ['ondrag'], '끌고 다니면 그리기!')],
          ['turtle.listen()', B('turtle.@()', ['listen'], '귀 열기!')],
        ],
        clue: '🧽 지우기는 <b>c</b> 로 시작하는 5글자!<br>🖱️ 끌기는 <b>on</b> 뒤에 "끌다(drag)"가 붙어요.<br>👂 귀 열기는 "듣다"라는 뜻의 영어 6글자예요.',
      },
    },
  };

  // ====================================================================================
  // 생각하는 미션 (1~5차시)
  //   pick     한글 설명을 보고 알맞은 코드를 순서대로 골라 넣는다
  //   goal     흐린 목표 그림과 똑같이 그려지게 코드를 고치거나(고치기) 처음부터 쓴다(만들기).
  //            글자가 아니라 "그려진 그림"으로 맞았는지 본다. 방법이 달라도 그림이 같으면 통과.
  //   order    섞인 줄을 ▲▼ 로 옮겨 순서를 맞춘다. 역시 그림으로 확인한다.
  // ====================================================================================
  const E = window.LESSON_EXTRAS;
  const PT = 'import turtle\nt = turtle.Turtle()\nt.shape("turtle")\n';
  const code = (...lines) => lines.join('\n');
  const fix = (title, talk, broken, fixed, clue) => ({ kind: 'goal', title: '🔧 고치기! ' + title, talk, start: PT + broken + '\n', solution: PT + fixed + '\n', clue,
    done: '버그를 찾아 고쳤어요! 🔧 코딩에서 제일 중요한 힘이에요. <b>다음 →</b>' });
  const SQ = code('def square():', '    for i in range(4):', '        t.forward(100)', '        t.left(90)');

  // ---------- 1차시: 흐름을 통째로 다시 짰다 ----------
  // 거북이 데려오기 3줄을 직접 써 보며 뜻을 알고, 그 뒤로는
  // 직접 쓰기 → 조립 → 고치기·바꾸기 → 코드 고르기 → 빈 화면에서 만들기로 이어 간다. (객관식은 쓰지 않는다)
  const P1 = {
    bring: { title: '거북이 데려오기 🐢',
      talk: '거북이를 무대에 데려오려면 <b>3줄</b>이 필요해요. 모든 거북이 코딩은 이 3줄로 시작해요!<br>'
        + '① <b>거북이 상자</b>를 열고 → ② 상자에서 거북이를 꺼내 <b>t</b> 라고 부르고 → ③ t 를 <b>거북이 모양</b>으로 바꿔요.<br>'
        + '<span class="small">③번 줄이 없으면 거북이 대신 화살표(▶)가 나와요. 줄마다 맡은 일이 있어요!</span><br>'
        + '<b>흐린 글씨</b> 위에 그대로 따라 써 보세요. 쓰면 글씨가 진해져요.',
      lines: [
        { type: 'import turtle', note: '① 거북이 상자 열기' },
        { type: 't = turtle.Turtle()', note: '② 거북이를 꺼내 t 라고 부르기' },
        { type: 't.shape("turtle")', note: '③ t 를 거북이 모양으로' },
      ],
      done: '거북이가 나타났어요! 🎉 <b>상자 열기 → 거북이 꺼내기 → 거북이 모양</b>. 이 순서를 기억해 두세요!' },
    write: { title: '직접 써 보기 🔢',
      talk: '괄호 <b>( )</b> 안의 숫자는 <b>얼마나 멀리</b> 갈지예요.<br>이번엔 보여 주는 글씨가 없어요! 방금 쓴 <b>앞으로 가는 명령</b>을 떠올려서, <b>원하는 숫자</b>로 직접 써 보세요. <span class="small">(예: 30, 200)</span>',
      lines: [{ prep: true }, { write: 't.forward(@)', note: '앞으로 ? 만큼', placeholder: '✏️ 앞으로 가는 명령을 직접 써 보세요' }],
      done: '보지 않고 스스로 썼어요! 👍 숫자가 크면 멀리, 작으면 조금 가요. 숫자를 바꿔서 또 실행해 봐도 돼요.' },
    square: { kind: 'goal', title: '🧩 조립하기! 네모 만들기',
      talk: '이번엔 타자 대신 <b>단어 버튼</b>으로 코드를 조립해요. 버튼을 누르면 한 줄씩 써져요.<br>흐린 그림 같은 <b>네모</b>가 되려면 어떤 버튼을 <b>어떤 순서로 몇 번</b> 눌러야 할까요?',
      start: PT, fullAnswer: true,
      solution: PT + code('t.forward(100)', 't.left(90)', 't.forward(100)', 't.left(90)', 't.forward(100)', 't.left(90)', 't.forward(100)', 't.left(90)') + '\n',
      bank: ['t.forward(100)', 't.left(90)'],
      clue: '⬜ 네모의 변 하나는 <b>앞으로 가기</b>, 모서리 하나는 <b>왼쪽으로 돌기</b>예요. 변은 모두 몇 개인가요?',
      done: '네모 완성! 🎉<br>그런데… 똑같은 2줄을 <b>4번이나</b> 썼어요. 너무 길죠? 😵<br>거북이에게 <b>"이거 4번 해 줘!"</b> 하고 한 번에 말하는 방법이 있어요! <b>다음 →</b>' },
    small: Object.assign(fix('더 작은 네모로', '방금 만든 네모 코드예요. 이 코드를 <b>고쳐서</b> 흐린 그림처럼 <b>더 작은 네모</b>로 만들어 보세요.<br>먼저 ▶ 실행해서 지금 네모와 흐린 네모를 비교해 보세요. 어느 숫자를 바꿔야 할까요?',
      code('for i in range(4):', '    t.forward(100)', '    t.left(90)'), code('for i in range(4):', '    t.forward(50)', '    t.left(90)'),
      '📏 숫자가 세 개 있어요. <b>반복 횟수</b>, <b>변의 길이</b>, <b>도는 숫자</b>. 크기를 정하는 건 어느 것일까요?<br>흐린 네모는 지금 네모의 <b>딱 절반</b>이에요.'),
      { title: '🔧 바꾸기! 더 작은 네모로', done: '작은 네모 완성! 📏 숫자 하나가 그림의 크기를 정해요. <b>다음 →</b>' }),
    tri: fix('세모가 이상해요', '네모 코드를 조금 바꿔서 <b>세모</b>를 그리려고 했어요. 반복은 3번으로 바꿨는데 이상한 모양이 나와요! 😵<br>먼저 <b>▶ 실행하기</b>로 무엇이 잘못됐는지 보고, <b>한 군데만</b> 고쳐서 흐린 그림과 똑같이 만들어 보세요.',
      code('for i in range(3):', '    t.forward(100)', '    t.left(90)'), code('for i in range(3):', '    t.forward(100)', '    t.left(120)'),
      '🔺 거북이가 도형을 다 그리고 제자리로 오면 <b>빙글 한 바퀴(360)</b>를 돈 거예요.<br>네모는 4번에 나눠 돌아서 360 ÷ 4 = 90. 세모는 3번에 나눠 도니까 <b>360 ÷ 3 = ?</b>'),
    star: fix('별이 그리다 말았어요', '맨 처음에 본 <b>별</b>을 그리는 코드예요. 별은 뾰족한 끝이 <b>5개</b>인데, 그리다 말았어요! 😵<br>▶ 실행해서 확인하고, <b>한 군데만</b> 고쳐서 별을 완성해 보세요.',
      code('for i in range(3):', '    t.forward(150)', '    t.left(144)'), code('for i in range(5):', '    t.forward(150)', '    t.left(144)'),
      '⭐ 선이 몇 개 그려졌는지 세어 보세요. 별에는 선이 몇 개 필요할까요? <b>몇 번 반복</b>하는지 정하는 숫자를 찾아보세요.'),
    hex: Object.assign(fix('네모를 육각형으로', '이번엔 고장 난 게 아니에요! 잘 되는 <b>네모 코드</b>를 여러분이 <b>바꿔서</b>, 흐린 그림 같은 <b>육각형(변 6개)</b>으로 만들어 보세요.<br>숫자 <b>두 군데</b>를 바꿔야 해요.',
      code('for i in range(4):', '    t.forward(100)', '    t.left(90)'), code('for i in range(6):', '    t.forward(100)', '    t.left(60)'),
      '⬡ 반복 횟수는 <b>변의 수</b>만큼!<br>도는 숫자는 한 바퀴를 변의 수로 나눠요. <b>360 ÷ 6 = ?</b>'),
      { title: '🔧 바꾸기! 네모를 육각형으로', done: '육각형 완성! ⬡ 숫자 두 개만 바꿔서 전혀 다른 도형을 만들었어요. <b>다음 →</b>' }),
    circle: { kind: 'pick', noPrep: true, title: '🧩 골라서 만들기! 빨간 동그라미',
      talk: '이번엔 <b>처음부터 끝까지</b> 여러분이 코드를 골라서 만들어요.<br>왼쪽 <b>한글 설명</b>을 읽고, 그 일을 하는 <b>코드</b>를 아래에서 골라 순서대로 눌러 보세요.<br><span class="small">새 단어: <b>color</b> = 색깔, <b>circle</b> = 동그라미</span>',
      steps: [
        { ko: '① 거북이 상자 열기', code: 'import turtle' },
        { ko: '② 거북이를 꺼내 t 라고 부르기', code: 't = turtle.Turtle()' },
        { ko: '③ t 를 거북이 모양으로', code: 't.shape("turtle")' },
        { ko: '④ 펜을 빨간색으로', code: 't.color("red")' },
        { ko: '⑤ 크기 80인 동그라미 그리기', code: 't.circle(80)' },
      ],
      bank: ['t.circle(80)', 't = turtle.Turtle()', 't.forward(80)', 't.color("red")', 'import turtle', 't.left(80)', 't.shape("turtle")'],
      clue: '🔤 영어 단어를 살펴보세요. <b>import</b> 는 "가져오다", <b>shape</b> 는 "모양", <b>color</b> 는 "색깔", <b>circle</b> 은 "동그라미"예요.<br>forward(앞으로)와 left(왼쪽)는 이번에 쓰지 않아요.',
      done: '빨간 동그라미 완성! ⭕ 코드 한 줄 한 줄이 무슨 일을 하는지 알고 골랐어요. <b>다음 →</b>' },
    stairs: { kind: 'goal', challenge: true, title: '🏆 도전! 계단 만들기 🪜',
      talk: '이번엔 <b>완전히 빈 화면</b>이에요! 흐린 그림처럼 <b>계단 3칸</b>을 그려 보세요.<br>맨 먼저 <b>거북이부터 데려와야</b> 해요. 계단 한 칸은 <b>앞으로 50 → 위로 50</b> 이에요.<br>방법은 여러 가지! 그림만 똑같으면 성공이에요.',
      start: '',
      solution: PT + code('for i in range(3):', '    t.forward(50)', '    t.left(90)', '    t.forward(50)', '    t.right(90)') + '\n', fullAnswer: true,
      bank: ['t.shape("turtle")', 'import turtle', 't = turtle.Turtle()', 't.forward( )', 't.left( )', 't.right( )', 'for i in range( ):'],
      must: [['import turtle', '그림은 똑같아요! 👍 그런데 맨 위에 <b>거북이 상자를 여는 줄</b>이 빠졌어요.'], ['t.shape("turtle")', '그림은 똑같아요! 👍 그런데 화살표가 그리고 있어요. <b>거북이 모양으로 바꾸는 줄</b>을 넣어 보세요.']],
      clue: '🐢 첫머리 3줄: <b>상자 열기 → 거북이 꺼내기 → 거북이 모양</b> 순서예요.<br>🪜 계단 한 칸을 말로 해 보세요: <b>앞으로 → 왼쪽으로 돌기 → 앞으로 → 오른쪽으로 돌기</b>. 이걸 몇 번 하면 3칸이 될까요?',
      done: '빈 화면에서 스스로 만들어 냈어요! 🏆 이게 진짜 코딩이에요. <b>다음 →</b>' },
  };
  delete E[1].clues;
  Object.assign(E[1], {
    showPrep: true,
    // 원래 미션에서 남긴 것: 0 미리보기, 2 앞으로 가, 4 돌아, 6 반복, 11 자유
    rebuild: b => [b[0], P1.bring, b[2], P1.write, b[4], P1.square, b[6], P1.small, P1.tri, P1.star, P1.hex, P1.circle, P1.stairs, b[11]],
  });

  // ---------- 2차시: 1차시 방식으로 통째로 다시 짰다 ----------
  // 새 명령(color, pensize, begin_fill/end_fill)을 따라 써 보고 → 직접 쓰기 → 조립 →
  // 줄이 빠진 코드 고치기 → 바꾸기 → 코드 고르기 → 빈 화면에서 만들기로 이어 간다.
  const FILL = 't.begin_fill()', END = 't.end_fill()';
  const P2 = {
    write: { title: '직접 써 보기 🖍️',
      talk: '펜을 굵게 하는 명령, 기억나나요? 이번엔 보여 주는 글씨가 없어요!<br>괄호 안 숫자는 <b>원하는 굵기</b>로 정해서, 펜 굵기를 바꾸는 줄을 <b>직접</b> 써 보세요. <span class="small">(예: 3, 20)</span>',
      lines: [{ prep: true }, { given: 't.color("red")', note: '빨간색 펜' }, { write: 't.pensize(@)', note: '펜 굵기 ?', placeholder: '✏️ 펜 굵기를 바꾸는 명령을 직접 써 보세요' }, { given: 't.circle(80)', note: '동그라미 80' }],
      done: '보지 않고 스스로 썼어요! 👍 숫자가 클수록 선이 뚱뚱해져요.' },
    apple: { kind: 'goal', title: '🧩 조립하기! 빨간 사과',
      talk: '단어 버튼으로 <b>속이 꽉 찬 빨간 동그라미</b>를 조립해 보세요.<br>색칠은 샌드위치 같아요. 어떤 버튼을 <b>어떤 순서로</b> 눌러야 안이 칠해질까요?',
      start: PT, fullAnswer: true,
      solution: PT + code('t.color("red")', FILL, 't.circle(80)', END) + '\n',
      bank: ['t.circle(80)', 't.end_fill()', 't.color("red")', 't.begin_fill()'],
      clue: '🪣 색칠은 <b>시작 → 그리기 → 끝</b> 순서예요. 동그라미를 그리기 <b>전</b>에 시작하고, 다 그린 <b>뒤</b>에 끝내요.<br>🎨 색은 맨 처음에 정해요.',
      done: '빨간 사과 완성! 🍎 순서가 틀리면 칠해지지 않아요. 컴퓨터는 <b>쓴 순서대로만</b> 해요. <b>다음 →</b>' },
    green: fix('초록 네모가 안 칠해져요', '속이 꽉 찬 <b>초록 네모</b>를 그리려고 했는데 선만 나와요! 😵<br>먼저 <b>▶ 실행하기</b>로 확인하고, <b>빠진 줄 하나</b>를 알맞은 자리에 넣어 보세요.',
      code('t.color("green")', FILL, 'for i in range(4):', '    t.forward(120)', '    t.left(90)'),
      code('t.color("green")', FILL, 'for i in range(4):', '    t.forward(120)', '    t.left(90)', END),
      '🪣 색칠을 <b>시작</b>하면 꼭 <b>끝</b>도 해야 칠해져요. 끝내는 줄은 도형을 다 그린 <b>뒤</b>에 써요.'),
    star: fix('노란 별이 안 칠해져요', '이번에도 칠이 안 돼요! 😵 <b>노란 별</b>을 칠하려고 했는데 선만 그려져요.<br>▶ 실행해서 확인하고, 이번엔 <b>다른 줄</b>이 빠졌어요. 찾아서 넣어 보세요.',
      code('t.color("gold")', 'for i in range(5):', '    t.forward(150)', '    t.left(144)', END),
      code('t.color("gold")', FILL, 'for i in range(5):', '    t.forward(150)', '    t.left(144)', END),
      '🌟 샌드위치의 위쪽 빵이 없어요. 색칠 <b>시작</b> 줄이 있나요? 그리기 <b>전에</b> 있어야 해요.'),
    blue: Object.assign(fix('초록 네모를 파란 세모로', '이번엔 고장 난 게 아니에요! 잘 되는 <b>초록 네모</b> 코드를 <b>바꿔서</b>, 흐린 그림 같은 <b>파란 세모</b>로 만들어 보세요.<br>숫자와 색을 <b>세 군데</b> 바꿔야 해요.',
      code('t.color("green")', FILL, 'for i in range(4):', '    t.forward(120)', '    t.left(90)', END),
      code('t.color("blue")', FILL, 'for i in range(3):', '    t.forward(120)', '    t.left(120)', END),
      '🔺 세모는 변이 <b>3개</b>, 도는 숫자는 <b>360 ÷ 3 = ?</b><br>🎨 색 이름도 영어로 바꿔요.'),
      { title: '🔧 바꾸기! 초록 네모를 파란 세모로', done: '파란 세모 완성! 🔺 색, 횟수, 도는 숫자를 바꿔서 전혀 다른 그림을 만들었어요. <b>다음 →</b>' }),
    pick: { kind: 'pick', noPrep: true, title: '🧩 골라서 만들기! 굵은 노란 별',
      talk: '처음부터 끝까지 코드를 <b>골라서</b> 만들어요.<br>왼쪽 <b>한글 설명</b>을 읽고, 그 일을 하는 <b>코드</b>를 골라 순서대로 눌러 보세요. 안쪽 줄은 들여써져 있어요.',
      steps: [
        { ko: '① 거북이 상자 열기', code: 'import turtle' },
        { ko: '② 거북이를 꺼내 t 라고 부르기', code: 't = turtle.Turtle()' },
        { ko: '③ t 를 거북이 모양으로', code: 't.shape("turtle")' },
        { ko: '④ 펜을 금색으로', code: 't.color("gold")' },
        { ko: '⑤ 펜을 굵기 8로', code: 't.pensize(8)' },
        { ko: '⑥ 색칠 시작!', code: 't.begin_fill()' },
        { ko: '⑦ 5번 해 줘!', code: 'for i in range(5):' },
        { ko: '⑧ 앞으로 150', code: 't.forward(150)', indent: 1 },
        { ko: '⑨ 별 각도 144로 돌기', code: 't.left(144)', indent: 1 },
        { ko: '⑩ 색칠 끝!', code: 't.end_fill()' },
      ],
      bank: ['t.left(144)', 't.end_fill()', 'for i in range(5):', 't.color("gold")', 'import turtle', 't.pensize(8)', 't.begin_fill()', 't.forward(150)', 't = turtle.Turtle()', 't.shape("turtle")', 't.circle(150)', 't.color("red")'],
      clue: '🪣 색칠은 <b>시작 → 그리기 → 끝</b> 순서예요.<br>🎨 색과 굵기는 <b>그리기 전에</b> 정해요. 동그라미(circle)와 빨강(red)은 이번에 쓰지 않아요.',
      done: '굵은 노란 별 완성! ⭐ 코드 한 줄 한 줄이 무슨 일을 하는지 알고 골랐어요. <b>다음 →</b>' },
    orange: { kind: 'goal', challenge: true, title: '🏆 도전! 주황 세모 칠하기 🔺',
      talk: '이번엔 <b>완전히 빈 화면</b>이에요! 흐린 그림처럼 <b>속이 꽉 찬 주황색 세모</b>를 그려 보세요.<br>맨 먼저 <b>거북이부터 데려와야</b> 해요. 세모의 변은 <b>120</b>, 색 이름은 <code>"orange"</code>예요.<br>방법은 여러 가지! 그림만 똑같으면 성공이에요.',
      start: '',
      solution: PT + code('t.color("orange")', FILL, 'for i in range(3):', '    t.forward(120)', '    t.left(120)', END) + '\n', fullAnswer: true,
      bank: ['t.shape("turtle")', 't.end_fill()', 'import turtle', 't = turtle.Turtle()', 't.color("orange")', 't.begin_fill()', 'for i in range( ):', 't.forward( )', 't.left( )'],
      must: [['import turtle', '그림은 똑같아요! 👍 그런데 맨 위에 <b>거북이 상자를 여는 줄</b>이 빠졌어요.'], ['t.shape("turtle")', '그림은 똑같아요! 👍 그런데 화살표가 그리고 있어요. <b>거북이 모양으로 바꾸는 줄</b>을 넣어 보세요.']],
      clue: '🐢 첫머리 3줄: <b>상자 열기 → 거북이 꺼내기 → 거북이 모양</b> 순서예요.<br>🪣 색칠은 <b>시작 → 그리기 → 끝</b>! 세모는 <b>3번</b> 반복하고 <b>360 ÷ 3</b> 만큼 돌아요.',
      done: '빈 화면에서 색칠까지 스스로 만들어 냈어요! 🏆 <b>다음 →</b>' },
  };
  delete E[2].review; delete E[2].challenge; delete E[2].insert;
  Object.assign(E[2], {
    showPrep: true,
    // 원래 미션에서 남긴 것: 0 미리보기, 1 펜 색깔, 2 다른 색 골라 보기(실험), 3 펜 굵게, 4 색칠 시작, 7 자유
    rebuild: b => [b[0], b[1], b[2], b[3], P2.write, b[4], P2.apple, P2.green, P2.star, P2.blue, P2.pick, P2.orange, b[7]],
  });

  // ---------- 3차시 ----------
  Object.assign(E[3], {
    insert: [
      [5, fix('선이 하나뿐이에요', '<b>떨어진 선 2개</b>를 그리려고 했는데 선이 하나만 나와요! 😵<br>▶ 실행해서 확인하고, <b>빠진 줄 하나</b>를 알맞은 자리에 넣어 보세요.',
        code('t.forward(100)', 't.penup()', 't.forward(50)', 't.forward(100)'), code('t.forward(100)', 't.penup()', 't.forward(50)', 't.pendown()', 't.forward(100)'),
        '✏️ 펜을 <b>든 뒤에 다시 내린 적</b>이 있나요? 두 번째 선을 그리기 <b>바로 전</b>에 필요해요.')],
    ],
    challenge: {
      kind: 'goal', title: '떨어진 동그라미 3개 ⚪⚪⚪',
      talk: '흐린 그림처럼 <b>동그라미 3개</b>를 선으로 이어지지 않게 그려 보세요.<br>동그라미 크기는 <b>30</b>, 다음 자리까지는 <b>120</b>만큼 걸어가요. 반복을 써도 되고 안 써도 돼요!',
      start: PT + 't.penup(); t.goto(-150, 0); t.pendown()\n\n',
      solution: PT + 't.penup(); t.goto(-150, 0); t.pendown()\n' + code('for i in range(3):', '    t.circle(30)', '    t.penup()', '    t.forward(120)', '    t.pendown()') + '\n',
      bank: ['t.circle( )', 't.penup()', 't.forward( )', 't.pendown()', 'for i in range( ):'],
      clue: '⚪ 동그라미 하나를 말로 해 보세요: <b>동그라미 → 펜 들기 → 걸어가기 → 펜 내리기</b>.<br>이걸 3번 하면 돼요.',
    },
  });

  // ---------- 4차시 ----------
  Object.assign(E[4], {
    insert: [
      [6, fix('세모가 하나뿐이에요', '<b>세모 2개</b>를 나란히 그리려고 했는데 하나만 나와요! 😵<br>▶ 실행해서 확인하고, <b>빠진 줄 하나</b>를 넣어 보세요.',
        code('def triangle():', '    for i in range(3):', '        t.forward(80)', '        t.left(120)', '', 'triangle()', 't.penup()', 't.forward(120)', 't.pendown()'),
        code('def triangle():', '    for i in range(3):', '        t.forward(80)', '        t.left(120)', '', 'triangle()', 't.penup()', 't.forward(120)', 't.pendown()', 'triangle()'),
        '🔺 세모 명령을 <b>몇 번 불렀는지</b> 세어 보세요. 자리를 옮긴 뒤에 무엇을 해야 할까요?')],
    ],
    challenge: {
      kind: 'goal', title: '계단 명령 만들기 🪜',
      talk: '계단 한 칸을 그리는 <b>step</b> 명령을 <b>직접 만들고</b>, 그 명령을 불러서 흐린 그림처럼 <b>계단 4칸</b>을 그려 보세요.<br>한 칸은 <b>앞으로 40 → 위로 40</b> 이에요.',
      start: PT + '\n',
      solution: PT + code('def step():', '    t.forward(40)', '    t.left(90)', '    t.forward(40)', '    t.right(90)', '', 'for i in range(4):', '    step()') + '\n',
      bank: ['def step():', 't.forward( )', 't.left( )', 't.right( )', 'for i in range( ):', 'step()'],
      must: [['def ', '그림은 똑같아요! 👍 그런데 이번 도전은 <b>def 로 나만의 명령</b>을 만들어서 그려야 해요.']],
      clue: '🪜 먼저 <b>def step():</b> 아래에 계단 한 칸(앞으로 → 왼쪽 → 앞으로 → 오른쪽)을 넣어요.<br>그다음 맨 앞 칸부터 다시 써서 <b>step()</b> 을 4번 불러요.',
    },
  });

  // ---------- 5차시 ----------
  Object.assign(E[5], {
    insert: [
      [6, fix('꽃이 덜 피었어요', '<b>꽃잎 8장</b>짜리 꽃을 그리려고 했는데 꽃이 덜 피었어요! 😵<br><b>한 군데만</b> 고쳐서 흐린 그림과 똑같이 만들어 보세요.',
        code('t.speed(0)', SQ, '', 'for i in range(6):', '    square()', '    t.left(45)'), code('t.speed(0)', SQ, '', 'for i in range(8):', '    square()', '    t.left(45)'),
        '🌸 45씩 돌아요. 45를 <b>몇 번</b> 더해야 한 바퀴 360이 될까요? 지금은 몇 번 반복하고 있죠?')],
    ],
    challenge: {
      kind: 'goal', title: '세모로 꽃 피우기 🌺',
      talk: '<b>triangle</b> 명령은 만들어 뒀어요. 이 세모를 <b>6번</b> 돌려 그려서 흐린 그림 같은 꽃을 피워 보세요.<br>한 번에 얼마씩 돌아야 딱 한 바퀴가 될까요?',
      start: PT + code('t.speed(0)', '', 'def triangle():', '    for i in range(3):', '        t.forward(100)', '        t.left(120)', '', ''),
      solution: PT + code('t.speed(0)', 'def triangle():', '    for i in range(3):', '        t.forward(100)', '        t.left(120)', 'for i in range(6):', '    triangle()', '    t.left(60)') + '\n',
      bank: ['for i in range( ):', 'triangle()', 't.left( )'],
      clue: '🌺 "세모 그리고 → 조금 돌기"를 6번 반복해요.<br>도는 숫자는 <b>360 ÷ 6</b>!',
    },
  });
})();
