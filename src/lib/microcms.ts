import { createClient } from "microcms-js-sdk";

export const client = createClient({
    serviceDomain: (import.meta.env.MICROCMS_SERVICE_DOMAIN || "YOUR_DOMAIN")
        .replace(/^https?:\/\//, "")
        .replace(/\.microcms\.io$/, ""),
    apiKey: import.meta.env.MICROCMS_API_KEY || "YOUR_API_KEY",
});

export type Blog = {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    title: string;
    content: string;
    thumbnail?: {
        url: string;
        height: number;
        width: number;
    };
    targetSites?: string[];
};

export type BlogResponse = {
    totalCount: number;
    offset: number;
    limit: number;
    contents: Blog[];
};

// Mock data for development/build without keys
const mockBlogs: Blog[] = [
    {
        id: "mock-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        revisedAt: new Date().toISOString(),
        title: "Welcome to Roborave Mie (Mock)",
        content: "<p>This is a mock blog post because no API keys were found. Set MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY to see real content.</p>",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            height: 600,
            width: 800
        },
        targetSites: ["mie"]
    },
    {
        id: "mock-2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        revisedAt: new Date().toISOString(),
        title: "Competition Updates (Mock)",
        content: "<p>Details about the upcoming competition challenges.</p>",
        targetSites: ["mie"]
    }
];

export const getBlogs = async (queries?: import("microcms-js-sdk").MicroCMSQueries) => {
    try {
        // Enforce filter for targetSites='mie'
        const mieFilter = "targetSites[contains]mie";
        const finalFilters = queries?.filters ? `(${queries.filters})[and]${mieFilter}` : mieFilter;

        return await client.get<BlogResponse>({
            endpoint: "blogs",
            queries: { ...queries, filters: finalFilters }
        });
    } catch (error) {
        console.warn("MicroCMS API failed, using mock data:", error);
        return {
            totalCount: mockBlogs.length,
            offset: 0,
            limit: 10,
            contents: mockBlogs
        };
    }
};

export const getBlogDetail = async (
    contentId: string,
    queries?: import("microcms-js-sdk").MicroCMSQueries
) => {
    try {
        return await client.getListDetail<Blog>({
            endpoint: "blogs",
            contentId,
            queries,
        });
    } catch (error) {
        console.warn("MicroCMS API failed, using mock data:", error);
        const mock = mockBlogs.find(b => b.id === contentId);
        if (mock) return mock;
        throw error; // If not found in mock, throw
    }
};

export type Competition = {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    title: string;
    subtitle: string; // e.g., "アメージング・チャレンジ"
    icon: string; // Emoji
    description: string;
    rules: string; // HTML content
    specs?: {
        label: string;
        value: string;
    }[];
    scoring?: {
        label: string;
        points: string;
        note?: string;
    }[];
    eyecatch?: {
        url: string;
        height: number;
        width: number;
    };
};

export type CompetitionResponse = {
    totalCount: number;
    offset: number;
    limit: number;
    contents: Competition[];
};

