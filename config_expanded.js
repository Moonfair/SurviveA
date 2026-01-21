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
    // =====【FLAG系统 v3.0】=====
    flagDesc: {
        // 核心剧情Flag
        hasReturnIdea: "是否有回国想法", hasTakenDrug: "是否碰过毒品", hasAppliedLoan: "是否申请贷款", isHomeless: "是否流落街头", hasDoBusiness: "是否创业",
        hasBuyBlackDrug: "是否买过黑市药", hasSeriousIll: "是否患过重病", hasBeenLayoff: "是否被裁员", hasWorkOver: "是否长期加班", hasMetNoble: "是否结交贵人",
        // 数字累计Flag
        loanCount: "累计贷款次数", begCount: "乞讨次数", debtCount: "负债次数", studyCount: "进修次数", overtimeCount: "加班次数",
        // 唯一事件Flag
        hasGotBonus: "是否获得过天降横财", hasBeenAided: "是否获得亲友资助", hasBeenCheated: "是否被骗过", hasGamble: "是否参与赌博", hasReportCheat: "是否举报过诈骗",
        // 系列事件分支Flag
        businessSuccess: "创业是否成功", drugQuit: "是否成功戒毒", hasGambleWin: "是否赌博赢过钱", hasGotJob: "是否跳槽成功", medicalDisputeWin: "是否医疗纠纷胜诉",
        // v3.0 新增FLAG
        hasSymptom: "有轻微症状", isDiagnosing: "正在预约/诊断中", hasDiagnosis: "已确诊具体病症", inTreatment: "正在治疗中", isWaitingForTest: "正在等待检查结果", needsEmergencyCare: "病情恶化需要急救", tookPainkillers: "服用过止痛药", hasNeglectHealth: "曾忽视健康", hasBadDiet: "饮食不规律", hasHighStress: "长期高压",
        hasPoorSocialConnection: "社交孤立", hasUnstableJobMentality: "职场心态不稳", hasLegalRisk: "有潜在法律风险",
        // 移民线
        inH1BProcess: "H1B申请流程中", hasH1B: "已抽中H1B", inGreenCardProcess: "绿卡申请流程中", greenCardFailed: "绿卡申请失败",
        // 感情线
        inRelationship: "恋爱中", isMarried: "已婚", hasChild: "已有孩子", relationshipCrisis: "感情危机",
        // 投资线
        investedStocks: "投资过股票", investedCrypto: "投资过加密货币", investmentSuccess: "投资是否成功",
        // 法律线
        inLawsuit: "官司缠身", wonLawsuit: "官司胜诉",
        // 副业线
        hasSideHustle: "有副业", sideHustleSuccess: "副业是否成功",
        isUnderKillLine: "当前是否处于斩杀线下"
    }
};

// ===================== 属性名称映射配置【无改动】=====================
const STATUS_MAP = [
    { key: "health", name: "健康", cls: "health-bar" },
    { key: "spirit", name: "精神", cls: "spirit-bar" },
    { key: "money", name: "资金(美金)", cls: "money-bar" },
    { key: "credit", name: "信用", cls: "credit-bar" },
    { key: "social", name: "人脉", cls: "social-bar" },
    { key: "income", name: "收入(美金/天)", cls: "income-bar" }
];

