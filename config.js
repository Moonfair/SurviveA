// ===================== 全局游戏配置 =====================
const GAME_CONFIG = {
    totalEventNum: 9,
    initStatus: {
        health: 60,  // 健康
        spirit: 60,  // 精神
        money: 150000, // 资金【初始15万，略高于14万斩杀线】
        credit: 60,  // 信用
        social: 60,  // 人脉
        job: 60      // 职业稳定性
    },
    maxVal: 100,
    minVal: 0,
    killLine: {
        threshold: 140000, // 斩杀线阈值
        punish: { credit: -5, money: -2000, spirit: -3 }, // 跌破后每轮自动惩罚
        warnText: "⚠️【跌破14万斩杀线】医疗费用翻倍/信用持续暴跌/房东强制驱逐，不可逆的阶层滑落开始！⚠️"
    },
    // =====【FLAG新增】全局自定义Flag说明(备注用，方便管理)，所有flag默认初始值:布尔=false/数字=0=====
    flagDesc: {
        hasReturnIdea: "是否有回国想法/选过回国相关选项",
        hasTakenDrug: "是否碰过街头毒品/精神药品",
        hasAppliedLoan: "是否申请过医疗/生活贷款",
        isHomeless: "是否流落街头/住进下水道",
        hasDoBusiness: "是否参与过创业投资",
        loanCount: "累计申请贷款次数【数字型Flag】",
        hasCallPolice: "是否求助过警方/报警举报",
        hasBeg: "是否有过街头乞讨行为"
    }
};

// ===================== 属性名称映射配置 =====================
const STATUS_MAP = [
    { key: "health", name: "健康", cls: "health-bar" },
    { key: "spirit", name: "精神", cls: "spirit-bar" },
    { key: "money", name: "资金(美金)", cls: "money-bar" },
    { key: "credit", name: "信用", cls: "credit-bar" },
    { key: "social", name: "人脉", cls: "social-bar" },
    { key: "job", name: "职业稳定", cls: "job-bar" }
];

