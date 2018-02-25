class Observer {
  constructor(subscribe) {
    this._subscriber = subscribe
  }
  subscribe(observer) {
    this._subscriber(observer)
  }
  static timer(time) {
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
  static fromEvent(el, evName) {
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

  map(projection) {
    return new Observer(observer => {
      const subscription = this._subscriber({
        next(ev) {
          observer.next(projection(ev))
        }
      })
      return subscription;

    })
  }
  filter(projection) {
    return new Observer(observer => {
      const subscription = this._subscriber({
        next(val) {
          if (projection(val)) {
            observer.next(val)
          }
        }
      })
      return subscription;

    })
  }
  concat(...obs) {

  }
}

//HOW IT WORKS
/*const time = Observer.timer(500)
time.subscribe({
    next() {
        console.log('NEXT')
    },
    complete() {
        console.log('COMPLETE')
    }
})

const click$ = Observer.fromEvent(someDomEl, 'click');
click$
.map(client => client.offsetX)
.filter(val=>val>25)
.subscribe({
    next(result) {
        console.log(result)
    }
})
*/