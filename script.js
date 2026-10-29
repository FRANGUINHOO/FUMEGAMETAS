let goals = JSON.parse(localStorage.getItem('goals_db')) || [];
let audioCtx = null;

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
    const timeInput = document.getElementById('targetTime');

    const newGoal = {
        id: Date.now().toString(),
        title: titleInput.value,
        targetTime: new Date(timeInput.value).getTime(),
        alarmPlayed: false
    };

    goals.push(newGoal);
    saveGoals();
    renderGoals();

    titleInput.value = '';
    timeInput.value = '';
});

function saveGoals() {
    localStorage.setItem('goals_db', JSON.stringify(goals));
}

function deleteGoal(id) {
    goals = goals.filter(g => g.id !== id);
    saveGoals();
    renderGoals();
}

function updateTimers() {
    const now = Date.now();

    goals.forEach(goal => {
        const diff = goal.targetTime - now;

        if (diff <= 0 && !goal.alarmPlayed) {
            goal.alarmPlayed = true;
            saveGoals();
            playAlarmSound();
        }

        const timerElem = document.getElementById(`timer-${goal.id}`);
        const itemElem = document.getElementById(`item-${goal.id}`);

        if (timerElem) {
            if (diff <= 0) {
                timerElem.textContent = "TEMPO ESGOTADO!";
                timerElem.classList.add('expired-text');
                if (itemElem) itemElem.classList.add('expired');
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                const hStr = String(hours).padStart(2, '0');
                const mStr = String(minutes).padStart(2, '0');
                const sStr = String(seconds).padStart(2, '0');

                timerElem.textContent = `${hStr}:${mStr}:${sStr}`;
            }
        }
    });
}

function renderGoals() {
    const container = document.getElementById('goalsList');

    if (goals.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhuma meta cadastrada no momento.</p>';
        return;
    }

    container.innerHTML = goals.map(goal => `
        <div class="goal-item" id="item-${goal.id}">
            <div class="goal-info">
                <span class="goal-title">${escapeHtml(goal.title)}</span>
                <span class="goal-timer" id="timer-${goal.id}">--:--:--</span>
            </div>
            <button class="btn btn-danger" onclick="deleteGoal('${goal.id}')">Excluir</button>
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