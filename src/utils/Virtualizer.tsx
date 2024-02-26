import { Accessor, JSXElement, Signal, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js"

interface ListDefinition<T> {
    height: number
    renderItem: (item: T) => JSXElement
    init?: Array<T>,
    updateMs?: number
    bottomPadding?: number,
}

class Virtualizer<T> {
    items: Array<T>
    height: number
    updateMs: number
    stickiStrenght: number = 3;
    bottomPadding: number = 0;
    renderItem: (item: T) => JSXElement
    parentStyle = {
        height: `100%`,
        overflow: 'auto',
    }

    parentRef: HTMLElement | null = null
    listHeight: Signal<number>
    parentHeight: Signal<number>
    scroolOffset: Signal<number>
    manualRerender: Signal<number>

    // push , unshift
    addBuffer: [Array<T>, Array<T>] = [[], []]

    constructor(def: ListDefinition<T>) {
        this.items = def.init ?? []
        this.height = def.height
        this.updateMs = def.updateMs ?? 150;
        this.bottomPadding = def.bottomPadding ?? 0;
        this.renderItem = def.renderItem
        this.listHeight = createSignal(this.items.length * this.height)
        this.parentHeight = createSignal(0)
        this.scroolOffset = createSignal(0)
        this.manualRerender = createSignal(0)
        setInterval(this.updateList.bind(this), this.updateMs)
    }

    rerender() {
        setTimeout(() => {
            this.manualRerender[1](p => p + 1)
            this.resize()
        }, 2)
    }

    private updateList() {
        const b = this.addBuffer;
        const push = b[0]
        const ushift = b[1]
        if (push.length == 0 && ushift.length == 0) return;
        this.addBuffer = [[], []]

        this.items.push(...push)
        this.items.unshift(...ushift)
        this.listHeight[1](prev => prev + ((push.length + ushift.length) * this.height))

        if (!this.parentRef) return
        const stickiHeight = this.height * this.stickiStrenght;
        const fromTop = this.parentRef.scrollTop;
        const fromBottom = this.parentRef.scrollHeight - fromTop - this.parentRef.offsetHeight;

        // stick to top or bottom
        if (fromBottom < stickiHeight) {
            this.parentRef.scrollTo({ top: this.parentRef.scrollHeight + (push.length * this.height) })
        } else if (fromTop > stickiHeight) {
            this.parentRef.scrollTo({ top: fromTop + (ushift.length * this.height) })
        }
    }

    push(item: T) {
        this.addBuffer[0].push(item)
    }

    unshift(item: T) {
        this.addBuffer[1].unshift(item)
    }

    setItems(items: T[]) {
        this.items = items;
        this.listHeight[1](this.items.length * this.height)
    }

    private resize(parentRef: any = this.parentRef) {
        this.parentRef = parentRef
        if (!this.parentRef) return
        this.parentHeight[1](this.parentRef.offsetHeight)
        this.scroolOffset[1](this.parentRef.scrollTop)
    }

    private getItemsToRender(): number {
        return Math.ceil(this.parentHeight[0]() / this.height)
    }
    private getItemsOffset(): number {
        return Math.round(this.scroolOffset[0]() / this.height)
    }

    public getRows(): Accessor<JSXElement[]> {
        const manualRerender = this.manualRerender[0]
        const listHeight = this.listHeight[0]
        const scroolOffset = this.scroolOffset[0]
        return createMemo(() => {
            let scrollOffset = scroolOffset();
            let offset = this.getItemsOffset();
            const items = this.getItemsToRender()
            manualRerender()
            listHeight()

            // end of list
            const lastItem = items + offset;
            const totalItems = this.items.length;
            if (offset > 0 && lastItem >= totalItems) {
                const pxGap = this.parentHeight[0]() % this.height;
                scrollOffset -= pxGap > 0 ? (this.height - pxGap) : pxGap
                offset -= Math.min(lastItem - totalItems, 1) + 1
            }

            const style = { "min-height": this.height + "px", transform: "translateY(" + scrollOffset + "px)" };
            const result = [] as JSXElement[]
            for (let i = 0; i < items + 1; i++) {
                const item: T = this.items[i + offset]
                item && result.push(<div style={style}>{this.renderItem(item)}</div>)
            }
            return result
        })
    }

    public getList(): () => JSXElement {
        const listHeight = this.listHeight[0]
        const rows = this.getRows()
        let parentRef: HTMLDivElement;
        let innerRef: HTMLDivElement;
        const onResizeFn = () => parentRef && this.resize(parentRef);
        onMount(() => {
            this.resize(parentRef)
            parentRef.onscroll = () => this.resize(parentRef)
            window.addEventListener('resize', onResizeFn, { passive: true })
        })
        onCleanup(() => {
            window.removeEventListener('resize', onResizeFn)
        })
        createEffect(() => {
            const bottomPadding = (this.getItemsToRender() * this.bottomPadding) * this.height;
            innerRef.style.height = listHeight() + bottomPadding + "px"
        })
        return () => (
            <div class="scroll-parent" ref={parentRef} style={this.parentStyle} >
                <div class="scroll-inner" ref={innerRef}>
                    {rows()}
                </div>
            </div>
        )
    }
}

export const newVirtualizer = <T,>(def: ListDefinition<T>): Virtualizer<T> => {
    return new Virtualizer(def)
}
