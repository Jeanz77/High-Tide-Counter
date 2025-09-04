// Contador de Mana
const manaCounter = document.getElementById('mana-counter');
const manaAddBtn = document.getElementById('mana-add');
const manaSubBtn = document.getElementById('mana-sub');
const manaResetBtn = document.getElementById('mana-reset');
const islandValueInput = document.getElementById('island-value');
const logsContainer = document.getElementById('logs-container');
const clearLogsBtn = document.getElementById('clear-logs');
const clearAllLogsBtn = document.getElementById('clear-all-logs');
const toggleLogsBtn = document.getElementById('toggle-logs');
const logsSection = document.querySelector('.logs-section');

let manaTotal = 0;
let sessionId = generateSessionId();
let logs = JSON.parse(localStorage.getItem('highTideLogs')) || [];
let logsVisible = false;

// Inicializar logs da sessão atual
addLog('Sessão iniciada');

// Event listeners para os botões
manaAddBtn.addEventListener('click', () => {
    const islandValue = parseInt(islandValueInput.value) || 1;
    manaTotal += islandValue;
    updateManaDisplay();
    addLog(`Adicionou ${islandValue} de mana (Total: ${manaTotal})`);
});

manaSubBtn.addEventListener('click', () => {
    manaTotal = Math.max(0, manaTotal - 1);
    updateManaDisplay();
    addLog(`Removeu 1 de mana (Total: ${manaTotal})`);
});

manaResetBtn.addEventListener('click', () => {
    addLog(`Resetou a mana de ${manaTotal} para 0`);
    manaTotal = 0;
    updateManaDisplay();
});

toggleLogsBtn.addEventListener('click', () => {
    logsVisible = !logsVisible;
    if (logsVisible) {
        logsSection.classList.remove('hidden');
        toggleLogsBtn.textContent = '❌ Ocultar Logs';
    } else {
        logsSection.classList.add('hidden');
        toggleLogsBtn.textContent = '📋 Exibir Logs';
    }
});

clearLogsBtn.addEventListener('click', () => {
    // Manter apenas logs de outras sessões
    logs = logs.filter(log => log.sessionId !== sessionId);
    localStorage.setItem('highTideLogs', JSON.stringify(logs));
    displayLogs();
    addLog('Limpos logs da sessão atual');
});

clearAllLogsBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico de logs?')) {
        logs = [];
        localStorage.setItem('highTideLogs', JSON.stringify(logs));
        displayLogs();
        addLog('Limpo todo o histórico de logs');
    }
});

// Atualizar display de mana com mudança de cor
function updateManaDisplay() {
    manaCounter.textContent = manaTotal;
    
    // Alterar cor baseado no valor da mana
    if (manaTotal >= 60) {
        manaCounter.classList.add('mana-red');
        manaCounter.classList.remove('mana-yellow');
    } else if (manaTotal >= 50) {
        manaCounter.classList.add('mana-yellow');
        manaCounter.classList.remove('mana-red');
    } else {
        manaCounter.classList.remove('mana-yellow', 'mana-red');
    }
}

// Sistema de logs
function addLog(action) {
    const timestamp = new Date();
    const logEntry = {
        sessionId: sessionId,
        timestamp: timestamp.toISOString(),
        date: timestamp.toLocaleDateString('pt-BR'),
        time: timestamp.toLocaleTimeString('pt-BR'),
        action: action
    };
    
    logs.push(logEntry);
    localStorage.setItem('highTideLogs', JSON.stringify(logs));
    displayLogs();
}

function displayLogs() {
    // Filtrar logs da sessão atual e ordenar por timestamp (mais recente primeiro)
    const sessionLogs = logs
        .filter(log => log.sessionId === sessionId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    logsContainer.innerHTML = '';
    
    if (sessionLogs.length === 0) {
        logsContainer.innerHTML = '<div class="log-entry">Nenhuma ação registrada nesta sessão</div>';
        return;
    }
    
    sessionLogs.forEach(log => {
        const logElement = document.createElement('div');
        logElement.classList.add('log-entry');
        logElement.textContent = `${log.date} ${log.time} - ${log.action}`;
        logsContainer.appendChild(logElement);
    });
}

function generateSessionId() {
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Inicializar exibição de logs
displayLogs();

// Suporte para toques em dispositivos móveis
//document.addEventListener('touchstart', function(e) {
 //   e.preventDefault();
//}, { passive: false });