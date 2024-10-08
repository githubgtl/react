import { errorBoundary } from '../React'
let schduledWork = null; //被调度的任务
let isRunning = false; //是否正在执行

let yieldInterval = 100000000000000000000000000000;
let deadline = 0;
const { port1, port2 } = new MessageChannel();

function performWorkUntilDeadline() {
  // 如果有任务
  if (schduledWork !== null) {
    let curTime = performance.now();
    deadline = curTime + yieldInterval; //deadline是为了判断是否还有剩余时间，具体判断再shouldYieldWork中
    try {
      const hasMore = schduledWork(); //尝试去执行
      // throw 123
      if (hasMore) {
        // console.log("工作的多个任务未执行完，接着执行")
        port2.postMessage(null);
      } else {
        // console.log("工作执行完毕")
        isRunning = false;
      }
    } catch (error) {
      if(errorBoundary && typeof errorBoundary === 'function'){
        errorBoundary('render', error)
      }
    }
  } else {
    isRunning = false;
  }
}

port1.onmessage = performWorkUntilDeadline;

export function requestWork(work) {
  schduledWork = work;

  if (!isRunning) {
    //通知执行工作
    isRunning = true;
    port2.postMessage(null);
  }
}

export function cancelWork() {
  schduledWork = null;
}

//判断当前是否需要让出执行权，这个函数会在任务循环中每次调用 ，可以workLoop_demo.js
export function shouldYieldWork() {
  const curTime = performance.now();
  if (curTime >= deadline) {
    return true;
  } else {
    return false;
  }
}