// ===================== 随机事件池【FLAG核心升级，三大新增能力全部实现】=====================
// ✅ 新增1：选项中配置【setFlag】→ 选择该选项后，自动标记/修改对应Flag
// ✅ 新增2：事件根节点配置【triggerFlag】→ 满足Flag+属性条件，才会触发该事件（事件联动）
// ✅ 新增3：数字型Flag支持【累加写法】 loanCount: (prev)=>prev+1
// ✅ 原有事件完全兼容，无任何改动
const EVENT_LIST = [
    {
        id: 1,
        title: "公司裁员预警",
        desc: "你的部门被列入裁员名单，你成为候选人员之一，随时可能失去工作收入。",
        options: [
            { text: "主动离职拿微薄补偿金", effect: { money: +5000, job: -20 }, tip: "你拿到了补偿金，但职业稳定性暴跌，找新工作难度增加" },
            { text: "托人脉求情保住工作", effect: { social: -10, job: +10 }, tip: "你消耗了人脉，暂时保住工作，但人脉资源变少" },
            { text: "默默等待裁决赌一把", effect: { job: Math.random()>0.5 ? +5 : -30, spirit: -5 }, tip: Math.random()>0.5 ? "幸运留任，职业稳定小幅提升" : "裁员敲定，你彻底失业了！" }
        ]
    },
    {
        id: 2,
        title: "突发重感冒发烧",
        desc: "你持续高烧不退，身体极度不适，需要做出选择，美国的医疗体系从不会仁慈。",
        options: [
            { text: "硬抗不吃药省钱", effect: { health: -10, spirit: -5 }, tip: "健康持续下滑，有30%概率引发肺炎，雪上加霜" },
            { text: "去社区医院治疗", effect: { money: -8000, health: +15 }, tip: "花费8000美金，病情好转，健康恢复" },
            { text: "叫救护车急诊", effect: { money: -50000, health: +20, credit: -15 }, tip: "一张5万美金的救护车账单，直接跌破斩杀线，信用暴跌", setFlag: {hasAppliedLoan: true, loanCount: 1} } //【FLAG】标记：申请过贷款+贷款次数=1
        ]
    },
    {
        id: 3,
        title: "亲友劝你回国发展",
        desc: "国内亲友得知你的处境，劝你放弃美国的挣扎，回国安稳生活。",
        options: [
            { text: "接受建议回国", effect: { spirit: +20, money: +10000 }, tip: "你认清现实，选择及时止损，远离斩杀线的威胁", setFlag: {hasReturnIdea: true} }, //【FLAG】标记：有回国想法
            { text: "拒绝坚守美国", effect: { spirit: +10, social: -20 }, tip: "你执念太深，失去了所有亲友的求助渠道，孤立无援", setFlag: {hasReturnIdea: false} },
            { text: "犹豫观望再看看", effect: { spirit: -5, money: -1000 }, tip: "你在纠结中消耗着资金和精神，危机并未解除" }
        ]
    },
    {
        id: 4,
        title: "街头出现特殊药品兜售",
        desc: "有人向你兜售廉价精神药品，声称能缓解焦虑和生存压力，这是底层常见的麻痹方式。",
        options: [
            { text: "购买尝试缓解压力", effect: { spirit: +5, health: -15, money: -2000 }, tip: "短暂的精神放松后，身体被药物侵蚀，开始成瘾", setFlag: {hasTakenDrug: true} }, //【FLAG】标记：碰过毒品
            { text: "果断远离坚决拒绝", effect: { spirit: -3, health: 0 }, tip: "你守住了底线，但精神压力依旧沉重", setFlag: {hasTakenDrug: false} },
            { text: "报警举报兜售者", effect: { social: +5, health: Math.random()>0.8 ? -10 : 0 }, tip: "警方端掉窝点，你获得了人脉，但有小概率被报复", setFlag: {hasCallPolice: true} }
        ]
    },
    {
        id: 5,
        title: "房东的驱逐通知",
        desc: "你的房租逾期未缴，房东发来驱逐通知，在美国，无家可归就是死亡的开始。",
        options: [
            { text: "借钱交房租", effect: { money: -3000, social: -10, credit: -5 }, tip: "你保住了住所，但人脉和信用都受损", setFlag: {hasAppliedLoan: true, loanCount: (prev)=>prev+1} }, //【FLAG】数字累加：贷款次数+1
            { text: "搬到下水道栖身", effect: { health: -8, spirit: -10, money: +0 }, tip: "你住进了暖气管道旁的下水道，成为牢A口中的「史莱姆」一员", setFlag: {isHomeless: true} }, //【FLAG】标记：已流落街头
            { text: "连夜跑路躲债", effect: { credit: -20, social: -5, money: +1000 }, tip: "你躲过了驱逐，但信用彻底破产，再也无法租房" }
        ]
    },
    // =====【FLAG核心示例】带前置条件的事件 → 满足Flag才会触发=====
    {
        id: 6,
        title: "下水道的生存危机",
        desc: "你住进了下水道的暖气管道旁，这里有其他流浪汉，还有定期的强酸管道清理，随时可能被腐蚀溶解。【牢A·史莱姆场景】",
        triggerFlag: (flag, status) => flag.isHomeless === true && status.money < 120000, //【FLAG】触发条件：已流落街头 + 资金<12万
        options: [
            { text: "抢占暖气管道核心位", effect: { health: -5, spirit: -3 }, tip: "你保住了温暖，但随时可能被清理工人发现" },
            { text: "每天外出乞讨谋生", effect: { money: +1000, social: -10, spirit: -5 }, tip: "勉强糊口，但尊严被彻底磨灭", setFlag: {hasBeg: true} }, //【FLAG】标记：有乞讨行为
            { text: "联系国内亲友求助", effect: { social: -5, money: +5000, spirit: +10 }, tip: "亲友寄来资金，你看到了回国的希望", setFlag: {hasReturnIdea: true} }
        ]
    },
    {
        id: 7,
        title: "毒贩的二次引诱",
        desc: "之前的毒贩再次找到你，拿出纯度更高的药品，价格更低，诱惑你再次购买。",
        triggerFlag: (flag) => flag.hasTakenDrug === true, //【FLAG】触发条件：仅碰过毒品的玩家会触发
        options: [
            { text: "再次购买吸食", effect: { spirit: +8, health: -20, money: -3000 }, tip: "毒瘾加深，身体彻底垮掉，再也无法回头" },
            { text: "反抗赶走毒贩", effect: { health: -10, spirit: +5 }, tip: "你鼓起勇气反抗，但被毒贩记恨，有报复风险" },
            { text: "报警戒毒", effect: { social: +5, health: -5, spirit: +8 }, tip: "警方介入帮你戒毒，恢复理智", setFlag: {hasTakenDrug: false} } //【FLAG】重置标记：戒掉毒品
        ]
    },
    {
        id: 8,
        title: "回国机票的抉择",
        desc: "你查到回国单程机票2万美金，资金刚好够支付，回国则安稳，留美则继续挣扎。",
        triggerFlag: (flag, status) => flag.hasReturnIdea === true && status.money >= 20000, //【FLAG】触发条件：有回国想法+资金足够
        options: [
            { text: "立刻买机票回国", effect: { money: -20000, spirit: +30, health: +10 }, tip: "你逃离美国，重启安稳人生", setFlag: {hasReturnIdea: true, isHomeless: false} },
            { text: "放弃机票留美", effect: { spirit: -20, money: 0, health: -5 }, tip: "你舍不得执念，继续在泥潭挣扎" },
            { text: "卖掉机票换生活费", effect: { money: +15000, spirit: -15 }, tip: "回国希望彻底破灭" }
        ]
    },
    {
        id: 9,
        title: "创业失败的连锁反应",
        desc: "你参与的创业项目血本无归，债主上门催债，信用彻底崩盘。",
        triggerFlag: (flag, status) => flag.hasDoBusiness === true && status.money < 100000, //【FLAG】触发条件：创业过+资金跌破斩杀线
        options: [
            { text: "申请破产保护", effect: { credit: -20, money: +0 }, tip: "暂时躲过催债，但信用彻底破产" },
            { text: "打工还债", effect: { money: +3000, health: -10, spirit: -5 }, tip: "勉强还债，但身体和精神被掏空" },
            { text: "跑路躲债", effect: { credit: -30, social: -10 }, tip: "你成了黑户，彻底流落街头", setFlag: {isHomeless: true} }
        ]
    }
];

