// 全局游戏状态
let gameState = {
    currentStatus: {}, // 当前属性值
    currentEventIndex: 0, // 当前事件索引
    usedEvents: [], // 已使用的事件ID，防止重复
    isGameOver: false, // 是否游戏结束
    customFlag: {
        loanCount: 0, // 数字型
        // 其他保持false默认值
    }     // =====【FLAG新增】全局自定义Flag状态池，自动初始化=====
};

// 初始化属性+FLAG初始化
function initStatus() {
    gameState.currentStatus = JSON.parse(JSON.stringify(GAME_CONFIG.initStatus));
    gameState.currentEventIndex = 0;
    gameState.usedEvents = [];
    gameState.isGameOver = false;
    // =====【FLAG新增】初始化所有Flag为默认值：布尔=false，数字=0=====
    gameState.customFlag = {};
    for(let key in GAME_CONFIG.flagDesc) gameState.customFlag[key] = false;
    renderStatus();
    document.getElementById("killLineWarn").style.display = "none";
}

// 渲染属性状态栏
function renderStatus() {
    STATUS_MAP.forEach(item => {
        const el = document.getElementById(item.key);
        const val = gameState.currentStatus[item.key];
        const percent = (val / GAME_CONFIG.maxVal) * 100;
        el.innerHTML = `${item.name}：${item.key === 'money' ? val.toLocaleString() : val} <span><b class="${item.cls}" style="width:${percent}%"></b></span>`;
    });
    checkKillLine();
    checkGameOverByStatus();
}

// 检测14万美金斩杀线
function checkKillLine() {
    const money = gameState.currentStatus.money;
    const warnEl = document.getElementById("killLineWarn");
    if (money < GAME_CONFIG.killLine.threshold) {
        warnEl.style.display = "block";
        Object.keys(GAME_CONFIG.killLine.punish).forEach(key => {
            gameState.currentStatus[key] += GAME_CONFIG.killLine.punish[key];
            if (key === 'money') {
                gameState.currentStatus[key] = Math.max(0, gameState.currentStatus[key]);
            } else {
                gameState.currentStatus[key] = Math.max(GAME_CONFIG.minVal, Math.min(GAME_CONFIG.maxVal, gameState.currentStatus[key]));
            }
        });
    } else {
        warnEl.style.display = "none";
    }
}

// =====【FLAG新增】设置自定义Flag的核心方法 支持直接赋值/累加赋值=====
function setCustomFlag(flagObj) {
    if(!flagObj) return;
    for(let key in flagObj) {
        const val = flagObj[key];
        gameState.customFlag[key] = typeof val === 'function' ? val(gameState.customFlag[key] || 0) : val;
    }
}

// =====【FLAG升级】随机抽取事件 - 过滤满足triggerFlag条件的事件=====
function getRandomEvent() {
    if (gameState.usedEvents.length >= EVENT_LIST.length) gameState.usedEvents = [];
    // 筛选可用事件：未使用 + 满足触发条件(无条件则默认通过)
    const availableEvents = EVENT_LIST.filter(event => {
        const isUsed = gameState.usedEvents.includes(event.id);
        const hasTriggerFlag = typeof event.triggerFlag === 'function';
        const flagPass = hasTriggerFlag ? event.triggerFlag(gameState.customFlag, gameState.currentStatus) : true;
        return !isUsed && flagPass;
    });
    if (availableEvents.length === 0) {
        // 所有事件都不满足条件，显示debug信息
        showEventPoolDebug();
        // 重置事件池后递归重试
        gameState.usedEvents = [];
        return getRandomEvent();
    }
    const randomIdx = Math.floor(Math.random() * availableEvents.length);
    const randomEvent = availableEvents[randomIdx];
    gameState.usedEvents.push(randomEvent.id);
    return randomEvent;
}

