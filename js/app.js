// "나를 그리는 한 장의 그림" - 간단한 계절 선택

// DOM 요소들
const introSection = document.getElementById('introSection');
const seasonSection = document.getElementById('seasonSection');
const calendarTransition = document.getElementById('calendarTransition');
const momentSection = document.getElementById('momentSection');
const musicSection = document.getElementById('musicSection');
const valueSection = document.getElementById('valueSection');
const completeSection = document.getElementById('completeSection');

const startBtn = document.getElementById('startTest');
const seasonCards = document.querySelectorAll('.season-card');
const scheduleDays = document.querySelectorAll('.schedule-day');
const momentCards = document.querySelectorAll('.moment-illustration');
const musicCards = document.querySelectorAll('.music-card');
const valueCards = document.querySelectorAll('.value-card');
const retryBtn = document.getElementById('retryBtn');
const saveBtn = document.getElementById('saveBtn');
const shareBtn = document.getElementById('shareBtn');
const selectedSeasonElement = document.getElementById('selectedSeason');
const spaceBackground = document.getElementById('spaceBackground');
const musicPreview = document.getElementById('musicPreview');
const audioSource = document.getElementById('audioSource');

const backToIntroBtn = document.getElementById('backToIntro');
const backToSeasonBtn = document.getElementById('backToSeason');
const backToCalendarBtn = document.getElementById('backToCalendar');
const backToMomentBtn = document.getElementById('backToMoment');
const backToMusicBtn = document.getElementById('backToMusic');

let selectedSeason = '';
let selectedSpace = '';
let selectedMoment = '';
let selectedMusic = '';
let selectedValue = '';

// 이벤트 리스너
startBtn.addEventListener('click', startTest);
retryBtn.addEventListener('click', resetTest);
saveBtn.addEventListener('click', saveResult);
shareBtn.addEventListener('click', shareResult);

// 계절 카드 이벤트 리스너
seasonCards.forEach(card => {
    card.addEventListener('click', () => selectSeason(card));
});

// 캘린더 일정 날짜 이벤트 리스너
scheduleDays.forEach(day => {
    day.addEventListener('click', () => selectSpace(day));
});

// 순간 카드 이벤트 리스너
momentCards.forEach(card => {
    card.addEventListener('click', () => selectMoment(card));
});

// 음악 카드 이벤트 리스너
musicCards.forEach(card => {
    card.addEventListener('click', () => selectMusic(card));
    
    // 데스크톱에서는 호버로 자동 재생
    card.addEventListener('mouseenter', () => {
        if (!isMobileDevice()) {
            window.playMusicPreview(card);
        }
    });
    card.addEventListener('mouseleave', () => {
        if (!isMobileDevice()) {
            stopMusicPreview();
        }
    });
    
    // 모바일에서는 터치 시 재생 버튼 표시
    card.addEventListener('touchstart', () => {
        card.classList.add('touch-active');
    });
});

// 가치관 카드 이벤트 리스너
valueCards.forEach(card => {
    card.addEventListener('click', () => selectValue(card));
});

// 모바일 디바이스 감지
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
}

// 음악 미리듣기 URL 매핑
const musicSamples = {
    'indie': 'audio/indie.mp3',
    'jazz': 'audio/jazz.mp3', 
    'rock': 'audio/rock.mp3',
    'electronic': 'audio/electronic.mp3'
};

// 음악 미리듣기 재생 (전역 함수로 만들어 HTML에서 호출 가능)
window.playMusicPreview = function(card) {
    const genre = card.dataset.preview;
    console.log('Playing music for genre:', genre); // 디버깅용
    
    if (musicSamples[genre]) {
        // 기존 음악 정지
        stopMusicPreview();
        
        // 파일 경로 확인
        const audioUrl = musicSamples[genre];
        console.log('Audio URL:', audioUrl); // 디버깅용
        
        audioSource.src = audioUrl;
        musicPreview.load();
        musicPreview.volume = 0;
        
        musicPreview.play().then(() => {
            console.log('Audio started playing'); // 디버깅용
            // 페이드 인 효과
            fadeInAudio();
        }).catch(e => {
            console.error('Audio play failed:', e);
            // 모바일에서는 사용자 상호작용이 필요하다는 알림
            showAudioError();
        });
    } else {
        console.error('No music sample found for genre:', genre);
    }
}

