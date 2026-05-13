const PASSWORD = '2913';
  let entered = '';
  let musicPlaying = false;
  let wrongTimer = null;
  let lastSparkTime = 0;
  let cursorReady = false;
  const cursorState = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2
  };

  function setupCursorMagic() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    document.addEventListener('pointermove', (e) => {
      cursorReady = true;
      cursorState.x = e.clientX;
      cursorState.y = e.clientY;
      dot.style.left = cursorState.x + 'px';
      dot.style.top = cursorState.y + 'px';

      const now = Date.now();
      if (now - lastSparkTime > 42) {
        lastSparkTime = now;
        createCursorSpark(e.clientX, e.clientY);
      }
    });

    document.addEventListener('pointerdown', (e) => {
      createClickHeart(e.clientX, e.clientY);
    });

    document.addEventListener('pointerover', (e) => {
      if (e.target.closest('button, .gift-item, .polaroid-wrap, .polaroid-miss, .photo-small')) {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('pointerout', (e) => {
      if (e.target.closest('button, .gift-item, .polaroid-wrap, .polaroid-miss, .photo-small')) {
        document.body.classList.remove('cursor-hover');
      }
    });

    function animateCursorRing() {
      cursorState.ringX += (cursorState.x - cursorState.ringX) * 0.18;
      cursorState.ringY += (cursorState.y - cursorState.ringY) * 0.18;
      if (cursorReady) {
        ring.style.left = cursorState.ringX + 'px';
        ring.style.top = cursorState.ringY + 'px';
      }
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();
  }

  function createCursorSpark(x, y) {
    const spark = document.createElement('span');
    spark.className = 'cursor-spark';
    spark.textContent = Math.random() > 0.5 ? '✦' : '♡';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.setProperty('--spark-x', (Math.random() * 36 - 18) + 'px');
    spark.style.setProperty('--spark-y', (Math.random() * 36 - 18) + 'px');
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  }

  function createClickHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'click-heart';
    heart.textContent = ['♥', '♡', '✦'][Math.floor(Math.random() * 3)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 950);
  }

  function animatePageElements(target) {
    [...target.children].forEach((child, index) => {
      child.classList.remove('entrance-pop');
      child.style.animationDelay = (index * 0.07) + 's';
      void child.offsetWidth;
      child.classList.add('entrance-pop');
      setTimeout(() => {
        child.classList.remove('entrance-pop');
        child.style.animationDelay = '';
      }, 760 + index * 70);
    });
  }

  function pageGlimmers() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const glimmer = document.createElement('span');
        glimmer.className = 'page-glimmer';
        glimmer.style.left = (8 + Math.random() * 84) + 'vw';
        glimmer.style.top = (18 + Math.random() * 68) + 'vh';
        glimmer.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
        document.body.appendChild(glimmer);
        setTimeout(() => glimmer.remove(), 4200);
      }, i * 70);
    }
  }

  function setupMusic() {
    const btn = document.getElementById('musicToggle');
    const audio = document.getElementById('birthdayAudio');
    audio.volume = 0.45;
    btn.classList.add('ready');
    audio.addEventListener('play', () => {
      musicPlaying = true;
      btn.textContent = '♪';
      btn.title = 'Pause music';
    });
    audio.addEventListener('pause', () => {
      musicPlaying = false;
      btn.textContent = '♫';
      btn.title = 'Play music';
    });
  }

  function toggleMusic() {
    const btn = document.getElementById('musicToggle');
    const audio = document.getElementById('birthdayAudio');
    if (musicPlaying) {
      audio.pause();
      return;
    }
    audio.play().catch(() => {
      btn.textContent = '!';
      btn.title = 'Add birthday-audio.mp3, birthday-audio.ogg, or birthday-audio.wav in this folder';
      setTimeout(() => {
        btn.textContent = '♫';
      }, 1200);
    });
  }

  function playMusicAfterUnlock() {
    const btn = document.getElementById('musicToggle');
    const audio = document.getElementById('birthdayAudio');
    if (musicPlaying) return;
    audio.play().catch(() => {
      btn.textContent = '♫';
      btn.title = 'Tap to play music';
    });
  }

  function numPress(n) {
    if (entered.length >= 4) return;
    hideWrongReaction();
    entered += n;
    updateDots();
    if (entered.length === 4) {
      setTimeout(checkPass, 300);
    }
  }

  function numDel() {
    entered = entered.slice(0, -1);
    updateDots();
    hideWrongReaction();
  }

  function updateDots() {
    for (let i = 0; i < 4; i++) {
      const d = document.getElementById('d' + i);
      if (i < entered.length) {
        d.textContent = '●';
        d.classList.add('filled');
      } else {
        d.textContent = '';
        d.classList.remove('filled');
      }
    }
  }

  function checkPass() {
    if (entered === PASSWORD) {
      playMusicAfterUnlock();
      goTo('page-bears');
    } else {
      showWrongReaction();
      entered = '';
      updateDots();
    }
  }

  function hideWrongReaction() {
    clearTimeout(wrongTimer);
    document.getElementById('wrongReaction').classList.remove('show');
  }

  function showWrongReaction() {
    clearTimeout(wrongTimer);
    const box = document.getElementById('wrongReaction');
    const msg = document.getElementById('wrongMsg');
    const gif = document.getElementById('wrongGif');
    msg.textContent = "Wrong password can't open";
    gif.src = 'saynogif.webp';
    box.classList.remove('show');
    box.offsetHeight;
    box.classList.add('show');
    msg.style.animation = 'none';
    setTimeout(() => { msg.style.animation = 'shake 0.4s'; }, 10);

    wrongTimer = setTimeout(() => {
      msg.textContent = 'socho kya ho sakta h password';
      gif.src = 'thinkinggif.webp';
      box.classList.remove('show');
      box.offsetHeight;
      box.classList.add('show');
    }, 1700);
  }

  function goTo(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    target.classList.add('active');
    animatePageElements(target);
    pageGlimmers();

    if (id === 'page-typing') startTyping();
    if (id === 'page-miss') buildLipsticks();
    if (id === 'page-letter') restartLetterPhotoDrop();
  }

  function restartLetterPhotoDrop() {
    document.querySelectorAll('#page-letter .photo-small').forEach(photo => {
      photo.style.animation = 'none';
      photo.offsetHeight;
      photo.style.animation = '';
    });
  }

  // ===== TYPING ANIMATION =====
  const typingMessages = [
    "Teri hotto ki khushi ek taraf\nTeri gam ki chupii ek taraf",
    "Chahe fir jo ho jaye puri duniya ek taraf",
    "Tere sath teraa yaar ek taraf"
  ];
  const messageImages = [
    "message1page.jpg",
    "message2page.jpg",
    "message3page.jpg"
  ];
  let tIdx = 0, tChar = 0, tDir = 1;

  function startTyping() {
    const el = document.getElementById('typingEl');
    const img = document.getElementById('messageGif');
    el.innerHTML = '';
    img.src = messageImages[0];
    tIdx = 0; tChar = 0;
    typeNext(el);
  }

  function typeNext(el) {
    const msg = typingMessages[tIdx];
    const img = document.getElementById('messageGif');
    if (tChar === 0) {
      img.src = messageImages[tIdx];
      img.style.animation = 'none';
      setTimeout(() => { img.style.animation = 'messagePop 0.55s ease both, floatText 2.2s ease-in-out infinite 0.6s'; }, 20);
    }
    if (tChar <= msg.length) {
      el.innerHTML = msg.slice(0, tChar) + '<span class="cursor"></span>';
      tChar++;
      setTimeout(() => typeNext(el), 60);
    } else {
      setTimeout(() => {
        tIdx++;
        tChar = 0;
        if (tIdx < typingMessages.length) {
          el.innerHTML = '';
          setTimeout(() => typeNext(el), 400);
        } else {
          setTimeout(() => goTo('page-wish'), 800);
        }
      }, 900);
    }
  }

  // ===== CONFETTI =====
  function launchConfetti() {
    const colors = ['#ffb3ba','#df8588','#df606f','#fa6d86','#8d1260','#5b0737'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = Math.random() * 1.5 + 's';
      c.style.animationDuration = (2 + Math.random() * 2) + 's';
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }
  }

  // ===== HEART RAIN =====
  function heartRain() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const h = document.createElement('div');
        h.className = 'heart-rain';
        h.textContent = ['💕','💗','💖','💝','🩷'][Math.floor(Math.random()*5)];
        h.style.left = Math.random() * 100 + 'vw';
        h.style.animationDuration = (2 + Math.random() * 2) + 's';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 4000);
      }, i * 150);
    }
  }

  // ===== BLOW CANDLES =====
  function blowCandles() {
    launchConfetti();
    heartRain();
    document.getElementById('blowBtn').textContent = '🎉 Yay!';
    document.getElementById('blowBtn').disabled = true;
    // Remove candle flames visually
    document.querySelectorAll('.candle-flame').forEach(f => {
      f.style.opacity = '0';
      f.style.transition = 'opacity 0.5s';
    });
    setTimeout(() => goTo('page-hbd'), 2000);
  }

  // ===== GIFTS =====
  const giftMsgs = [
    '💝 Teri khushi hamesha bani rahe!',
    '🌸 Teri yaari sabse anmol hai!',
    '✨ Best friend forever, yaara!'
  ];
  let openedGifts = new Set();

  function openGift(n) {
    openedGifts.add(n);
    const gifts = document.querySelectorAll('.gift-item');
    gifts[n-1].textContent = '🎉';
    gifts[n-1].style.animation = 'bounceIn 0.5s';

    const msg = document.getElementById('giftMsg');
    msg.textContent = giftMsgs[n-1];
    msg.classList.remove('show');
    msg.offsetHeight;
    msg.classList.add('show');

    if (openedGifts.size === 3) {
      setTimeout(() => {
        document.getElementById('giftNextBtn').style.display = 'block';
      }, 600);
    }
  }

  // ===== BFF BG =====
  function buildLipsticks() {
    const bg = document.getElementById('lipstickBg');
    bg.innerHTML = '';
    for (let i = 0; i < 40; i++) {
      const span = document.createElement('span');
      span.textContent = ['BFF', 'YAAR', 'FOREVER', '★', '♡'][Math.floor(Math.random() * 5)];
      span.style.margin = '4px 6px';
      span.style.fontSize = (18 + Math.random() * 34) + 'px';
      span.style.transform = `rotate(${Math.random() * 28 - 14}deg)`;
      span.style.display = 'inline-block';
      bg.appendChild(span);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupMusic();
    setupCursorMagic();
    animatePageElements(document.querySelector('.page.active'));
  });


