* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    min-height: 100vh;
    background-image: url('fundo.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
}

/* Transparência reduzida para o fundo aparecer com clareza */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 2, 4, 0.45);
    z-index: 1;
}

.container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 750px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

header {
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #8b0000;
}

header h1 {
    font-size: 2.2rem;
    letter-spacing: 3px;
    color: #ff3333;
    text-shadow: 0 0 12px rgba(255, 0, 0, 0.7);
}

.subtitle {
    font-size: 0.9rem;
    color: #dddddd;
    margin-top: 4px;
    letter-spacing: 1px;
}

.card {
    background: rgba(20, 4, 6, 0.75);
    border: 1px solid #7a0c0c;
    border-radius: 8px;
    padding: 22px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
}

.card h2 {
    font-size: 1.2rem;
    color: #ff4d4d;
    border-bottom: 1px solid #4a0808;
    padding-bottom: 8px;
}

.form-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
}

label {
    font-size: 0.85rem;
    color: #eeeeee;
    font-weight: 600;
}

input, select {
    background: rgba(15, 3, 5, 0.85);
    border: 1px solid #8a0c0c;
    border-radius: 4px;
    padding: 10px 12px;
    color: #ffffff;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
}

input:focus, select:focus {
    border-color: #ff2222;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
}

select option {
    background: #1a0305;
    color: #ffffff;
}

.btn {
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.85rem;
}

.btn-primary {
    width: 100%;
    padding: 12px;
    background: #a00000;
    color: #ffffff;
    margin-top: 6px;
}

.btn-primary:hover {
    background: #c00000;
}

.btn-expand {
    background: #330505;
    color: #ffaaaa;
    border: 1px solid #660000;
}

.btn-expand:hover {
    background: #550000;
    color: #ffffff;
}

.btn-danger {
    background: #4a0000;
    color: #ff8888;
    border: 1px solid #7a0000;
}

.btn-danger:hover {
    background: #7a0000;
    color: #ffffff;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid #4a0808;
    padding-bottom: 8px;
}

.stats-bar {
    display: flex;
    gap: 12px;
    font-size: 0.85rem;
    color: #cccccc;
    font-weight: bold;
}

.goals-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.empty-msg {
    text-align: center;
    color: #aaaaaa;
    font-style: italic;
    padding: 12px 0;
}

.goal-item {
    background: rgba(35, 6, 10, 0.85);
    border-left: 4px solid #cc0000;
    padding: 14px 16px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.goal-item.expired {
    border-left-color: #ff0000;
    background: rgba(55, 2, 4, 0.9);
}

.goal-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.goal-header-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.goal-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: #ffffff;
}

.badge {
    background: #5a0a0a;
    color: #ffcccc;
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.goal-timer {
    font-family: monospace;
    font-size: 1.2rem;
    color: #ff6666;
    font-weight: bold;
}

.goal-timer.expired-text {
    color: #ff2222;
    animation: blink 1s infinite;
}

.goal-actions {
    display: flex;
    gap: 8px;
}

/* Modal de Tela Cheia */
.fullscreen-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(10, 1, 2, 0.95);
    z-index: 9999;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.fullscreen-modal.active {
    display: flex;
}

.fullscreen-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 90%;
}

.close-modal-btn {
    position: absolute;
    top: 30px;
    right: 30px;
    background: transparent;
    border: 1px solid #880000;
    color: #ff6666;
    padding: 8px 16px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
}

.close-modal-btn:hover {
    background: #880000;
    color: #ffffff;
}

#fullscreenTitle {
    font-size: 2.5rem;
    color: #ffffff;
    letter-spacing: 2px;
}

.fullscreen-timer {
    font-family: monospace;
    font-size: clamp(4rem, 15vw, 10rem);
    font-weight: bold;
    color: #ff2222;
    text-shadow: 0 0 25px rgba(255, 0, 0, 0.8);
    line-height: 1;
}

.fullscreen-status {
    font-size: 1.2rem;
    letter-spacing: 2px;
    color: #aaaaaa;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

@media (max-width: 600px) {
    .form-row {
        flex-direction: column;
        gap: 0;
    }
    .goal-item {
        flex-direction: column;
        align-items: flex-start;
    }
    .goal-actions {
        width: 100%;
        justify-content: flex-end;
    }
}