// Sidebar Navigation Logic
function showTool(toolId) {
    // Hide all tool sections
    const sections = document.querySelectorAll('.tool-section');
    sections.forEach(section => section.classList.add('hidden'));

    // Show selected tool section
    const selectedSection = document.getElementById('tool-' + toolId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }

    // Update active nav state
    const navItems = document.querySelectorAll('.sidebar-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNav = document.getElementById('nav-' + toolId);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Global Notification Helper
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.innerText = message;
    
    // Reset colors
    toast.classList.remove('bg-gray-800', 'bg-red-500', 'bg-green-500', 'bg-blue-500');
    
    // Add color based on type
    if (type === 'error') {
        toast.classList.add('bg-red-500');
    } else {
        toast.classList.add('bg-green-500');
    }

    // Show
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    // Clear previous timeout
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    
    window.toastTimeout = setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}

// Copy Text Helper with Fallback
function copyText(id, isText = false) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const textToCopy = isText ? el.innerText : el.value;
    
    if (!textToCopy || textToCopy.trim() === "") {
        showToast('内容为空，无法复制', 'error');
        return;
    }

    // Attempt using navigator.clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('已复制到剪贴板');
        }).catch(() => {
            fallbackCopy(textToCopy);
        });
    } else {
        fallbackCopy(textToCopy);
    }
}

function fallbackCopy(text) {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Ensure it's not visible
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showToast('已复制到剪贴板');
        } else {
            showToast('复制失败', 'error');
        }
    } catch (err) {
        showToast('复制失败', 'error');
    }
}

// --- 1. Timestamp Tool Logic ---
function updateCurrentTS() {
    const currentTsEl = document.getElementById('current-ts');
    if (currentTsEl) {
        currentTsEl.innerText = Math.floor(Date.now() / 1000);
    }
}

setInterval(updateCurrentTS, 1000);
updateCurrentTS();

function convertTimestamp() {
    const input = document.getElementById('ts-input').value.trim();
    if (!input) return;
    
    let ts = parseInt(input);
    if (isNaN(ts)) {
        showToast('请输入有效的时间戳', 'error');
        return;
    }
    
    // Auto-detect if input is seconds or milliseconds
    const date = new Date(ts.toString().length === 10 ? ts * 1000 : ts);
    document.getElementById('ts-to-date-output').value = formatDate(date);
}

function convertDate() {
    const input = document.getElementById('date-input').value.trim();
    if (!input) return;
    
    const date = new Date(input);
    if (isNaN(date.getTime())) {
        showToast('日期格式不正确', 'error');
        return;
    }
    
    document.getElementById('date-to-ts-output').value = Math.floor(date.getTime() / 1000) + ' (秒) / ' + date.getTime() + ' (毫秒)';
}

function formatDate(date) {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// --- 2. Base64 Tool Logic ---
function base64Encode() {
    const input = document.getElementById('base64-input').value;
    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        document.getElementById('base64-output').value = encoded;
    } catch (e) {
        showToast('编码失败: ' + e.message, 'error');
    }
}

function base64Decode() {
    const input = document.getElementById('base64-input').value;
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById('base64-output').value = decoded;
    } catch (e) {
        showToast('解码失败: 请检查是否为合法的 Base64', 'error');
    }
}

// --- 3. JSON Tool Logic ---
function formatJSON() {
    const input = document.getElementById('json-input').value.trim();
    const statusEl = document.getElementById('json-status');
    if (!input) return;
    
    try {
        const obj = JSON.parse(input);
        document.getElementById('json-input').value = JSON.stringify(obj, null, 2);
        statusEl.innerText = 'JSON 合法';
        statusEl.className = 'text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-600';
    } catch (e) {
        statusEl.innerText = '无效 JSON: ' + e.message;
        statusEl.className = 'text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-600';
    }
}

function minifyJSON() {
    const input = document.getElementById('json-input').value.trim();
    if (!input) return;
    try {
        const obj = JSON.parse(input);
        document.getElementById('json-input').value = JSON.stringify(obj);
    } catch (e) {
        showToast('压缩失败: JSON 语法错误', 'error');
    }
}

function clearJSON() {
    document.getElementById('json-input').value = '';
    document.getElementById('json-status').innerText = '';
}

// --- 4. Random Generator Tool Logic ---
function generateRandom() {
    const length = parseInt(document.getElementById('rand-len').value);
    const useUpper = document.getElementById('rand-upper').checked;
    const useLower = document.getElementById('rand-lower').checked;
    const useNumber = document.getElementById('rand-number').checked;
    const useSymbol = document.getElementById('rand-symbol').checked;
    
    let charset = "";
    if (useUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useNumber) charset += "0123456789";
    if (useSymbol) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    if (charset === "") {
        showToast('请至少选择一项字符类型', 'error');
        return;
    }
    
    let result = "";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('rand-output').innerText = result;
}

// Initialize
window.onload = () => {
    // Set default view
    showTool('timestamp');
    // Set current date in input as placeholder
    const now = new Date();
    const dateInput = document.getElementById('date-input');
    if (dateInput) {
        dateInput.value = formatDate(now);
    }
};
