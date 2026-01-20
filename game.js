// 全局游戏状态
let gameState = {
    currentStatus: {}, // 当前属性值
    currentEventIndex: 0, // 当前事件索引
    usedEvents: [], // 已使用的事件ID，防止重复
    eventCount: {}, // 事件累计出现次数
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
    gameState.eventCount = {};
    gameState.isGameOver = false;
    gameState.eventCounts = {}; // <-- 添加这行来初始化事件计数器
    // =====【FLAG新增】初始化所有Flag为默认值：布尔=false，数字型(Count结尾)=0=====
    gameState.customFlag = {};
    for(let key in GAME_CONFIG.flagDesc) {
        // 数字型Flag（以Count结尾）初始化为0，其他为false
        gameState.customFlag[key] = key.includes('Count') ? 0 : false;
    }
    renderStatus();
}

// 渲染属性状态栏
function renderStatus() {
    STATUS_MAP.forEach(item => {
        const el = document.getElementById(item.key);
        const val = gameState.currentStatus[item.key];
        if (item.key === 'money') {
            const income = gameState.currentStatus.income || 0;
            el.innerHTML = `${item.name}：${val.toLocaleString()} <span class="income-text">(+${income.toLocaleString()}/天)</span> <span><b class="${item.cls}" style="width:${(val / GAME_CONFIG.maxVal) * 100}%"></b></span>`;
        } else {
            const percent = (val / GAME_CONFIG.maxVal) * 100;
            el.innerHTML = `${item.name}：${val} <span><b class="${item.cls}" style="width:${percent}%"></b></span>`;
        }
    });
    // 天数信息渲染
    const daysInfo = document.getElementById("daysInfo");
    if(daysInfo) {
        const total = GAME_CONFIG.totalEventNum;
        const current = Math.min(gameState.currentEventIndex+1, total);
        daysInfo.innerText = `第${current}天 / 共${total}天`;
    }
    checkKillLine();
    checkGameOverByStatus();
}