// ===================== 结局配置【FLAG核心升级】=====================
// ✅ 结局条件升级为：condition: (属性s, 标记flag) => 组合判定
// ✅ 所有结局支持「属性阈值 + Flag值」双重条件，剧情逻辑更严谨，HE/BE更合理
const RESULT_LIST = [
    // ===== 完美HE 稀有 =====
    {
        id: 1,
        type: "HE",
        title: "【安稳立足】",
        desc: "你凭借稳健选择守住14万斩杀线，健康精神俱佳，职业稳定，没碰过毒品，成为美国中产里幸运的少数人。",
        egg: "牢A：不是所有人都能跨过那道线，你是幸运的极少数。",
        condition: (s, flag) => s.money >=140000 && s.health>=60 && s.spirit>=60 && s.job>=70 && flag.hasTakenDrug !== true
    },
    // ===== 普通HE 【FLAG组合判定核心示例】=====
    {
        id: 2,
        type: "HE",
        title: "【归乡安稳·完美版】",
        desc: "你带着回国的坚定想法，凑够机票钱成功回国，远离了美国的生存地狱，重启平稳人生。这不是失败，是最明智的止损。",
        egg: "牢A：有时候退出不是认输，是看透后的清醒。",
        condition: (s, flag) => flag.hasReturnIdea === true && s.money >=50000 && s.health>=50 && s.spirit>=50
    },
    {
        id: 3,
        type: "HE",
        title: "【底层突围】",
        desc: "你曾跌破斩杀线流落街头，但守住底线没碰毒品，靠人脉找到稳定工作，资金缓慢回升，守住了活下去的希望。",
        condition: (s, flag) => s.money >=120000 && s.health>=40 && s.spirit>=40 && flag.hasTakenDrug !== true
    },
    // ===== BE 坏结局 【FLAG组合判定，贴合牢A言论】=====
    { id:4,type:"BE",title:"【医疗吞噬】",desc:"你因无力支付高额医疗账单，健康归零离世，这是美国医疗体系下中产最常见的陨落方式。",egg:"牢A：一张医疗账单，就能碾碎一个中产的所有体面。",condition:(s)=>s.health<=0 },
    { id:5,type:"BE",title:"【冻亡街头·史莱姆终章】",desc:"你流落下水道后，被寒冬和强酸清理溶解，成为牢A口中的「史莱姆」，无人认领。",egg:"牢A：西雅图的下水道，装着无数底层人的绝望。",condition:(s,flag)=>flag.isHomeless===true && s.health<=0 },
    { id:6,type:"BE",title:"【毒瘾深渊】",desc:"你碰毒后无法自拔，健康和精神被掏空，最终因过量吸食离世，这是底层最可悲的结局。",egg:"牢A：毒品是底层的麻药，也是通往死亡的单程票。",condition:(s,flag)=>flag.hasTakenDrug===true && s.health<20 && s.spirit<20 },
    { id:7,type:"BE",title:"【债务枷锁】",desc:"你累计贷款3次以上，信用彻底归零，高额利息让你永远无法还清，最终被逼流落街头。",egg:"牢A：在美国，贷款不是救赎，是套在脖子上的枷锁。",condition:(s,flag)=>flag.loanCount>=3 && s.credit<=0 },
    { id:8,type:"BE",title:"【回国无望】",desc:"你有回国想法，但资金不够买机票，健康和精神彻底垮掉，最终在绝望中离世，连回家的希望都破灭了。",egg:"牢A：有时候，回家的路，比活下去的路更难。",condition:(s,flag)=>flag.hasReturnIdea===true && s.money<20000 && s.spirit<=0 },
    { id:9,type:"BE",title:"【失业沉沦】",desc:"你失去所有工作机会，职业稳定归零，资金耗尽后跌破斩杀线，再也无法翻身，沉沦至死。",egg:"牢A：在美国，失业不是暂停，是阶层滑落的开始。",condition:(s)=>s.job<=0 },
    { id:10,type:"BE",title:"【底层互害】",desc:"你在街头乞讨时被其他流浪汉殴打，健康归零，底层的世界只有弱肉强食，没有共情。",egg:"牢A：底层的法则，就是弱肉强食，没有例外。",condition:(s,flag)=>flag.hasBeg===true && s.social<=0 && s.health<=0 }
];