import { DevToolsPrivateTypes as Types } from "mute8-plugins"
// Event Types
export interface InitStateEvent {
    id: number,
    label: string,
    type: "init"
    state: object
    time: number
}

export interface ChangeStateEvent {
    id: number,
    label: string,
    type: "change"
    oldState: object
    state: object,
    actionName: string | undefined,
    args: Types.ChangeStateCallArgs,
    time: number
}
export type StoreEvent = InitStateEvent | ChangeStateEvent