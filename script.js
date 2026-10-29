let goals = JSON.parse(localStorage.getItem('study_goals_db')) || [];
let audioCtx = null;
let activeFullscreenId = null;

const motivationalQuotes = [
    "Mantenha a concentração. Cada minuto conta.",
    "O foco de hoje é a conquista de amanhã.",
    "Sem distrações. O seu objetivo é maior.",
    "Persistência e disciplina geram resultados excelentes.",
    "Respire fundo e continue avançando."
];

document.addEventListener('DOMContentLoaded', () => {
    // Carrega anotações salvas
    const savedNotes = localStorage.getItem('study_notes') || '';
    document.getElementById('quickNotes').value = savedNotes;

    // Salva anotações automaticamente ao digitar
    document.getElementById('quickNotes').addEventListener('input', (e) => {
        localStorage.setItem('study_notes', e.target.value);
        document.getElementById('notesStatus').textContent = 'Anotação salva';
        setTimeout(() => {
            document.getElementById('notesStatus').textContent = 'Salvo automaticamente';
        }, 2000);
    });
});

function clearNotes() {
    if (confirm('Deseja limpar suas anotações?')) {
        document.getElementById('quickNotes').value = '';
        localStorage.removeItem('study_notes');
    }
}

// Preenche o campo apenas com a hora calculada
function setQuickMinutes(minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('targetTimeOnly').value = `${hh}:${min}:${ss}`;
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
    const subjectInput = document.getElementById('subject');
    const timeOnlyInput = document.getElementById('targetTimeOnly').value;

    const now = new Date();
    const [hours, minutes, seconds] = timeOnlyInput.split(':').map(Number);

    const targetDate = new Date();
    targetDate.setHours(hours, minutes, seconds || 0, 0);

    // Se o horário escolhido já passou hoje, assume que é para o dia seguinte
    if (targetDate.getTime() <= now.getTime()) {
        targetDate.setDate(targetDate.getDate() + 1);
    }

    const newGoal = {
        id: Date.now().toString(),
        title: titleInput.value,
        subject: subjectInput.value,
        targetTime: targetDate.getTime(),
        alarmPlayed: false
    };

    goals.push(newGoal);
    saveGoals();
    renderGoals();

    titleInput.value = '';
    document.getElementById('targetTimeOnly').value = '';
});

function saveGoals() {
    localStorage.setItem('study_goals_db', JSON.stringify(goals));
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
    document.getElementById('fullscreenSubject').textContent = goal.subject;

    // Seleciona uma frase motivacional aleatória
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('quoteBox').textContent = randomQuote;

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
            formattedTime = "SESSÃO CONCLUÍDA!";
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
                fsStatus.textContent = "TEMPO FINALIZADO";
                fsTimer.style.color = "#ff0000";
            } else {
                fsStatus.textContent = "MODO FOCO ATIVO";
                fsTimer.style.color = "#ff2222";
            }
        }
    });

    document.getElementById('statActive').textContent = `Em Foco: ${activeCount}`;
    document.getElementById('statCompleted').textContent = `Concluídas: ${expiredCount}`;
}

function renderGoals() {
    const container = document.getElementById('goalsList');

    if (goals.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhuma sessão de estudo ativa no momento.</p>';
        updateTimers();
        return;
    }

    container.innerHTML = goals.map(goal => `
        <div class="goal-item" id="item-${goal.id}">
            <div class="goal-info">
                <div class="goal-header-row">
                    <span class="goal-title">${escapeHtml(goal.title)}</span>
                    <span class="badge">${escapeHtml(goal.subject)}</span>
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