declare const SESSION_KEY = "ray_tab_hash";
declare const STORAGE_KEY = "ray_req_hash";
declare const getSessionKey: () => string;
interface ResHistory {
    status: number;
    url: string;
    params?: any;
    data: any;
    logCount?: number;
    time: number;
    session: string;
    removeLastLog?: boolean;
}
declare const updateReqHistory: ({ logCount, removeLastLog, ...resData }: Omit<ResHistory, "time" | "session">) => Promise<void>;

export { ResHistory, SESSION_KEY, STORAGE_KEY, getSessionKey, updateReqHistory };