// 显示事件池Debug弹窗
function showEventPoolDebug() {
    const unusedUnmetEvents = EVENT_LIST.filter(event => {
        const isUsed = gameState.usedEvents.includes(event.id);
        const hasTriggerFlag = typeof event.triggerFlag === 'function';
        const flagPass = hasTriggerFlag ? event.triggerFlag(gameState.customFlag, gameState.currentStatus) : true;
        return !isUsed && !flagPass; // 未使用 + 不满足条件
    });

    let debugInfo = "🔴 【DEBUG】事件池已空\n\n";
    debugInfo += `已使用事件: [${gameState.usedEvents.join(', ')}]\n`;
    debugInfo += `总事件数: ${EVENT_LIST.length}\n\n`;
    debugInfo += `未使用但不满足条件的事件 (${unusedUnmetEvents.length}个):\n`;
    debugInfo += "─".repeat(50) + "\n";
    
    unusedUnmetEvents.forEach(event => {
        debugInfo += `\n📌 事件ID: ${event.id}\n`;
        debugInfo += `   标题: ${event.title}\n`;
        debugInfo += `   触发条件: ${event.triggerFlag ? "有条件" : "无条件"}\n`;
        if (event.triggerFlag) {
            debugInfo += `   当前不满足: ${debugCheckTriggerFlag(event.triggerFlag)}\n`;
        }
    });
    
    debugInfo += "\n" + "─".repeat(50) + "\n";
    debugInfo += "\n🔄 将重置事件池并继续游戏...\n";
    debugInfo += `\n📊 当前属性值:\n`;
    debugInfo += `   健康: ${gameState.currentStatus.health}\n`;
    debugInfo += `   精神: ${gameState.currentStatus.spirit}\n`;
    debugInfo += `   资金: ${gameState.currentStatus.money}\n`;
    debugInfo += `   信用: ${gameState.currentStatus.credit}\n`;
    debugInfo += `   人脉: ${gameState.currentStatus.social}\n`;
    debugInfo += `   职业: ${gameState.currentStatus.job}\n`;
    debugInfo += `\n🚩 当前Flag值:\n`;
    Object.keys(gameState.customFlag).forEach(key => {
        debugInfo += `   ${key}: ${gameState.customFlag[key]}\n`;
    });

    alert(debugInfo);
}

// 辅助函数：检查触发条件未满足的原因
function debugCheckTriggerFlag(triggerFlagFunc) {
    try {
        const result = triggerFlagFunc(gameState.customFlag, gameState.currentStatus);
        return result ? "满足条件" : "条件不满足";
    } catch (e) {
        return `错误: ${e.message}`;
    }
}

// 渲染事件和选项
function renderEvent(event) {
    document.getElementById("eventTitle").innerText = event.title;
    document.getElementById("eventDesc").innerText = event.desc;
    const optionBox = document.getElementById("optionBox");
    optionBox.innerHTML = "";
    event.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt.text;
        btn.onclick = () => handleOption(opt);
        optionBox.appendChild(btn);
    });
}

// 处理选项点击：属性增减 + FLAG设置 + 流程推进
function handleOption(option) {
    // 如果effect是函数，则动态执行
    const finalEffect = typeof option.effect === 'function' 
        ? option.effect() 
        : option.effect;
    
    Object.keys(finalEffect).forEach(key => {
        gameState.currentStatus[key] += finalEffect[key];
        if (key === 'money') {
            gameState.currentStatus[key] = Math.max(0, gameState.currentStatus[key]);
        } else {
            gameState.currentStatus[key] = Math.max(GAME_CONFIG.minVal, Math.min(GAME_CONFIG.maxVal, gameState.currentStatus[key]));
        }
    });
    // =====【FLAG新增】执行当前选项的Flag标记=====
    setCustomFlag(option.setFlag);

    renderStatus();
    gameState.currentEventIndex++;
    if (gameState.currentEventIndex >= GAME_CONFIG.totalEventNum || gameState.isGameOver) {
        showResult();
        return;
    }
    renderEvent(getRandomEvent());
}

// 检测属性归0提前结束游戏
function checkGameOverByStatus() {
    gameState.isGameOver = Object.values(gameState.currentStatus).some(val => val <= GAME_CONFIG.minVal);
}

// =====【FLAG升级】结局判定 - 传入属性+Flag双参数=====
function showResult() {
    let result = RESULT_LIST.find(res => res.condition(gameState.currentStatus, gameState.customFlag));
    if (!result) result = RESULT_LIST[9]; // 默认BE兜底
    document.getElementById("resultType").innerText = result.type === "HE" ? "✅ 好结局 ✅" : "❌ 坏结局 ❌";
    document.getElementById("resultTitle").innerText = result.title;
    document.getElementById("resultDesc").innerText = result.desc;
    document.getElementById("resultEgg").innerText = result.egg;
    document.getElementById("resultModal").style.display = "flex";
}

// 开始游戏
function startGame() {
    initStatus();
    renderEvent(getRandomEvent());
}

// 重启游戏
function restartGame() {
    document.getElementById("resultModal").style.display = "none";
    startGame();
}

// 页面加载初始化
window.onload = () => {
    initStatus();
};