// ===================== ✅ 事件池【102个事件 超量扩容】 =====================
// 📜【系列事件】 | ⭐【唯一事件】 | ♻️【普通事件】
const EVENT_LIST = [
// ===================================== 【- 斩杀线专属事件 -】=====================================
    {id:201, type:"kill_line", title:"🚨【斩杀线】催租的房东", desc:"【生活】你的房东发来短信，提醒你本月房租尚未支付，并暗示如果再拖延，将不得不采取行动。", triggerFlag:(f)=>f.isUnderKillLine, options:[
        {text:"支付房租(-2500)", effect:{money:-2500, spirit:-5}, tip:"你支付了房租，但资金更加紧张。"},
        {text:"请求宽限几天", effect:{credit:-10, social:-5}, tip:"房东勉强同意了，但你的信用和人脉受到了影响。"}
    ]},
    {id:202, type:"kill_line", title:"🚨【斩杀线】高额的账单", desc:"【生活】信用卡、水电煤气、网费...各种账单接踵而至，压得你喘不过气。", triggerFlag:(f)=>f.isUnderKillLine, options:[
        {text:"全部支付(-1500)", effect:{money:-1500, spirit:-8}, tip:"你勉强付清了所有账单，但精神压力巨大。"},
        {text:"只支付最低还款额", effect:{money:-500, credit:-15, spirit:-10}, tip:"高昂的利息让你的债务雪上加霜。"}
    ]},
    {id:203, type:"kill_line", title:"🚨【斩杀线】廉价的快乐", desc:"【生活】巨大的压力让你渴望一丝慰藉。街角的酒吧和便利店的速食似乎是不错的选择。", triggerFlag:(f)=>f.isUnderKillLine, options:[
        {text:"去酒吧喝一杯(-100)", effect:{money:-100, spirit:+10, health:-5}, tip:"酒精暂时麻痹了你的神经，但伤害了你的健康。", setFlag:{hasBadDiet:true}},
        {text:"吃一顿垃圾食品(-30)", effect:{money:-30, spirit:+8, health:-8}, tip:"高热量的食物带来了短暂的满足感，但健康再次受损。", setFlag:{hasBadDiet:true}},
        {text:"忍住，回家喝水", effect:{spirit:-5}, tip:"你靠着惊人的意志力抵抗住了诱惑。"}
    ]},
    {id:204, type:"kill_line", title:"🚨【斩杀线】失眠的夜晚", desc:"【健康】对未来的焦虑让你彻夜难眠，第二天精神恍惚。", triggerFlag:(f)=>f.isUnderKillLine && s.spirit < 40, options:[
        {text:"服用安眠药", effect:{health:-5, spirit:+10}, tip:"药物让你强行入睡，但副作用让你第二天昏昏沉沉。", setFlag:{tookPainkillers:true}},
        {text:"硬撑着上班", effect:{job:-5, health:-5, spirit:-8}, tip:"你的工作效率低下，受到了老板的批评。"}
    ]},

    // ===================================== 【📜 系列事件 - 核心链式剧情 树状分支】=====================================
    // --- 医疗线 (症状 -> 诊断 -> 治疗 -> 账单) ---
    {id:103, type:"series", title:"★【医疗系列①】身体的警报", desc:"【健康】你最近总是感到疲劳、食欲不振，似乎是身体发出的警报。", triggerFlag:(f,s)=>(s.health < 60 || f.hasHighStress || f.hasBadDiet) && !f.hasSymptom && !f.isDiagnosing, options:[
        {text:"硬抗，也许只是太累了", effect:{spirit:-5}, tip:"你忽视了身体的警告，健康状况可能恶化", setFlag:{hasSymptom:true, hasNeglectHealth:true}},
        {text:"预约家庭医生检查(-150)", effect:{money:-150, spirit:+5}, tip:"你决定正视问题，预约了医生，但等待时间可能很长", setFlag:{hasSymptom:true, isDiagnosing:true}}
    ]},
    {id:104, type:"series", title:"★【医疗系列②】硬扛与抉择", desc:"【健康】家庭医生排期在两周后。但一个紧急项目压下来，老板要求你必须加班完成，否则就走人。", triggerFlag:(f)=>f.isDiagnosing && !f.hasDiagnosis, options:[
        {text:"服用止痛药硬扛工作", effect:{job:+10, health:-8}, tip:"药物暂时压制了痛苦，但你感觉身体被掏空。有30%几率药物成瘾。", setFlag:{tookPainkillers:true}, dynamicEffect:()=>{
            if(Math.random() < 0.3) gameState.customFlag.hasTakenDrug = true;
            return {};
        }},
        {text:"请病假，放弃项目", effect:{job:-20, spirit:-10}, tip:"你保住了健康，但失去了工作和收入来源。", setFlag:{hasBeenLayoff:true, isDiagnosing:false}},
        {text:"去昂贵的Urgent Care(-800)", effect:{money:-800, health:+5}, tip:"你快速见到医生，避免了工作危机，但钱包大出血。", setFlag:{isDiagnosing:false, hasDiagnosis:true}}
    ]},
    {id:105, type:"series", title:"★【医疗系列③】再次排队", desc:"【健康】医生怀疑是消化系统问题，开了一系列化验单，包括胃镜和CT扫描，但这些检查都需要再次漫长排队。", triggerFlag:(f)=>f.hasDiagnosis && !f.isWaitingForTest, options:[
        {text:"预约全部检查(-5000)", effect:{money:-5000, spirit:-10}, tip:"你支付了高昂的检查费用，进入了新一轮的等待。", setFlag:{isWaitingForTest:true}},
        {text:"只做基础化验(-1000)", effect:{money:-1000, health:-5}, tip:"你选择了一个更便宜的方案，但可能无法查出根本原因。", setFlag:{isWaitingForTest:true}},
        {text:"放弃检查，寻求替代疗法", effect:{spirit:+5, social:+5}, tip:"你开始尝试一些朋友推荐的“自然疗法”，效果未知。", setFlag:{hasDiagnosis:false}}
    ]},
    {id:106, type:"series", title:"★【医疗系列④】等待中的恶化", desc:"【健康】在等待检查结果期间，你的腹部突然传来一阵剧痛，冷汗直流，几乎无法站立。", triggerFlag:(f)=>f.isWaitingForTest && !f.needsEmergencyCare, options:[
        {text:"呼叫救护车去急诊(-5000)", effect:{money:-5000, health:-20}, tip:"救护车和急诊的费用是天价，但你别无选择。", setFlag:{needsEmergencyCare:true, isWaitingForTest:false}},
        {text:"让伴侣/朋友送你去医院", effect:{social:+10, health:-15}, tip:"你省下了救护车费用，但在路上耽误了宝贵的时间。", triggerCond:(s,f)=>f.inRelationship || s.social > 40, setFlag:{needsEmergencyCare:true, isWaitingForTest:false}},
        {text:"继续吃止痛药硬扛", effect:{health:-30, spirit:-20}, tip:"你冒着生命危险，试图靠意志力战胜病魔。", setFlag:{needsEmergencyCare:true, isWaitingForTest:false}}
    ]},
    {id:107, type:"series", title:"★【医疗系列⑤】天价账单", desc:"【健康】急诊、手术、住院...一系列操作后，你终于脱离危险，但一张超过10万美金的医疗账单也随之而来。", triggerFlag:(f)=>f.needsEmergencyCare, options:[
        {text:"与医院和保险公司谈判", effect:{spirit:-15, social:-10}, tip:"你陷入了无尽的扯皮和文件工作中，心力交瘁。", dynamicEffect:()=>{
            const success = Math.random()<0.2; // 只有20%的几率能砍价成功
            return success ? {money:+30000, spirit:+20} : {spirit:-15};
        }},
        {text:"申请医院的财政援助", effect:{credit:-10, social:-5}, tip:"你需要提交大量隐私的财务证明，等待漫长的审批。", triggerCond:(s)=>s.money < 100000},
        {text:"宣布个人医疗破产", effect:{credit:-80, job:-20, spirit:-30}, tip:"你免除了债务，但信用记录彻底被毁，未来生活举步维艰。", setFlag:{hasAppliedLoan:true}}
    ]},
    
    // --- 移民身份线 (H1B -> 绿卡) ---
    {id:1, maxTimes:1, title:"★【身份系列①】H1B申请启动", desc:"【身份】你的OPT即将到期，公司同意为你申请H1B工作签证，但费用需要自理。", triggerFlag:(f)=>!f.inH1BProcess && !f.hasH1B, options:[
        {text:"支付8000律师费申请", effect:{money:-8000, job:+5}, tip:"H1B流程启动，职业稳定暂时提升", setFlag:{inH1BProcess:true}},
        {text:"放弃申请准备回国", effect:{spirit:-10}, tip:"你失去了在美合法工作的机会，回国想法萌生", setFlag:{hasReturnIdea:true}}
    ]},
    {id:2, maxTimes:1, title:"★【身份系列②】H1B抽签结果", desc:"【身份】H1B抽签结果公布，你的命运将被决定。", triggerFlag:(f)=>f.inH1BProcess, options:[
        {text:"查询抽签结果", effect:{spirit:-10}, tip:"80%未抽中，20%抽中", dynamicEffect:()=>{
            const success = Math.random()<0.2;
            gameState.customFlag.hasH1B = success;
            gameState.customFlag.inH1BProcess = false;
            return success ? {spirit:+40, job:+10} : {job:-30, spirit:-20};
        }}
    ]},
    {id:3, maxTimes:1, title:"★【身份系列③-分支】H1B RFE补件通知", desc:"【身份】你虽然抽中了H1B，但收到了移民局的补充材料(RFE)通知，需要律师协助处理。", triggerFlag:(f)=>f.hasH1B && !f.inGreenCardProcess, options:[
        {text:"支付3000律师费补件", effect:{money:-3000, spirit:-5}, tip:"70%补件成功，30%失败", dynamicEffect:()=>{
            const success = Math.random()<0.7;
            if(!success) gameState.customFlag.hasH1B = false;
            return success ? {spirit:+10, job:+5} : {job:-40, spirit:-25};
        }},
        {text:"放弃补件，签证作废", effect:{job:-50, spirit:-30}, tip:"你的H1B签证作废，失去了工作资格", setFlag:{hasH1B:false}}
    ]},
    {id:4, maxTimes:1, title:"★【身份系列④】绿卡申请启动", desc:"【身份】你的H1B身份稳定，可以向公司申请办理绿卡(PERM)了。", triggerFlag:(f)=>f.hasH1B && !f.inGreenCardProcess, options:[
        {text:"向公司提出申请", effect:{social:+5, job:+5}, tip:"公司同意，但过程漫长，且你未来3年不能离职", setFlag:{inGreenCardProcess:true}},
        {text:"暂时不申请", effect:{spirit:-5}, tip:"你错过了最佳申请时机"}
    ]},
    {id:5, title:"★【身份系列⑤-分支】绿卡流程中的裁员", desc:"【身份】在绿卡申请期间，公司开始裁员，你的岗位岌岌可危。", triggerFlag:(f)=>f.inGreenCardProcess && f.hasBeenLayoff, options:[
        {text:"紧急寻找下家保身份", effect:{job:-20, spirit:-15}, tip:"找到下家则绿卡流程重启，找不到则身份失效", dynamicEffect:()=>{
            const success = Math.random()<0.4;
            if(!success) {
                gameState.customFlag.inGreenCardProcess = false;
                gameState.customFlag.hasH1B = false;
                gameState.customFlag.greenCardFailed = true;
            }
            return success ? {job:+10} : {job:-50, spirit:-20};
        }}
    ]},

    // --- 情感关系线 ---
    {id:6, maxTimes:1, title:"★【情感系列①】一场浪漫的邂逅", desc:"【情感】在一次朋友聚会上，你遇到一个让你心动的人。", triggerFlag:(f)=>!f.inRelationship && !f.isMarried, options:[
        {text:"主动要联系方式", effect:{social:+5, spirit:+10}, tip:"你们开始聊天，关系升温", setFlag:{inRelationship:true}},
        {text:"默默关注", effect:{spirit:-5}, tip:"你因为犹豫错过了机会"}
    ]},
    {id:7, title:"★【情感系列②】第一次约会", desc:"【情感】你们决定第一次约会，去哪里，做什么，都影响着关系走向。", triggerFlag:(f)=>f.inRelationship && !f.isMarried, options:[
        {text:"去高档餐厅（-500）", effect:{money:-500, spirit:+10}, tip:"一次完美的约会，关系更加亲密", setFlag:{relationshipCrisis:false}},
        {text:"去公园散步（-0）", effect:{spirit:+5}, tip:"虽然没花钱，但对方觉得你不够重视", setFlag:{relationshipCrisis:true}},
        {text:"因工作忙取消约会", effect:{job:+5, spirit:-10, social:-5}, tip:"你伤害了对方的感情", setFlag:{relationshipCrisis:true}}
    ]},
    {id:8, title:"★【情感系列③】同居的决定", desc:"【情感】你们的关系稳定，对方提议一起住，分摊房租，但也会失去个人空间。", triggerFlag:(f)=>f.inRelationship && !f.isMarried, options:[
        {text:"同意同居", effect:{money:+800, health:+5, spirit:+5}, tip:"生活成本降低，但需要磨合"},
        {text:"再考虑一下", effect:{spirit:-8}, tip:"对方认为你没有认真对待这段感情", setFlag:{relationshipCrisis:true}}
    ]},
    {id:9, maxTimes:1, title:"★【情感系列④】婚姻的殿堂/分手的路口", desc:"【情感】你们走到了人生的十字路口。", triggerFlag:(f)=>f.inRelationship && !f.isMarried, options:[
        {text:"求婚/接受求婚", effect:{money:-10000, spirit:+30}, tip:"你们决定结婚，但婚礼开销不菲", setFlag:{isMarried:true, inRelationship:false}, triggerCond:(s,f)=>!f.relationshipCrisis},
        {text:"提出分手", effect:{spirit:-25, social:-10}, tip:"一段感情的结束让你身心俱疲", setFlag:{inRelationship:false, relationshipCrisis:false}},
        {text:"被分手", effect:{spirit:-35, health:-10}, tip:"你被突如其来的分手打击到崩溃", setFlag:{inRelationship:false, relationshipCrisis:false}, triggerCond:(s,f)=>f.relationshipCrisis}
    ]},
    {id:10, maxTimes:1, title:"★【情感系列⑤-分支】孩子的降生", desc:"【情感】你们有了一个孩子，这是生命的奇迹，也是巨大的责任。", triggerFlag:(f)=>f.isMarried && !f.hasChild, options:[
        {text:"迎接新生命", effect:{money:-50000, health:-15, spirit:-20}, tip:"医疗、奶粉、尿布...开销巨大，且你几乎没有个人时间", setFlag:{hasChild:true}}
    ]},

    // --- 投资理财线 ---
    {id:11, title:"★【投资系列①】股市的诱惑", desc:"【投资】同事们都在讨论股票，声称最近行情很好，建议你也开户投资。", triggerFlag:(f)=>!f.investedStocks, options:[
        {text:"投入2万美金试试水", effect:{money:-20000}, tip:"你迈出了投资的第一步", setFlag:{investedStocks:true}},
        {text:"风险太高，拒绝", effect:{spirit:+5}, tip:"你选择稳妥，远离风险"}
    ]},
    {id:12, title:"★【投资系列②】加密货币的狂热", desc:"【投资】新闻和社交媒体上铺天盖地都是加密货币暴富的故事。", triggerFlag:(f)=>!f.investedCrypto, options:[
        {text:"投入1万美金追逐风口", effect:{money:-10000}, tip:"你加入了这场数字淘金热", setFlag:{investedCrypto:true}},
        {text:"认为是骗局，远离", effect:{spirit:+5}, tip:"你对这种虚拟资产保持警惕"}
    ]},
    {id:13, title:"★【投资系列③】市场的审判", desc:"【投资】市场风云突变，你的投资将面临考验。", triggerFlag:(f)=>f.investedStocks || f.investedCrypto, options:[
        {text:"查看账户收益", effect:{}, tip:"40%盈利，60%亏损", dynamicEffect:()=>{
            const success = Math.random()<0.4;
            gameState.customFlag.investmentSuccess = success;
            let change = 0;
            if(gameState.customFlag.investedStocks) change += success ? 15000 : -15000;
            if(gameState.customFlag.investedCrypto) change += success ? 20000 : -8000;
            return {money:change, spirit: success ? 15 : -15};
        }}
    ]},
    {id:14, maxTimes:1, title:"★【投资系列④-分支】杀猪盘骗局", desc:"【投资】网上一个“理财大师”主动联系你，声称有内幕消息，保证盈利。", triggerFlag:(f)=>!f.hasBeenCheated, options:[
        {text:"相信大师，追加5万投资", effect:{money:-50000, spirit:-30, credit:-20}, tip:"你的钱被转走，对方消失，你被骗了", setFlag:{hasBeenCheated:true}},
        {text:"识破骗局并举报", effect:{spirit:+10, social:+5}, tip:"你保护了自己的财产，并帮助了他人", setFlag:{hasReportCheat:true}}
    ]},

    // --- 副业与梦想线 ---
    {id:15, title:"★【副业系列①】探索副业", desc:"【副业】主业收入有限，你考虑发展一项副业增加收入。", triggerFlag:(f)=>!f.hasSideHustle, options:[
        {text:"做代驾/送外卖", effect:{}, tip:"启动成本低，但辛苦且收入不稳定", setFlag:{hasSideHustle:true, sideHustleType:'gig'}},
        {text:"做视频博主/UP主", effect:{money:-1000}, tip:"需要前期投入买设备，回报周期长", setFlag:{hasSideHustle:true, sideHustleType:'creator'}},
        {text:"还是专注主业", effect:{job:+5}, tip:"你决定把所有精力放在本职工作上"}
    ]},
    {id:16, title:"★【副业系列②】副业的挑战", desc:"【副业】你的副业开始面临挑战。", triggerFlag:(f)=>f.hasSideHustle, options:[
        {text:"投入更多时间精力", effect:{health:-8, spirit:-5}, tip:"70%概率收入增加，30%失败", dynamicEffect:(f)=>{
            const success = Math.random()<0.7;
            gameState.customFlag.sideHustleSuccess = success;
            return success ? {money: f.sideHustleType==='gig' ? 1500:3000, job:-3} : {money:-500, job:-5};
        }},
        {text:"放弃副业", effect:{spirit:-10}, tip:"你感到挫败，决定放弃", setFlag:{hasSideHustle:false}}
    ]},
    
    // --- 原有系列事件（已整合和优化） ---
    {id:17,type:"series",title:"★【就业系列①】裁员危机·二次抉择",desc:"【工作】公司优化架构，你被纳入裁员名单，HR给出主动离职、转岗偏远分部、协商留任三个方案",triggerFlag:(f)=>!f.hasBeenLayoff,options:[
        {text:"主动离职拿补偿金",effect:{money:+8000,job:-25,spirit:-5},tip:"失业焦虑缠身",setFlag:{hasBeenLayoff:true}},
        {text:"接受转岗保工作",effect:{money:-2000,job:+10,health:-3},tip:"通勤消耗健康，收入缩水",setFlag:{overtimeCount:p=>p+1}},
        {text:"协商留任（人脉≥40）",effect:{social:-8,job:+5,spirit:+3},tip:"暂时安心，消耗人脉",triggerCond:(s)=>s.social>=40}
    ]},
    {id:18,type:"series",title:"★【就业系列②-分支】创业分红·风险兑现",desc:"【工作】前同事的创业项目迎来分红节点，可追加投资、撤资或观望",triggerFlag:(f)=>f.hasDoBusiness,options:[
        {text:"追加2万美金投资",effect:{money:-20000},tip:"50%盈利翻倍，50%亏损负债", dynamicEffect:()=>{
            const success = Math.random()>0.5;
            gameState.customFlag.businessSuccess = success;
            return success ? {money:+80000,job:+20} : {money:-10000,credit:-15};
        }},
        {text:"选择撤资离场",effect:{money:+5000,social:-10,job:+3},tip:"拿回本金，同事产生隔阂"},
        {text:"观望不动作",effect:{spirit:-5},tip:"失去后续创业事件触发权",setFlag:{hasDoBusiness:false}}
    ]},
    {id:19,type:"series",title:"★【毒品系列①】毒品引诱·成瘾深渊",desc:"【底层】流浪期间，毒贩兜售廉价解压药品，短期缓解压力，长期成瘾",triggerFlag:(f)=>!f.hasTakenDrug&&f.isHomeless,options:[
        {text:"尝试购买吸食",effect:{money:-800,spirit:+7,health:-20},tip:"短暂快乐后成瘾",setFlag:{hasTakenDrug:true}},
        {text:"远离毒贩规避",effect:{spirit:-4},tip:"守住底线，触发警惕状态"},
        {text:"联合流浪汉反抗",effect:{health:-10,social:+6,spirit:+3},tip:"获得流浪汉认可"}
    ]},
    {id:20,type:"series",title:"★【毒品系列②-分支】毒瘾戒断抉择",desc:"【底层】你已染上毒瘾，需选择复吸、强行戒毒或求助专业机构",triggerFlag:(f)=>f.hasTakenDrug,options:[
        {text:"复吸成瘾沉沦",effect:{money:-500,spirit:+10,health:-25},tip:"彻底坠入深渊，精神持续下滑",setFlag:{drugQuit:false}},
        {text:"强忍戒断反应",effect:{health:-10,spirit:+8},tip:"重获理智，成功戒毒",setFlag:{drugQuit:true,hasTakenDrug:false}},
        {text:"求助戒毒所",effect:{money:-5000,health:-5,spirit:+10},tip:"专业戒毒，逐步恢复",setFlag:{drugQuit:true,hasTakenDrug:false}}
    ]},
    {id:21,type:"series",title:"★【回国系列①】归乡邀约·二次考量",desc:"【社交】国内亲友来电，安排好稳定工作并承担机票，需放弃美资产",triggerFlag:(f)=>!f.hasReturnIdea && f.hasPoorSocialConnection,options:[
        {text:"同意回国启程",effect:{money:-5000,spirit:+30},tip:"触发HE归乡分支，重启人生",setFlag:{hasReturnIdea:true},triggerCond:(s)=>s.money>=100000},
        {text:"坚决拒绝留美",effect:{spirit:+12,social:-20},tip:"执念支撑，斩断亲友渠道"},
        {text:"延期答复观望",effect:{spirit:-8,money:-1000},tip:"犹豫消耗心神，3回合后二次抉择"}
    ]},
    {id:22,type:"series",title:"★【回国系列②-分支】归国资金筹备",desc:"【生活】确定回国意向，需筹备手续费与路费，资金不足则无望",triggerFlag:(f,s)=>f.hasReturnIdea&&s.money<5000,options:[
        {text:"变卖剩余资产",effect:{money:+3000,social:-5},tip:"凑够费用，顺利回国",setFlag:{isHomeless:false}},
        {text:"求助亲友资助",effect:{social:-10,money:+5000},tip:"亲友相助，圆满归乡",setFlag:{hasBeenAided:true}},
        {text:"放弃回国留美",effect:{spirit:-25,health:-5},tip:"归乡希望破灭，继续挣扎"}
    ]},
    {id:23,type:"series",title:"★【流浪系列①】房东逼迁·绝境求助",desc:"【生活】资金跌破预警线，房租逾期，房东下达24小时通牒",triggerFlag:(f,s)=>!f.isHomeless&&s.money<145000,options:[
        {text:"求助亲友交租",effect:{money:+5000,social:-10,spirit:+5},tip:"保住住所，消耗人脉",triggerCond:(s)=>s.social>=35},
        {text:"妥协搬离流浪",effect:{money:-2000,health:-5},tip:"触发流浪前置，下一回合必出流浪事件",setFlag:{isHomeless:true}},
        {text:"协商延期缴纳",effect:{money:-5500,credit:-8},tip:"支付滞纳金，暂时稳住",triggerCond:(s)=>s.credit>=40}
    ]},
    {id:24,type:"series",title:"★【流浪系列②-分支】管道争抢·史莱姆博弈",desc:"【底层】流落街头，西雅图寒冬，争夺暖气管道栖身地",triggerFlag:(f)=>f.isHomeless,options:[
        {text:"激烈争执争抢",effect:{health:-18,spirit:-12},tip:"50%抢到栖身地，停止寒冷伤害",dynamicEffect:()=>Math.random()>0.5?{health:+10}:{health:-3}},
        {text:"妥协退让避让",effect:{spirit:-8,health:-10},tip:"冻僵状态，健康持续下滑",dynamicEffect:()=>{return {health:-3}}},
        {text:"报警求助收容",effect:{social:-7,health:+2},tip:"暂时获得收容，消耗人脉",triggerCond:(s)=>s.social>=30}
    ]},
    {id:25,type:"series",title:"★【贷款系列①】家人急诊·贷款抉择",desc:"【医疗】家人突发阑尾炎，手术费18万，需申请贷款、变卖资产或放弃",triggerFlag:(f)=>!f.hasAppliedLoan,options:[
        {text:"申请医疗贷款",effect:{money:+180000,credit:-20},tip:"每月还款6000，持续12回合",setFlag:{hasAppliedLoan:true,loanCount:p=>p+1},triggerCond:(s)=>s.credit>=50},
        {text:"变卖资产救治",effect:{money:-180000,credit:-35,spirit:+5},tip:"资金跌破斩杀线，尽到责任"},
        {text:"无奈放弃治疗",effect:{spirit:-35,social:-25},tip:"触发抑郁事件，精神持续下滑",setFlag:{hasSeriousIll:true}}
    ]},
    {id:26,type:"series",title:"★【贷款系列②-分支】债务催收应对",desc:"【生活】医疗贷款到期，无力偿还则信用暴跌，偿还则资金见底",triggerFlag:(f)=>f.hasAppliedLoan&&f.loanCount>=1,options:[
        {text:"借钱拆东补西",effect:{money:-6000,credit:-10},tip:"负债加剧，雪球越滚越大", setFlag:{loanCount:p=>p+1}},
        {text:"申请延期还款",effect:{credit:-15},tip:"暂时躲过，利息暴涨", setFlag:{debtCount:p=>p+1}},
        {text:"打工赚钱还债",effect:{money:+6000,health:-8,job:+5},tip:"辛苦奔波，逐步还清"}
    ]},
    {id:27,type:"series",title:"★【医疗系列①】流感蔓延·医保博弈",desc:"【医疗】社区流感爆发，你出现症状，有医保报销、无保自付或硬抗",triggerFlag:(f)=>!f.hasSymptom,options:[
        {text:"硬抗自愈冒险",effect:{health:-12,spirit:-6},tip:"30%引发肺炎，健康持续下滑",dynamicEffect:()=>{
            const success = Math.random()>0.7;
            if(success) gameState.customFlag.hasSeriousIll = true;
            return success ? {health:-5}:{};
        }},
        {text:"医保就医报销",effect:{money:-3000,health:+12,credit:+3},tip:"流程繁琐但费用可控", setFlag:{isDiagnosing:true}},
        {text:"无保全额就医",effect:{money:-9000,health:+12,spirit:-4},tip:"经济压力剧增", setFlag:{isDiagnosing:true}}
    ]},
    {id:28,type:"series",title:"★【医疗系列②-分支】黑市买药·真伪难辨",desc:"【医疗】资金见底，无力正规就医，街头兜售廉价特效药",triggerFlag:(f,s)=>s.money<10000&&!f.hasBuyBlackDrug,options:[
        {text:"购买黑市药品",effect:{money:-1500},tip:"50%有效痊愈，50%副作用伤身",dynamicEffect:()=>{
            const success = Math.random()>0.5;
            if(!success) gameState.customFlag.hasBeenCheated = true;
            return success ? {health:+8}:{health:-18};
        }, setFlag:{hasBuyBlackDrug:true}},
        {text:"求助公益诊所",effect:{health:+5,spirit:+4,social:-5},tip:"获得基础治疗，消耗人脉",triggerCond:(s)=>s.social>=25},
        {text:"继续硬抗拖延",effect:{health:-15,spirit:-10},tip:"触发病危预警，属性再降5直接结束",setFlag:{hasSeriousIll:true}}
    ]},

    // ===================================== 【⭐ 唯一事件 - 全局仅1次 大额奖惩】=====================================
    {id:29,maxTimes:1,type:"unique",title:"◆【唯一】天降横财·创业分红",desc:"【工作】前同事创业项目大获成功，分给你10万美金分红，资金暴涨",triggerFlag:(f)=>f.hasDoBusiness&&f.businessSuccess,options:[
        {text:"收下分红",effect:{money:+100000,credit:+5,job:+10},tip:"雪中送炭，脱离生存危机",setFlag:{hasGotBonus:true}}
    ]},
    {id:30,maxTimes:1,type:"unique",title:"◆【唯一】突发重病·手术抉择",desc:"【医疗】确诊急性阑尾炎，手术费8万美金，不手术健康归零",options:[
        {text:"花钱手术治疗",effect:{money:-80000,health:+20},tip:"保住性命但资金见底",setFlag:{hasSeriousIll:true}},
        {text:"硬抗放弃治疗",effect:{health:-50,spirit:-15},tip:"健康暴跌，触发病危预警"}
    ]},
    {id:31,maxTimes:1,type:"unique",title:"◆【唯一】亲友大额资助",desc:"【社交】国内父母寄来5万美金应急，无需偿还，雪中送炭",options:[
        {text:"收下亲友资助",effect:{money:+50000,spirit:+15,social:+10},tip:"亲情兜底，缓解资金压力",setFlag:{hasBeenAided:true}}
    ]},
    {id:32,maxTimes:1,type:"unique",title:"◆【唯一】被恶意裁员",desc:"【工作】公司恶意裁员，你被辞退且无补偿金，职业稳定暴跌", triggerFlag:(f)=>f.hasUnstableJobMentality, options:[
        {text:"接受现实找工作",effect:{job:-30,spirit:-10},tip:"从头再来，生存压力倍增",setFlag:{hasBeenLayoff:true}},
        {text:"仲裁维权追责",effect:{social:+5,job:-20,spirit:-5},tip:"拿回少量补偿金，耗时耗力"}
    ]},
    {id:33,maxTimes:1,type:"unique",title:"◆【唯一】黑市买药被骗",desc:"【医疗】资金见底购买黑市药，结果买到假药，健康大幅下滑",triggerFlag:(f,s)=>s.money<3000&&f.hasSeriousIll&&!f.hasBuyBlackDrug,options:[
        {text:"买黑市药",effect:{money:-2000,health:-20},tip:"雪上加霜，得不偿失",setFlag:{hasBuyBlackDrug:true,hasBeenCheated:true}},
        {text:"放弃买药硬抗",effect:{health:-5},tip:"保住剩余资金，硬抗病痛"}
    ]},
    {id:34,maxTimes:1,type:"unique",title:"◆【唯一】结交贵人·职场提携",desc:"【社交】偶遇行业大佬，相谈甚欢，对方愿意帮你推荐高薪工作",triggerFlag:(f,s)=>s.social<30&&s.job<60&&!f.hasMetNoble,options:[
        {text:"结交贵人借力",effect:{social:+20,job:+15,money:+5000},tip:"贵人相助，职场逆袭",setFlag:{hasMetNoble:true}},
        {text:"保持距离自立",effect:{social:-5},tip:"不求他人，靠自己打拼"}
    ]},
    {id:35,maxTimes:1,type:"unique",title:"◆【唯一】捡到现金·良心抉择",desc:"【生活】街头捡到2万美金现金，无人认领，可留用可上交",triggerFlag:(f,s)=>s.money<20000,options:[
        {text:"留用补充资金",effect:{money:+20000,credit:-5},tip:"缓解压力，良心不安"},
        {text:"上交警方处理",effect:{social:+10,spirit:+5},tip:"心安理得，获得社会认可"}
    ]},
    {id:36,maxTimes:1,type:"unique",title:"◆【唯一】医疗纠纷·维权胜诉",desc:"【医疗】就医时医生操作失误，医院提议私了，可起诉追讨更多赔偿",triggerFlag:(f,s)=>f.hasSeriousIll&&!f.medicalDisputeWin,options:[
        {text:"起诉维权胜诉",effect:{money:+50000,spirit:-8,health:-3},tip:"耗时耗力，获得足额赔偿",setFlag:{medicalDisputeWin:true},triggerCond:(s)=>s.social>=40},
        {text:"接受私了赔偿",effect:{money:+20000,health:-5,spirit:+3},tip:"快速了结，获得基础补偿"}
    ]},
    {id:37,maxTimes:1,type:"unique",title:"◆【唯一】兼职欠薪·仲裁胜诉",desc:"【工作】完成工地兼职后被拖欠工资，仲裁成功拿回薪资",triggerFlag:(f,s)=>s.money<5000&&!f.hasReportCheat,options:[
        {text:"劳动仲裁维权",effect:{money:+3000,credit:+5,spirit:+4},tip:"耗时1回合，成功拿回薪资",setFlag:{hasReportCheat:true},triggerCond:(s)=>s.social>=25},
        {text:"上门讨薪拿回",effect:{health:-8,money:+3000},tip:"引发冲突，侥幸拿回工资",dynamicEffect:()=>Math.random()>0.5?{}:{health:-12}}
    ]},
    {id:38,maxTimes:1,type:"unique",title:"◆【唯一】街头乞讨·尊严抉择",desc:"【底层】资金耗尽，需放下尊严乞讨，或捡垃圾、求助收容所",triggerFlag:(f,s)=>s.money<1000,options:[
        {text:"街头乞讨谋生",effect:{spirit:-18,social:-5},tip:"勉强糊口，尊严尽失", dynamicEffect:()=>{ return {money:Math.floor(Math.random()*500)+300}; }, setFlag:{begCount:p=>p+1}},
        {text:"求助收容所",effect:{health:+3,spirit:+4},tip:"获得基础安置，无资金变动",triggerCond:(s)=>s.social>=25}
    ]},
    {id:39,maxTimes:1,type:"unique",title:"◆【唯一】彩票中奖",desc:"【生活】你花2美元买了一张彩票，竟然中了大奖。",options:[
        {text:"兑换100万美金大奖",effect:{money:+1000000, spirit:+50, job:-10},tip:"你一夜暴富，但似乎也失去了奋斗的动力。"}
    ]},
    {id:40,maxTimes:1,type:"unique",title:"◆【唯一】身份被盗用",desc:"【生活】你收到一堆催债账单，才发现自己的身份信息被盗用，信用一夜归零。", triggerFlag:(f)=>f.hasLegalRisk, options:[
        {text:"报警并冻结信用",effect:{credit:-50, spirit:-20, social:-10},tip:"你开始了漫长的信用修复之路。"}
    ]},
    {id:41,maxTimes:1,type:"unique",title:"◆【唯一】陪审团义务",desc:"【生活】你被抽中成为陪审团成员，必须参加一场旷日持久的庭审。",options:[
        {text:"履行公民义务",effect:{job:-10, spirit:-10, social:+10},tip:"你见识了美国的司法体系，但工作受到了影响。"}
    ]},
    {id:42,maxTimes:1,type:"unique",title:"◆【唯一】自然灾害",desc:"【生活】你所在的地区遭遇了飓风/山火，你的住所被毁。",options:[
        {text:"申请联邦紧急援助",effect:{money:-20000, health:-15, spirit:-15},tip:"家园被毁，你不得不搬家，并花费一大笔钱重建。"}
    ]},

    // ===================================== 【♻️ 普通事件 - 无限制随机 小额奖惩】=====================================
    {id:43,type:"normal",title:"●【医疗】轻微感冒·用药抉择",desc:"【医疗】换季感冒，买药花500美金，不买药健康小幅下降",options:[
        {text:"买药快速治疗",effect:{money:-500,health:+5},tip:"快速康复，无后续影响"},
        {text:"硬抗自愈节省",effect:{health:-5,spirit:-2},tip:"节省开支，轻微影响状态"}
    ]},
    {id:44,type:"normal",title:"●【工作】职场内卷·加班博弈",desc:"【工作】部门紧急项目，加班一周获双倍工资，拒绝则可能被裁员",options:[
        {text:"主动加班赚钱",effect:{money:+4000,health:-10,job:+8},tip:"多劳多得，职业稳定提升",setFlag:{overtimeCount:p=>p+1, hasHighStress:true}},
        {text:"拒绝加班规避",effect:{job:-15,spirit:-6},tip:"保住健康，30%概率被裁员",dynamicEffect:()=>Math.random()>0.7?{job:-20}:{}}
    ]},
    {id:45,type:"normal",title:"●【生活】物价上涨·开销增加",desc:"【生活】超市物价上涨30%，日常开销增加，资金小幅减少",effect:{money:-1000,spirit:-2},options:[{text:"接受现实应对",tip:"生活成本攀升，压力增加"}], isHighCost: true},
    {id:46,type:"normal",title:"●【生活】房屋设施维修",desc:"【生活】房屋设施损坏，需支付维修费用",effect:{money:-2000,spirit:-3},options:[{text:"无奈支付维修费",tip:"意外支出，精神受挫"}], isHighCost: true},
    {id:47,type:"normal",title:"●【生活】交通罚单",desc:"【生活】因交通违规收到罚单",effect:{money:-1500,spirit:-5},options:[{text:"缴纳罚款",tip:"资金减少，心情郁闷"}], isHighCost: true},
    {id:48,type:"normal",title:"●【生活】社交礼金",desc:"【生活】朋友或同事结婚/生子，需要送礼",effect:{money:-1200,spirit:2},options:[{text:"送出祝福和礼金",tip:"维持社交关系，但资金减少"}], isHighCost: true},
    {id:49,type:"normal",title:"●【生活】电子产品损坏",desc:"【生活】手机或电脑损坏，需要修理或更换",effect:{money:-1800,spirit:-4},options:[{text:"支付修理/更换费用",tip:"影响生活和工作，资金压力增大"}], isHighCost: true},
    {id:50,type:"normal",title:"●【生活】家庭紧急援助",desc:"【生活】家人需要紧急资金援助",effect:{money:-2500,spirit:-5},options:[{text:"提供资金支持",tip:"家庭责任重大，资金紧张"}], isHighCost: true},
    {id:51,type:"normal",title:"●【生活】订阅服务自动续费",desc:"【生活】忘记取消的订阅服务自动续费",effect:{money:-3000,spirit:-2},options:[{text:"接受扣款",tip:"资金流失，感到无奈"}], isHighCost: true},
    {id:52,type:"normal",title:"●【生活】丢失个人物品",desc:"【生活】丢失钱包或重要证件，造成经济损失",effect:{money:-500,spirit:-8},options:[{text:"承担损失并补办",tip:"资金和精神双重打击"}]},
    {id:53,type:"normal",title:"●【生活】慈善捐款",desc:"【生活】遇到慈善捐款活动，决定奉献爱心",effect:{money:-300,spirit:5},options:[{text:"慷慨解囊",tip:"精神得到满足，资金略减"}]},
    {id:54,type:"normal",title:"●【人际】朋友借钱",desc:"【人际】朋友遇到困难向你借钱",effect:{},options:[{text:"借钱给朋友",effect:{money:-2000,spirit:3},tip:"帮助朋友，巩固友谊"},{text:"婉言拒绝",effect:{spirit:-5},tip:"关系可能受损，但保住资金"}]},
    {id:55,type:"normal",title:"●【生活】牙齿问题",desc:"【生活】牙痛难忍，需要看牙医",effect:{money:-5000,spirit:-10},options:[{text:"接受治疗",tip:"牙科费用昂贵，资金大幅减少"}], isHighCost: true},
    {id:56,type:"normal",title:"●【生活】宠物生病",desc:"【生活】心爱的宠物生病，需要兽医治疗",effect:{money:-8000,spirit:-15},options:[{text:"带宠物去看病",tip:"宠物是家人，治疗费用高昂"}], isHighCost: true},
    {id:57,type:"normal",title:"●【生活】法律咨询",desc:"【生活】遇到法律纠纷，需要咨询律师",effect:{money:-10000,spirit:-8},options:[{text:"寻求专业法律意见",tip:"保护自身权益，但费用不菲"}], isHighCost: true},
    {id:58,type:"normal",title:"●【人际】参加校友会",desc:"【人际】参加校友会，拓展人脉",effect:{money:-800,spirit:4},options:[{text:"积极参与",tip:"社交活动有助精神，但有开销"}]},
    {id:59,type:"normal",title:"●【人际】与邻居冲突",desc:"【人际】与邻居发生小冲突",effect:{spirit:-6},options:[{text:"尝试和解",effect:{spirit:2},tip:"化解矛盾，社区和谐"},{text:"置之不理",effect:{spirit:-3},tip:"关系恶化，影响心情"}]},
    {id:60,type:"normal",title:"●【工作】团队建设活动",desc:"【工作】公司组织团队建设活动，需自费一部分",effect:{money:-2000,spirit:5},options:[{text:"参加活动",tip:"增进同事关系，但有开销"}], isHighCost: true},
    {id:61,type:"normal",title:"●【工作】职业培训",desc:"【工作】为提升技能报名参加职业培训",effect:{money:-3000,spirit:3},options:[{text:"投资自己",tip:"提升竞争力，但短期资金压力大"}], isHighCost: true},
    {id:62,type:"normal",title:"●【工作】项目失败",desc:"【工作】负责的项目失败，可能影响奖金",effect:{spirit:-10},options:[{text:"承担责任，总结教训",tip:"精神受挫，但为未来积累经验"}]},
    {id:63,type:"normal",title:"●【工作】与同事的激烈争吵",desc:"【工作】你和一位平时就看不顺眼的同事因为工作分配问题大吵一架，你感觉身心俱疲。",effect:{spirit:-10},options:[{text:"摔门而出",tip:"吵完就走，眼不见心不烦"},{text:"向对方道歉",effect:{spirit:5},tip:"能屈能伸，维持了基本的同事关系"}],triggerFlag:(f)=>!f.hasPoorSocialConnection,setFlag:{hasPoorSocialConnection:true}},
    {id:64,type:"normal",title:"●【健康】季节性流感",desc:"【健康】季节交替，不幸患上流感",effect:{money:-1000,health:-5,spirit:-5},options:[{text:"请假看病",tip:"健康第一，但影响收入和精神"}], isHighCost: true},
    {id:65,type:"normal",title:"●【健康】运动受伤",desc:"【健康】锻炼时不慎受伤",effect:{money:-1500,health:-8,spirit:-6},options:[{text:"去医院治疗",tip:"身体恢复需要时间和金钱"}], isHighCost: true},
    {id:66,type:"normal",title:"●【健康】失眠困扰",desc:"【健康】长期失眠，精神状态不佳",effect:{money:-2000,health:-3,spirit:-10},options:[{text:"寻求专业帮助",tip:"改善睡眠质量，但花费不菲"}], isHighCost: true},
    {id:67,type:"normal",title:"●【健康】心理咨询",desc:"【健康】感觉压力巨大，预约心理咨询",effect:{money:-2000,spirit:15},options:[{text:"接受心理疏导",tip:"精神得到缓解，但钱包缩水"}], isHighCost: true},
    {id:68,type:"normal",title:"●【工作】被要求做违法的事",desc:"【工作】你的上司要求你做一些灰色地带甚至违法的事情来完成业绩。",options:[
        {text:"严词拒绝并举报",effect:{job:-20, social:-10, spirit:+15},tip:"你可能因此丢掉工作，但守住了底线。"},
        {text:"服从安排",effect:{job:+10, credit:-15, spirit:-10},tip:"你完成了业绩，但从此良心不安，并留下了隐患。", setFlag:{hasLegalRisk:true}}
    ]},
    {id:69,type:"normal",title:"●【生活】参与社区园艺",desc:"【生活】社区有一片公共花园，邀请居民一起打理。",options:[
        {text:"参与其中",effect:{health:+5, spirit:+5, social:+3},tip:"你在劳动中放松了身心，还认识了新朋友。"},
        {text:"没有兴趣",effect:{},tip:"你对花花草草不感兴趣。"}
    ]},
    {id:70,type:"normal",title:"●【娱乐】一场说走就走的旅行",desc:"【娱乐】你感到身心俱疲，决定来一场短暂的旅行。",options:[
        {text:"去国家公园徒步(-800)",effect:{money:-800, health:+10, spirit:+15},tip:"大自然治愈了你的心灵。"},
        {text:"去拉斯维加斯放纵(-2000)",effect:{money:-2000, spirit:+20, health:-5},tip:"你在纸醉金迷中短暂地忘记了烦恼。", setFlag:{hasGamble:true}}
    ]}
];

