/* ==========================================================================
   The Legend of Zelda 40th — 공통 인터랙션 스크립트
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {

  /* 1. 스크롤 시 고정 네비게이션 바에 그림자 부여 */
  var nav = document.querySelector('.nintendo-nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2. 맨 위로(PAGE TOP) 버튼 — 일정 스크롤 후 표시 */
  var topBtn = document.querySelector('.btn-top');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 3. 코로그의 숲 — 스크롤 진입 시 등장, 클릭하면 야하하! */
  var korokSec = document.querySelector('.korok-section');
  if (korokSec) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          korokSec.classList.toggle('in-view', entry.isIntersecting);
        });
      }, { threshold: 0.25 }).observe(korokSec);
    } else {
      korokSec.classList.add('in-view');
    }
    /* 클릭 시 귀여운 '뿅' 효과음 (Web Audio 합성) */
    function korokPop() {
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1240, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) { /* 오디오 미지원 환경은 무음 */ }
    }

    korokSec.querySelectorAll('.korok-runner').forEach(function (r) {
      var timer;
      r.addEventListener('click', function () {
        r.classList.add('yahaha');
        korokPop();
        clearTimeout(timer);
        timer = setTimeout(function () {
          r.classList.remove('yahaha');
        }, 5000); /* 대사는 5초 뒤에 사라짐 */
      });
    });
  }

  /* 4. 시커스톤 단말 — 클릭 시 활성화 + 기동음 */
  var terminal = document.querySelector('.sheikah-terminal');
  if (terminal) {
    /* 실제 효과음 파일(audio/Sheikah_Slate.mp3)이 있으면 사용, 없으면 합성음 */
    var sfx = new Audio('audio/Sheikah_Slate.mp3');
    var sfxOk = true;
    sfx.addEventListener('error', function () { sfxOk = false; });

    function sheikahChime() {
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        [740, 1108, 1480, 2217].forEach(function (freq, i) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          var t = ctx.currentTime + i * 0.09;
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.55);
        });
      } catch (e) { /* 오디오 미지원 환경은 무음 */ }
    }

    var label = terminal.querySelector('.sheikah-label');
    terminal.addEventListener('click', function () {
      var on = terminal.classList.toggle('active');
      if (on) {
        terminal.classList.remove('pulse');
        void terminal.offsetWidth; /* 파동 애니메이션 리셋 */
        terminal.classList.add('pulse');
        if (sfxOk) {
          sfx.currentTime = 0;
          sfx.play().catch(sheikahChime);
        } else {
          sheikahChime();
        }
        label.textContent = '시커스톤 기동 완료 — 영상 기록 열람 가능';
      } else {
        terminal.classList.remove('pulse');
        label.textContent = '단말에 시커스톤을 가져다 대세요 (클릭)';
      }
    });
  }

  /* 5. 사이트 검색 — 검색 아이콘 클릭 시 오버레이 */
  var SEARCH_INDEX = [
    /* 본편 타이틀 */
    { tag: '타이틀', year: 1986, title: '젤다의 전설', desc: '1986 · 패미컴 — 시리즈의 위대한 시작', url: 'index.html#history' },
    { tag: '타이틀', year: 1987, title: '젤다의 전설 2 링크의 모험', desc: '1987 · 패미컴 — 횡스크롤 액션 RPG 외전적 2편', url: 'index.html#history' },
    { tag: '타이틀', year: 1991, title: '젤다의 전설 신들의 트라이포스', desc: '1991 · 슈퍼패미컴 — 빛과 어둠의 평행 세계', url: 'index.html#history' },
    { tag: '타이틀', year: 1993, title: '젤다의 전설 꿈꾸는 섬', desc: '1993 원작 / 2019 Switch 리메이크', url: 'detail.html?game=dream' },
    { tag: '타이틀', year: 1998, title: '젤다의 전설 시간의 오카리나', desc: '1998 · N64 — 메타크리틱 99점의 신화', url: 'index.html#history' },
    { tag: '타이틀', year: 2000, title: '젤다의 전설 무쥬라의 가면', desc: '2000 · N64 — 3일의 시간을 되감는 이색작', url: 'index.html#history' },
    { tag: '타이틀', year: 2001, title: '젤다의 전설 이상한 나무열매 (시공의 장·대지의 장)', desc: '2001 · GBC — 두 작품 연동 패스워드 모험', url: 'index.html#history' },
    { tag: '타이틀', year: 2002, title: '젤다의 전설 바람의 지휘봉', desc: '2002 · 게임큐브 — 대양을 항해하는 툰셰이딩 모험', url: 'index.html#history' },
    { tag: '타이틀', year: 2002, title: '젤다의 전설 4개의 검', desc: '2002 · GBA — 시리즈 첫 멀티플레이 협동 외전', url: 'index.html#history' },
    { tag: '타이틀', year: 2004, title: '젤다의 전설 이상한 모자', desc: '2004 · GBA — 소인 세계를 오가는 모험', url: 'index.html#history' },
    { tag: '타이틀', year: 2004, title: '젤다의 전설 4개의 검+', desc: '2004 · 게임큐브 — 4인 협동 액션 어드벤처', url: 'index.html#history' },
    { tag: '타이틀', year: 2006, title: '젤다의 전설 황혼의 공주', desc: '2006 · Wii — 울프 링크의 다크 판타지', url: 'index.html#history' },
    { tag: '타이틀', year: 2007, title: '젤다의 전설 몽환의 모래시계', desc: '2007 · NDS — 터치펜으로 항해하는 모험', url: 'index.html#history' },
    { tag: '타이틀', year: 2009, title: '젤다의 전설 대지의 기적', desc: '2009 · NDS — 기차로 달리는 하이랄', url: 'index.html#history' },
    { tag: '타이틀', year: 2011, title: '젤다의 전설 스카이워드 소드 HD', desc: '2011 원작 / 2021 Switch HD — 마스터 소드 탄생의 비화', url: 'detail.html?game=skyward' },
    { tag: '타이틀', year: 2013, title: '젤다의 전설 신들의 트라이포스 2', desc: '2013 · 3DS — 벽화가 되어 이동하는 신감각 퍼즐', url: 'index.html#history' },
    { tag: '타이틀', year: 2015, title: '젤다의 전설 트라이포스 삼총사', desc: '2015 · 3DS — 3인 협동 멀티플레이', url: 'index.html#history' },
    { tag: '타이틀', year: 2017, title: '젤다의 전설 브레스 오브 더 와일드', desc: '2017 · Switch — 오픈월드의 표준을 바꾼 신화', url: 'detail.html?game=botw' },
    { tag: '타이틀', year: 2023, title: '젤다의 전설 티어스 오브 더 킹덤', desc: '2023 · Switch — 하늘과 지저의 한계 없는 크래프팅', url: 'detail.html?game=totk' },
    { tag: '타이틀', year: 2024, title: '젤다의 전설 지혜의 투영', desc: '2024 · Switch — 공주가 이끄는 최신 패러다임', url: 'detail.html?game=echoes' },
    /* 외전 · 스핀오프 */
    { tag: '타이틀', year: 2019, title: '케이던스 오브 하이랄', desc: '2019 · Switch — 네크로댄서 크로스오버 리듬 액션', url: 'index.html#spinoff' },
    { tag: '타이틀', year: 2018, title: '젤다무쌍 하이랄 올스타즈 DX', desc: '2018 · Switch — 올스타 무쌍 액션 완전판', url: 'index.html#spinoff' },
    { tag: '타이틀', year: 2020, title: '젤다무쌍 대재앙의 시대', desc: '2020 · Switch — 대재앙 100년 전의 전쟁 서사', url: 'index.html#spinoff' },
    { tag: '타이틀', year: 2025, title: '젤다무쌍 봉인전기', desc: '2025 · Switch 2 — 태고의 봉인 전쟁', url: 'index.html#spinoff' },
    /* DLC — 브레스 오브 더 와일드 */
    { tag: 'DLC', year: 2017, title: '젤다의 전설 브레스 오브 더 와일드 익스팬션 패스', desc: '2017 · BotW 추가 콘텐츠 2종 통합 패스', url: 'detail.html?game=botw' },
    { tag: 'DLC', year: 2017, title: '젤다의 전설 브레스 오브 더 와일드 시련의 패자', desc: 'BotW 익스팬션 1탄 — 마스터 모드 · 시련의 사당 · 검의 시련', url: 'detail.html?game=botw' },
    { tag: 'DLC', year: 2017, title: '젤다의 전설 브레스 오브 더 와일드 영걸들의 노래', desc: 'BotW 익스팬션 2탄 — 4영걸 추가 시나리오 · 마스터 사이클 제로', url: 'detail.html?game=botw' },
    /* DLC — 젤다무쌍 대재앙의 시대 */
    { tag: 'DLC', year: 2021, title: '젤다무쌍 대재앙의 시대 익스팬션 패스', desc: '2021 · 대재앙의 시대 추가 콘텐츠 통합 패스', url: 'index.html#spinoff' },
    { tag: 'DLC', year: 2021, title: '젤다무쌍 대재앙의 시대 고대유물의 고동', desc: '대재앙의 시대 1탄 — 역전의 가디언 등 신규 플레이어블', url: 'index.html#spinoff' },
    { tag: 'DLC', year: 2021, title: '젤다무쌍 대재앙의 시대 추억의 수호자', desc: '대재앙의 시대 2탄 — 신규 시나리오 · 추가 무기', url: 'index.html#spinoff' },
    /* DLC — 젤다무쌍 (2014, 영웅들의 시대 시즌 패스 / DX 수록) */
    { tag: 'DLC', year: 2014, title: '젤다무쌍 하이랄 올스타즈 마스터 퀘스트 팩', desc: '젤다무쌍 — 추가 어드벤처 맵 · 신규 무기 (DX 수록)', url: 'index.html#spinoff' },
    { tag: 'DLC', year: 2014, title: '젤다무쌍 하이랄 올스타즈 황혼의 공주 팩', desc: '젤다무쌍 — 트와일라잇 프린세스 테마 캐릭터 · 무기 (DX 수록)', url: 'index.html#spinoff' },
    { tag: 'DLC', year: 2015, title: '젤다무쌍 하이랄 올스타즈 무쥬라의 가면 팩', desc: '젤다무쌍 — 무쥬라의 가면 테마 캐릭터 · 맵 (DX 수록)', url: 'index.html#spinoff' },
    { tag: 'DLC', year: 2015, title: '젤다무쌍 하이랄 올스타즈 보스 팩', desc: '젤다무쌍 — 가논의 분노 등 신규 모드 · 캐릭터 (DX 수록)', url: 'index.html#spinoff' },
    /* DLC — 케이던스 오브 하이랄 */
    { tag: 'DLC', year: 2019, title: '케이던스 오브 하이랄 캐릭터 팩', desc: '추가 플레이어블 캐릭터 다수', url: 'index.html#spinoff' },
    { tag: 'DLC', year: 2019, title: '케이던스 오브 하이랄 멜로디 팩', desc: '케이던스 오브 하이랄 — 추가 BGM 어레인지', url: 'index.html#spinoff' },
    { tag: 'DLC', year: 2020, title: '케이던스 오브 하이랄 가면의 교향곡', desc: '케이던스 오브 하이랄 — 스컬 키드가 주인공인 신규 스토리', url: 'index.html#spinoff' }
  ];

  var searchBtn = document.querySelector('.nav-search');
  if (searchBtn) {
    var overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.innerHTML =
      '<div class="search-box">' +
        '<div class="search-input-row">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>' +
          '<input type="text" placeholder="게임 타이틀 검색..." aria-label="검색어 입력">' +
          '<button type="button" class="search-close" aria-label="닫기">✕</button>' +
        '</div>' +
        '<div class="search-controls">' +
          '<div class="search-filter" role="tablist">' +
            '<button type="button" class="search-filter-btn is-active" data-filter="all">전체</button>' +
            '<button type="button" class="search-filter-btn" data-filter="타이틀">타이틀</button>' +
            '<button type="button" class="search-filter-btn" data-filter="DLC">DLC</button>' +
          '</div>' +
          '<select class="search-sort" aria-label="정렬 순서">' +
            '<option value="newest">최신순</option>' +
            '<option value="oldest">오래된순</option>' +
            '<option value="name">이름순</option>' +
          '</select>' +
        '</div>' +
        '<ul class="search-results"></ul>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('input');
    var resultsEl = overlay.querySelector('.search-results');
    var filterBtns = overlay.querySelectorAll('.search-filter-btn');
    var sortSelect = overlay.querySelector('.search-sort');
    var currentFilter = 'all';
    var currentSort = 'newest';

    function renderResults(keyword) {
      var q = keyword.trim().toLowerCase();
      var list = SEARCH_INDEX.filter(function (item) {
        var matchTag = currentFilter === 'all' || item.tag === currentFilter;
        var matchKeyword = !q || (item.title + ' ' + item.desc + ' ' + item.tag).toLowerCase().indexOf(q) !== -1;
        return matchTag && matchKeyword;
      });
      list.sort(function (a, b) {
        /* 전체는 타이틀·DLC 구분 없이 섞어서 정렬 (기본 최신순) */
        if (currentSort === 'name') return a.title.localeCompare(b.title, 'ko');
        if (currentSort === 'oldest') return a.year - b.year;
        return b.year - a.year;
      });
      if (!list.length) {
        resultsEl.innerHTML = '<li class="search-empty">검색 결과가 없습니다. 다른 키워드로 찾아보세요.</li>';
        return;
      }
      resultsEl.innerHTML = list.map(function (item) {
        return '<li><a href="' + item.url + '">' +
          '<span class="search-tag">' + item.tag + '</span>' +
          '<span><span class="sr-title">' + item.title + '</span>' +
          '<span class="sr-desc">' + item.desc + '</span></span>' +
        '</a></li>';
      }).join('');
    }

    function openSearch(e) {
      if (e) e.preventDefault();
      currentFilter = 'all';
      currentSort = 'newest';
      if (sortSelect) sortSelect.value = 'newest';
      filterBtns.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-filter') === 'all'); });
      overlay.classList.add('open');
      renderResults('');
      setTimeout(function () { input.focus(); }, 100);
    }
    function closeSearch() {
      overlay.classList.remove('open');
      input.value = '';
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFilter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        /* 전체는 항상 타이틀 → DLC, 최신순으로 고정 배치 */
        if (currentFilter === 'all') {
          currentSort = 'newest';
          if (sortSelect) sortSelect.value = 'newest';
        }
        renderResults(input.value);
      });
    });
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        currentSort = sortSelect.value;
        renderResults(input.value);
      });
    }

    searchBtn.addEventListener('click', openSearch);
    overlay.querySelector('.search-close').addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearch(); });
    input.addEventListener('input', function () { renderResults(input.value); });
  }

  /* 6. 장바구니 (저장/배지/토스트) */
  function getCart() {
    try {
      var raw = JSON.parse(localStorage.getItem('zelda_cart') || '[]');
      /* 구버전(문자열 배열) 데이터 호환 */
      return raw.map(function (item) {
        return typeof item === 'string' ? { title: item, price: '-' } : item;
      });
    } catch (e) { return []; }
  }
  function setCart(items) {
    try { localStorage.setItem('zelda_cart', JSON.stringify(items)); } catch (e) {}
    updateCartBadge();
    renderCart();
  }
  function updateCartBadge() {
    var buyLink = document.querySelector('.nav-buy a');
    if (!buyLink) return;
    var count = getCart().length;
    var badge = buyLink.querySelector('.cart-badge');
    if (count === 0) { if (badge) badge.remove(); return; }
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      buyLink.appendChild(badge);
    }
    badge.textContent = count > 99 ? '99+' : count;
  }
  function priceToNumber(price) {
    var n = parseInt(String(price).replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }

  var toastEl = document.createElement('div');
  toastEl.className = 'toast';
  document.body.appendChild(toastEl);
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }

  /* 7. 가짜 SMS 구매 모달 (전 페이지 공통 주입) */
  var smsOverlay = document.createElement('div');
  smsOverlay.className = 'sms-overlay';
  smsOverlay.setAttribute('role', 'dialog');
  smsOverlay.innerHTML =
    '<div class="sms-phone">' +
      '<div class="sms-header">Nintendo Store · 1588-0000' +
        '<button type="button" class="sms-x" aria-label="닫기">✕</button></div>' +
      '<div class="sms-body">' +
        '<div class="sms-bubble">[Web발신]<br><strong>Nintendo Store 주문 알림</strong><br><br>' +
          '고객님, <strong class="sms-game"></strong> 결제 요청이 접수되었습니다.<br>' +
          '결제 금액: <strong class="sms-price"></strong><br><br>' +
          '본인이 주문하신 것이 맞다면 아래 버튼을 눌러 구매를 완료해 주세요.</div>' +
        '<span class="sms-time"></span>' +
      '</div>' +
      '<div class="sms-actions"><button type="button" class="btn-sms-confirm">구매완료</button></div>' +
      '<div class="sms-success">' +
        '<div class="success-check">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12.5 10 18.5 20 6.5"></polyline></svg>' +
        '</div>' +
        '<h3>구매가 완료되었습니다!</h3>' +
        '<p>하이랄에서 만나요, 용사님 🗡️</p>' +
        '<button type="button" class="btn-sms-confirm btn-sms-close">닫기</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(smsOverlay);

  var smsPhone = smsOverlay.querySelector('.sms-phone');
  var smsFromCart = false;

  function openSms(title, price, fromCart) {
    smsFromCart = !!fromCart;
    smsOverlay.querySelector('.sms-game').textContent = title;
    smsOverlay.querySelector('.sms-price').textContent = price;
    var now = new Date();
    smsOverlay.querySelector('.sms-time').textContent =
      '오늘 ' + (now.getHours() < 12 ? '오전 ' : '오후 ') +
      ((now.getHours() % 12) || 12) + ':' + String(now.getMinutes()).padStart(2, '0');
    smsPhone.classList.remove('done');
    smsOverlay.classList.add('open');
  }
  function closeSms() { smsOverlay.classList.remove('open'); }

  smsOverlay.querySelector('.sms-x').addEventListener('click', closeSms);
  smsOverlay.addEventListener('click', function (e) { if (e.target === smsOverlay) closeSms(); });
  smsOverlay.querySelector('.btn-sms-confirm').addEventListener('click', function () {
    smsPhone.classList.add('done');
    if (smsFromCart) setCart([]); /* 장바구니 전체 구매 시 비우기 */
  });
  smsOverlay.querySelector('.btn-sms-close').addEventListener('click', closeSms);

  /* 8. 장바구니 드로어 — 네비 '구매하기' 클릭으로 열림 */
  var drawerDim = document.createElement('div');
  drawerDim.className = 'cart-dim';
  var drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.innerHTML =
    '<div class="cart-head">' +
      '<h3>장바구니 <span class="cart-count"></span></h3>' +
      '<button type="button" class="cart-close" aria-label="닫기">✕</button>' +
    '</div>' +
    '<ul class="cart-items"></ul>' +
    '<div class="cart-foot">' +
      '<div class="cart-total-row"><span>총 결제 금액</span><strong class="cart-total">0원</strong></div>' +
      '<button type="button" class="btn-cart-buy">전체 구매하기</button>' +
      '<button type="button" class="btn-cart-clear">전체 비우기</button>' +
    '</div>';
  document.body.appendChild(drawerDim);
  document.body.appendChild(drawer);

  function renderCart() {
    var items = getCart();
    drawer.querySelector('.cart-count').textContent = items.length ? '(' + items.length + ')' : '';
    var listEl = drawer.querySelector('.cart-items');
    if (!items.length) {
      listEl.innerHTML = '<li class="cart-empty">장바구니가 비어 있어요.<br>마음에 드는 하이랄을 담아보세요! 🗡️</li>';
    } else {
      listEl.innerHTML = items.map(function (item, i) {
        return '<li><div><p class="ci-title">' + item.title + '</p>' +
          '<span class="ci-price">' + item.price + '</span></div>' +
          '<button type="button" class="ci-remove" data-idx="' + i + '" aria-label="삭제">✕</button></li>';
      }).join('');
    }
    var total = items.reduce(function (sum, item) { return sum + priceToNumber(item.price); }, 0);
    drawer.querySelector('.cart-total').textContent = total.toLocaleString('ko-KR') + '원';
    var hasItems = items.length > 0;
    drawer.querySelector('.btn-cart-buy').disabled = !hasItems;
    drawer.querySelector('.btn-cart-clear').disabled = !hasItems;
  }

  function openDrawer() { renderCart(); drawer.classList.add('open'); drawerDim.classList.add('show'); }
  function closeDrawer() { drawer.classList.remove('open'); drawerDim.classList.remove('show'); }

  var navBuy = document.querySelector('.nav-buy a');
  if (navBuy) {
    navBuy.addEventListener('click', function (e) {
      e.preventDefault();
      openDrawer();
    });
  }
  drawer.querySelector('.cart-close').addEventListener('click', closeDrawer);
  drawerDim.addEventListener('click', closeDrawer);

  drawer.querySelector('.cart-items').addEventListener('click', function (e) {
    var btn = e.target.closest('.ci-remove');
    if (!btn) return;
    var items = getCart();
    items.splice(parseInt(btn.getAttribute('data-idx'), 10), 1);
    setCart(items);
  });

  drawer.querySelector('.btn-cart-clear').addEventListener('click', function () {
    setCart([]);
    toast('장바구니를 비웠어요.');
  });

  drawer.querySelector('.btn-cart-buy').addEventListener('click', function () {
    var items = getCart();
    if (!items.length) return;
    var total = items.reduce(function (sum, item) { return sum + priceToNumber(item.price); }, 0);
    var title = items.length === 1 ? items[0].title : '장바구니 상품 ' + items.length + '개';
    closeDrawer();
    openSms(title, total.toLocaleString('ko-KR') + '원', true);
  });

  updateCartBadge();
  renderCart();

  /* 9. 상세 페이지 버튼 연결 */
  var addCartBtn = document.getElementById('add-cart');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', function () {
      var game = window.CURRENT_GAME || { title: '젤다의 전설', price: '-' };
      var cart = getCart();
      cart.push({ title: game.title, price: game.price });
      setCart(cart);
      toast('🛒 「' + game.title + '」을(를) 장바구니에 담았어요 (' + cart.length + '개)');
    });
  }

  var buyNowBtn = document.getElementById('buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function () {
      var game = window.CURRENT_GAME || { title: '젤다의 전설', price: '-' };
      openSms(game.title, game.price, false);
    });
  }

  /* 10. 스크롤 리빌 — 화면에 들어오는 순간 부드럽게 떠오르는 등장 효과 */
  var targets = document.querySelectorAll(
    '.section-title, .section-subtitle, .char-grid, ' +
    '.spinoff-grid, .echoes-intro, .eshop-wrapper, .timeline-master-row, ' +
    '.meme-text, .korok-text-card, .video-grid, .faq-list, .news-list, ' +
    '.main-content, .sidebar-box'
  );

  if (!('IntersectionObserver' in window)) return; /* 구형 브라우저는 즉시 표시 */

  targets.forEach(function (el) { el.classList.add('reveal'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(function (el) { io.observe(el); });
});