const mockCompetitions: Competition[] = [
    {
        id: "amazing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        revisedAt: new Date().toISOString(),
        title: "a-MAZE-ing Challenge",
        subtitle: "アメージング・チャレンジ",
        icon: "🧩",
        description: "木の板で組み合わせて作られたコースの上を、地面に落ちることなくどこまで走り抜けれるかを競う競技です。このチャレンジでは、ゴールまで走破した時の残り時間がボーナスポイントとして加算されるので、いかに素早く正確にゴールを目指せるかが勝負の鍵となります。",
        rules: `
        <h3>募集要項</h3>
        <ul>
            <li><strong>チーム構成</strong>: 2〜4人で構成されるチームで参加してください。</li>
            <li><strong>参加区分</strong>:
                <ul>
                    <li>小学生の部</li>
                    <li>中学生の部</li>
                </ul>
            </li>
        </ul>

        <h3>競技ルール</h3>
        <ul>
            <li><strong>完全自律型ロボット</strong>を使用してください。（コントローラーなどの遠隔操作は不可）</li>
            <li>ロボットに<strong>外部センサーを使用することは禁止</strong>です。（エンコーダーのような内部センサーは使用可）</li>
            <li>プレイヤーのみロボットに触れることができます。</li>
            <li>１回のプレイ時間は<strong>２分</strong>で、時間内なら何度トライしても構いません。</li>
            <li>リトライする時は必ず<strong>スタート位置にロボットを戻してから</strong>やり直してください。</li>
        </ul>

        <h3>得点について</h3>
        <ul>
            <li>コースに設けられた各直線・曲り角を通過するごとに得点が入ります。</li>
            <li>２分間の走行のうち<strong>一番良い結果</strong>をそのプレイの得点とします。</li>
            <li>時間内にゴールまで走破した場合のみ、残り時間の秒数（整数部分）がボーナスポイントとして加点されます。</li>
            <li>５回のプレイを行った後、５回分の得点の合計がチームの総合得点となります。</li>
        </ul>`,
        specs: [
            { label: "ロボット制御", value: "完全自律型 (Autonomous)" },
            { label: "センサー制限", value: "外部センサー禁止 (No External Sensors)" },
            { label: "制限時間", value: "2分間 (Time Limit)" },
            { label: "試技回数", value: "合計5回 (Total 5 runs)" },
        ],
        scoring: [
            { label: "コース走破", points: "通過ごとの加点", note: "直線・カーブ通過で得点" },
            { label: "ゴールボーナス", points: "残り時間 × 1点", note: "完走時のみ加算" },
            { label: "総合得点", points: "5回の合計", note: "ベストスコアの合計" },
        ],
        eyecatch: {
            url: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=800",
            height: 600,
            width: 800
        }
    },
    {
        id: "sumobot",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        revisedAt: new Date().toISOString(),
        title: "SumoBot Challenge",
        subtitle: "力と戦略",
        icon: "🥋",
        description: "直径122cmの板の上で２台のロボットが押し合いをする、日本の国技『相撲』に見立てた競技です。対戦相手のロボットを土俵から押し出す、または土俵上でひっくり返るなど走行不能となった場合に勝敗が決まります。",
        rules: `
        <h3>募集要項</h3>
        <ul>
            <li><strong>チーム構成</strong>: 2〜4人で構成されるチームで参加してください。</li>
            <li><strong>参加区分</strong>:
                <ul>
                    <li>小学生の部</li>
                    <li>中学生の部</li>
                    <li>高校生の部</li>
                </ul>
            </li>
        </ul>

        <h3>競技ルール</h3>
        <ul>
            <li><strong>完全自律型ロボット</strong>を使用してください。（コントローラーなどの遠隔操作は不可）</li>
            <li>ロボットにはセンサーおよびプロセッサーをいくつ使用しても構いません。</li>
            <li>ロボットの寸法は、競技開始時に限り <strong>25cm x 30cm以内</strong>（高さ制限なし）とします。</li>
            <li>ロボットの重量は、<strong>1.5kg以下</strong>とします。</li>
            <li>１回のプレイ時間は<strong>３分</strong>です。</li>
            <li>土俵の黒枠の内側にロボットを置き（ロボットの向きは問わず）、審判の合図と同時にロボットを始動します。</li>
            <li>プレイヤーのみプレイヤーズサークルに入り、ロボットに触れることが出来ます。</li>
            <li>各チームのプレイヤーは、プレイ開始と同時にプレイヤーズサークル外に速やかに移動します。</li>
            <li>１度プレイが開始すると、勝敗が決まるまで（または審判が止めるまで）はロボットに触れてはいけません。</li>
            <li>一定時間ロボットが動かないなど、審判が必要と判断した場合は、時計を一時停止し再スタートします。</li>
        </ul>

        <h3>禁止行為</h3>
        <ul>
            <li>鋭い刃やハンマーなど、対戦相手のロボットおよび土俵を傷つけるような装置の搭載。</li>
            <li>赤外線LEDを照射するなど、対戦相手のロボットの赤外線センサーを妨害するような装置の搭載。</li>
            <li>物質の状態（固体/液体/気体）に関わらず、対戦相手のロボットに浴びせるような装置の搭載。</li>
            <li>対戦相手のロボットを捕らえることを意図する装置の搭載。</li>
            <li>真空ポンプ、磁石、接着剤や吸盤等、土俵に接着または吸着することを意図する装置の搭載。</li>
            <li>粘着性物質を使用した装置の搭載。</li>
        </ul>

        <h3>土俵詳細</h3>
        <ul>
            <li>コンパネ（合板の木材）またはその他の適切な非磁性体の素材で作成された土俵は、幅5cmの黒色の縁のある<strong>直径122cm</strong>の白色の円形です。</li>
            <li>支柱によって5〜10cm程度床から離した状態で設置します。</li>
            <li>土俵の周囲には、<strong>プレイヤーズサークル</strong>と称したエリアを設けています。これは距離センサー等を搭載しているロボットへの影響に配慮した、プレイヤーのみ立ち入ることが可能なエリアです。</li>
        </ul>`,
        specs: [
            { label: "ロボット制御", value: "完全自律型 (Autonomous)" },
            { label: "サイズ制限 (開始時)", value: "25cm x 30cm以内" },
            { label: "重量制限", value: "1.5kg以下" },
            { label: "制限時間", value: "3分間" },
        ],
        scoring: [
            { label: "勝ち (Win)", points: "3点", note: "相手を土俵外へ押し出す / 走行不能にする" },
            { label: "引き分け (Draw)", points: "1点", note: "時間切れなどで勝敗がつかない場合" },
            { label: "負け (Loss)", points: "0点", note: "自ら落下、または押し出された場合" },
        ],
        eyecatch: {
            url: "https://images.unsplash.com/photo-1535378437323-9555f3e7f671?auto=format&fit=crop&q=80&w=800",
            height: 600,
            width: 800
        }
    },
    {
        id: "line-following",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        revisedAt: new Date().toISOString(),
        title: "Line Following Challenge",
        subtitle: "王道の競技",
        icon: "〰️",
        description: "HOMEから黒線を辿りながらボールを運び、TOWERにボールを１つ以上入れ、再び黒線を辿りHOMEまで戻る競技です。このミッションをクリアした後、残りのプレイ時間でボールをTOWERに運び入れてボーナスポイントを稼ぎましょう。",
        rules: `
        <h3>募集要項</h3>
        <ul>
            <li><strong>チーム構成</strong>: 2〜4人で構成されるチームで参加してください。</li>
            <li><strong>参加区分</strong>:
                <ul>
                    <li>小学生の部</li>
                    <li>中学生の部</li>
                    <li>高校生の部</li>
                </ul>
            </li>
        </ul>

        <h3>競技ルール</h3>
        <ul>
            <li><strong>完全自律型ロボット</strong>を使用してください。（コントローラーなどの遠隔操作は不可）</li>
            <li>ロボットにはセンサーおよびプロセッサーをいくつ使用しても構いません。</li>
            <li>１回のプレイ時間は<strong>３分</strong>です。</li>
            <li>プレイヤーのみロボットに触れることが出来ます。</li>
            <li>TOWERに手を触れてはいけません。</li>
            <li>運び入れたボールをTOWERの後ろからかき出す行為は禁止です。</li>
            <li>プレイ中にロボットに触れた場合は、必ずロボットを<strong>HOMEに戻してから</strong>プレイを再開してください。</li>
            <li>ボーナスチャレンジ中の復路は黒線を辿る必要はなく、ロボットを手に持ってHOMEに戻して良いものとします。</li>
        </ul>

        <h3>得点について</h3>
        <p>３分のプレイ時間内にクリアした項目に応じて得点が入ります。</p>
        <ul>
            <li>１往復の課題をクリアした後、残り時間で運び入れたボーナスボールの数に応じて得点が加算されます。</li>
            <li>※１往復目に運び入れたボールは、ボーナスボールには含まれません。</li>
            <li>５回のプレイを行った後、５回分の得点の合計がチームの総合得点となります。</li>
        </ul>`,
        specs: [
            { label: "ロボット制御", value: "完全自律型 (Autonomous)" },
            { label: "センサー/プロセッサー", value: "無制限 (Unlimited)" },
            { label: "制限時間", value: "3分間 (Time Limit)" },
            { label: "チーム構成", value: "2〜4名 (2-4 Members)" },
        ],
        scoring: [
            { label: "ミッション (Mission)", points: "基本点", note: "1往復でクリア" },
            { label: "ボーナス (Bonus)", points: "加算", note: "2回目以降のボール運搬" },
            { label: "総合得点 (Total)", points: "5回の合計", note: "合計得点で競う" },
        ],
        eyecatch: {
            url: "https://images.unsplash.com/photo-1517077304055-6e89abbec40b?auto=format&fit=crop&q=80&w=800",
            height: 600,
            width: 800
        }
    }
];

export const getCompetitions = async (queries?: import("microcms-js-sdk").MicroCMSQueries) => {
    try {
        return await client.get<CompetitionResponse>({
            endpoint: "competitions",
            queries
        });
    } catch (error) {
        console.warn("MicroCMS API failed for competitions, using mock data:", error);
        return {
            totalCount: mockCompetitions.length,
            offset: 0,
            limit: 10,
            contents: mockCompetitions
        };
    }
}

export const getCompetitionDetail = async (
    contentId: string,
    queries?: import("microcms-js-sdk").MicroCMSQueries
) => {
    try {
        return await client.getListDetail<Competition>({
            endpoint: "competitions",
            contentId,
            queries,
        });
    } catch (error) {
        console.warn("MicroCMS API failed for competition detail, using mock data:", error);
        const mock = mockCompetitions.find(c => c.id === contentId);
        if (mock) return mock;
        throw error;
    }
};
