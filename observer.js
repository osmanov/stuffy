class Observer {
    constructor(subscribe) {
        this._subscriber = subscribe
    }
    subscribe(observer) {
        this._subscriber(observer)
    }
    static timer = (time) => {
        return new Observer((observer) => {
            const handler = setTimeout(() => {
                observer.next()
                observer.complete()
            }, time)
            return {
                unsubscribe() {
                    clearTimeout(handler)
                }
            }
        })
    }
    static fromEvent = (el, evName) => {
        return new Observer(observer => {
            const handler = (ev) => {
                observer.next(ev)
            }
            el.addEventListener(evName, handler)
            return {
                unsubscribe() {
                    el.removeEventListener(evName, handler)
                }
            }
        })
    }
}

const obs = Observer.timer(500)
obs.subscribe({
    next() {
        console.log('Next')
    },
    complete() {
        console.log('Complete')
    }
})