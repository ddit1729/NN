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
const scheduleCards = document.querySelectorAll('.schedule-item');
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

// 일정 카드 이벤트 리스너
scheduleCards.forEach(card => {
    card.addEventListener('click', () => selectSpace(card));
});

// 순간 카드 이벤트 리스너
momentCards.forEach(card => {
    card.addEventListener('click', () => selectMoment(card));
});

// 음악 카드 이벤트 리스너
musicCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (isMobileDevice()) {
            // 모바일에서는 첫 클릭시 음악 재생, 두 번째 클릭시 선택
            if (!card.classList.contains('music-playing')) {
                e.preventDefault();
                window.playMusicPreview(card);
                card.classList.add('music-playing');
                // 3초 후 자동으로 선택 가능하도록
                setTimeout(() => {
                    card.classList.add('ready-to-select');
                }, 3000);
            } else if (card.classList.contains('ready-to-select')) {
                selectMusic(card);
            }
        } else {
            // 데스크톱에서는 바로 선택
            selectMusic(card);
        }
    });
    
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

// 모든 오디오 정지 함수
function stopAllAudio() {
    // 메인 음악 미리보기 정지
    if (musicPreview) {
        musicPreview.pause();
        musicPreview.currentTime = 0;
        musicPreview.volume = 0;
    }
    
    // 페이지의 모든 오디오 요소 정지
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
    });
    
    // 음악 카드 재생 상태 초기화
    musicCards.forEach(card => {
        card.classList.remove('playing', 'touch-active');
        const playBtn = card.querySelector('.play-btn');
        if (playBtn) {
            playBtn.textContent = '▶';
        }
    });
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
    
    const seasonMonths = {
        'spring': ['3월 15일', '3월 17일', '3월 20일', '3월 24일'],
        'summer': ['6월 15일', '6월 17일', '6월 20일', '6월 24일'],
        'autumn': ['9월 15일', '9월 17일', '9월 20일', '9월 24일'],
        'winter': ['12월 15일', '12월 17일', '12월 20일', '12월 24일']
    };
    
    // 상단 계절 레이블 업데이트
    const selectedSeasonLabel = document.getElementById('selectedSeasonLabel');
    if (selectedSeasonLabel) {
        selectedSeasonLabel.textContent = seasonNames[season] || 'SPRING';
    }
    
    // 각 일정 아이템의 시간 업데이트
    const scheduleTimes = document.querySelectorAll('.schedule-time');
    const times = ['15일', '17일', '20일', '24일']; // 날짜는 고정
    
    scheduleTimes.forEach((timeElement, index) => {
        if (times[index]) {
            timeElement.textContent = times[index];
        }
    });
}

