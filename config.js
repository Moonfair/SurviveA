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
        isUnderKillLine: "当前是否处于斩杀线下",
        inMedical: "医疗流程中",
        sickStartTurn: "生病开始回合",
        hasBlackClinicInfo: "拥有黑诊所名片",
        hasHighClinicInfo: "拥有私人诊所名片",
        blackClinic: "去了黑诊所",
        hadSurgery: "已完成手术",
        insuranceDenied: "保险拒赔",
        debtCollectorHarass: "债务催收骚扰",
        inLawsuit: "诉讼中",
        hasAppliedLoan: "已申请贷款",
        hasBankruptcy: "已申请破产",
        overtimeCount: "加班次数",
        burnedOut: "职业倦怠",
        drugDependency: "药物依赖",
        quit: "已辞职",
        underSurveillance: "工作监控中",
        troubleMaker: "被标记为问题员工",
        jobHunting: "正在找工作",
        survivedLayoff: "裁员幸存",
        rentIncreased: "房租上涨",
        lookingForCheaperPlace: "寻找更便宜住处",
        receivedEvictionNotice: "收到驱逐通知",
        hasRoommate: "有室友",
        roommateRisk: "室友有问题",
        roommateConflict: "室友冲突",
        landlordRetaliating: "房东报复",
        hasTenantsUnion: "加入租户工会",
        livingInCar: "住在车里",
        isHomeless: "无家可归",
        receivedInheritance: "收到遗产",
        hasDisability: "有残疾",
        identityStolen: "身份被盗",
        creditDestroyed: "信用彻底毁灭",
        disasterVictim: "灾难受害者",
        homelessRewarded: "流浪汉报恩",
        helpedHomelessCount: "帮助流浪汉次数",
        useDragTimes: "使用止痛药次数",
        loanSharkDebt: "高利贷债务",
        owedParents: "欠父母钱",
        lentMoneyToFriend: "借钱给朋友",
        onLeave: "本月请假中"
    }
};
const STATUS_MAP = [
    { key: "health", name: "健康", cls: "health-bar" },
    { key: "spirit", name: "精神", cls: "spirit-bar" },
    { key: "money", name: "资金(美金)", cls: "money-bar" },
    { key: "credit", name: "信用", cls: "credit-bar" },
    { key: "social", name: "人脉", cls: "social-bar" },
    { key: "income", name: "收入(美金/月)", cls: "income-bar" }
];

// ===================== Buff/Debuff配置 =====================
const BUFF_CONFIG = {
    // 示例1：中毒debuff - 每回合持续扣血
    poisoned: {
        name: "🦠 中毒",
        onTick: {health: -5, spirit: -3}  // 每回合执行的效果
    },
    
    // 示例2：治疗buff - 每回合恢复生命
    regeneration: {
        name: "❤️ 治疗",
        onTick: {health: +3, spirit: +2}
    },
    
    // 示例3：加薪 buff - 每回合增加收入
    salaryBoost: {
        name: "💰 加薪",
        onTick: {income: +200}
    },
    
    // 示例4：压力 debuff - 每回合扣精神
    stressed: {
        name: "😓 压力山大",
        onTick: {spirit: -5}
    },
    
    // 示例5：动态buff - 根据游戏状态计算效果
    debtPressure: {
        name: "💸 债务压力",
        onTick: (gs) => {
            const pressure = gs.currentStatus.money < 50000 ? -10 : -5;
            return {spirit: pressure, health: -2};
        }
    },
    
    // 病痛
    sack: {
        name: "病痛",
        onTick: {spirit: -5, health: -5}
    }
};