// ===================== ✅ 结局池【扩充至30+】 =====================
const RESULT_LIST = [
    // ===================== ✅ 【HE 好结局】=====================
    {id:1,type:"HE",title:"【人生赢家·完美结局】",desc:"你守住14万斩杀线且资金超20万，健康精神俱佳，创业成功/跳槽高薪，没碰毒没赌博，结交贵人，成为美国中产精英，安稳立足还能接济亲友。",egg:"牢A：赢的人，永远是守住底线且抓住机会的人。",condition:(s,f)=>s.money>=200000&&s.health>=70&&s.spirit>=70&&!f.hasTakenDrug&&!f.hasGamble},
    {id:2,type:"HE",title:"【归乡安稳·圆满结局】",desc:"你带着回国的坚定想法，凑够机票成功回国，家人团聚，有稳定工作，远离美国的生存地狱，健康精神恢复如初，重启幸福人生。",egg:"牢A：回家，永远是最温暖的退路。",condition:(s,f)=>f.hasReturnIdea&&s.money>=50000&&s.health>=60},
    {id:3,type:"HE",title:"【创业成功·财富自由】",desc:"你的创业投资大获成功，资金翻倍，职业稳定拉满，结交行业贵人，彻底摆脱生存压力，实现财富自由的初步目标。",egg:"牢A：风险与机遇并存，敢闯的人终会收获回报。",condition:(s,f)=>f.businessSuccess&&s.money>=180000&&s.job>=80},
    {id:4,type:"HE",title:"【底层突围·涅槃重生】",desc:"你曾流落街头/跌破斩杀线，但守住底线没碰毒，靠兼职/贵人相助还清债务，资金回升至14万以上，健康精神恢复，找到稳定工作，重获新生。",egg:"牢A：跌入谷底不可怕，可怕的是放弃爬起来的勇气。",condition:(s,f)=>s.money>=140000&&s.health>=50&&!f.hasTakenDrug&&f.isHomeless},
    {id:5,type:"HE",title:"【进修加薪·稳步上升】",desc:"你坚持进修考证，成功加薪升职，职业稳定提升，资金稳步增长，虽未大富大贵，但生活安稳，健康精神良好，是普通人的最优解。",egg:"牢A：知识改变命运，永远是真理。",condition:(s,f)=>f.studyCount>=1&&s.job>=70&&s.money>=150000},
    {id:6,type:"HE",title:"【亲友相助·渡过难关】",desc:"你获得亲友大额资助，还清债务，资金重回斩杀线以上，健康精神恢复，靠自己的努力找到稳定工作，不再挣扎，安稳度日。",egg:"牢A：亲情，是绝境中最坚固的后盾。",condition:(s,f)=>f.hasBeenAided&&s.money>=140000&&s.health>=60},
    {id:7,type:"HE",title:"【戒毒重生·浪子回头】",desc:"你曾碰过毒品，但凭借毅力成功戒毒，远离深渊，健康精神慢慢恢复，找到一份踏实的工作，重新做人，虽有伤疤但未来可期。",egg:"牢A：能戒掉的不是毒，是内心的欲望，浪子回头金不换。",condition:(s,f)=>f.drugQuit&&!f.hasTakenDrug&&s.health>=50},
    {id:8,type:"HE",title:"【小康生活·岁月静好】",desc:"你资金在15万左右，健康精神平平，无负债无恶习，有稳定工作和少量人脉，不富不贵但安稳度日，是美国大多数普通人的理想生活。",egg:"牢A：安稳，就是最大的幸福。",condition:(s,f)=>s.money>=150000&&s.health>=60&&s.spirit>=60&&!f.hasTakenDrug&&!f.hasGamble},
    {id:9,type:"HE",title:"【绿卡持有者·扎根异乡】",desc:"经过漫长的等待和努力，你终于拿到了美国绿卡，拥有了永久居留权。虽然未来的路依然漫长，但你终于在这片土地上有了一个安稳的身份。",egg:"牢A：一张小小的卡片，承载了多少人的美国梦。",condition:(s,f)=>f.inGreenCardProcess && !f.greenCardFailed && s.money>=100000},
    {id:10,type:"HE",title:"【家庭美满·人生伴侣】",desc:"你与相爱的人组建了家庭，或许还有了可爱的孩子。虽然生活充满了柴米油盐的琐碎，但家庭的温暖是你最坚实的后盾。",egg:"牢A：家人，是你在风雨中最温暖的港湾。",condition:(s,f)=>f.isMarried && s.spirit>=60 && s.health>=60},

    // ===================== ✅ 【BE 坏结局】=====================
    {id:11,type:"BE",title:"【毒瘾深渊·万劫不复】",desc:"你沉迷毒品无法自拔，健康精神彻底归零，资金耗尽，流落街头被毒贩控制，最终因过量吸食离世，无人问津。",egg:"牢A：毒品是无底洞，碰了就是万劫不复。",condition:(s,f)=>f.hasTakenDrug&&s.health<20&&s.spirit<20},
    {id:12,type:"BE",title:"【创业失败·负债累累】",desc:"你创业血本无归，还欠巨额外债，信用归零，被债主催收，流落街头乞讨，健康精神暴跌，最终冻饿而死。",egg:"牢A：不是所有人都能创业成功，大多数人只是赌光了家底。",condition:(s,f)=>!f.businessSuccess&&f.hasDoBusiness&&s.credit<=0},
    {id:13,type:"BE",title:"【医疗破产·生不如死】",desc:"你突发重病无力支付手术费，健康归零，或花钱治病后资金暴跌至斩杀线以下，被房东驱逐，最终病死街头。",egg:"牢A：在美国，一场病就能摧毁一个中产家庭。",condition:(s,f)=>f.hasSeriousIll&&s.money<80000&&s.health<=20},
    {id:14,type:"BE",title:"【赌博倾家·妻离子散】",desc:"你沉迷赌博，亏损巨额资金，信用暴跌，亲友远离，最终流落街头，被流浪汉殴打致死，一无所有。",egg:"牢A：赌博赢的是纸，输的是命。",condition:(s,f)=>f.hasGamble&&s.money<80000&&s.social<=0},
    {id:15,type:"BE",title:"【流浪冻死·史莱姆终章】",desc:"你流落下水道，健康精神归零，西雅图的寒冬+强酸清理，让你在睡梦中被腐蚀溶解，成为牢A口中的史莱姆，无人认领。",egg:"牢A：下水道里的每一个史莱姆，都是曾经的追梦人。",condition:(s,f)=>f.isHomeless&&s.health<=0},
    {id:16,type:"BE",title:"【债务枷锁·永无出头】",desc:"你累计贷款超3次，负债累累，信用归零，被追债者逼得走投无路，最终选择极端方式结束生命。",egg:"牢A：在美国，贷款不是救赎，是套在脖子上的绞索。",condition:(s,f)=>f.loanCount>=3&&s.credit<=0},
    {id:17,type:"BE",title:"【回国无望·绝望离世】",desc:"你有回国的想法，但资金不够买机票，健康精神彻底垮掉，流落街头乞讨，最终在绝望中病死，连回家的最后希望都破灭了。",egg:"牢A：有时候，回家的路，比活下去的路更遥远。",condition:(s,f)=>f.hasReturnIdea&&s.money<20000&&s.spirit<=0},
    {id:18,type:"BE",title:"【失业沉沦·彻底摆烂】",desc:"你被裁员后找不到工作，职业稳定归零，资金耗尽，流落街头，健康精神暴跌，最终放弃挣扎，在酒精和绝望中离世。",egg:"牢A：失业不可怕，可怕的是失去了重新站起来的勇气。",condition:(s,f)=>f.hasBeenLayoff&&s.job<=0&&s.money<100000},
    {id:19,type:"BE",title:"【底层互害·惨死街头】",desc:"你乞讨时被其他流浪汉殴打，健康归零，或被毒贩报复，最终惨死街头，底层的世界只有弱肉强食，没有共情。",egg:"牢A：底层的法则，就是吃人，被吃，然后消失。",condition:(s,f)=>f.begCount>=2&&s.social<=0&&s.health<=0},
    {id:20,type:"BE",title:"【身份失效·被迫离境】",desc:"你的H1B申请失败，或者在绿卡期间失业没能找到下家，最终失去了在美合法身份，不得不打包行李，仓皇离开。",egg:"牢A：没有那张纸，你在这里的一切努力都可能瞬间清零。",condition:(f)=>!f.hasH1B && f.greenCardFailed},
    {id:21,type:"BE",title:"【孤独终老·客死他乡】",desc:"你一生未婚，没有子女，与亲友关系淡漠。晚年在一个小小的公寓里悄然离世，几天后才被邻居发现。",egg:"牢A：最深的孤独，不是没人陪，是没人记得。",condition:(s,f)=>!f.isMarried && !f.inRelationship && s.social<=10 && s.spirit<=20},
    {id:22,type:"BE",title:"【投资失败·一贫如洗】",desc:"你将所有积蓄投入股市或加密货币，结果市场崩盘，你血本无归，甚至背上债务。",egg:"牢A：金融市场，是合法收割你财富的地方。",condition:(f)=> (f.investedCrypto || f.investedStocks) && !f.investmentSuccess && f.money < 10000},
    {id:23,type:"BE",title:"【官司缠身·精神崩溃】",desc:"你卷入了一场旷日持久的官司，即使最后胜诉，也耗尽了你的金钱和精力，最终精神崩溃。",egg:"牢A：在美国，赢了官司，输了人生。",condition:(f)=>f.inLawsuit && s.spirit<=0},

    // ===================== ✅ 【NORMAL 中性结局】=====================
    {id:24,type:"NORMAL",title:"【平凡度日·岁月安稳】",desc:"你资金在14-15万之间，健康精神60左右，无负债无恶习，有稳定工作，不富不贵，只是平淡度日，这是最真实的普通人生活。",egg:"牢A：平凡，是大多数人最终的归宿，也是最好的归宿。",condition:(s)=>s.money>=140000&&s.money<=150000&&s.health>=50&&s.spirit>=50},
    {id:25,type:"NORMAL",title:"【挣扎求生·温饱线徘徊】",desc:"你资金在12-14万之间，健康精神50左右，偶尔跌破斩杀线被惩罚，有小额负债，工作不稳定，每天都在为生存奔波，看不到希望。",egg:"牢A：生存，就是一场无休止的挣扎，活着就好。",condition:(s)=>s.money>=120000&&s.money<140000&&s.health>=40&&s.spirit>=40},
    {id:26,type:"NORMAL",title:"【小有积蓄·谨慎度日】",desc:"你资金在15-18万之间，健康精神良好，无负债，有少量积蓄，工作稳定，只是不敢冒险，谨慎度日，虽不富裕但安稳。",egg:"牢A：谨慎的人，永远不会跌得太惨。",condition:(s)=>s.money>=150000&&s.money<180000&&s.health>=60&&s.spirit>=60},
    {id:27,type:"NORMAL",title:"【得过且过·混吃等死】",desc:"你资金刚好在斩杀线，健康精神平平，工作摸鱼，无追求无梦想，每天混吃等死，不挣扎也不进步，只是活着而已。",egg:"牢A：混吃等死，也是一种生活方式，至少不累。",condition:(s)=>s.money>=130000&&s.money<150000&&s.health>=45&&s.spirit>=45},
    {id:28,type:"NORMAL",title:"【H1B打工人】",desc:"你抽中了H1B，成为了一名标准的“美漂”打工人。每天在公司和公寓间两点一线，为不确定的绿卡前景和生活开销而奔波。",egg:"牢A：H1B不是绿卡，只是给你一个继续在这里挣扎的许可。",condition:(f)=>f.hasH1B && !f.inGreenCardProcess},
    {id:29,type:"NORMAL",title:"【月光族】",desc:"你有一份不错的工作，但也是一个标准的月光族。工资一到手就用来支付账单、房租和各种消费，几乎没有存款。",egg:"牢A：挣得多花得也多，最后都是一场空。",condition:(s)=>s.job>=70 && s.money < 145000 && s.money > 140000},
    {id:30,type:"NORMAL",title:"【永恒的异乡人】",desc:"你在美国生活了很多年，但始终没有归属感。你既无法完全融入美国社会，也回不去记忆中的故乡。",egg:"牢A：故乡容不下肉身，他乡容不下灵魂。",condition:(s,f)=>s.social<30 && s.spirit<40 && !f.hasReturnIdea},
    {id:31,type:"NORMAL",title:"【人生过客·碌碌无为】",desc:"你没有达成任何好结局条件，也没有跌入坏结局深渊，只是在生存线上浮沉，资金、健康、精神都平平无奇，一生碌碌无为，来去无痕。【终极兜底】",egg:"牢A：大多数人，都是人间的过客，悄无声息的来，悄无声息的走。",condition:()=>true}
];