// 공간 선택
function selectSpace(selectedCard) {
    const space = selectedCard.dataset.value;
    selectedSpace = space;
    
    // 선택 효과
    scheduleCards.forEach(card => {
        if (card === selectedCard) {
            card.classList.add('selected');
        } else {
            card.style.opacity = '0.3';
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
        
        // 음악 완전 정지
        stopAllAudio();
        
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
            title: '내면의 고요한 안정감',
            description: '이 그림을 그려낸 당신은 마음 깊은 곳에 누구도 흔들 수 없는 고요하고 단단한 뿌리를 내린 사람입니다. 당신의 안정감은 외부의 화려함이나 시끄러운 것들에서 오는 것이 아니라, 자신의 내면에서 우러나오는 진정한 평온함입니다.\n\n당신은 급작스러운 변화보다는 천천히, 하지만 꾸준히 성장해나가는 것을 선호합니다. 마치 깊은 숲 속의 나무들처럼 시간이 지날수록 더욱 단단해지고 깊어지는 존재입니다. 다른 사람들이 조급해할 때도 당신은 자신만의 속도를 유지하며 묵묵히 나아갑니다.\n\n당신에게 가장 소중한 것은 마음의 평화와 내적 조화입니다. 혼자만의 시간을 통해 자신을 돌아보고, 진정으로 의미 있는 것들에 집중하는 능력이 뛰어납니다. 때로는 세상이 너무 빠르게 돌아간다고 느낄 수도 있지만, 당신의 이런 차분함과 깊이가 주변 사람들에게는 큰 위로가 될 것입니다.'
        },
        'spring-soft': { // 1: 봄의 부드러운 실내
            title: '지혜로운 안정감의 균형',
            description: '이 그림을 그려낸 당신은 변화와 안정, 새로움과 전통, 개인과 공동체 사이에서 아름다운 균형을 찾은 지혜로운 사람입니다. 당신은 안정을 추구하지만 고여있지 않으며, 변화를 받아들이지만 뿌리를 잃지 않습니다.\n\n당신의 안정감은 경직된 것이 아니라 유연하고 적응력이 뛰어납니다. 마치 바람에 흔들리는 나무가 부러지지 않고 오히려 더 강해지듯이, 당신도 어려움을 만나면 그것을 성장의 기회로 만들어냅니다.\n\n주변 사람들은 당신과 함께 있으면 안정감을 느끼면서도 답답하지 않다고 말할 것입니다. 당신은 전통과 새로움을 조화롭게 받아들이며, 다양한 가치관을 가진 사람들 사이에서 중재자 역할을 자연스럽게 해냅니다. 이런 당신의 모습은 많은 사람들에게 신뢰감을 주고, 함께 일하고 싶은 동반자로 여겨질 것입니다.'
        },
        'spring-vivid': { // 2: 봄의 생생한 도시
            title: '역동적인 안정감의 추진력',
            description: '이 그림을 그려낸 당신은 안정감을 바탕으로 끊임없이 성장하고 발전해나가는 에너지 넘치는 사람입니다. 당신의 안정은 정체된 것이 아니라, 마치 봄날 새싹이 돋아나듯 생명력 넘치는 역동적인 안정입니다.\n\n당신은 변화를 두려워하지 않으면서도, 그 변화가 건설적이고 의미 있는 방향으로 나아가도록 이끄는 능력이 뛰어납니다. 새로운 도전을 받아들이되, 기존의 좋은 것들은 지켜내려고 노력합니다. 이런 당신의 모습은 주변 사람들에게 용기와 희망을 줍니다.\n\n당신은 개인의 성장뿐만 아니라 공동체의 발전에도 관심이 많습니다. 사람들을 하나로 모으고, 함께 성장할 수 있는 환경을 만드는 것에 특별한 재능을 가지고 있습니다. 당신의 이런 리더십은 강압적이지 않으면서도 자연스럽게 사람들이 따르고 싶어하는 매력적인 힘을 발휘할 것입니다.'
        },
        'spring-dark': { // 3: 봄의 신비로운 밤
            title: '무한한 안정감의 수호자',
            description: '이 그림을 그려낸 당신은 마치 수백 년을 견뎌온 거대한 나무처럼, 주변의 모든 것들을 품어주는 따뜻하고 깊은 안정감을 가진 사람입니다. 당신에게 안정이란 단순히 개인적인 평안함을 넘어서, 다른 사람들에게도 안식처가 되어주는 소중한 선물입니다.\n\n당신은 어떤 어려움이 와도 흔들리지 않는 강인함을 가지고 있으며, 동시에 상처받은 사람들을 치유해주는 따뜻함도 함께 가지고 있습니다. 사람들은 당신과 함께 있으면 마치 깊은 숲 속에서 쉬는 것 같은 평온함을 느낍니다.\n\n당신은 급진적인 변화보다는 점진적이고 지속가능한 발전을 추구하며, 모든 사람이 조화롭게 공존할 수 있는 환경을 만들기 위해 노력합니다. 때로는 당신의 이런 신중함을 답답해하는 사람들도 있을 수 있지만, 시간이 지나면 당신의 선택이 얼마나 지혜로웠는지 깨닫게 될 것입니다.\n\n당신은 이 세상에 진정한 안정과 평화를 가져다주는 귀한 존재입니다. 당신의 존재 자체가 많은 사람들에게 희망이 되고 있다는 것을 기억해주세요.'
        },
        
        // ☀️ 여름의 그림들
        'summer-bright': { // 4: 여름의 밝은 자연
            title: '내면의 섬세한 창조력',
            description: '이 그림을 그려낸 당신은 조용한 작업실에서 혼자만의 시간을 통해 깊이 있는 창작의 세계를 만들어가는 섬세한 예술가입니다. 당신의 창의성은 화려하게 드러나지 않지만, 마치 장인이 하나의 작품을 완성해가듯 꼼꼼하고 정성스럽습니다.\n\n당신은 남들에게 보여주기 위해서가 아니라, 자신만의 완벽함을 추구하며 작업에 몰입합니다. 세상의 시끄러운 소리들은 잠시 잊고, 오직 자신의 내면에서 우러나오는 영감에만 집중하는 시간들이 당신을 가장 행복하게 만듭니다.\n\n당신의 작품들은 겉으로는 단순해 보일 수 있지만, 그 안에는 깊은 사색과 진심이 담겨 있습니다. 완성도를 중시하고, 디테일에 신경쓰며, 시간이 오래 걸리더라도 자신이 만족할 수 있는 결과물을 만들어내려고 노력합니다. 당신의 이런 진정성 있는 창작 태도는 시간이 지날수록 더욱 빛을 발할 것입니다.'
        },
        'summer-soft': { // 5: 여름의 부드러운 실내
            title: '체계적인 창의력의 발휘',
            description: '이 그림을 그려낸 당신은 창의성과 현실감각 사이에서 완벽한 균형을 찾은 지혜로운 창작자입니다. 당신은 상상력을 발휘하면서도 실용성을 놓치지 않으며, 혁신을 추구하면서도 기본기를 소홀히 하지 않습니다.\n\n당신의 공방은 정돈되어 있으면서도 창의적인 아이디어들로 가득합니다. 계획을 세우고 단계별로 진행하면서도, 그 과정에서 새로운 영감이 떠오르면 유연하게 받아들일 줄 아는 사람입니다.\n\n당신은 혼자만의 창작 시간도 소중히 여기지만, 다른 사람들과의 협업이나 피드백도 적극적으로 받아들입니다. 자신의 아이디어를 다른 사람들과 나누며 함께 발전시켜나가는 과정에서 더 큰 창의력을 발휘합니다. 이런 당신의 열린 마음과 균형감각은 주변 사람들에게도 좋은 영향을 주며, 함께 작업하고 싶은 동반자로 인정받을 것입니다.'
        },
        'summer-vivid': { // 6: 여름의 생생한 도시
            title: '열정적인 창조력의 폭발',
            description: '이 그림을 그려낸 당신은 머릿속에 떠오르는 아이디어들을 즉시 현실로 만들어내는 역동적인 창작자입니다. 당신의 공방은 항상 무언가 새로운 것이 만들어지고 있는 활기찬 에너지로 가득합니다.\n\n당신은 완벽함보다는 속도감을 중시하며, 일단 시작하고 나서 수정해나가는 방식을 선호합니다. 실패를 두려워하지 않고, 오히려 실패에서 새로운 아이디어를 얻는 능력이 뛰어납니다. 다양한 분야에 관심이 많고, 여러 프로젝트를 동시에 진행하면서도 각각에 열정을 쏟아부을 수 있는 에너지를 가지고 있습니다.\n\n당신의 창작물들은 독창적이고 실험적인 성격이 강하며, 기존의 틀을 깨고 새로운 방식을 시도하는 것을 즐깁니다. 때로는 주변 사람들이 당신의 아이디어를 이해하지 못할 수도 있지만, 당신의 열정과 추진력은 결국 사람들을 놀라게 하는 결과물을 만들어낼 것입니다.'
        },
        'summer-dark': { // 7: 여름의 신비로운 밤
            title: '무한한 열정의 창조자',
            description: '이 그림을 그려낸 당신은 창작에 대한 열정이 그 누구보다도 뜨거운 진정한 아티스트입니다. 당신에게 창작이란 단순한 취미나 일이 아니라, 살아가는 이유이자 삶 그 자체입니다.\n\n당신의 공방은 마치 용광로처럼 끊임없이 새로운 것들이 만들어지고 변화하는 역동적인 공간입니다. 24시간이 모자랄 정도로 하고 싶은 것들이 많고, 머릿속에는 항상 새로운 아이디어들이 폭죽처럼 터져나옵니다.\n\n당신은 기존의 방식에 만족하지 않고 항상 혁신적이고 독창적인 것을 추구합니다. 때로는 이런 강렬한 창작 욕구 때문에 주변 사람들과의 관계나 일상생활에 소홀해질 수도 있지만, 그만큼 당신이 만들어내는 작품들은 세상에 없던 특별한 것들입니다.\n\n당신의 이런 타오르는 창작 정신은 세상을 더 아름답고 흥미롭게 만드는 원동력입니다. 당신은 예술가로, 창조자로, 혁신가로 태어난 사람입니다. 때로는 외로울 수도 있지만, 당신의 열정이 만들어내는 작품들은 많은 사람들에게 영감과 감동을 줄 것입니다.\n\n당신의 불타는 열정을 믿고, 계속해서 세상에 없던 새로운 것들을 창조해나가세요.'
        },
        
        // 🍂 가을의 그림들
        'autumn-bright': { // 8: 가을의 밝은 자연
            title: '차분하고 내향적인 관계 추구형',
            description: '이 그림을 그려낸 당신은 소중한 사람들과의 깊고 진실한 연결을 무엇보다 소중히 여기는 사람입니다. 당신에게 관계란 시끄럽고 화려한 것이 아니라, 마치 따뜻한 햇살이 조용히 스며드는 것처럼 은은하면서도 깊은 의미를 갖습니다.\n\n당신은 많은 사람들과 얕은 관계를 맺기보다는, 진심으로 마음을 나눌 수 있는 몇 명의 사람들과 깊이 있는 관계를 선호합니다. 때로는 새로운 사람들과의 만남이 부담스럽게 느껴질 수도 있지만, 한번 마음을 연 상대에게는 변함없는 따뜻함과 신뢰를 보여주는 당신입니다.\n\n조용한 카페에서 나누는 진솔한 대화, 함께하는 고요한 산책, 말없이도 서로를 이해하는 순간들이 당신에게는 가장 소중한 시간들이겠죠.'
        },
        'autumn-soft': { // 9: 가을의 부드러운 실내
            title: '조화로운 관계 균형형',
            description: '이 그림을 그려낸 당신은 혼자만의 시간과 사람들과의 시간 사이에서 아름다운 균형감을 찾은 지혜로운 사람입니다. 당신은 관계의 소중함을 알면서도, 자신만의 공간과 시간의 필요성 역시 잘 알고 있습니다.\n\n당신에게 인간관계는 마치 적당한 햇살처럼 따뜻하면서도 부담스럽지 않은 것입니다. 사람들과 함께할 때는 진심으로 그 순간을 즐기지만, 동시에 혼자만의 시간을 통해 자신을 돌아보고 재충전하는 시간도 소중히 여깁니다.\n\n당신의 주변 사람들은 당신의 이런 균형잡힌 모습에서 안정감을 느끼며, 당신과 함께 있을 때 편안함과 자연스러움을 경험합니다. 당신은 관계에서 무리하지 않으면서도 진정성을 잃지 않는, 성숙한 관계 맺기의 달인이라고 할 수 있어요.'
        },
        'autumn-vivid': { // 10: 가을의 생생한 도시
            title: '적극적인 관계 주도형',
            description: '이 그림을 그려낸 당신은 사람들과의 만남에서 에너지를 얻고, 그 에너지를 다시 주변 사람들에게 나누어주는 따뜻한 태양 같은 존재입니다. 당신은 관계에서 수동적으로 기다리기보다는 먼저 다가가고, 먼저 관심을 표현하며, 먼저 손을 내미는 사람입니다.\n\n당신의 밝고 긍정적인 에너지는 주변 사람들에게 활력을 주고, 때로는 소극적이던 사람들도 당신 덕분에 마음을 열게 됩니다. 새로운 만남을 두려워하지 않고, 오히려 설렘으로 받아들이는 당신의 모습은 많은 사람들에게 영감을 줍니다.\n\n당신은 그룹에서 자연스럽게 분위기 메이커 역할을 하며, 사람들 사이의 관계를 연결해주는 다리 같은 존재입니다. 때로는 너무 많은 관계에 에너지를 쏟아 지칠 수도 있지만, 사람들과의 소중한 추억들이 당신에게는 가장 큰 보물이 될 것입니다.'
        },
        'autumn-dark': { // 11: 가을의 신비로운 밤
            title: '열정적인 관계 몰입형',
            description: '이 그림을 그려낸 당신은 사랑하는 사람들을 위해서라면 무엇이든 할 수 있는, 뜨거운 마음을 가진 사람입니다. 당신에게 관계란 단순한 인연이 아니라 삶의 가장 중요한 의미이자 원동력입니다.\n\n당신은 사람을 사랑할 때 전심전력으로 사랑하고, 친구를 대할 때도 온 마음을 다해 대합니다. 당신의 이런 진심어린 마음은 상대방에게 깊은 감동을 주며, 당신 주변에는 항상 당신의 따뜻함에 감화된 사람들이 모여들게 됩니다.\n\n때로는 당신의 이런 열정이 상대방에게 부담이 될까 걱정하기도 하고, 때로는 사람들이 당신만큼 진심으로 대하지 않는 것 같아 상처받기도 할 것입니다. 하지만 당신의 이런 따뜻하고 진실한 마음이야말로 이 세상을 더 아름답게 만드는 귀한 선물이라는 것을 기억해주세요.\n\n당신은 사랑받기 위해 태어난 사람이고, 동시에 사랑을 나누어주기 위해 태어난 사람입니다.'
        },
        
        // ❄️ 겨울의 그림들
        'winter-bright': { // 12: 겨울의 밝은 자연
            title: '내면의 평온한 독립성',
            description: '이 그림을 그려낸 당신은 겉으로는 조용해 보이지만, 마음 깊은 곳에는 누구도 건드릴 수 없는 자신만의 바다를 품고 있는 사람입니다. 당신의 자유는 시끄럽거나 화려하지 않습니다. 마치 고요한 바다 깊은 곳처럼 조용하지만 무한히 넓고 깊은 자유입니다.\n\n당신은 다른 사람들의 기대나 시선에 휘둘리지 않고, 자신만의 속도와 방향으로 살아가는 법을 알고 있습니다. 때로는 주변 사람들이 당신을 이해하지 못할 수도 있지만, 당신은 그런 것들에 크게 흔들리지 않습니다.\n\n당신에게 가장 소중한 것은 마음의 평화와 내면의 자유입니다. 혼자만의 시간을 통해 자신과 마주하고, 진정으로 원하는 것이 무엇인지 깊이 사색하는 시간들이 당신을 가장 행복하게 만들 것입니다. 당신의 이런 고요한 깊이는 시간이 지날수록 더욱 큰 힘이 될 거예요.'
        },
        'winter-soft': { // 13: 겨울의 부드러운 실내
            title: '적응력 있는 독립성',
            description: '이 그림을 그려낸 당신은 자유로움과 책임감 사이에서 아름다운 균형을 찾은 현명한 사람입니다. 당신은 자유를 추구하지만 동시에 주변 상황과 사람들을 배려할 줄도 아는, 성숙한 자유인입니다.\n\n당신의 자유는 마치 잔잔한 파도처럼 유연하고 적응력이 뛰어납니다. 때로는 규칙과 틀 안에서도 자신만의 방식을 찾아내고, 때로는 과감하게 새로운 길을 개척하기도 합니다. 중요한 것은 어떤 상황에서든 자신다움을 잃지 않으면서도 조화를 이룰 줄 안다는 점입니다.\n\n당신은 계획을 세우는 것도 좋아하지만, 그 계획에 너무 얽매이지는 않습니다. 상황에 따라 유연하게 변화할 수 있는 여유로움이 당신의 큰 매력입니다. 이런 당신의 모습은 주변 사람들에게도 좋은 영향을 주며, 함께 있으면 편안함을 느끼게 해줍니다.'
        },
        'winter-vivid': { // 14: 겨울의 생생한 도시
            title: '모험적인 도전 정신',
            description: '이 그림을 그려낸 당신은 새로운 경험과 모험을 두려워하지 않는 용감한 개척자입니다. 당신의 자유는 정적이지 않습니다. 마치 파도를 타는 서퍼처럼 역동적이고 에너지 넘치는 자유를 추구합니다.\n\n당신은 반복되는 일상보다는 예측할 수 없는 새로운 경험들을 선호합니다. 여행을 좋아하고, 새로운 사람들을 만나는 것을 즐기며, 도전적인 일들에 흥미를 느낍니다. 때로는 주변 사람들이 당신의 선택을 무모하다고 생각할 수도 있지만, 당신은 안전한 길보다는 의미 있는 길을 선택하는 사람입니다.\n\n실패를 두려워하지 않고, 실패마저도 값진 경험으로 받아들이는 당신의 태도는 정말 멋집니다. 당신의 이런 도전 정신과 자유로운 영혼은 많은 사람들에게 영감을 주고, 세상을 더 넓게 보는 시야를 선물해줄 것입니다.'
        },
        'winter-dark': { // 15: 겨울의 신비로운 밤
            title: '무한한 가능성을 향한 질주',
            description: '이 그림을 그려낸 당신은 자유에 대한 갈망이 그 누구보다도 강렬한 사람입니다. 당신에게 자유란 선택사항이 아니라 삶의 필수 요소이며, 숨쉬는 것만큼이나 자연스럽고 중요한 것입니다.\n\n당신은 어떤 제약이나 한계도 받아들이기 어려워하며, 항상 더 넓은 세상, 더 큰 가능성을 꿈꿉니다. 때로는 이런 강렬한 자유 의지 때문에 주변 사람들과 갈등을 겪기도 하고, 안정을 추구하는 사람들로부터 이해받지 못할 때도 있을 것입니다.\n\n하지만 당신의 이런 타오르는 자유 정신이야말로 세상을 변화시키는 원동력입니다. 당신은 기존의 틀을 깨고 새로운 길을 만들어가는 선구자적 역할을 하며, 다른 사람들이 꿈꾸지도 못했던 가능성들을 현실로 만들어낼 수 있는 사람입니다.\n\n때로는 무모해 보일 수도 있지만, 당신의 이런 거침없는 자유로움이 세상에 새로운 바람을 불러일으킬 것입니다. 당신은 진정한 자유인으로 태어난 사람이에요.'
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
        card.classList.remove('selected');
        card.style.cssText = ''; // 모든 인라인 스타일 제거
    });
    
    // 인트로는 이미 깔끔한 상태이므로 추가 애니메이션 필요 없음
}

function goBackToSeason() {
    // Q2에서 Q1으로
    calendarTransition.classList.add('hidden');
    seasonSection.classList.remove('hidden');
    
    // 캘린더 선택 상태 초기화
    selectedSpace = '';
    scheduleCards.forEach(card => {
        card.classList.remove('selected');
        card.style.cssText = ''; // 모든 인라인 스타일 제거
    });
    
    // 계절 카드도 완전 초기화하고 다시 애니메이션
    seasonCards.forEach(card => {
        card.classList.remove('selected');
        card.style.cssText = ''; // 모든 인라인 스타일 제거
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    });
    
    // 계절 카드 다시 애니메이션
    setTimeout(() => {
        seasonCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

function goBackToCalendar() {
    // Q3에서 Q2로
    momentSection.classList.add('hidden');
    calendarTransition.classList.remove('hidden');
    
    // 순간 선택 상태 초기화
    selectedMoment = '';
    momentCards.forEach(card => {
        card.classList.remove('selected');
        card.style.cssText = ''; // 모든 인라인 스타일 제거
    });
    
    // 배경 초기화
    if (spaceBackground) {
        spaceBackground.className = 'space-background';
    }
    
    // 일정 카드도 완전 초기화하고 다시 애니메이션
    scheduleCards.forEach(card => {
        card.classList.remove('selected');
        card.style.cssText = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });
    
    // 일정 카드 다시 애니메이션
    setTimeout(() => {
        scheduleCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 80);
        });
    }, 100);
}

function goBackToMoment() {
    // Q4에서 Q3으로
    musicSection.classList.add('hidden');
    momentSection.classList.remove('hidden');
    
    // 음악 선택 상태 초기화
    selectedMusic = '';
    musicCards.forEach(card => {
        card.classList.remove('selected');
        card.style.cssText = ''; // 모든 인라인 스타일 제거
    });
    
    // 순간 카드도 완전 초기화하고 다시 애니메이션
    momentCards.forEach(card => {
        card.classList.remove('selected');
        card.style.cssText = '';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
    });
    
    // 순간 카드 다시 애니메이션
    setTimeout(() => {
        momentCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 120);
        });
    }, 150);
}

function goBackToMusic() {
    // Q5에서 Q4로
    valueSection.classList.add('hidden');
    musicSection.classList.remove('hidden');
    
    // 가치관 선택 상태 초기화
    selectedValue = '';
    valueCards.forEach(card => {
        card.classList.remove('selected');
        card.style.cssText = ''; // 모든 인라인 스타일 제거
    });
    
    // 음악 카드도 완전 초기화하고 다시 애니메이션
    musicCards.forEach(card => {
        card.classList.remove('selected', 'music-playing', 'ready-to-select');
        card.style.cssText = '';
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
    });
    
    // 음악 카드 다시 애니메이션
    setTimeout(() => {
        musicCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }, 100);
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