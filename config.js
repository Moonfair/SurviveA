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
        income: 5000 // 初始收入
    },
    maxVal: 100,
    minVal: 0,
    killLine: {
        threshold: 140000, // 斩杀线阈值
        punish: { credit: -8, money: -3000, spirit: -6 }, // 惩罚力度加强
        warnText: "⚠️【跌破14万斩杀线】阶层滑落开始，不可逆惩罚已触发！⚠️"
    },
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
    { key: "job", name: "职业稳定", cls: "job-bar" }
];

const EVENT_LIST = [
    //医疗
    {id:1, type:"kill_line", title:"你生病了!", desc:"身体的病痛正折磨着你, 你可能不得不去看医生了", triggerFlag:(f)=>f.isUnderKillLine, options:[
        {text:"支付房租(-2500)", effect:{money:-2500, spirit:-5}, tip:"你支付了房租，但资金更加紧张。"},
        {text:"请求宽限几天", effect:{credit:-10, social:-5}, tip:"房东勉强同意了，但你的信用和人脉受到了影响。"}
    ]},
];

const RESULT_LIST = [

];