const EVENT_LIST = [
    // ===================== 医疗线 =====================
    // 挂号
    {
        id:101, 
        title:"你生病了!", 
        triggerFlag:(gs)=> !gs.customFlag.inMedical,
        maxtimes:1,
        weight: (gs) => 10 + 50 * ((GAME_CONFIG.maxVal - gs.currentStatus.health) * 1.0 / GAME_CONFIG.maxVal),
        desc:"身体的病痛正折磨着你，你不得不打通了医院的电话。电话在长久的拨号声后终于接通，对面传来喘杂的噪声。接起来电话的是个不耐烦的中年护士，她几乎是吹毛求疵地要求你相近地描述症状。你决定：", 
        options:[
            {text:"强忍不适，尽可能详细描述病情", effect:{spirit:-3, scheduleEvent: {eventId: 102, turnsLater: 3}}, resultText: "护士总算是勉强表示她听懂了，告诉你 3 个月后再来。"},
            {text:"不耐烦地草草描述病情", effect:{spirit:-7, scheduleEvent: {eventId: 102, turnsLater: 5}}, resultText: "护士显得比你还要烦躁，最终告诉你 5 个月后再来。"},
            {text:"使用专业术语，精准描述病情", effect:{spirit:-3, scheduleEvent: {eventId: 102, turnsLater: 2}}, resultText: "护士显然是愣了一下，告诉你 2 个月后再来。"}
        ],
        setFlag: {inMedical: true, sickStartTurn: (gs) => gs.currentTurn},
        effect: {addBuff: {sack: 999}} // 持续病痛debuff
    },
    // 诊断
    {
        id:102, 
        title:"诊断", 
        triggerFlag:(gs)=> gs.customFlag.inMedical,
        maxtimes:1,
        weight: 0,
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
        triggerFlag:(gs)=> gs.customFlag.inMedical,
        maxtimes:1,
        weight: 0,
        desc:"又是几个月过去，你终于你带着CT结果回到医生面前。医生仔细端详了片子和化验结果，告知你需要进行一台手术。然而排队的人很多，最近的一台也要等到6个月后。医生耸耸肩，“如果运气好，也有可能提前安排。我先给你开一些止痛药，实在坚持不了就吃两片顶一顶。”你决定：", 
        options:[
            {text:"默默接受", resultText: "你知道现实确实如此，甚至6个月已经算是很短的时间。你只能默默接受这个安排，祈祷自己能够活着等到手术日期。"},
            {text:"去黑诊所", triggerFlag:(gs)=> {return gs.customFlag.hasBlackClinicInfo}, tip:"需要黑诊所名片", setFlag:{blackClinic:true}, resultText: "手术的排期实在是太靠后了，你不确定自己是否还能坚持到那个时候。“不能这么听天由命！”你暗自决定去黑诊所碰碰运气。"},
            {text:"去私人诊所", triggerFlag:(gs)=> {return gs.customFlag.hasHighClinicInfo}, tip:"需要私人诊所名片", effect:{money:-200000, health:+100}, setFlag:{inMedical:false}, resultText: "你咬咬牙，决定花重金去私人诊所进行手术。虽然价格昂贵，但至少能保证自己活下来。手术非常成功，你的身体状况大幅好转。" },
        ]
    },
    // ===================== 医疗线续 =====================
    // 手术的结果
    {
        id:104, 
        title:"手术的结果", 
        triggerFlag:(gs)=> gs.customFlag.inMedical && !gs.customFlag.hadSurgery,
        maxtimes:1,
        weight: 0,
        desc:"漫长的等待终于结束了。手术当天，你被推进冰冷的手术室，刺眼的无影灯晃得你睁不开眼。麻醉师冷漠地说：“数到十。”你数到三就失去了意识。醒来时，你感到一阵剧痛。护士告诉你手术基本成功，但需要观察48小时。出院时，你拿到了一叠厚厚的账单。你决定：", 
        options:[
            {text:"查看账单金额", effect:{money:-85000, spirit:-10, health:+30}, resultText: "$85,000。你的视线模糊了。即使有保险，自付额也高达$15,000。更可怕的是，保险公司还没有批准理赔。你抱着账单，不知该哭还是该笑——手术救了你的命，账单可能要了你的命。", setFlag:{hadSurgery:true}},
            {text:"先回家休养，以后再说", effect:{spirit:-7, health:+25}, resultText: "你把账单塞进抽屉，告诉自己船到桥头自然直。现在你只想好好休息，让伤口愈合。至于钱的问题......以后再说吧。反正欠债的又不止你一个。", setFlag:{hadSurgery:true}}
        ]
    },
    // 保险公司的拒赔
    {
        id:105, 
        title:"保险公司的拒赔", 
        triggerFlag:(gs)=> gs.customFlag.hadSurgery && gs.currentStatus.money < 100000 && !gs.customFlag.insuranceDenied,
        maxtimes:1,
        weight: (gs) => 30,
        desc:"两周后，你收到保险公司的一封信。拆开一看，是理赔拒绝通知。理由是：“该病症属于保单生效前已存在的健康状况（pre-existing condition），根据条款第37.B款，不予赔付。”你愣住了——你从未被诊断过这个病，怎么就“已存在”了？客服电话永远占线，邮件石沉大海。你决定：", 
        options:[
            {text:"聘请律师上诉", effect:{money:-8000, spirit:-15}, resultText: "你咬牙花$8,000聘请了专门打保险官司的律师。律师翻着你的病历，漫不经心地说：“这种案子很常见，保险公司就是赌你不会上诉。我们有60%的胜算，不过流程可能要拖18个月。”你听着，感觉像是又跳进了另一个无底洞。", setFlag:{insuranceDenied:true, inLawsuit:true}},
            {text:"申请医疗贷款", effect:{money:+70000, credit:-25, spirit:-10}, resultText: "你填写了无数表格，提交了所有隐私信息，终于获批一笔医疗贷款。年利率12.5%，还款期10年，每月$1,100。签字的瞬间，你仿佛听见锁链扣紧的声音——从今往后，你就是债务的奴隶了。", setFlag:{insuranceDenied:true, hasAppliedLoan:true}},
            {text:"和医院协商分期付款", effect:{credit:-15, spirit:-7}, resultText: "医院的财务部门“很通融”地同意了36个月分期，不收利息。但每月$2,400的还款额让你喘不过气。而且一旦违约，全额债务立即到期，外加30%的罚金。你点头同意，不是因为接受，而是因为别无选择。", setFlag:{insuranceDenied:true}}
        ]
    },
    // 债务催收的骚扰
    {
        id:106, 
        title:"债务催收的骚扰", 
        triggerFlag:(gs)=> gs.customFlag.insuranceDenied && gs.currentStatus.credit < 60 && !gs.customFlag.debtCollectorHarass,
        maxtimes:1,
        weight: (gs) => 25,
        desc:"医疗债务被转卖给了催收公司。从此，你的电话一天响20次。陌生号码、自动语音、真人威胁，轮番轰炸。“我们已经掌握了你的工作地址，将派员登门拜访。”“不还款将影响你的信用记录，你将无法贷款买车买房。”有一次，催收员甚至打给了你的上司。你的信用分数已经跌到了500分以下。你决定：", 
        options:[
            {text:"支付最低额，换取暂时的安宁", effect:{money:-5000, spirit:+5}, resultText: "你转账了$5,000，催收员的语气立刻变得“友善”起来：“非常感谢您的配合，我们会在系统中更新您的还款记录。”电话安静了一周，然后又开始了。你意识到，这只是饮鸩止渴。", setFlag:{debtCollectorHarass:true}},
            {text:"申请个人破产保护", effect:{credit:-60, job:-15, spirit:-18}, resultText: "律师告诉你，个人破产能让你摆脱债务，但代价是信用记录彻底毁灭，7年内无法贷款，求职背景调查会显示破产记录。你签下文件，感觉自己像是在自己的墓碑上刻字。", setFlag:{debtCollectorHarass:true, hasBankruptcy:true}},
            {text:"换号码，能躲多久是多久", effect:{spirit:-7, credit:-20}, resultText: "你换了手机号，告诉自己“眼不见心不烦”。但催收公司早就掌握了你的所有信息——工作地址、家庭住址、亲友联系方式。两周后，你的新号码又开始响个不停。你无处可逃。", setFlag:{debtCollectorHarass:true}}
        ]
    },
    
    // ===================== 工作线 =====================
    {
        id:111, 
        title:"漏洞百出", 
        triggerFlag:(gs)=> gs.currentStatus.spirit < 60 ,
        weight: (gs) => 40 * ((GAME_CONFIG.maxVal - gs.currentStatus.spirit) * 1.0 / GAME_CONFIG.maxVal),
        desc:"一觉醒来，你发现自己头痛欲裂，哈欠连天。强撑着来到公司，不到一小时的时间里已经犯了好几个低级错误。老板把你叫到办公室，严肃地说：“你今天的状态不太对，要不要考虑请个假好好休息一下？”你决定：", 
        options:[
            {text:"请假休息",effect:{job:-10, spirit:+10}, setFlag:{onLeave:true}, resultText: "你实在顶不住了，决定请假休息一天。至于堆积的工作、同事的挤兑、老板的不满......你都无暇顾及了。你只想好好睡一觉。本月收入将不会发放。"},
            {text:"使用强化剂",effect:{spirit:+10, job:+5, money:-1000}, resultText: "你敏锐的察觉到老板的不满——他并不是真的希望你休息，而是在暗暗敲打你的工作状态。你知道再不做出些改变，你可能会永远失去这份薪水并不丰厚的工作。你来到楼下的便利店忍痛买了根强化剂。喝下的瞬间，你一下摆脱了疲劳，也失去了些别的什么东西......"},
            {text:"强撑",effect:{spirit:-10, job:-5}, resultText: "你不敢请假，也不想成为天天依靠强化剂的毒狗，只能咬咬牙强撑下去。即使如此，你还是错漏百出，不得不花加倍的时间来完成工作。终于，在凌晨3点钟，你拖着疲惫的身躯走出了空无一人的办公室。"},
        ]
    },
    {
        id:112, 
        title:"晋升风波", 
        triggerFlag:(gs)=> gs.currentStatus.job > 60 ,
        maxtimes:1,
        desc:"公司的绩效周期到了，你被提名为本季度的晋升候选人之一。经过漫长的准备和严格的面试，你终于等来了结果公布的日子，却只等来现实一个大大的比斗。事后你通过同事打听到晋升的人选，是组里那个整日不学无术只会溜须拍马的家伙。你决定：", 
        options:[
            {text:"忍气吞声",effect:{spirit:-7}, resultText: "你决定忍气吞声——和这种小人计较永远没有好处，大不了等下次再晋升也是一样。退一步越想越气，你感觉今天的工作都不在状态，回家猛灌一瓶啤酒便沉沉睡下。"},
            {text:"检举揭发",effect:{job:-10}, resultText: "你觉得忍无可忍，于是向HR举报了他可能存在舞弊行为。HR礼貌的结果申请，并告诉你会秉公调查，有了结果再联系你。一个月过去了，你没有收到任何结果，反而觉得同事们都有意无意地疏远你。"},
            {text:"同流合污",effect:{job:+10, income:+100}, resultText: "你知道对于这种混的风生水起的人，检举揭发并不能解决问题，但是如果你与他打好关系，说不定还能喝到口汤。于是你强忍着恶心与他称兄道弟，果然做出了不少业绩。你的收入也有所增加。"},
        ]
    },
    {
        id:113, 
        title:"兔死狐悲", 
        triggerFlag:(gs)=> gs.currentStatus.job > 60 ,
        maxtimes:1,
        desc:"早上八点，你准时坐进工位。扭头看看，距离邻座的小张被救护车拉走已经过去了两天，你不禁暗自担心起来 —— 眼看版本日快到了，他再不回来的话，功能可不就得我来做了吗。正当你如此想着的时候，HR召集大家来到了会议室，神情自若的宣布了小张的死讯，并警告大家不要向外透露。你决定：", 
        options:[
            {text:"当作无事发生",effect:{job:+5}, resultText: "总有人来来走走，这对你来说已是司空见惯。走在路上，你不禁烦恼小张留下的功能 —— 看来是要砸到你的头上了。起在这片土地上，死亡从来不是什么稀罕事。"},
            {text:"去小张家看望",effect:{spirit:-3}, resultText: "不论如何，小张和你也是同事多年，你决定去他家看望一下，和他做最后的告别。你为他的家人送上了告慰。看着冰冷的小张，你不禁升起一丝悲凉 —— 或许哪天，躺着的就会换成自己。"},
            {text:"匿名发布到永永",effect:{spirit:+5}, resultText: "“今天公司又有人猝死了...”你这样编辑着，偷偷把内容匿名发布到了永永。虽然知道不应该，但你还是无法抵制一时成为话题焦点的诱惑，“其他人有权知道！” 你这样想着。"},
        ]
    },
    // 燃烧殆尽
    {
        id:114, 
        title:"燃烧殆尽", 
        triggerFlag:(gs)=> (gs.customFlag.overtimeCount >= 2 && gs.currentStatus.spirit < 50) || gs.customFlag.burnedOut,
        maxtimes:1,
        desc:"你已经连续加班两个月了。今天早上，你盯着天花板，发现自己无法起床。不是身体不能动，而是大脑在拒绝——“为什么？为什么要起来？工作有什么意义？”你迟到了两个小时才到公司，整个上午都坐在工位上发呆，什么也做不了。同事们窃窃私语，老板的目光如芒在背。你已经燃烧殆尽了。你决定：", 
        options:[
            {text:"申请心理健康假期", effect:{job:-15, spirit:+20, money:-2000}, setFlag:{burnedOut:true, onLeave:true}, resultText: "你鼓起勇气向HR提出申请。HR给你一个充满怀疑的眼神：“心理健康假期？我们公司没有这个政策。不过你可以用你的病假额度。”你用掉了仅有的5天病假，在家躺了一周，什么也没做，只是盯着天花板发呆。回到公司后，你发现自己的项目已经被分给了别人。本月收入将不会发放。"},
            {text:"依靠咖啡因和刺激物硬撑", effect:{health:-20, spirit:-7, job:+10}, resultText: "你开始每天喝6杯咖啡，午休时吞下能量药丸。晚上失眠时服用安眠药，早上起不来时喝强化剂。你变成了一个靠化学物质维持运转的机器。老板表扬你“最近状态很好”，而你的手开始控制不住地颤抖。", setFlag:{burnedOut:true, drugDependency:true}},
            {text:"辞职，哪怕没有下家", effect:{job:-50, spirit:-10, money:-10000, income:-500}, resultText: "你在一个普通的周二下午，突然站起来，走进老板办公室，说：“我不干了。”老板愣了一下，然后笑了：“想清楚了？市场上可没那么多工作。”你还是走了出去，清空工位，头也不回地离开。走出大楼的那一刻，你深吸一口气，感觉到了久违的……解脱。至于明天怎么办？明天再说吧。你失去了工作，收入归零。", setFlag:{burnedOut:true, quit:true}}
        ]
    },
    // 无处不在的监控
    {
        id:115, 
        title:"无处不在的监控", 
        triggerFlag:(gs)=> gs.currentStatus.job > 60 && !gs.customFlag.underSurveillance,
        maxtimes:1,
        weight: 20,
        desc:"公司新安装了“生产力监控系统”。IT部门群发邮件：该软件将记录你的所有击键、屏幕截图（每5分钟一次）、网页浏览记录、应用使用时长，以及“工作效率评分”。邮件最后一句是：“这是为了帮助大家提高工作效率。”你的电脑右下角出现了一个小小的红点，一直在闪烁。老大哥在看着你。你决定：", 
        options:[
            {text:"接受现实，自我审查", effect:{spirit:-10, job:+5}, resultText: "你开始变得神经质：不敢打开与工作无关的网页，不敢超过8分钟的厕所时间，不敢在座位上发呆超过30秒。你把手机藏起来，午休时也假装在查阅邮件。你的“效率评分”上升到了92分，老板很满意。你感觉自己不再是个人，而是一个被优化的数据点。", setFlag:{underSurveillance:true}},
            {text:"向HR投诉这种做法", effect:{job:-20, social:-10, spirit:-7}, resultText: "你约见了HR，表达了对隐私侵犯的担忧。HR微笑着说：“你签署的劳动合同第15条已经授权公司进行必要的工作监控。如果你觉得不适应我们的企业文化，我们完全理解。”一周后，你的项目负责人找你谈话，暗示你“态度有问题”。你的名字出现在了“不配合员工”的内部名单上。", setFlag:{underSurveillance:true, troubleMaker:true}},
            {text:"开始偷偷找下家", effect:{spirit:-3, social:+5}, resultText: "你学会了用手机投简历，在厕所里打电话面试，删除浏览器历史记录。你变成了一个间谍，在自己的工作场所潜伏。每次看到屏幕右下角的红点，你都提醒自己：“忍耐，快了，很快就能逃出去了。”但你也知道，下一家公司多半也有类似的监控。", setFlag:{underSurveillance:true, jobHunting:true}}
        ]
    },
    // 大裁员的幸存者
    {
        id:116, 
        title:"大裁员的幸存者", 
        triggerFlag:(gs)=> gs.currentStatus.job < 70 && !gs.customFlag.survivedLayoff,
        maxtimes:1,
        weight: 25,
        desc:"CEO在全员会议上宣布：“为了应对市场挑战，公司将进行组织优化，优化比例为30%。”会议室一片死寂。接下来的两周，办公室变成了战场。同事们互相提防，拼命表现自己的价值，揭露别人的“划水”行为。HR开始一对一约谈。你每天早上醒来都在想：今天会是我吗？你决定：", 
        options:[
            {text:"主动加班，做更多项目", effect:{health:-15, spirit:-7, job:+15}, resultText: "你每天第一个到公司，最后一个离开，周末也主动来加班。你给老板发日报、周报，事无巨细地展示自己的工作量。你的“生存本能”被激活了——像困兽一样拼命撕咬。", dynamicEffect:(gs)=>{const survive=Math.random()>0.35; if(survive){return {spirit:+15};}else{return{job:-60, money:+15000, spirit:-20};}}, setFlag:{survivedLayoff:true}},
            {text:"疯狂社交，证明自己有人脉价值", effect:{social:+10, spirit:-10, money:-3000}, resultText: "你开始和每个人套近乎，请同事喝咖啡，给老板的老板发邮件“汇报工作”，在公司社交活动上强颜欢笑。你花钱请客吃饭，只为了让别人记住你的名字。你变成了一个社交机器，笑容都是假的。", dynamicEffect:(gs)=>{const survive=Math.random()>0.45; if(survive){return {spirit:+10};}else{return{job:-60, money:+12000, spirit:-25};}}, setFlag:{survivedLayoff:true}},
            {text:"默默更新简历，做两手准备", effect:{spirit:-7}, resultText: "你一边假装镇定地工作，一边偷偷投简历。你知道，在这种恐慌氛围里，过度表现反而可能引起怀疑。你保持低调，不参与办公室政治，暗暗等待结果。", dynamicEffect:(gs)=>{const survive=Math.random()>0.5; if(survive){return {spirit:+5};}else{return{job:-60, money:+10000, spirit:-18};}}, setFlag:{survivedLayoff:true}}
        ]
    },
    
    // ===================== 房租危机线 =====================
    // 房租暴涨通知
    {
        id:201, 
        title:"房租暴涨通知", 
        triggerFlag:(gs)=> !gs.customFlag.rentIncreased && gs.currentStatus.money < 120000,
        maxtimes:1,
        weight: 30,
        desc:"房东发来一封邮件，标题是“租约更新通知”。你打开一看，月租金从$2,000涨到了$2,800——涨幅40%。邮件用礼貌的语言解释：“鉴于市场租金普遍上涨，本次调整符合市场行情。如您不接受新租金，请在30天内搬离。祝生活愉快！”你算了算，搬家的成本（中介费、押金、搬运费）至少$5,000，而且附近的租金也都差不多。你被困住了。你决定：", 
        options:[
            {text:"接受涨价，继续住下去", effect:{money:-5000, spirit:-10}, resultText: "你咬牙签下了新租约。从今往后，每个月要多支出$800，一年就是$9,600。你计算着自己的银行账户，感觉墙壁正在缓缓合拢，压缩你的生存空间。房东在邮件里感谢你的“理解和配合”。", setFlag:{rentIncreased:true}},
            {text:"尝试和房东谈判", effect:{spirit:-7}, resultText: "你回复邮件，诚恳地说明自己的财务困难，希望房东能少涨一点。房东回复了一个模板化的答复：“我们理解您的处境，但租金调整是根据市场行情制定的。我们相信您能理解。”谈判失败。要么接受，要么搬走。", dynamicEffect:(gs)=>{const success=Math.random()<0.15; if(success){gs.customFlag.rentIncreased=true; return{money:-3000, spirit:+5};}else{return{scheduleEvent:{eventId:202, turnsLater:1}, spirit:-3};}}},
            {text:"开始找更便宜的房子", effect:{spirit:-10, money:-1500}, resultText: "你在租房网站上刷了三天三夜，看了无数又小又破的房子。那些便宜的房子都在犯罪率高的区，或者离公司要通勤2小时，或者合租室友是个“性格古怪”的陌生人。你感到绝望——这座城市，已经没有穷人的容身之地了。", setFlag:{lookingForCheaperPlace:true}}
        ]
    },
    // 三十天驱逐通知
    {
        id:202, 
        title:"三十天驱逐通知", 
        triggerFlag:(gs)=> (gs.currentStatus.money < 60000) || (gs.customFlag.rentIncreased && gs.currentStatus.money < 80000),
        maxtimes:1,
        weight: 0,
        desc:"门缝里塞进来一张正式的法律文件：《三十日驱逐通知》。文件上写着你拖欠了两个月的房租，共计$5,600，要求你在30天内支付全额租金外加$500滞纳金，否则将启动法律程序强制驱逐。文件最后一行：“届时警长办公室将协助执行驱逐，你的个人物品将被移出房产。”你的手在颤抖。你决定：", 
        options:[
            {text:"向亲友借钱交租", effect:{social:-15, spirit:-15, money:+6100}, resultText: "你拨通了远在国内的父母的电话，支支吾吾地说明情况。电话那头沉默了很久，最后你母亲说：“我们给你转5000美元，但这是我们的养老钱......你要争气啊。”你挂掉电话，泪流满面。你用这笔钱保住了住所，但代价是无法偿还的愧疚。", setFlag:{receivedEvictionNotice:false, owedParents:true}},
            {text:"向高利贷公司借款", effect:{money:+6500, credit:-30, spirit:-18}, resultText: "你在网上找到一家“快速现金贷款”公司，利率月息8%，但不查信用记录。你签下合同，拿到钱，交了房租。现在你每个月要还$700的利息，本金还没开始还。你知道自己跳进了更深的坑，但你别无选择。", setFlag:{receivedEvictionNotice:false, loanSharkDebt:true}},
            {text:"紧急寻找室友分担房租", effect:{spirit:-7, social:-5}, resultText: "你在Craigslist上发布了找室友的广告，收到了几十个回复。你没时间仔细筛选，只能选了个看起来“还行”的人。对方搬进来的当天，你就意识到自己可能做了一个错误的决定——他的行李箱里散发出奇怪的味道。", setFlag:{receivedEvictionNotice:false, hasRoommate:true, roommateRisk:true}}
        ]
    },
    // 室友的噩梦
    {
        id:203, 
        title:"室友的噩梦", 
        triggerFlag:(gs)=> gs.customFlag.hasRoommate && gs.customFlag.roommateRisk,
        maxtimes:1,
        weight: 40,
        desc:"你的室友问题爆发了。他深夜开派对，音乐震天响；他从不打扫卫生，厨房堆满发霉的餐具；他“忘记”支付自己那份水电费；你怀疑他在房间里搞些不合法的生意，因为经常有陌生人深夜来敲门。房东开始给你发警告邮件。你发现自己为了省钱找的室友，可能会让你失去住处。你决定：", 
        options:[
            {text:"正面对质，要求他搬走", effect:{spirit:-10}, resultText: "你终于忍无可忍，和他大吵了一架。他冷笑着说：“租约上可是写着我的名字，凭什么让我走？”第二天，你发现自己的笔记本电脑不见了。你报了警，警察做了笔录，说“会调查”，然后就再也没有消息。", dynamicEffect:(gs)=>{const success=Math.random()<0.3; if(success){return{money:-2000, social:-10};}else{return{health:-10, money:-3000, spirit:-10};}}, setFlag:{roommateConflict:true}},
            {text:"忍气吞声，暗暗寻找新住处", effect:{health:-10, spirit:-15}, resultText: "你选择忍耐，把卧室门反锁，戴着耳塞睡觉，避免和室友正面冲突。但每天回家都像进入敌区，你的精神和健康都在恶化。你在网上看房，但房租更贵的地方你住不起，房租便宜的地方更危险。你被困住了。", setFlag:{roommateConflict:true}},
            {text:"破釜沉舟，违约搬走", effect:{money:-4000, credit:-20, spirit:-7}, resultText: "你和房东协商提前终止租约。房东扣掉了你的押金($2,000)，还要你支付违约金($2,000)。你咬牙认了，收拾行李，搬进了一间更小更远的房子。新房子的窗户外就是高速公路，24小时车声轰鸣，但至少你逃离了那个室友。", setFlag:{roommateConflict:false, hasRoommate:false}}
        ]
    },
    // 房东的报复
    {
        id:204, 
        title:"房东的报复", 
        triggerFlag:(gs)=> (gs.customFlag.rentIncreased || gs.customFlag.receivedEvictionNotice) && gs.currentStatus.social > 40,
        maxtimes:1,
        weight: 15,
        desc:"你向市政府的租户权益部门投诉了房东的违规行为——拖延修理漏水问题、不提供采暖、无理扣留押金。投诉生效了，政府要求房东整改。但第二天，房东开始了报复：他突然宣布要”检查房屋状况“，每周来一次，每次都鸡蛋里挑骨头。他给邻居们发信说你是“麻烦租户”。他以“违反租约”为由，威胁要起诉你。你意识到，穷人是没有资格维权的。你决定：", 
        options:[
            {text:"聘请律师反击", effect:{money:-5000, spirit:-15}, resultText: "你找到一位租户权益律师，每小时收费$300。律师帮你写了一封律师函，警告房东停止骚扰。房东收手了，但你也花光了积蓄。律师告诉你：“这种案子很难赢，房东有的是时间和钱耗着你。”你赢了这场battle，但正在输掉这场war。", setFlag:{landlordRetaliating:false}},
            {text:"联系租户权益组织求助", effect:{social:+10, spirit:-3}, resultText: "你加入了一个租户互助组织，他们教你如何记录房东的违法行为，如何应对骚扰。他们甚至帮你组织了其他租户一起向房东施压。你第一次感受到，一个人是弱小的，但团结起来，或许还有一线希望。", setFlag:{landlordRetaliating:false, hasTenantsUnion:true}},
            {text:"算了，搬走结束这一切", effect:{spirit:-10, money:-3000}, resultText: "你受够了这无休止的斗争。你放弃了押金，放弃了维权，放弃了原则，搬走了。房东赢了。你发誓再也不投诉任何人，因为在这个系统里，维权的代价比忍受更高。这就是美国给你上的一课。", setFlag:{landlordRetaliating:false}}
        ]
    },
    // 流落街头
    {
        id:205, 
        title:"流落街头", 
        triggerFlag:(gs)=> gs.customFlag.receivedEvictionNotice && gs.currentStatus.money < 40000,
        maxtimes:1,
        weight: 0,
        desc:"驱逐日到了。警长和房东站在门口，冷漠地看着你把最后一箱东西搬出来。你的家当堆在人行道上：一个行李箱、几个纸箱、一台旧笔记本。路人匆匆走过，没人停下来看你一眼。你站在街头，突然意识到——你无家可归了。太阳西沉，夜晚即将到来，你需要找个地方睡觉。你决定：", 
        options:[
            {text:"睡在车里（如果有车）", effect:{health:-15, spirit:-15, money:-500}, resultText: "你把车停在沃尔玛的停车场，这是流浪者的惯例——沃尔玛通常不赶人。你蜷缩在后座上，用外套当被子，试图入睡。凌晨两点，保安敲你的车窗：“你不能睡在这儿。”你启动车子，开往下一个地方。天亮前，你被驱赶了三次。", setFlag:{livingInCar:true}},
            {text:"去流浪者收容所", effect:{health:-10, spirit:-18}, resultText: "收容所的床位要抽签决定，今晚你没抽到。你只能在大厅的椅子上坐到天亮。周围的人有的在大声自言自语，有的在咳嗽，空气中弥漫着汗味、尿味和绝望的味道。你的背包要一直抱在怀里，因为这里经常有人偷东西。你一夜未眠，盯着墙上的标语：“每个人都值得有尊严。”你苦笑。", setFlag:{isHomeless:true}},
            {text:"在公园或街头过夜", effect:{health:-25, spirit:-22}, resultText: "你在公园找了个长椅躺下，把行李箱当枕头。半夜，几个醉汉路过，朝你扔酒瓶。你不敢睡着，因为听说有流浪者在睡梦中被袭击。凌晨四点，警察来了，用手电筒照着你的脸：“这里不能过夜，走吧。”你拖着疲惫的身体，继续寻找下一个可以躺下的地方。这座城市里，穷人连睡觉的地方都没有。", setFlag:{isHomeless:true}, dynamicEffect:(gs)=>{const attacked=Math.random()<0.25; if(attacked){return{health:-15, money:-200};}else{return{};}}}
        ]
    },
    
    // ===================== 唯一事件 =====================
    // 流浪汉的报恩
    {
        id:601, 
        title:"流浪汉的报恩", 
        triggerFlag:(gs)=> !gs.customFlag.homelessRewarded,
        desc:"“好心的先生，请等一下！”流浪汉叫住了正准备离开的你，“感谢您慷慨的帮助，让我挺过了最艰难的时期。我这儿有一些好东西，希望能够帮到您！”说着他打开了脏兮兮的包裹。你选择：", 
        weight: 0,        
        options:[
            {text:"一张黑诊所的名片", setFlag: {hasBlackClinicInfo: true}, resultText: "你选择了一张记录了一家黑诊所地址和联系方式的名片。或许哪天你能用得上它。"},
            {text:"一支特效强化剂", effect:{spirit:+15}, resultText: "你选择了一支看起来很高级的强化剂。你迫不及待地服用了它，顿时感觉精神焕发，整个人都轻松了许多。"},
            {text:"不要了，走了", effect:{spirit:+15}, resultText: "你选择拒绝了他的“好意”，匆匆转身离开了。“这样的‘好东西’我可消受不起！”"},
        ],
        setFlag: {homelessRewarded: true}
    },
    // 意外的遗产
    {
        id:701, 
        title:"意外的遗产", 
        triggerFlag:(gs)=> gs.currentStatus.money < 100000 && !gs.customFlag.receivedInheritance,
        maxtimes:1,
        weight: 3,
        desc:"你接到律师的电话，通知你一位远房亲戚去世了，在遗嘱里给你留了一笔钱——$50,000。你甚至不记得有这样一位亲戚。律师冷冰冰地说：“请在三个工作日内来办公室签署文件，逾期视为放弃继承权。”你有复杂的心情：有人死去，你才能得到这笔救命钱。这是悲伤还是幸运？你决定：", 
        options:[
            {text:"接受遗产", effect:{money:+50000, spirit:-7}, resultText: "你签下文件，$50,000到账了。你用这笔钱还了一部分债务，终于能喘口气。但每次花这笔钱，你都会想起那位素未谋面的亲戚，以及他/她孤独的死亡。在美国，生命和金钱就是这样残酷地划上等号。", setFlag:{receivedInheritance:true}}
        ]
    },
    // 车祸与残疾
    {
        id:702, 
        title:"车祸与残疾", 
        triggerFlag:(gs)=> !gs.customFlag.hasDisability,
        maxtimes:1,
        weight: 2,
        desc:"绿灯，你踩下油门。一辆闯红灯的皮卡从侧面撞上了你的车。巨大的撞击声，玻璃碎裂，气囊弹出。你醒来时已经在医院，医生告诉你：“你的右腿粉碎性骨折，需要多次手术，至少6个月不能工作。”对方司机没有保险，而你的车损险只能赔偿$10,000。救护车费用$2,000，急诊$8,000，手术预估$110,000。你的世界瞬间崩塌。你决定：", 
        options:[
            {text:"申请残疾人补助", effect:{job:-40, spirit:-15, health:-25}, resultText: "你填写了厚厚一叠表格，申请“短期残疾补助”。每月能拿到$800，是你工资的30%。你躺在床上，看着积蓄一天天减少，账单一天天堆积，身体一天天虚弱。你在等待康复，但更像是在等待死亡。", setFlag:{hasDisability:true}, effect:{money:-110000}},
            {text:"向家人求助", effect:{social:-20, money:+60000, spirit:-22, health:-20}, resultText: "你打电话给国内的父母，说了实情。电话那头的哭声让你心如刀绞。父母变卖了老家的房子，凑了$60,000给你。你用这笔钱保住了性命，但失去了父母的退路。你知道，这辈子都无法补偿这份恩情。", setFlag:{hasDisability:true}, effect:{money:-50000}}
        ]
    },
    // 身份被盗用
    {
        id:703, 
        title:"身份被盗用", 
        triggerFlag:(gs)=> !gs.customFlag.identityStolen && gs.currentStatus.credit > 40,
        maxtimes:1,
        weight: 4,
        desc:"你的信用卡被盗刷了。更糟的是，有人用你的身份信息开了10张信用卡，申请了5笔贷款，买了一辆车，总欠款$80,000。你的信用评分从680跌到了320。你报警，警察说：“这种案子很多，我们会立案，但破案率很低。”你联系信用局，客服说：“您需要逐一联系每家银行，提供身份盗窃报告，走申诉流程，大概需要18-24个月。”你的人生被偷走了。你决定：", 
        options:[
            {text:"走正规申诉流程", effect:{credit:-50, spirit:-18, money:-3000}, resultText: "你打了无数个客服电话，填了无数份表格，寄了无数封挂号信。每个银行都要求你提供不同的证明文件。18个月后，你终于解决了大部分问题，但信用记录上的污点将跟随你7年。", setFlag:{identityStolen:true}},
            {text:"放弃信用，改用现金生活", effect:{spirit:-22, job:-10}, resultText: "你放弃了所有信用卡，注销了银行账户，改用现金和预付卡生活。你无法租房（房东要查信用），无法贷款买车，无法申请某些工作（背景调查会查信用）。你被排除在了主流经济系统之外，成为了金融体系里的幽灵。", setFlag:{identityStolen:true, creditDestroyed:true}}
        ]
    },
    // 自然灾害
    {
        id:704, 
        title:"自然灾害", 
        triggerFlag:(gs)=> !gs.customFlag.disasterVictim,
        maxtimes:1,
        weight: 2,
        desc:"飓风/山火/龙卷风（随机）袭击了你所在的地区。警报响起时，你只有15分钟撤离。你抓起一个背包，塞进护照、笔记本电脑和几件衣服，冲出门外。等灾难过去，你回到住处——只剩下一片废墟。你的一切都被摧毁了：家具、电器、衣物、纪念品、所有积累的物品。保险公司评估员看了看废墟，说：“很遗憾，这属于'不可抗力条款'，我们只能赔偿$5,000。”你的损失至少$40,000。FEMA送来了一箱罐头食品和一张$2,000的支票，祝你“早日重建家园” 。你决定：", 
        options:[
            {text:"接受现实，从头开始", effect:{money:-38000, spirit:-18, health:-10}, resultText: "你用FEMA的钱和保险公司的赔偿买了些基本生活用品，租了一间比以前小得多的房子，重新开始。你的财产积累瞬间清零，多年的努力化为灰烬。但至少你还活着，还能重新开始，虽然这个念头让你很难从绝望中找到安慰。", setFlag:{disasterVictim:true}},
            {text:"起诉保险公司", effect:{money:-8000, spirit:-22}, resultText: "你聘请律师，起诉保险公司拒赔。律师费每小时$400，取证、开庭、上诉......两年后，你输了官司。法官判决：”保险条款合法有效，驳回原告诉讼请求。“你不仅失去了家园，还失去了最后的希望。", setFlag:{disasterVictim:true}}
        ]
    },
    // ===================== 普通事件 =====================
    // 使用强化剂
    {
        id:901, 
        title:"病痛折磨着你！", 
        desc:"又是一个难熬的夜晚，身体的病痛考验着你的意志。想到明天堆积如山的工作，你更加无法入睡。你决定：", 
        triggerFlag:(gs)=> gs.customFlag.inMedical,
        weight: (gs) => 10 * Math.max(5, gs.currentTurn - gs.customFlag.sickStartTurn),
        options:[
            {text:"强迫自己入睡", effect:{spirit:-7, job:-5}, resultText: "你辗转反侧，强迫自己入睡。但收效甚微，第二天你哈欠连天，未能顺利完成工作。"},
            {text:"喝酒", effect:{money:-800}, resultText: "你灌下两杯烈酒，试图捱这个难挨的夜晚。酒精起到了一定的作用，但收效甚微，第二天你依然疲惫不堪。"},
            {text:"使用止痛药", effect:{spirit:+5, money:-1000}, resultText: "这种持续的折磨就像半夜飞来飞去的蚊子，让你实在无法忍受。你选择吃下两片止痛药，“反正两片的剂量，应该不会有什么大问题”，你这样想着，终于得以入睡。但是代价是什么呢？", setFlag: {useDragTimes: (gs) => (gs.customFlag.useDragTimes || 0) + 1} }
        ]
    },    
    // 流浪汉
    {
        id:902, 
        title:"流浪汉的求助", 
        desc:"你在街头遇到一个衣衫褴褛的流浪汉，他向你伸出手，低声请求一些钱来买食物。你决定：", 
        triggerFlag:(gs)=> !gs.customFlag.homelessRewarded,
        options:[
            {text:"给他一些钱", effect:{spirit:+5, money:-10}, setFlag: {helpedHomelessCount: (gs) => (gs.customFlag.helpedHomelessCount || 0) + 1}, dynamicEffect: (gs) => { if (gs.customFlag.helpedHomelessCount == 3) return {scheduleEvent: {eventId: 601, turnsLater: 1}}; return {};}, resultText: "“God bless you！”他连忙对你点头哈腰。你自觉帮助了他人的同时，内心也隐隐升起一阵莫名的庆幸，步伐中也带上些轻快和从容。"},
            {text:"快步走过", effect:{spirit:-3}, resultText: "你摇了摇头，快步离开。你知道，给了他钱也许并不能真正帮助到他，反而可能助长他的恶习。你心中隐隐有些愧疚，但更多的是对自己生活的担忧。"}
        ]
    },
    // 停车罚单的雪球
    {
        id:1001, 
        title:"停车罚单的雪球", 
        desc:"你在街边停了15分钟买咖啡，回来发现雨刷下夹着一张黄色罚单：$45。你以为不是什么大事，打算下个月发工资再交。但两周后，罚单变成了$145（加上$100滞纳金）。你还没交。再过一个月，市政府发来通知：“如不立即支付，将对车辆实施锁定(boot)，并可能拖走。”一张$45的罚单，如今欠费$295。你决定：", 
        weight: 20,
        options:[
            {text:"立刻支付罚单", effect:{money:-295, spirit:-10}, resultText: "你咬牙支付了$295，心疼到无法呼吸。你这个月的伙食费又要缩水了。你发誓以后绝不再忽视任何罚单，但你知道，类似的陷阱还有无数个等着你。"},
            {text:"继续拖延，侥幸逃避", effect:{spirit:-7}, resultText: "你抱着侥幸心理，心想“也许他们不会真的锁车”。一周后，你下班回到停车场，发现车轮上装了一个巨大的黄色锁。旁边的告示牌写着：“解锁费$150，拖车费$350，罚单$295，总计$795，请在24小时内支付，否则车辆将被拖走并拍卖。”", dynamicEffect:(gs)=>{return {scheduleEvent:{eventId:1005, turnsLater:1}, spirit:-15};}}
        ]
    },
    // 牙科急诊
    {
        id:1002, 
        title:"牙科急诊", 
        desc:"你的牙齿突然剧痛，整个脸颊都肿了起来。你去看牙医，医生拍了X光，说：“牙根感染了，需要做根管治疗加牙冠，费用$3,200。如果不治疗，感染可能扩散到血液，那就不是牙的问题了，是命的问题。”你当然知道根管很重要，但$3,200对你来说是天文数字。医生又说：“或者你可以选择拔牙，只要$200，一劳永逸。”你决定：", 
        weight: 15,
        options:[
            {text:"忍痛支付根管治疗费", effect:{money:-3200, spirit:-10, health:+5}, resultText: "你刷了信用卡，做了根管治疗。牙保住了，但你的卡债又增加了$3,200。你算了算，按照最低还款额，这笔债要还3年，利息近$1,000。一颗牙的代价，是四个月的工资。"},
            {text:"拔掉算了，省钱", effect:{money:-200, health:-5, spirit:-7}, resultText: "你选择了拔牙。医生叹了口气，给你打了麻药，用钳子拔掉了那颗牙。你少了一颗磨牙，以后咀嚼会不太方便，笑起来也会露出缺口。但你省下了$3,000，虽然你知道，这是用健康和尊严换来的。"},
            {text:"暂时用止痛药撑着", effect:{health:-10, money:-50}, resultText: "你买了一大瓶止痛药，每天吃4颗，勉强压制疼痛。你告诉自己“再撑一个月，等发了奖金再去治”。但你心里清楚，感染不会等你发奖金。这是一场赌博，赌注是你的健康甚至生命。"}
        ]
    },
    // 朋友的求助
    {
        id:1003, 
        title:"朋友的求助", 
        desc:"朋友深夜发来消息：“兄弟，能借我$1,500吗？我妈住院了，我手头真的周转不开。下个月一定还你。”你知道他家里情况确实困难，他不是那种随便借钱的人。但你也知道，你自己的银行账户里只有$8,000，还要付房租、车贷、保险。而且说实话，借出去的钱，往往就回不来了。你决定：", 
        triggerFlag:(gs)=> gs.currentStatus.social > 30,
        weight: 18,
        options:[
            {text:"借给他$1,500", effect:{money:-1500, social:+10, spirit:+5}, resultText: "你转账了$1,500，说：“别急着还，你妈要紧。”朋友发来一连串感激的消息。你关掉手机，看着骤减的余额，心里有些不安，但也有些坦然——至少在这个冷漠的世界里，你还保留着一点人性。三个月后，朋友还了$500，说剩下的“再宽限一段时间”。你知道，那$1,000多半是要不回来了。", setFlag:{lentMoneyToFriend:true}},
            {text:"拒绝，保护自己", effect:{social:-15, spirit:-7}, resultText: "你回复：“兄弟，实在对不住，我最近也挺紧张的，真帮不上忙。”消息发出后，你盯着屏幕等待回复。他回了个“没事，我再想办法”，之后就没了下文。你知道，这段友谊可能就此结束了。但你也知道，在美国，生存才是第一位的，友情是奢侈品。"}
        ]
    },
    // 杂货店的震撼
    {
        id:1004, 
        title:"杂货店的震撼", 
        desc:"你推着购物车，按照往常的清单采购：鸡蛋、牛奶、面包、蔬菜、肉。结账时，收银员说：“$187。”你愣住了——上个月同样的东西才$132。你看着小票：鸡蛋从$4.5涨到$8一打，牛奶从$3.5涨到$5.5，牛肉从$12涨到$18一磅。收银员面无表情地等你付款，后面排队的人开始不耐烦。你的工资没涨，但所有东西都涨了。你决定：", 
        weight: 25,
        options:[
            {text:"照常购买，勒紧裤腰带", effect:{money:-187, spirit:-8}, resultText: "你刷了卡，拎着袋子走出超市。这意味着你这个月的娱乐预算要归零，下馆子是不可能了，连看电影都成了奢侈。你算了算，如果物价持续这样涨，你的积蓄最多还能撑8个月。"},
            {text:"改买便宜的替代品", effect:{money:-125, health:-8, spirit:-7}, resultText: "你把购物车里的东西换成了最便宜的版本：冷冻鸡肉代替新鲜的，白面包代替全麦，罐头蔬菜代替新鲜蔬菜。结账时$125，省了$60，但你知道这些食物的营养价值和口味都大打折扣。穷人连吃得健康的权利都没有。"},
            {text:"只买最基本的，其他不买", effect:{money:-85, health:-12, spirit:-10}, resultText: "你狠心放下了一半的商品，只买了最基本的主食：米、面、鸡蛋、冷冻蔬菜。肉、水果、零食、饮料全部放弃。结账$85，但你知道，接下来的一个月你要面对单调乏味、营养不良的饮食。生存和生活，从来都是两回事。"}
        ]
    },
    // 罚单雪球后续
    {
        id:1005, 
        title:"车被拖走了", 
        desc:"你的车被拖走了。拖车场的工作人员冷漠地告诉你：总欠费$795（罚单+滞纳金+锁车费+拖车费），外加每天$50的停车费。今天是第3天，你欠$945。如果7天内不取车，车将被拍卖。没有车，你无法上班；不上班，就没钱取车。这是一个死循环。你决定：", 
        weight: 0,
        options:[
            {text:"借钱取车", effect:{money:-945, social:-15, spirit:-15}, resultText: "你向能借的人都借了一遍，凑够了$945，取回了车。但你欠了一屁股人情债，还有几个人从此不再回复你的消息。你发动车子，握着方向盘的手在颤抖——一张$45的罚单，最终花了你$945和无数尊严。"},
            {text:"放弃车，找其他交通方式", effect:{spirit:-22, job:-15, health:-10}, resultText: "你放弃了那辆车，让它被拍卖。从此你靠公交、自行车和步行上下班，通勤时间从30分钟变成2小时。你每天早上5点起床，晚上9点到家，筋疲力尽。老板开始抱怨你总是迟到。你的生活质量断崖式下跌，但至少你不用再为这辆破车操心了。"}
        ]
    },
];

