// Helper to get tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Helper to save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Show confetti animation
function showConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = '🎉';
    confetti.style.opacity = '1';
    confetti.style.transform = 'scale(1.5)';
    setTimeout(() => {
        confetti.style.opacity = '0';
        confetti.style.transform = 'scale(1)';
    }, 1200);
}

function updateProgress() {
    const tasks = getTasks();
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('progress-bar').style.setProperty('--progress', percent + '%');
    document.getElementById('progress-stats').innerHTML =
        `<span class="done">✅ ${done} Done</span> / <span class="pending">🕒 ${total-done} Pending</span> &nbsp; <span>(${percent}% Complete)</span>`;
}

// Play sound effects for add, complete, and delete actions.
function playSound(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

// Render tasks to the DOM
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    const tasks = getTasks();
    tasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed animate-complete' : '';
        li.innerHTML = `
            <span>${task.emoji || '📝'} ${task.completed ? '<b>' + task.text + '</b>' : task.text}</span>
            <button class="complete-btn" data-index="${idx}">${task.completed ? '↩️ Undo' : '✔️ Complete'}</button>
            <button class="edit-btn" data-index="${idx}">✏️ Edit</button>
            <button class="delete-btn" data-index="${idx}">🗑️ Delete</button>
        `;
        taskList.appendChild(li);
    });
    updateProgress();
}

// Add new task
document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const emoji = document.getElementById('emoji-select').value;
    const text = input.value.trim();
    if (text) {
        const tasks = getTasks();
        tasks.push({ text, completed: false, emoji });
        saveTasks(tasks);
        renderTasks();
        playSound('add-sound');
        input.value = '';
    }
});

// Handle task actions (complete, edit, delete)
document.getElementById('task-list').addEventListener('click', function(e) {
    const idx = e.target.dataset.index;
    if (e.target.classList.contains('complete-btn')) {
        const tasks = getTasks();
        tasks[idx].completed = !tasks[idx].completed;
        saveTasks(tasks);
        renderTasks();
        if (tasks[idx].completed) {
            showConfetti();
            playSound('complete-sound');
        }
    }
    if (e.target.classList.contains('delete-btn')) {
        const tasks = getTasks();
        tasks.splice(idx, 1);
        saveTasks(tasks);
        renderTasks();
        playSound('delete-sound');
    }
    if (e.target.classList.contains('edit-btn')) {
        const tasks = getTasks();
        const newText = prompt('Edit task:', tasks[idx].text);
        let newEmoji = tasks[idx].emoji;
        // Emoji edit prompt
        const emojiList = ['📝','✅','📚','💼','🛒','🎯','🏃','🍽️','🎉','🧹','🕒','🌟'];
        const emojiPrompt = prompt('Edit emoji (choose or paste):\n' + emojiList.join(' '), newEmoji);
        if (emojiPrompt && emojiPrompt.trim()) {
            newEmoji = emojiPrompt.trim();
        }
        if (newText !== null && newText.trim() !== '') {
            tasks[idx].text = newText.trim();
            tasks[idx].emoji = newEmoji;
            saveTasks(tasks);
            renderTasks();
        }
    }
});

// Suggest emoji based on task text
function suggestEmoji(text) {
    text = text.toLowerCase();
    if (text.includes('study') || text.includes('read') || text.includes('book') || text.includes('homework')) return '📚';
    if (text.includes('work') || text.includes('office') || text.includes('meeting')) return '💼';
    if (text.includes('shop') || text.includes('grocery') || text.includes('buy')) return '🛒';
    if (text.includes('goal') || text.includes('target') || text.includes('finish')) return '🎯';
    if (text.includes('run') || text.includes('exercise') || text.includes('gym') || text.includes('walk')) return '🏃';
    if (text.includes('cook') || text.includes('eat') || text.includes('dinner') || text.includes('lunch')) return '🍽️';
    if (text.includes('party') || text.includes('celebrate') || text.includes('birthday')) return '🎉';
    if (text.includes('clean') || text.includes('sweep') || text.includes('wash')) return '🧹';
    if (text.includes('wait') || text.includes('later') || text.includes('remind')) return '🕒';
    if (text.includes('important') || text.includes('star') || text.includes('priority')) return '🌟';
    if (text.includes('done') || text.includes('complete') || text.includes('finish')) return '✅';
    return '📝';
}

// Update emoji select based on input
document.getElementById('task-input').addEventListener('input', function(e) {
    const emoji = suggestEmoji(e.target.value);
    document.getElementById('emoji-select').value = emoji;
});

// Cartoon emojis for background
const cartoonEmojis = ['🐱','🐶','🐵','🦄','🐸','🐧','🐼','🐻','🐯','🦊','🐰','🐨','🦉','🐢','🐙'];
function createCartoonBackground() {
    const bg = document.getElementById('cartoon-bg');
    for (let i = 0; i < 12; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'cartoon-emoji';
        emoji.textContent = cartoonEmojis[Math.floor(Math.random() * cartoonEmojis.length)];
        emoji.style.left = Math.random() * 90 + 'vw';
        emoji.style.top = Math.random() * 80 + 'vh';
        emoji.style.animationDelay = (Math.random() * 8) + 's';
        bg.appendChild(emoji);
    }
}

function setTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    const btn = document.getElementById('theme-toggle');
    if (isDark) {
        btn.textContent = '☀️ Light Mode';
    } else {
        btn.textContent = '🌙 Dark Mode';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

window.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    createCartoonBackground();
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark');
    document.getElementById('theme-toggle').addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark'));
    });
});