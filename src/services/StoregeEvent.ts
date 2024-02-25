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
    args: any[] | undefined,
    time: number
}
export type StoreEvent = InitStateEvent | ChangeStateEvent