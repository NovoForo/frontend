import type {Session} from "@toolpad/core/AppProvider";

export interface ExtendedSession extends Session {
    token?: string;
    isModerator?: boolean;
    isAdministrator?: boolean;
}