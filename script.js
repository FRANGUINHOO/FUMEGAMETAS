let goals = JSON.parse(localStorage.getItem('goals_db')) || [];
let audioCtx = null;
let activeFullscreenId = null;

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('targetDate').value = today;
});

function setQuickMinutes(minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('targetDate').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('targetHour').value = `${hh}:${min}:${ss}`;
}

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playAlarmSound() {
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

document.getElementById('goalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    initAudio();

    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category');
    const dateInput = document.getElementById('targetDate').value;
    const hourInput = document.getElementById('targetHour').value;

    const targetTimestamp = new Date(`${dateInput}T${hourInput}`).getTime();

    const newGoal = {
        id: Date.now().toString(),
        title: titleInput.value,
        category: categoryInput.value,
        targetTime: targetTimestamp,
        alarmPlayed: false
    };

    goals.push(newGoal);
    saveGoals();
    renderGoals();

    titleInput.value = '';
    document.getElementById('targetHour').value = '';
});

function saveGoals() {
    localStorage.setItem('goals_db', JSON.stringify(goals));
}

function deleteGoal(id) {
    if (activeFullscreenId === id) {
        closeFullscreen();
    }
    goals = goals.filter(g => g.id !== id);
    saveGoals();
    renderGoals();
}

function openFullscreen(id) {
    activeFullscreenId = id;
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    document.getElementById('fullscreenTitle').textContent = goal.title;
    document.getElementById('fullscreenCategory').textContent = goal.category;
    document.getElementById('fullscreenModal').classList.add('active');

    updateTimers();
}

function closeFullscreen() {
    activeFullscreenId = null;
    document.getElementById('fullscreenModal').classList.remove('active');
}

function updateTimers() {
    const now = Date.now();
    let activeCount = 0;
    let expiredCount = 0;

    goals.forEach(goal => {
        const diff = goal.targetTime - now;

        if (diff <= 0) {
            expiredCount++;
            if (!goal.alarmPlayed) {
                goal.alarmPlayed = true;
                saveGoals();
                playAlarmSound();
            }
        } else {
            activeCount++;
        }

        const timerElem = document.getElementById(`timer-${goal.id}`);
        const itemElem = document.getElementById(`item-${goal.id}`);

        let formattedTime = "";
        if (diff <= 0) {
            formattedTime = "TEMPO ESGOTADO!";
        } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const hStr = String(hours).padStart(2, '0');
            const mStr = String(minutes).padStart(2, '0');
            const sStr = String(seconds).padStart(2, '0');

            formattedTime = `${hStr}:${mStr}:${sStr}`;
        }

        if (timerElem) {
            timerElem.textContent = formattedTime;
            if (diff <= 0) {
                timerElem.classList.add('expired-text');
                if (itemElem) itemElem.classList.add('expired');
            } else {
                timerElem.classList.remove('expired-text');
                if (itemElem) itemElem.classList.remove('expired');
            }
        }

        if (activeFullscreenId === goal.id) {
            const fsTimer = document.getElementById('fullscreenTimer');
            const fsStatus = document.getElementById('fullscreenStatus');

            fsTimer.textContent = formattedTime;
            if (diff <= 0) {
                fsStatus.textContent = "PRAZO FINALIZADO";
                fsTimer.style.color = "#ff0000";
            } else {
                fsStatus.textContent = "CONTAGEM REGRESSIVA";
                fsTimer.style.color = "#ff2222";
            }
        }
    });

    document.getElementById('statActive').textContent = `Ativas: ${activeCount}`;
    document.getElementById('statExpired').textContent = `Esgotadas: ${expiredCount}`;
}

function renderGoals() {
    const container = document.getElementById('goalsList');

    if (goals.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhuma meta cadastrada no momento.</p>';
        updateTimers();
        return;
    }

    container.innerHTML = goals.map(goal => `
        <div class="goal-item" id="item-${goal.id}">
            <div class="goal-info">
                <div class="goal-header-row">
                    <span class="goal-title">${escapeHtml(goal.title)}</span>
                    <span class="badge">${escapeHtml(goal.category)}</span>
                </div>
                <span class="goal-timer" id="timer-${goal.id}">--:--:--</span>
            </div>
            <div class="goal-actions">
                <button class="btn btn-expand" onclick="openFullscreen('${goal.id}')">TELA CHEIA</button>
                <button class="btn btn-danger" onclick="deleteGoal('${goal.id}')">EXCLUIR</button>
            </div>
        </div>
    `).join('');

    updateTimers();
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

renderGoals();
setInterval(updateTimers, 1000);