// 오디오 에러 알림
function showAudioError() {
    // 간단한 알림 (실제로는 더 예쁜 UI로 만들 수 있음)
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
    `;
    errorMsg.textContent = '🎵 재생 버튼을 눌러 음악을 들어보세요!';
    document.body.appendChild(errorMsg);
    
    setTimeout(() => {
        document.body.removeChild(errorMsg);
    }, 3000);
}

// 음악 미리듣기 정지
function stopMusicPreview() {
    if (musicPreview && !musicPreview.paused) {
        fadeOutAudio(() => {
            musicPreview.pause();
            musicPreview.currentTime = 0;
        });
    }
}

// 페이드 인 효과
function fadeInAudio() {
    const fadeInInterval = setInterval(() => {
        if (musicPreview.volume < 0.25) {
            musicPreview.volume += 0.05;
        } else {
            clearInterval(fadeInInterval);
        }
    }, 50);
}

// 페이드 아웃 효과
function fadeOutAudio(callback) {
    const fadeOutInterval = setInterval(() => {
        if (musicPreview.volume > 0.05) {
            musicPreview.volume -= 0.05;
        } else {
            clearInterval(fadeOutInterval);
            musicPreview.volume = 0;
            if (callback) callback();
        }
    }, 30);
}

// 뒤로가기 버튼 이벤트 리스너
backToIntroBtn.addEventListener('click', goBackToIntro);
backToSeasonBtn.addEventListener('click', goBackToSeason);
backToCalendarBtn.addEventListener('click', goBackToCalendar);
backToMomentBtn.addEventListener('click', goBackToMoment);
backToMusicBtn.addEventListener('click', goBackToMusic);

// 테스트 시작
function startTest() {
    introSection.classList.add('hidden');
    seasonSection.classList.remove('hidden');
    
    // 계절 카드 애니메이션
    seasonCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// 계절 선택
function selectSeason(selectedCard) {
    const season = selectedCard.dataset.season;
    selectedSeason = season;
    
    // 선택 효과
    seasonCards.forEach(card => {
        if (card === selectedCard) {
            card.style.transform = 'scale(1.1)';
            card.style.zIndex = '10';
            card.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
        } else {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.9)';
        }
    });
    
    // 캘린더 전환
    setTimeout(() => {
        seasonSection.classList.add('hidden');
        calendarTransition.classList.remove('hidden');
        
        // 선택한 계절을 캘린더 헤더에 표시
        updateCalendarSeason(season);
    }, 1500);
}

// 캘린더 계절 업데이트
function updateCalendarSeason(season) {
    const seasonNames = {
        'spring': 'SPRING',
        'summer': 'SUMMER', 
        'autumn': 'AUTUMN',
        'winter': 'WINTER'
    };
    
    if (selectedSeasonElement) {
        selectedSeasonElement.textContent = seasonNames[season] || 'SPRING';
    }
}

// 공간 선택
function selectSpace(selectedDay) {
    const space = selectedDay.dataset.value;
    selectedSpace = space;
    
    // 선택 효과
    scheduleDays.forEach(day => {
        if (day === selectedDay) {
            day.style.transform = 'scale(1.1)';
            day.style.backgroundColor = '#8b4513';
            day.style.color = '#fff';
        } else {
            day.style.opacity = '0.3';
        }
    });
    
    // Q3으로 전환하고 배경 설정
    setTimeout(() => {
        calendarTransition.classList.add('hidden');
        momentSection.classList.remove('hidden');
        
        // 선택한 공간에 따른 배경 설정
        setSpaceBackground(selectedSpace);
    }, 1500);
}

// 공간 배경 설정
function setSpaceBackground(space) {
    const backgrounds = {
        'A': 'nature-bg',    // 자연
        'B': 'indoor-bg',    // 실내
        'C': 'city-bg',      // 도시
        'D': 'night-bg'      // 밤
    };
    
    if (spaceBackground && backgrounds[space]) {
        spaceBackground.className = `space-background ${backgrounds[space]}`;
    }
}

// 순간 선택
function selectMoment(selectedCard) {
    const moment = selectedCard.dataset.value;
    selectedMoment = moment;
    
    // 선택 효과
    momentCards.forEach(card => {
        if (card === selectedCard) {
            card.style.transform = 'scale(1.3)';
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            card.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.6)';
        } else {
            card.style.opacity = '0.2';
        }
    });
    
    // Q4로 전환
    setTimeout(() => {
        momentSection.classList.add('hidden');
        musicSection.classList.remove('hidden');
    }, 1500);
}

// 음악 선택
function selectMusic(selectedCard) {
    const music = selectedCard.dataset.value;
    selectedMusic = music;
    
    // 선택 효과
    musicCards.forEach(card => {
        if (card === selectedCard) {
            card.style.transform = 'scale(1.05)';
            card.style.borderColor = 'var(--accent-color)';
            card.style.boxShadow = '0 20px 50px rgba(139, 69, 19, 0.2)';
        } else {
            card.style.opacity = '0.3';
        }
    });
    
    // Q5로 전환
    setTimeout(() => {
        musicSection.classList.add('hidden');
        valueSection.classList.remove('hidden');
    }, 1500);
}

// 가치관 선택
function selectValue(selectedCard) {
    const value = selectedCard.dataset.value;
    selectedValue = value;
    
    // 선택 효과
    valueCards.forEach(card => {
        if (card === selectedCard) {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
            card.style.borderColor = 'var(--accent-color)';
        } else {
            card.style.opacity = '0.3';
        }
    });
    
    // 최종 결과 페이지로 전환
    setTimeout(() => {
        valueSection.classList.add('hidden');
        completeSection.classList.remove('hidden');
        
        // 최종 결과 메시지 업데이트 (모든 5가지 선택)
        updateFinalResult(selectedSeason, selectedSpace, selectedMoment, selectedMusic, selectedValue);
    }, 1500);
}

// 가중치 기반 결과 매핑 시스템
function calculateResultMapping(season, space, moment, music, value) {
    // 각 선택지에 대한 가중치 점수
    const scores = {
        season: { 'spring': 0, 'summer': 1, 'autumn': 2, 'winter': 3 },
        space: { 'A': 0, 'B': 1, 'C': 2, 'D': 3 },
        moment: { 'A': 0, 'B': 1, 'C': 2, 'D': 3 },
        music: { 'A': 0, 'B': 1, 'C': 2, 'D': 3 },
        value: { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
    };
    
    // 각 질문의 중요도 가중치 (총합 = 16)
    const weights = {
        season: 5,   // 기본 색상 결정 (가장 중요)
        space: 4,    // 분위기/톤 결정
        moment: 3,   // 감정적 뉘앙스
        music: 2,    // 리듬감/에너지
        value: 2     // 철학적 깊이
    };
    
    // 가중치 점수 계산
    const totalScore = 
        scores.season[season] * weights.season +
        scores.space[space] * weights.space +
        scores.moment[moment] * weights.moment +
        scores.music[music] * weights.music +
        scores.value[value] * weights.value;
    
    // 16개 결과 중 하나로 매핑 (0-15)
    const resultIndex = totalScore % 16;
    
    // 16개 조합 정의 (season-modifier 형태)
    const resultMappings = [
        'spring-bright',   // 0: 봄의 밝은 자연
        'spring-soft',     // 1: 봄의 부드러운 실내
        'spring-vivid',    // 2: 봄의 생생한 도시
        'spring-dark',     // 3: 봄의 신비로운 밤
        'summer-bright',   // 4: 여름의 밝은 자연
        'summer-soft',     // 5: 여름의 부드러운 실내
        'summer-vivid',    // 6: 여름의 생생한 도시
        'summer-dark',     // 7: 여름의 신비로운 밤
        'autumn-bright',   // 8: 가을의 밝은 자연
        'autumn-soft',     // 9: 가을의 부드러운 실내
        'autumn-vivid',    // 10: 가을의 생생한 도시
        'autumn-dark',     // 11: 가을의 신비로운 밤
        'winter-bright',   // 12: 겨울의 밝은 자연
        'winter-soft',     // 13: 겨울의 부드러운 실내
        'winter-vivid',    // 14: 겨울의 생생한 도시
        'winter-dark'      // 15: 겨울의 신비로운 밤
    ];
    
    return {
        mapping: resultMappings[resultIndex],
        index: resultIndex,
        score: totalScore,
        breakdown: {
            season: scores.season[season] * weights.season,
            space: scores.space[space] * weights.space,
            moment: scores.moment[moment] * weights.moment,
            music: scores.music[music] * weights.music,
            value: scores.value[value] * weights.value
        }
    };
}

// 색상 및 스타일 매핑 (업데이트)
function getColorTheme(resultMapping) {
    const [seasonName, modifier] = resultMapping.split('-');
    
    // 기본 색상 (계절)
    const baseColors = {
        'spring': { primary: '#22c55e', name: 'green' },  // 초록
        'summer': { primary: '#ef4444', name: 'red' },    // 빨강  
        'autumn': { primary: '#f59e0b', name: 'yellow' }, // 노랑
        'winter': { primary: '#3b82f6', name: 'blue' }    // 파랑
    };
    
    // 공간별 명도/채도 조정
    const spaceModifiers = {
        'bright': { brightness: 1.2, saturation: 1.1, desc: 'bright' },  // 밝고 선명
        'soft': { brightness: 0.9, saturation: 0.8, desc: 'soft' },      // 부드럽고 따뜻
        'vivid': { brightness: 1.1, saturation: 1.3, desc: 'vivid' },    // 선명하고 대비
        'dark': { brightness: 0.6, saturation: 0.9, desc: 'dark' }       // 어둡고 신비
    };
    
    return {
        baseColor: baseColors[seasonName],
        modifier: spaceModifiers[modifier],
        mapping: resultMapping
    };
}

// 16가지 결과 해석 데이터 (가중치 기반 매핑 사용)
function getResultInterpretation(resultMapping) {
    const interpretations = {
        // 🌸 봄의 그림들
        'spring-bright': { // 0: 봄의 밝은 자연
            description: '당신의 그림은 새싹처럼 조용히 피어납니다. 사람들 사이에서는 환한 웃음으로 주변을 밝히지만, 집에 돌아와 혼자가 되면 잔잔한 바람 같은 내면의 목소리를 듣습니다. 당신이 가장 소중히 여기는 건 진정성. 그래서 당신은 서두르지 않고, 천천히 그러나 분명하게 자신의 길을 만들어갑니다.'
        },
        'spring-soft': { // 1: 봄의 부드러운 실내
            description: '당신의 그림은 벚꽃잎이 흩날리는 길 위에서 경쾌하게 춤추고 있습니다. 사람들 곁에서는 웃음과 즐거움을 퍼뜨리고, 혼자 있을 때는 발걸음처럼 규칙적인 내면의 리듬에 귀 기울입니다. 당신에게 중요한 가치는 순간의 즐거움. 그래서 당신은 작은 일상마저도 노래처럼 만들어내는 재주가 있습니다.'
        },
        'spring-vivid': { // 2: 봄의 생생한 도시
            description: '당신의 그림은 따뜻한 바람에 불타는 듯한 열정을 담고 있습니다. 사람들과 함께할 때는 아이디어와 활력을 쏟아내며 중심이 되고, 혼자일 때는 심장이 두근거리는 소리에 귀 기울입니다. 당신이 지키고 싶은 건 도전과 성장. 그래서 당신의 봄은 늘 새로운 시작으로 가득합니다.'
        },
        'spring-dark': { // 3: 봄의 신비로운 밤
            description: '당신의 그림은 햇살에 반짝이는 구름 위에 그려집니다. 사람들 사이에서는 다소 엉뚱해 보일 수 있지만, 그 속엔 누구보다 자유로운 상상이 흐릅니다. 혼자 있을 때 당신의 마음은 선율을 따라 여행하듯 흘러갑니다. 당신의 가치는 창의와 자유. 그래서 당신의 그림은 늘 현실 너머의 가능성을 품고 있습니다.'
        },
        
        // ☀️ 여름의 그림들
        'summer-bright': { // 4: 여름의 밝은 자연
            description: '당신의 그림은 바다 속 깊은 곳에 잠겨 있습니다. 사람들 앞에서는 환한 미소를 지으며 즐겁게 어울리지만, 혼자가 되면 마치 고요한 심해처럼 깊은 사색에 빠집니다. 당신의 중심 가치관은 평온과 균형. 그래서 당신은 외부의 뜨거운 에너지 속에서도 스스로의 온도를 잃지 않습니다.'
        },
        'summer-soft': { // 5: 여름의 부드러운 실내
            description: '당신의 그림은 파도처럼 생동감 있게 출렁입니다. 사람들과 함께할 때는 언제나 활기를 불어넣고, 혼자가 되었을 때도 음악 같은 리듬으로 자신을 채워 넣습니다. 당신의 삶에서 가장 중요한 건 움직임과 에너지. 그래서 당신의 그림은 늘 멈추지 않는 흐름으로 그려집니다.'
        },
        'summer-vivid': { // 6: 여름의 생생한 도시
            description: '당신의 그림은 한낮의 태양처럼 강렬합니다. 사람들 곁에서는 열정과 추진력을 드러내며 모두를 이끌고, 혼자일 때는 심장이 뛰는 소리에 맞춰 내일을 계획합니다. 당신이 가장 중시하는 건 성취와 용기. 그래서 당신은 뜨겁게 타올라 세상에 흔적을 남깁니다.'
        },
        'summer-dark': { // 7: 여름의 신비로운 밤
            description: '당신의 그림은 여름밤 별빛으로 채워져 있습니다. 사람들과 있을 때는 함께 웃고 즐기면서도, 마음 한켠에서는 다른 하늘을 바라보고 있죠. 혼자일 때는 별자리처럼 이어지는 상상을 따라갑니다. 당신이 가장 지키고 싶은 건 자유로운 영혼. 그래서 당신의 여름은 언제나 조금 특별하게 빛납니다.'
        },
        
        // 🍂 가을의 그림들
        'autumn-bright': { // 8: 가을의 밝은 자연
            description: '당신의 그림은 노란 낙엽이 바닥에 쌓인 듯 단단합니다. 사람들 속에서는 따뜻한 안정감을 주지만, 혼자 있을 때는 한 장의 책처럼 깊은 고요 속에 머뭅니다. 당신이 가장 소중히 여기는 건 성실과 지속성. 그래서 당신의 삶은 천천히 그러나 확실히 물들어갑니다.'
        },
        'autumn-soft': { // 9: 가을의 부드러운 실내
            description: '당신의 그림은 바람에 흔들리는 갈대처럼 유연합니다. 사람들과 함께할 때는 적절히 조화를 이루며 어울리고, 혼자가 되면 잔잔한 멜로디에 귀를 기울입니다. 당신의 삶에서 중요한 가치는 균형과 흐름. 그래서 당신은 계절의 리듬처럼 자연스럽게 변화를 받아들입니다.'
        },
        'autumn-vivid': { // 10: 가을의 생생한 도시
            description: '당신의 그림은 붉게 타오르는 단풍으로 그려집니다. 사람들과 있을 때는 마음 깊은 울림을 나누고, 혼자일 때는 심장의 불꽃이 사그라들지 않도록 스스로를 다집니다. 당신이 중시하는 건 깊은 열정. 그래서 당신의 가을은 언제나 뜨겁게 물들어 있습니다.'
        },
        'autumn-dark': { // 11: 가을의 신비로운 밤
            description: '당신의 그림은 저녁노을에 잠겨 있습니다. 사람들 앞에서는 차분히 이야기하지만, 마음은 언제나 다른 하늘을 상상합니다. 혼자 있을 때는 은은한 현악기 소리처럼 사색에 잠깁니다. 당신의 가치관은 의미와 성찰. 그래서 당신의 그림은 언제나 한 편의 시처럼 느껴집니다.'
        },
        
        // ❄️ 겨울의 그림들
        'winter-bright': { // 12: 겨울의 밝은 자연
            description: '당신의 그림은 눈 덮인 숲 속에 머물러 있습니다. 사람들과 있을 때는 따뜻한 온기를 나누지만, 혼자일 때는 고요한 설원처럼 차분히 자신을 다스립니다. 당신이 가장 소중히 여기는 건 내적 안정. 그래서 당신의 삶은 외부의 소란 속에서도 흔들리지 않습니다.'
        },
        'winter-soft': { // 13: 겨울의 부드러운 실내
            description: '당신의 그림은 겨울 축제의 불빛처럼 반짝입니다. 사람들 사이에서는 분위기를 밝히는 존재가 되고, 혼자가 되었을 때도 작은 리듬을 타며 자신을 즐겁게 합니다. 당신의 중심 가치관은 희망과 활력. 그래서 당신의 겨울은 추위 속에서도 따뜻한 불빛으로 채워집니다.'
        },
        'winter-vivid': { // 14: 겨울의 생생한 도시
            description: '당신의 그림은 폭설처럼 강렬합니다. 사람들 곁에서는 단호함과 결단력으로 자신을 드러내고, 혼자일 때는 거센 바람 같은 내적 목소리를 듣습니다. 당신에게 중요한 건 의지와 힘. 그래서 당신은 추위조차 뚫고 나아가는 사람입니다.'
        },
        'winter-dark': { // 15: 겨울의 신비로운 밤
            description: '당신의 그림은 긴 겨울밤의 별자리로 이어집니다. 사람들과 있을 때는 차분히 조화를 이루지만, 혼자가 되면 마음속 우주로 들어가 상상을 펼칩니다. 당신이 중시하는 건 꿈과 가능성. 그래서 당신의 그림은 늘 현실 너머의 길을 그리고 있습니다.'
        }
    };
    
    return interpretations[resultMapping] || {
        description: '당신의 내면은 누구와도 다른 특별한 색깔을 가지고 있습니다. 그 독특함이 바로 당신만의 예술이 됩니다.'
    };
}

// 최종 결과 업데이트 (가중치 시스템 적용)
function updateFinalResult(season, space, moment, music, value) {
    // 가중치 기반 결과 매핑 계산
    const resultData = calculateResultMapping(season, space, moment, music, value);
    const colorTheme = getColorTheme(resultData.mapping);
    const interpretation = getResultInterpretation(resultData.mapping);
    
    // 색상 조합 기반 이미지 파일명
    const colorFileName = `${colorTheme.baseColor.name}-${colorTheme.modifier.desc}.jpg`;
    const specificFileName = `${season}-${space}-${moment}-${music}-${value}.jpg`;
    
    const resultImageElement = document.getElementById('resultImage');
    const resultTitleElement = document.getElementById('resultSubtitle');
    const completeDescriptionElement = document.querySelector('.complete-description');
    
    // 이미지 로딩 (구체적 조합 → 색상 조합 → 폴백 순서)
    if (resultImageElement) {
        tryLoadImage(resultImageElement, [
            `images/${specificFileName}`,      // 구체적 조합
            `images/${colorFileName}`,         // 색상 기반
            null                               // 폴백
        ], colorTheme);
    }
    
    // 제목과 설명 설정 (제목은 HTML에서 고정, 설명만 동적으로 변경)
    if (completeDescriptionElement) {
        completeDescriptionElement.textContent = interpretation.description;
    }
    
    // 콘솔에서 결과 확인 (가중치 정보 포함)
    console.log('🎨 최종 결과 (가중치 시스템):', {
        입력조합: `${season}-${space}-${moment}-${music}-${value}`,
        결과매핑: resultData.mapping,
        총점수: resultData.score,
        점수분해: resultData.breakdown,
        색상테마: colorTheme,
        해석: interpretation,
        이미지파일: [specificFileName, colorFileName]
    });
}

// 이미지 로딩 시도 함수
function tryLoadImage(element, imagePaths, colorTheme) {
    let currentIndex = 0;
    
    function tryNext() {
        if (currentIndex >= imagePaths.length) {
            // 모든 이미지 로딩 실패 시 색상 기반 그라데이션
            createColorGradient(element, colorTheme);
            return;
        }
        
        const imagePath = imagePaths[currentIndex];
        if (!imagePath) {
            createColorGradient(element, colorTheme);
            return;
        }
        
        const img = new Image();
        img.onload = () => {
            element.style.backgroundImage = `url('${imagePath}')`;
        };
        img.onerror = () => {
            currentIndex++;
            tryNext();
        };
        img.src = imagePath;
    }
    
    tryNext();
}

// 색상 테마 기반 그라데이션 생성
function createColorGradient(element, colorTheme) {
    const { primary } = colorTheme.baseColor;
    const { brightness, saturation } = colorTheme.modifier;
    
    // RGB 값 추출 및 조정
    const hex = primary.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0,2), 16) * brightness));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2,2), 16) * brightness));  
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4,2), 16) * brightness));
    
    element.style.background = `
        linear-gradient(135deg, 
            rgba(${r}, ${g}, ${b}, 0.8) 0%, 
            rgba(${Math.floor(r*0.7)}, ${Math.floor(g*0.7)}, ${Math.floor(b*0.7)}, 0.6) 50%,
            rgba(${Math.floor(r*0.4)}, ${Math.floor(g*0.4)}, ${Math.floor(b*0.4)}, 0.8) 100%
        ),
        repeating-linear-gradient(45deg,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 2px,
            transparent 2px,
            transparent 15px
        ),
        radial-gradient(circle at 70% 30%, rgba(${r}, ${g}, ${b}, 0.3) 0%, transparent 60%)
    `;
}

// 테스트 재시작
function resetTest() {
    selectedSeason = '';
    selectedSpace = '';
    selectedMoment = '';
    selectedMusic = '';
    selectedValue = '';
    
    // 모든 섹션 숨기기
    [seasonSection, calendarTransition, momentSection, musicSection, valueSection, completeSection].forEach(section => {
        section.classList.add('hidden');
    });
    
    // 인트로 섹션 표시
    introSection.classList.remove('hidden');
    
    // 카드 스타일 초기화
    seasonCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.zIndex = '';
        card.style.boxShadow = '';
        card.style.transition = '';
    });
    
    // 캘린더 스타일 초기화
    scheduleDays.forEach(day => {
        day.style.opacity = '';
        day.style.transform = '';
        day.style.backgroundColor = '';
        day.style.color = '';
    });
    
    // 순간 카드 스타일 초기화
    momentCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.backgroundColor = '';
        card.style.boxShadow = '';
    });
    
    // 음악 카드 스타일 초기화
    musicCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.borderColor = '';
        card.style.boxShadow = '';
    });
    
    // 가치관 카드 스타일 초기화
    valueCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.borderColor = '';
        card.style.boxShadow = '';
    });
    
    // 배경 초기화
    if (spaceBackground) {
        spaceBackground.className = 'space-background';
    }
}

// 뒤로가기 함수들
function goBackToIntro() {
    // Q1에서 인트로로
    seasonSection.classList.add('hidden');
    introSection.classList.remove('hidden');
    
    // 선택 상태 초기화
    selectedSeason = '';
    seasonCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.zIndex = '';
        card.style.boxShadow = '';
        card.style.transition = '';
    });
}

function goBackToSeason() {
    // Q2에서 Q1으로
    calendarTransition.classList.add('hidden');
    seasonSection.classList.remove('hidden');
    
    // 캘린더 선택 상태 초기화
    selectedSpace = '';
    scheduleDays.forEach(day => {
        day.style.opacity = '';
        day.style.transform = '';
        day.style.backgroundColor = '';
        day.style.color = '';
    });
}

function goBackToCalendar() {
    // Q3에서 Q2로
    momentSection.classList.add('hidden');
    calendarTransition.classList.remove('hidden');
    
    // 순간 선택 상태 초기화
    selectedMoment = '';
    momentCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.backgroundColor = '';
        card.style.boxShadow = '';
    });
    
    // 배경 초기화
    if (spaceBackground) {
        spaceBackground.className = 'space-background';
    }
}

function goBackToMoment() {
    // Q4에서 Q3으로
    musicSection.classList.add('hidden');
    momentSection.classList.remove('hidden');
    
    // 음악 선택 상태 초기화
    selectedMusic = '';
    musicCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.borderColor = '';
        card.style.boxShadow = '';
    });
}

function goBackToMusic() {
    // Q5에서 Q4로
    valueSection.classList.add('hidden');
    musicSection.classList.remove('hidden');
    
    // 가치관 선택 상태 초기화
    selectedValue = '';
    valueCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.borderColor = '';
        card.style.boxShadow = '';
    });
}

// 결과 저장하기 (이미지 다운로드)
function saveResult() {
    const resultFrame = document.querySelector('.result-frame');
    
    // html2canvas 라이브러리를 사용하여 결과를 이미지로 변환
    if (typeof html2canvas !== 'undefined') {
        html2canvas(resultFrame, {
            backgroundColor: '#f8f5f1',
            scale: 2,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = '나를_그리는_한_장의_그림_결과.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        // html2canvas가 없을 경우 간단한 텍스트 저장
        alert('결과 저장 기능을 위해서는 추가 라이브러리가 필요합니다.');
    }
}

// 결과 공유하기
function shareResult() {
    const resultTitle = document.querySelector('.complete-title').textContent;
    const resultDescription = document.querySelector('.complete-description').textContent;
    
    const shareText = `${resultTitle}\n\n${resultDescription.substring(0, 100)}...\n\n나를 그리는 한 장의 그림 테스트 결과 🎨`;
    const shareUrl = window.location.href;
    
    // Web Share API 지원 확인 (모바일)
    if (navigator.share) {
        navigator.share({
            title: '나를 그리는 한 장의 그림',
            text: shareText,
            url: shareUrl
        }).catch(err => {
            console.log('공유 취소:', err);
        });
    } else {
        // Web Share API 미지원시 클립보드 복사
        const shareContent = `${shareText}\n\n${shareUrl}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareContent).then(() => {
                showToast('결과가 클립보드에 복사되었습니다! 🎨');
            }).catch(() => {
                fallbackShare(shareContent);
            });
        } else {
            fallbackShare(shareContent);
        }
    }
}

// 폴백 공유 방식 (텍스트 선택)
function fallbackShare(content) {
    const textArea = document.createElement('textarea');
    textArea.value = content;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('결과가 클립보드에 복사되었습니다! 🎨');
    } catch (err) {
        showToast('수동으로 복사해주세요: Ctrl+C');
        textArea.style.position = 'static';
        textArea.style.left = 'auto';
        textArea.style.top = 'auto';
        textArea.style.width = '100%';
        textArea.style.height = '100px';
        textArea.style.margin = '20px 0';
        return; // 텍스트 영역을 남겨둠
    }
    
    document.body.removeChild(textArea);
}

// 토스트 메시지 표시
function showToast(message) {
    // 기존 토스트가 있으면 제거
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(44, 24, 16, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: toast-appear 0.3s ease-out;
    `;
    
    // CSS 애니메이션 추가
    if (!document.querySelector('#toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes toast-appear {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toast-appear 0.3s ease-out reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 3000);
}

// 터치 이벤트 최적화 (모바일)
document.addEventListener('touchstart', function() {}, { passive: true });