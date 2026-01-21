// ===================== 全局游戏配置 (v3.0 - 102个事件) =====================
const GAME_CONFIG = {
    totalEventNum: 25, // 游戏回合数上调至25，体验长篇剧情
    initStatus: {
        health: 70,  // 初始健康
        spirit: 70,  // 初始精神
        money: 150000, // 初始资金
        credit: 60,  // 初始信用
        social: 50,  // 初始人脉
        job: 60,      // 初始职业稳定
        income: 500 // 初始收入
    },
    maxVal: 100,
    minVal: 0,
    killLineThreshold: 140000,
    flagDesc: {
        isUnderKillLine: "当前是否处于斩杀线下"
    }
};
const STATUS_MAP = [
    { key: "health", name: "健康", cls: "health-bar" },
    { key: "spirit", name: "精神", cls: "spirit-bar" },
    { key: "money", name: "资金(美金)", cls: "money-bar" },
    { key: "credit", name: "信用", cls: "credit-bar" },
    { key: "social", name: "人脉", cls: "social-bar" },
    { key: "income", name: "收入(美金/天)", cls: "income-bar" }
];


const EVENT_LIST = [
    // ===================== 医疗事件 =====================
    // 挂号
    {
        id:101, 
        title:"你生病了!", 
        maxtimes:1,
        desc:"身体的病痛正折磨着你，你不得不打通了医院的电话。电话在长久的拨号声后终于接通，对面传来嘈杂的噪声。接起来电话的是个不耐烦的中年护士，她几乎是吹毛求疵地要求你相近地描述症状。你决定：", 
        options:[
            {text:"强忍不适，尽可能详细描述病情", effect:{spirit:-5, scheduleEvent: {eventId: 102, turnsLater: 3}}, resultText: "护士总算是勉强表示她听懂了，告诉你 3 个月后再来。"},
            {text:"不耐烦地草草描述病情", effect:{spirit:-10, scheduleEvent: {eventId: 102, turnsLater: 5}}, resultText: "护士显得比你还要烦躁，最终告诉你 5 个月后再来。"},
            {text:"使用专业术语，精准描述病情", effect:{spirit:-5, scheduleEvent: {eventId: 102, turnsLater: 2}}, resultText: "护士显然是愣了一下，告诉你 2 个月后再来。"}
        ],
        setFlag: {inMedical: true, sickStartTurn: (s) => s.currentTurn}
    },
    // 诊断
    {
        id:102, 
        title:"诊断", 
        maxtimes:1,
        desc:"终于到了你的预约时间，你来到医院，见到了医生。医生显然已经不记得你这个病人，装模作样的进行一番诊断后。他笑容可掬的说：“先去排队做一个ct吧。你也是运气好，最近刚好有一个加急通道名额，原来要等4个月的，现在可以减到两个月。就是价格上会贵那么一些...“你决定：", 
        options:[
            {text:"等正常流程", effect:{scheduleEvent: {eventId: 103, turnsLater: 4}}, resultText: "“该死的吸血鬼！”你暗骂道，“多等两个月可以，但绝不能让他们从我这多捞到一分钱！”你还是委婉拒绝，决定耐心等待4个月。"},
            {text:"使用加急通道", effect:{money:-10000, scheduleEvent: {eventId: 103, turnsLater: 2}}, resultText: "你不确定再这么拖下去还要多久，而身体中的病痛正一点一滴地将你吞噬......你还是决定接受医生的建议，使用加急通道。"}
        ]
    },
    // 治疗
    {
        id:103, 
        title:"治疗", 
        maxtimes:1,
        desc:"终于到了你的预约时间，你来到医院，见到了医生。医生显然已经不记得你这个病人，装模作样的进行一番诊断后。他笑容可掬的说：“先去排队做一个CT吧。你也是运气好，最近刚好有一个加急通道名额，原来要等4个月的，现在可以减到两个月。就是价格上会贵那么一些...“你决定：", 
        options:[
            {text:"等正常流程", effect:{scheduleEvent: {eventId: 103, turnsLater: 4}}, resultText: "“该死的吸血鬼！”你暗骂道，“多等两个月可以，但绝不能让他们从我这多捞到一分钱！”你还是委婉拒绝，决定耐心等待4个月。"},
            {text:"使用加急通道", effect:{money:-10000, scheduleEvent: {eventId: 103, turnsLater: 2}}, resultText: "你不确定再这么拖下去还要多久，而身体中的病痛正一点一滴地将你吞噬......你还是决定接受医生的建议，使用加急通道。"}
        ]
    },
    // ===================== 普通事件 =====================
    // 使用强化剂
    {
        id:901, 
        title:"病痛折磨着你！", 
        desc:"又是一个难熬的夜晚，身体的病痛考验着你的意志。想到明天堆积如山的工作，你更加无法入睡。你决定：", 
        triggerFlag:(f)=> f.inMedical,
        weight: (f, s) => 10 * Math.max(5, s.currentTurn - f.sickStartTurn),
        options:[
            {text:"强迫自己入睡", effect:{spirit:-10, job:-5}, resultText: "你辗转反侧，强迫自己入睡。但收效甚微，第二天你哈欠连天，未能顺利完成工作。"},
            {text:"喝酒", effect:{spirit:-8, money:-800}, resultText: "你灌下两杯烈酒，试图捱这个难熬的夜晚。酒精起到了一定的作用，但收效甚微，第二天你依然疲惫不堪。"},
            {text:"使用止痛药", effect:{money:-1000}, resultText: "这种持续的折磨就像半夜飞来飞去的蚊子，让你实在无法忍受。你选择吃下两片止痛药，“反正两片的剂量，应该不会有什么大问题”，你这样想着，终于得以入睡。"}
        ]
    },
];

const RESULT_LIST = [

];