// ===================== 结局配置 =====================
const RESULT_LIST = [
    // 特殊结局：黑诊所死亡
    {id:22, resultType:"special", type:"BE", title:"化身高达", desc:"你顺利在黑诊所约到了一台手术，安心地打上麻药，在无影灯下躺下。但你再也没有睁开眼睛。你的器官将帮助其他人更好的活下去。", egg:"并非失踪，而是分散到更多人身体中。", condition:(gs)=>gs.customFlag.blackClinic},

    // 死亡结局：心衰
    {id:1, resultType:"special", type:"BE", title:"钢铁丛林", desc:"你感到一阵天旋地转。有时候在城市的钢铁丛林里生存，并不比荒野中容易。现在你终于能休息了。", egg:"城市的丛林，远比自然中更加危险。",condition:(gs)=>gs.currentStatus.spirit <= 0},
    
    // 新增特殊结局
    // 好结局1：逃离加拿大
    {id:10, resultType:"special", type:"HE", title:"北方的希望", desc:"你终于受够了。美国梦？那是上个世纪的童话。医疗账单、裁员恐惧、房租暴涨——这一切让你窒息。你攒够了$80,000，申请了加拿大技术移民。漫长的等待后，你终于拿到了枫叶卡，越过北方边界。你在温哥华找到了工作，虽然工资比美国低20%，但看病免费，租金管控，生活踏实。第一次去家庭诊所，医生笑着说：“不用担心账单，这是你的权利。”那一刻，你热泪盈眶。", egg:"有时候，认输就是胜利。", condition:(gs)=>gs.currentStatus.money >= 80000 && gs.currentStatus.spirit < 40 && (gs.customFlag.insuranceDenied || gs.customFlag.rentIncreased || gs.customFlag.burnedOut)},
    
    // 好结局2：社区的力量
    {id:11, resultType:"normal", type:"HE", title:"互助之网", desc:"你失去了一切——工作、房子、积蓄。你流落街头，成为了统计数字中的一个。但你没有失去人心。你帮助过的流浪汉记得你，你的前同事记得你，你的邻居记得你。他们偷偷塞给你现金，给你介绍临时工作，让你睡他们的沙发。一个社区活动家找到你，说：“我们在组织租户工会，需要你的故事和力量。”你加入了。你们一起抗议，一起维权，一起守望相助。你依然贫穷，但不再孤独。在这个吃人的社会里，你们用人性编织了一张安全网。", egg:"在地狱里，人与人之间的温暖就是最大的反抗。", condition:(gs)=>gs.currentStatus.social >= 60 && gs.currentStatus.money < 100000 && (gs.customFlag.isHomeless || gs.customFlag.livingInCar)},
    
    // 好结局3：幸存者
    {id:12, resultType:"normal", type:"HE", title:"幸存者的黎明", desc:"你活下来了。这不是胜利，只是幸存。你的健康受损，精神疲惫，积蓄见底，信用破产。你失去了无数东西——梦想、希望、对未来的幻想。但你还在呼吸，还在行走，还能看到明天的太阳。你找到了一份勉强糊口的工作，租了一间狭小的房间，开始慢慢还债。你不再奢望“美国梦”，你只求生存。朋友问你：“值得吗？”你想了想，说：“我不知道。但我还活着。”也许，这就足够了。", egg:"能活着走出地狱，本身就是奇迹。", condition:(gs)=>gs.currentStatus.health >= 40 && gs.currentStatus.spirit >= 30 && gs.currentStatus.money >= 60000 && (gs.customFlag.insuranceDenied || gs.customFlag.debtCollectorHarass || gs.customFlag.survivedLayoff)},
    
    // 坏结局1：过量
    {id:13, resultType:"special", type:"BE", title:"止痛药的终结", desc:"又是一个失眠的夜晚。疼痛、焦虑、绝望交织在一起，像虫子一样啃噬你的神经。你打开药瓶，倒出几颗止痛药，吞下。等了20分钟，还是痛。再吞几颗。还是痛。你已经记不清自己吃了多少颗，你只想让痛苦停止，只想睡一觉。你的愿望实现了——你再也不会醒来。验尸官报告上写着：“意外药物过量”。没人会记得你是怎么一步步被逼到这里的——医疗债务、保险拒赔、工作压力、慢性疼痛。统计数字里只会多一个没有名字的数字。", egg:"美国每天有200人死于药物过量。你只是其中之一。", condition:(gs)=>(gs.customFlag.useDragTimes >= 3 || gs.customFlag.drugDependency) && gs.currentStatus.health < 30 && gs.currentStatus.spirit < 20},
    
    // 坏结局2：警察的子弹
    {id:14, resultType:"special", type:"BE", title:"例行公事", desc:"你在车里睡觉（或在公园长椅上）。深夜，手电筒的光照在你的脸上，刺眼。“警察，请出示证件！”你惊醒，手忙脚乱地去摸口袋里的身份证。“双手放在我能看见的地方！他在拿武器！”砰。巨大的枪响，然后是剧痛，然后是黑暗。你躺在冰冷的地上，生命流逝，听见警察在对讲机里说：“嫌疑人做出威胁性动作，开枪自卫。请派救护车和调查组。”内部调查结果：开枪合理，警官复职。你的死亡被归类为“officer-involved shooting”，成为了新闻里的一行字，几天后就被遗忘。没人会追问，为什么贫穷会成为死刑。", egg:"在美国，贫穷就是原罪。", condition:(gs)=>(gs.customFlag.livingInCar || gs.customFlag.isHomeless) && gs.currentStatus.spirit < 20 && gs.currentStatus.money < 20000},
    
    // 坏结局3：债务深渊
    {id:15, resultType:"normal", type:"BE", title:"债务的绞索", desc:"你欠的钱太多了。医疗贷款、高利贷、信用卡、拖欠的房租、罚款——总共$150,000。你的工资每个月只有$3,000，还完最低还款额后，你只剩$200生活费。你每天睁开眼睛，第一个念头就是：“还要还多久？”你算过，按照现在的收入，要还35年。那时候你已经70岁了。你的一生，就是为债务而活。催收电话一天30个，你的信用分数跌到了300，你无法租房、无法买车、无法找到更好的工作。你被困在了底层，永远无法翻身。终于有一天，你站在桥上，看着下面的河水，想：“也许这是唯一的解脱。”", egg:"在美国，债务不会杀死你。但它会让你生不如死。", condition:(gs)=>gs.currentStatus.money < 20000 && (gs.customFlag.loanSharkDebt || gs.customFlag.hasAppliedLoan || gs.customFlag.debtCollectorHarass) && gs.currentStatus.credit < 30 && gs.currentStatus.spirit < 25},
    
    // 坏结局4：系统碾压
    {id:16, resultType:"normal", type:"BE", title:"齿轮下的尘埃", desc:"你做对了一切。你努力工作，遵守规则，按时纳税，克制消费。但系统不在乎。医疗账单清空了你的积蓄，房东驱逐让你无家可归，公司裁员让你失业，保险公司拒赔让你债台高筑。你去申请救济，政府说你“不符合条件”。你去找工作，雇主看到你的地址是收容所，把简历扔进了垃圾桶。你去看病，医院要求先付款再治疗。你被困在了一个死循环里：因为穷而生病，因为生病而更穷，因为更穷而无法治病。系统不是坏了，系统本来就是这样设计的——它保护有钱人，碾压穷人。你只是齿轮下的一粒尘埃，渺小到连痕迹都留不下。", egg:"个人的失败，往往是系统的成功。", condition:(gs)=>gs.currentStatus.money < 40000 && gs.currentStatus.health < 30 && gs.currentStatus.spirit < 30 && (gs.customFlag.insuranceDenied && gs.customFlag.survivedLayoff===false && (gs.customFlag.isHomeless || gs.customFlag.receivedEvictionNotice))},
    
    // 兜底结局
    {id:999, resultType:"normal", type:"BE", title:"平凡的结束", desc:"你的故事就这样结束了，没有特别的好，也没有特别的坏。", egg:"有些人的一生，注定平凡。", condition:(gs)=>true}
];
