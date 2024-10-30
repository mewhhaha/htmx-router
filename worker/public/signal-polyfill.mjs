// ../node_modules/.pnpm/signal-polyfill@0.2.1/node_modules/signal-polyfill/dist/index.js
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateIn = (member, obj) => {
  if (Object(obj) !== obj)
    throw TypeError('Cannot use the "in" operator on this value');
  return member.has(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
function defaultEquals(a, b) {
  return Object.is(a, b);
}
var activeConsumer = null;
var inNotificationPhase = false;
var epoch = 1;
var SIGNAL = /* @__PURE__ */ Symbol("SIGNAL");
function setActiveConsumer(consumer) {
  const prev = activeConsumer;
  activeConsumer = consumer;
  return prev;
}
function getActiveConsumer() {
  return activeConsumer;
}
function isInNotificationPhase() {
  return inNotificationPhase;
}
var REACTIVE_NODE = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: false,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: false,
  consumerIsAlwaysLive: false,
  producerMustRecompute: () => false,
  producerRecomputeValue: () => {
  },
  consumerMarkedDirty: () => {
  },
  consumerOnSignalRead: () => {
  }
};
function producerAccessed(node) {
  if (inNotificationPhase) {
    throw new Error(
      typeof ngDevMode !== "undefined" && ngDevMode ? `Assertion error: signal read during notification phase` : ""
    );
  }
  if (activeConsumer === null) {
    return;
  }
  activeConsumer.consumerOnSignalRead(node);
  const idx = activeConsumer.nextProducerIndex++;
  assertConsumerNode(activeConsumer);
  if (idx < activeConsumer.producerNode.length && activeConsumer.producerNode[idx] !== node) {
    if (consumerIsLive(activeConsumer)) {
      const staleProducer = activeConsumer.producerNode[idx];
      producerRemoveLiveConsumerAtIndex(staleProducer, activeConsumer.producerIndexOfThis[idx]);
    }
  }
  if (activeConsumer.producerNode[idx] !== node) {
    activeConsumer.producerNode[idx] = node;
    activeConsumer.producerIndexOfThis[idx] = consumerIsLive(activeConsumer) ? producerAddLiveConsumer(node, activeConsumer, idx) : 0;
  }
  activeConsumer.producerLastReadVersion[idx] = node.version;
}
function producerIncrementEpoch() {
  epoch++;
}
function producerUpdateValueVersion(node) {
  if (!node.dirty && node.lastCleanEpoch === epoch) {
    return;
  }
  if (!node.producerMustRecompute(node) && !consumerPollProducersForChange(node)) {
    node.dirty = false;
    node.lastCleanEpoch = epoch;
    return;
  }
  node.producerRecomputeValue(node);
  node.dirty = false;
  node.lastCleanEpoch = epoch;
}
function producerNotifyConsumers(node) {
  if (node.liveConsumerNode === void 0) {
    return;
  }
  const prev = inNotificationPhase;
  inNotificationPhase = true;
  try {
    for (const consumer of node.liveConsumerNode) {
      if (!consumer.dirty) {
        consumerMarkDirty(consumer);
      }
    }
  } finally {
    inNotificationPhase = prev;
  }
}
function producerUpdatesAllowed() {
  return (activeConsumer == null ? void 0 : activeConsumer.consumerAllowSignalWrites) !== false;
}
function consumerMarkDirty(node) {
  var _a;
  node.dirty = true;
  producerNotifyConsumers(node);
  (_a = node.consumerMarkedDirty) == null ? void 0 : _a.call(node.wrapper ?? node);
}
function consumerBeforeComputation(node) {
  node && (node.nextProducerIndex = 0);
  return setActiveConsumer(node);
}
function consumerAfterComputation(node, prevConsumer) {
  setActiveConsumer(prevConsumer);
  if (!node || node.producerNode === void 0 || node.producerIndexOfThis === void 0 || node.producerLastReadVersion === void 0) {
    return;
  }
  if (consumerIsLive(node)) {
    for (let i = node.nextProducerIndex; i < node.producerNode.length; i++) {
      producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
    }
  }
  while (node.producerNode.length > node.nextProducerIndex) {
    node.producerNode.pop();
    node.producerLastReadVersion.pop();
    node.producerIndexOfThis.pop();
  }
}
function consumerPollProducersForChange(node) {
  assertConsumerNode(node);
  for (let i = 0; i < node.producerNode.length; i++) {
    const producer = node.producerNode[i];
    const seenVersion = node.producerLastReadVersion[i];
    if (seenVersion !== producer.version) {
      return true;
    }
    producerUpdateValueVersion(producer);
    if (seenVersion !== producer.version) {
      return true;
    }
  }
  return false;
}
function producerAddLiveConsumer(node, consumer, indexOfThis) {
  var _a;
  assertProducerNode(node);
  assertConsumerNode(node);
  if (node.liveConsumerNode.length === 0) {
    (_a = node.watched) == null ? void 0 : _a.call(node.wrapper);
    for (let i = 0; i < node.producerNode.length; i++) {
      node.producerIndexOfThis[i] = producerAddLiveConsumer(node.producerNode[i], node, i);
    }
  }
  node.liveConsumerIndexOfThis.push(indexOfThis);
  return node.liveConsumerNode.push(consumer) - 1;
}
function producerRemoveLiveConsumerAtIndex(node, idx) {
  var _a;
  assertProducerNode(node);
  assertConsumerNode(node);
  if (typeof ngDevMode !== "undefined" && ngDevMode && idx >= node.liveConsumerNode.length) {
    throw new Error(
      `Assertion error: active consumer index ${idx} is out of bounds of ${node.liveConsumerNode.length} consumers)`
    );
  }
  if (node.liveConsumerNode.length === 1) {
    (_a = node.unwatched) == null ? void 0 : _a.call(node.wrapper);
    for (let i = 0; i < node.producerNode.length; i++) {
      producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
    }
  }
  const lastIdx = node.liveConsumerNode.length - 1;
  node.liveConsumerNode[idx] = node.liveConsumerNode[lastIdx];
  node.liveConsumerIndexOfThis[idx] = node.liveConsumerIndexOfThis[lastIdx];
  node.liveConsumerNode.length--;
  node.liveConsumerIndexOfThis.length--;
  if (idx < node.liveConsumerNode.length) {
    const idxProducer = node.liveConsumerIndexOfThis[idx];
    const consumer = node.liveConsumerNode[idx];
    assertConsumerNode(consumer);
    consumer.producerIndexOfThis[idxProducer] = idx;
  }
}
function consumerIsLive(node) {
  var _a;
  return node.consumerIsAlwaysLive || (((_a = node == null ? void 0 : node.liveConsumerNode) == null ? void 0 : _a.length) ?? 0) > 0;
}
function assertConsumerNode(node) {
  node.producerNode ?? (node.producerNode = []);
  node.producerIndexOfThis ?? (node.producerIndexOfThis = []);
  node.producerLastReadVersion ?? (node.producerLastReadVersion = []);
}
function assertProducerNode(node) {
  node.liveConsumerNode ?? (node.liveConsumerNode = []);
  node.liveConsumerIndexOfThis ?? (node.liveConsumerIndexOfThis = []);
}
function computedGet(node) {
  producerUpdateValueVersion(node);
  producerAccessed(node);
  if (node.value === ERRORED) {
    throw node.error;
  }
  return node.value;
}
function createComputed(computation) {
  const node = Object.create(COMPUTED_NODE);
  node.computation = computation;
  const computed = () => computedGet(node);
  computed[SIGNAL] = node;
  return computed;
}
var UNSET = /* @__PURE__ */ Symbol("UNSET");
var COMPUTING = /* @__PURE__ */ Symbol("COMPUTING");
var ERRORED = /* @__PURE__ */ Symbol("ERRORED");
var COMPUTED_NODE = /* @__PURE__ */ (() => {
  return {
    ...REACTIVE_NODE,
    value: UNSET,
    dirty: true,
    error: null,
    equal: defaultEquals,
    producerMustRecompute(node) {
      return node.value === UNSET || node.value === COMPUTING;
    },
    producerRecomputeValue(node) {
      if (node.value === COMPUTING) {
        throw new Error("Detected cycle in computations.");
      }
      const oldValue = node.value;
      node.value = COMPUTING;
      const prevConsumer = consumerBeforeComputation(node);
      let newValue;
      let wasEqual = false;
      try {
        newValue = node.computation.call(node.wrapper);
        const oldOk = oldValue !== UNSET && oldValue !== ERRORED;
        wasEqual = oldOk && node.equal.call(node.wrapper, oldValue, newValue);
      } catch (err) {
        newValue = ERRORED;
        node.error = err;
      } finally {
        consumerAfterComputation(node, prevConsumer);
      }
      if (wasEqual) {
        node.value = oldValue;
        return;
      }
      node.value = newValue;
      node.version++;
    }
  };
})();
function defaultThrowError() {
  throw new Error();
}
var throwInvalidWriteToSignalErrorFn = defaultThrowError;
function throwInvalidWriteToSignalError() {
  throwInvalidWriteToSignalErrorFn();
}
function createSignal(initialValue) {
  const node = Object.create(SIGNAL_NODE);
  node.value = initialValue;
  const getter = () => {
    producerAccessed(node);
    return node.value;
  };
  getter[SIGNAL] = node;
  return getter;
}
function signalGetFn() {
  producerAccessed(this);
  return this.value;
}
function signalSetFn(node, newValue) {
  if (!producerUpdatesAllowed()) {
    throwInvalidWriteToSignalError();
  }
  if (!node.equal.call(node.wrapper, node.value, newValue)) {
    node.value = newValue;
    signalValueChanged(node);
  }
}
var SIGNAL_NODE = /* @__PURE__ */ (() => {
  return {
    ...REACTIVE_NODE,
    equal: defaultEquals,
    value: void 0
  };
})();
function signalValueChanged(node) {
  node.version++;
  producerIncrementEpoch();
  producerNotifyConsumers(node);
}
var NODE = Symbol("node");
var Signal;
((Signal2) => {
  var _a, _brand, brand_fn, _b, _brand2, brand_fn2;
  class State {
    constructor(initialValue, options = {}) {
      __privateAdd(this, _brand);
      __publicField(this, _a);
      const ref = createSignal(initialValue);
      const node = ref[SIGNAL];
      this[NODE] = node;
      node.wrapper = this;
      if (options) {
        const equals = options.equals;
        if (equals) {
          node.equal = equals;
        }
        node.watched = options[Signal2.subtle.watched];
        node.unwatched = options[Signal2.subtle.unwatched];
      }
    }
    get() {
      if (!(0, Signal2.isState)(this))
        throw new TypeError("Wrong receiver type for Signal.State.prototype.get");
      return signalGetFn.call(this[NODE]);
    }
    set(newValue) {
      if (!(0, Signal2.isState)(this))
        throw new TypeError("Wrong receiver type for Signal.State.prototype.set");
      if (isInNotificationPhase()) {
        throw new Error("Writes to signals not permitted during Watcher callback");
      }
      const ref = this[NODE];
      signalSetFn(ref, newValue);
    }
  }
  _a = NODE;
  _brand = /* @__PURE__ */ new WeakSet();
  brand_fn = function() {
  };
  Signal2.isState = (s) => __privateIn(_brand, s);
  Signal2.State = State;
  class Computed {
    // Create a Signal which evaluates to the value returned by the callback.
    // Callback is called with this signal as the parameter.
    constructor(computation, options) {
      __privateAdd(this, _brand2);
      __publicField(this, _b);
      const ref = createComputed(computation);
      const node = ref[SIGNAL];
      node.consumerAllowSignalWrites = true;
      this[NODE] = node;
      node.wrapper = this;
      if (options) {
        const equals = options.equals;
        if (equals) {
          node.equal = equals;
        }
        node.watched = options[Signal2.subtle.watched];
        node.unwatched = options[Signal2.subtle.unwatched];
      }
    }
    get() {
      if (!(0, Signal2.isComputed)(this))
        throw new TypeError("Wrong receiver type for Signal.Computed.prototype.get");
      return computedGet(this[NODE]);
    }
  }
  _b = NODE;
  _brand2 = /* @__PURE__ */ new WeakSet();
  brand_fn2 = function() {
  };
  Signal2.isComputed = (c) => __privateIn(_brand2, c);
  Signal2.Computed = Computed;
  ((subtle2) => {
    var _a2, _brand3, brand_fn3, _assertSignals, assertSignals_fn;
    function untrack(cb) {
      let output;
      let prevActiveConsumer = null;
      try {
        prevActiveConsumer = setActiveConsumer(null);
        output = cb();
      } finally {
        setActiveConsumer(prevActiveConsumer);
      }
      return output;
    }
    subtle2.untrack = untrack;
    function introspectSources(sink) {
      var _a3;
      if (!(0, Signal2.isComputed)(sink) && !(0, Signal2.isWatcher)(sink)) {
        throw new TypeError("Called introspectSources without a Computed or Watcher argument");
      }
      return ((_a3 = sink[NODE].producerNode) == null ? void 0 : _a3.map((n) => n.wrapper)) ?? [];
    }
    subtle2.introspectSources = introspectSources;
    function introspectSinks(signal) {
      var _a3;
      if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) {
        throw new TypeError("Called introspectSinks without a Signal argument");
      }
      return ((_a3 = signal[NODE].liveConsumerNode) == null ? void 0 : _a3.map((n) => n.wrapper)) ?? [];
    }
    subtle2.introspectSinks = introspectSinks;
    function hasSinks(signal) {
      if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) {
        throw new TypeError("Called hasSinks without a Signal argument");
      }
      const liveConsumerNode = signal[NODE].liveConsumerNode;
      if (!liveConsumerNode)
        return false;
      return liveConsumerNode.length > 0;
    }
    subtle2.hasSinks = hasSinks;
    function hasSources(signal) {
      if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isWatcher)(signal)) {
        throw new TypeError("Called hasSources without a Computed or Watcher argument");
      }
      const producerNode = signal[NODE].producerNode;
      if (!producerNode)
        return false;
      return producerNode.length > 0;
    }
    subtle2.hasSources = hasSources;
    class Watcher {
      // When a (recursive) source of Watcher is written to, call this callback,
      // if it hasn't already been called since the last `watch` call.
      // No signals may be read or written during the notify.
      constructor(notify) {
        __privateAdd(this, _brand3);
        __privateAdd(this, _assertSignals);
        __publicField(this, _a2);
        let node = Object.create(REACTIVE_NODE);
        node.wrapper = this;
        node.consumerMarkedDirty = notify;
        node.consumerIsAlwaysLive = true;
        node.consumerAllowSignalWrites = false;
        node.producerNode = [];
        this[NODE] = node;
      }
      // Add these signals to the Watcher's set, and set the watcher to run its
      // notify callback next time any signal in the set (or one of its dependencies) changes.
      // Can be called with no arguments just to reset the "notified" state, so that
      // the notify callback will be invoked again.
      watch(...signals) {
        if (!(0, Signal2.isWatcher)(this)) {
          throw new TypeError("Called unwatch without Watcher receiver");
        }
        __privateMethod(this, _assertSignals, assertSignals_fn).call(this, signals);
        const node = this[NODE];
        node.dirty = false;
        const prev = setActiveConsumer(node);
        for (const signal of signals) {
          producerAccessed(signal[NODE]);
        }
        setActiveConsumer(prev);
      }
      // Remove these signals from the watched set (e.g., for an effect which is disposed)
      unwatch(...signals) {
        if (!(0, Signal2.isWatcher)(this)) {
          throw new TypeError("Called unwatch without Watcher receiver");
        }
        __privateMethod(this, _assertSignals, assertSignals_fn).call(this, signals);
        const node = this[NODE];
        assertConsumerNode(node);
        for (let i = node.producerNode.length - 1; i >= 0; i--) {
          if (signals.includes(node.producerNode[i].wrapper)) {
            producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
            const lastIdx = node.producerNode.length - 1;
            node.producerNode[i] = node.producerNode[lastIdx];
            node.producerIndexOfThis[i] = node.producerIndexOfThis[lastIdx];
            node.producerNode.length--;
            node.producerIndexOfThis.length--;
            node.nextProducerIndex--;
            if (i < node.producerNode.length) {
              const idxConsumer = node.producerIndexOfThis[i];
              const producer = node.producerNode[i];
              assertProducerNode(producer);
              producer.liveConsumerIndexOfThis[idxConsumer] = i;
            }
          }
        }
      }
      // Returns the set of computeds in the Watcher's set which are still yet
      // to be re-evaluated
      getPending() {
        if (!(0, Signal2.isWatcher)(this)) {
          throw new TypeError("Called getPending without Watcher receiver");
        }
        const node = this[NODE];
        return node.producerNode.filter((n) => n.dirty).map((n) => n.wrapper);
      }
    }
    _a2 = NODE;
    _brand3 = /* @__PURE__ */ new WeakSet();
    brand_fn3 = function() {
    };
    _assertSignals = /* @__PURE__ */ new WeakSet();
    assertSignals_fn = function(signals) {
      for (const signal of signals) {
        if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) {
          throw new TypeError("Called watch/unwatch without a Computed or State argument");
        }
      }
    };
    Signal2.isWatcher = (w) => __privateIn(_brand3, w);
    subtle2.Watcher = Watcher;
    function currentComputed() {
      var _a3;
      return (_a3 = getActiveConsumer()) == null ? void 0 : _a3.wrapper;
    }
    subtle2.currentComputed = currentComputed;
    subtle2.watched = Symbol("watched");
    subtle2.unwatched = Symbol("unwatched");
  })(Signal2.subtle || (Signal2.subtle = {}));
})(Signal || (Signal = {}));
export {
  Signal
};
/*! Bundled license information:

signal-polyfill/dist/index.js:
  (**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   *)
  (**
   * @license
   * Copyright 2024 Bloomberg Finance L.P.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