// 检测14万美金斩杀线
function checkKillLine() {
    const money = gameState.currentStatus.money;
    if (money < GAME_CONFIG.killLine.threshold) {
        gameState.customFlag.isUnderKillLine = true; // 设置斩杀线Flag
    } else {
        gameState.customFlag.isUnderKillLine = false; // 解除斩杀线Flag
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
    // 筛选出所有未被使用过，且满足触发条件的事件
    let availableEvents = EVENT_LIST.filter(event => {
        const isUsed = gameState.usedEvents.includes(event.id);
        const hasMetMaxTimes = event.maxTimes && (gameState.eventCounts[event.id] || 0) >= event.maxTimes;
        if (isUsed || hasMetMaxTimes) return false;

        if (event.triggerFlag) {
            return event.triggerFlag(gameState.customFlag, gameState.currentStatus);
        }
        return true;
    });

    // 如果处于“斩杀线”状态，则提高高消耗事件的出现概率
    if (gameState.customFlag.isUnderKillLine) {
        const highCostEvents = availableEvents.filter(e => e.isHighCost);
        const normalEvents = availableEvents.filter(e => !e.isHighCost);
        
        // 70%的概率从高消耗事件中抽取，30%从普通事件中抽取
        if (highCostEvents.length > 0 && Math.random() < 0.7) {
            availableEvents = highCostEvents;
        } else if (normalEvents.length > 0) { // 如果高消耗事件没抽中或不存在，则从普通事件中抽
            availableEvents = normalEvents;
        }
        // 如果只剩下一种类型的事件，则直接使用
    }

    if (availableEvents.length === 0) {
        return null; // 没有可用事件
    }

    const randomIndex = Math.floor(Math.random() * availableEvents.length);
    return availableEvents[randomIndex];
}

// 显示事件池Debug弹窗
function showEventPoolDebug() {
    const blockedEvents = EVENT_LIST.filter(event => {
        const isUsed = gameState.usedEvents.includes(event.id);
        if (isUsed) return false; // 已在本轮使用，先排除
        const hasTriggerFlag = typeof event.triggerFlag === 'function';
        const flagPass = hasTriggerFlag ? event.triggerFlag(gameState.customFlag, gameState.currentStatus) : true;
        const maxTimes = typeof event.maxTimes === 'number' ? event.maxTimes : Infinity;
        const currentCount = gameState.eventCount[event.id] || 0;
        const underLimit = currentCount < maxTimes;
        return !flagPass || !underLimit; // 不满足条件 或 已达上限
    });

    let debugInfo = "🔴 【DEBUG】事件池已空\n\n";
    debugInfo += `已使用事件: [${gameState.usedEvents.join(', ')}]\n`;
    debugInfo += `总事件数: ${EVENT_LIST.length}\n\n`;
    debugInfo += `未使用但不可选的事件 (${blockedEvents.length}个):\n`;
    debugInfo += "─".repeat(50) + "\n";
    
    blockedEvents.forEach(event => {
        const maxTimes = typeof event.maxTimes === 'number' ? event.maxTimes : Infinity;
        const currentCount = gameState.eventCount[event.id] || 0;
        const hasTriggerFlag = typeof event.triggerFlag === 'function';
        const flagPass = hasTriggerFlag ? event.triggerFlag(gameState.customFlag, gameState.currentStatus) : true;
        const reasons = [];
        if (!flagPass) reasons.push("触发条件未满足");
        if (currentCount >= maxTimes) reasons.push("达到出现上限");

        debugInfo += `\n📌 事件ID: ${event.id}\n`;
        debugInfo += `   标题: ${event.title}\n`;
        debugInfo += `   触发条件: ${event.triggerFlag ? "有条件" : "无条件"}\n`;
        debugInfo += `   出现次数: ${currentCount}/${maxTimes === Infinity ? 'unlimited' : maxTimes}\n`;
        debugInfo += `   阻塞原因: ${reasons.join(' & ') || '无'}\n`;
        if (event.triggerFlag) debugInfo += `   条件检查: ${debugCheckTriggerFlag(event.triggerFlag)}\n`;
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
        // =====【新增】过滤不满足triggerCond条件的选项=====
        const hasTriggerCond = typeof opt.triggerCond === 'function';
        const condPass = hasTriggerCond ? opt.triggerCond(gameState.currentStatus, gameState.customFlag) : true;
        if (!condPass) return; // 不满足条件的选项不显示
        
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt.text;
        btn.onclick = () => handleOption(opt, event);
        optionBox.appendChild(btn);
    });
}

// 处理选项点击：属性增减 + FLAG设置 + dynamicEffect + 流程推进
function handleOption(option, event) {
    // 每次行动前，先结算收入
    gameState.currentStatus.money += gameState.currentStatus.income || 0;

    // =====【步骤1】应用基础effect=====
    const baseEffect = typeof option.effect === 'function' 
        ? option.effect() 
        : (option.effect || {});
    
    const applyEffect = (effectObj) => {
        Object.keys(effectObj).forEach(key => {
            gameState.currentStatus[key] += effectObj[key];
            if (key === 'money') {
                gameState.currentStatus[key] = Math.max(0, gameState.currentStatus[key]);
            } else {
                gameState.currentStatus[key] = Math.max(GAME_CONFIG.minVal, Math.min(GAME_CONFIG.maxVal, gameState.currentStatus[key]));
            }
        });
    };
    
    applyEffect(baseEffect);
    
    // =====【步骤2】设置Flag标记=====
    setCustomFlag(option.setFlag);
    
    // =====【步骤3】应用dynamicEffect（依赖Flag和当前状态）=====
    if (typeof option.dynamicEffect === 'function') {
        const dynamicEffectResult = option.dynamicEffect(gameState.customFlag, gameState.currentStatus);
        if (dynamicEffectResult && typeof dynamicEffectResult === 'object') {
            applyEffect(dynamicEffectResult);
        }
    }
    
    // =====【步骤4】应用事件级effect（单选项事件）=====
    if (event && event.effect && event.options.length === 1) {
        applyEffect(event.effect);
    }

    renderStatus();
    gameState.currentEventIndex++;
    if (gameState.currentEventIndex >= GAME_CONFIG.totalEventNum || gameState.isGameOver) {
        showResult();
        return;
    }
    const nextEvent = getRandomEvent();
    if (!nextEvent) {
        showResult();
        return;
    }
    renderEvent(nextEvent);
}

// 检测属性归0提前结束游戏
function checkGameOverByStatus() {
    // 只在所有关键属性都为0时才提前game over，否则等事件池耗尽或回合数到达后结算
    // 关键属性可自定义，这里假设为money, health, spirit, job, social, credit
    const keys = ['money', 'health', 'spirit', 'job', 'social', 'credit'];
    const allZero = keys.every(key => gameState.currentStatus[key] <= GAME_CONFIG.minVal);
    gameState.isGameOver = allZero;
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
    const firstEvent = getRandomEvent();
    if (!firstEvent) {
        showResult();
        return;
    }
    renderEvent(firstEvent);
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