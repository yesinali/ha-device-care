/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, V = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), Z = /* @__PURE__ */ new WeakMap();
let le = class {
  constructor(e, a, i) {
    if (this._$cssResult$ = !0, i !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = a;
  }
  get styleSheet() {
    let e = this.o;
    const a = this.t;
    if (V && e === void 0) {
      const i = a !== void 0 && a.length === 1;
      i && (e = Z.get(a)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Z.set(a, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const me = (t) => new le(typeof t == "string" ? t : t + "", void 0, q), ge = (t, ...e) => {
  const a = t.length === 1 ? t[0] : e.reduce((i, r, s) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[s + 1], t[0]);
  return new le(a, t, q);
}, fe = (t, e) => {
  if (V) t.adoptedStyleSheets = e.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of e) {
    const i = document.createElement("style"), r = U.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = a.cssText, t.appendChild(i);
  }
}, J = V ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let a = "";
  for (const i of e.cssRules) a += i.cssText;
  return me(a);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: be, defineProperty: ve, getOwnPropertyDescriptor: $e, getOwnPropertyNames: ye, getOwnPropertySymbols: xe, getPrototypeOf: _e } = Object, B = globalThis, Y = B.trustedTypes, we = Y ? Y.emptyScript : "", ke = B.reactiveElementPolyfillSupport, P = (t, e) => t, T = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? we : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let a = t;
  switch (e) {
    case Boolean:
      a = t !== null;
      break;
    case Number:
      a = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        a = JSON.parse(t);
      } catch {
        a = null;
      }
  }
  return a;
} }, K = (t, e) => !be(t, e), Q = { attribute: !0, type: String, converter: T, reflect: !1, useDefault: !1, hasChanged: K };
Symbol.metadata ??= Symbol("metadata"), B.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, a = Q) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(e, a), !a.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, a);
      r !== void 0 && ve(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, a, i) {
    const { get: r, set: s } = $e(this.prototype, e) ?? { get() {
      return this[a];
    }, set(n) {
      this[a] = n;
    } };
    return { get: r, set(n) {
      const d = r?.call(this);
      s?.call(this, n), this.requestUpdate(e, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const e = _e(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const a = this.properties, i = [...ye(a), ...xe(a)];
      for (const r of i) this.createProperty(r, a[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const a = litPropertyMetadata.get(e);
      if (a !== void 0) for (const [i, r] of a) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, i] of this.elementProperties) {
      const r = this._$Eu(a, i);
      r !== void 0 && this._$Eh.set(r, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const a = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) a.unshift(J(r));
    } else e !== void 0 && a.push(J(e));
    return a;
  }
  static _$Eu(e, a) {
    const i = a.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), a = this.constructor.elementProperties;
    for (const i of a.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return fe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, a, i) {
    this._$AK(e, i);
  }
  _$ET(e, a) {
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const s = (i.converter?.toAttribute !== void 0 ? i.converter : T).toAttribute(a, i.type);
      this._$Em = e, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(e, a) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const s = i.getPropertyOptions(r), n = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : T;
      this._$Em = r;
      const d = n.fromAttribute(a, s.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, a, i, r = !1, s) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (s = this[e]), i ??= n.getPropertyOptions(e), !((i.hasChanged ?? K)(s, a) || i.useDefault && i.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, i)))) return;
      this.C(e, a, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, a, { useDefault: i, reflect: r, wrapped: s }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? a ?? this[e]), s !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (a = void 0), this._$AL.set(e, a)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (a) {
      Promise.reject(a);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, s] of this._$Ep) this[r] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, s] of i) {
        const { wrapped: n } = s, d = this[r];
        n !== !0 || this._$AL.has(r) || d === void 0 || this.C(r, void 0, s, d);
      }
    }
    let e = !1;
    const a = this._$AL;
    try {
      e = this.shouldUpdate(a), e ? (this.willUpdate(a), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(a)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(a);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((a) => a.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((a) => this._$ET(a, this[a])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[P("elementProperties")] = /* @__PURE__ */ new Map(), k[P("finalized")] = /* @__PURE__ */ new Map(), ke?.({ ReactiveElement: k }), (B.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, X = (t) => t, H = W.trustedTypes, ee = H ? H.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ce = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + y, Ae = `<${de}>`, w = document, C = () => w.createComment(""), M = (t) => t === null || typeof t != "object" && typeof t != "function", G = Array.isArray, Ee = (t) => G(t) || typeof t?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, te = /-->/g, ae = />/g, x = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ie = /'/g, re = /"/g, pe = /^(?:script|style|textarea|title)$/i, Se = (t) => (e, ...a) => ({ _$litType$: t, strings: e, values: a }), o = Se(1), A = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), se = /* @__PURE__ */ new WeakMap(), _ = w.createTreeWalker(w, 129);
function he(t, e) {
  if (!G(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ee !== void 0 ? ee.createHTML(e) : e;
}
const Pe = (t, e) => {
  const a = t.length - 1, i = [];
  let r, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = S;
  for (let d = 0; d < a; d++) {
    const l = t[d];
    let h, m, u = -1, v = 0;
    for (; v < l.length && (n.lastIndex = v, m = n.exec(l), m !== null); ) v = n.lastIndex, n === S ? m[1] === "!--" ? n = te : m[1] !== void 0 ? n = ae : m[2] !== void 0 ? (pe.test(m[2]) && (r = RegExp("</" + m[2], "g")), n = x) : m[3] !== void 0 && (n = x) : n === x ? m[0] === ">" ? (n = r ?? S, u = -1) : m[1] === void 0 ? u = -2 : (u = n.lastIndex - m[2].length, h = m[1], n = m[3] === void 0 ? x : m[3] === '"' ? re : ie) : n === re || n === ie ? n = x : n === te || n === ae ? n = S : (n = x, r = void 0);
    const $ = n === x && t[d + 1].startsWith("/>") ? " " : "";
    s += n === S ? l + Ae : u >= 0 ? (i.push(h), l.slice(0, u) + ce + l.slice(u) + y + $) : l + y + (u === -2 ? d : $);
  }
  return [he(t, s + (t[a] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class D {
  constructor({ strings: e, _$litType$: a }, i) {
    let r;
    this.parts = [];
    let s = 0, n = 0;
    const d = e.length - 1, l = this.parts, [h, m] = Pe(e, a);
    if (this.el = D.createElement(h, i), _.currentNode = this.el.content, a === 2 || a === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (r = _.nextNode()) !== null && l.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const u of r.getAttributeNames()) if (u.endsWith(ce)) {
          const v = m[n++], $ = r.getAttribute(u).split(y), R = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: s, name: R[2], strings: $, ctor: R[1] === "." ? Ce : R[1] === "?" ? Me : R[1] === "@" ? De : L }), r.removeAttribute(u);
        } else u.startsWith(y) && (l.push({ type: 6, index: s }), r.removeAttribute(u));
        if (pe.test(r.tagName)) {
          const u = r.textContent.split(y), v = u.length - 1;
          if (v > 0) {
            r.textContent = H ? H.emptyScript : "";
            for (let $ = 0; $ < v; $++) r.append(u[$], C()), _.nextNode(), l.push({ type: 2, index: ++s });
            r.append(u[v], C());
          }
        }
      } else if (r.nodeType === 8) if (r.data === de) l.push({ type: 2, index: s });
      else {
        let u = -1;
        for (; (u = r.data.indexOf(y, u + 1)) !== -1; ) l.push({ type: 7, index: s }), u += y.length - 1;
      }
      s++;
    }
  }
  static createElement(e, a) {
    const i = w.createElement("template");
    return i.innerHTML = e, i;
  }
}
function E(t, e, a = t, i) {
  if (e === A) return e;
  let r = i !== void 0 ? a._$Co?.[i] : a._$Cl;
  const s = M(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== s && (r?._$AO?.(!1), s === void 0 ? r = void 0 : (r = new s(t), r._$AT(t, a, i)), i !== void 0 ? (a._$Co ??= [])[i] = r : a._$Cl = r), r !== void 0 && (e = E(t, r._$AS(t, e.values), r, i)), e;
}
class ze {
  constructor(e, a) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = a;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: a }, parts: i } = this._$AD, r = (e?.creationScope ?? w).importNode(a, !0);
    _.currentNode = r;
    let s = _.nextNode(), n = 0, d = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let h;
        l.type === 2 ? h = new N(s, s.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (h = new Ne(s, this, e)), this._$AV.push(h), l = i[++d];
      }
      n !== l?.index && (s = _.nextNode(), n++);
    }
    return _.currentNode = w, r;
  }
  p(e) {
    let a = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, a), a += i.strings.length - 2) : i._$AI(e[a])), a++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, a, i, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = a, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const a = this._$AM;
    return a !== void 0 && e?.nodeType === 11 && (e = a.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, a = this) {
    e = E(this, e, a), M(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== A && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ee(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && M(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: a, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = D.createElement(he(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(a);
    else {
      const s = new ze(r, this), n = s.u(this.options);
      s.p(a), this.T(n), this._$AH = s;
    }
  }
  _$AC(e) {
    let a = se.get(e.strings);
    return a === void 0 && se.set(e.strings, a = new D(e)), a;
  }
  k(e) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let i, r = 0;
    for (const s of e) r === a.length ? a.push(i = new N(this.O(C()), this.O(C()), this, this.options)) : i = a[r], i._$AI(s), r++;
    r < a.length && (this._$AR(i && i._$AB.nextSibling, r), a.length = r);
  }
  _$AR(e = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); e !== this._$AB; ) {
      const i = X(e).nextSibling;
      X(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, a, i, r, s) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = a, this._$AM = r, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(e, a = this, i, r) {
    const s = this.strings;
    let n = !1;
    if (s === void 0) e = E(this, e, a, 0), n = !M(e) || e !== this._$AH && e !== A, n && (this._$AH = e);
    else {
      const d = e;
      let l, h;
      for (e = s[0], l = 0; l < s.length - 1; l++) h = E(this, d[i + l], a, l), h === A && (h = this._$AH[l]), n ||= !M(h) || h !== this._$AH[l], h === c ? e = c : e !== c && (e += (h ?? "") + s[l + 1]), this._$AH[l] = h;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ce extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class Me extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class De extends L {
  constructor(e, a, i, r, s) {
    super(e, a, i, r, s), this.type = 5;
  }
  _$AI(e, a = this) {
    if ((e = E(this, e, a, 0) ?? c) === A) return;
    const i = this._$AH, r = e === c && i !== c || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== c && (i === c || r);
    r && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ne {
  constructor(e, a, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    E(this, e);
  }
}
const Re = W.litHtmlPolyfillSupport;
Re?.(D, N), (W.litHtmlVersions ??= []).push("3.3.3");
const Oe = (t, e, a) => {
  const i = a?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const s = a?.renderBefore ?? null;
    i._$litPart$ = r = new N(e.insertBefore(C(), s), s, void 0, a ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis;
class z extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Oe(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
z._$litElement$ = !0, z.finalized = !0, F.litElementHydrateSupport?.({ LitElement: z });
const Ue = F.litElementPolyfillSupport;
Ue?.({ LitElement: z });
(F.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = (t) => (e, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: T, reflect: !1, hasChanged: K }, Be = (t = He, e, a) => {
  const { kind: i, metadata: r } = a;
  let s = globalThis.litPropertyMetadata.get(r);
  if (s === void 0 && globalThis.litPropertyMetadata.set(r, s = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(a.name, t), i === "accessor") {
    const { name: n } = a;
    return { set(d) {
      const l = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(n, l, t, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, t, d), d;
    } };
  }
  if (i === "setter") {
    const { name: n } = a;
    return function(d) {
      const l = this[n];
      e.call(this, d), this.requestUpdate(n, l, t, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ue(t) {
  return (e, a) => typeof a == "object" ? Be(t, e, a) : ((i, r, s) => {
    const n = r.hasOwnProperty(s);
    return r.constructor.createProperty(s, i), n ? Object.getOwnPropertyDescriptor(r, s) : void 0;
  })(t, e, a);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return ue({ ...t, state: !0, attribute: !1 });
}
class Le {
  constructor(e) {
    this.connection = e;
  }
  getData() {
    return this.connection.sendMessagePromise({ type: "device_care/get_data" });
  }
  async setPreferences(e) {
    return (await this.connection.sendMessagePromise({ type: "device_care/set_preferences", preferences: e })).preferences;
  }
  getReport(e) {
    return this.connection.sendMessagePromise({ type: "device_care/get_report", window: e });
  }
  generateReport(e) {
    return this.connection.sendMessagePromise({ type: "device_care/generate_report", window: e });
  }
  callEntity(e, a, i) {
    return this.connection.sendMessagePromise({ type: "device_care/call_entity", entity_id: e, service: a, ...i ? { data: i } : {} });
  }
  async subscribe(e) {
    await this.unsubscribe?.(), this.unsubscribe = await this.connection.subscribeMessage(
      (a) => {
        a.event_type === "device_care/updated" && e(a.data?.reason ?? "state");
      },
      { type: "device_care/subscribe_updates" }
    );
  }
  async dispose() {
    const e = this.unsubscribe;
    this.unsubscribe = void 0, e && e();
  }
}
var je = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, f = (t, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Ie(e, a) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (r = (i ? n(e, a, r) : n(r)) || r);
  return i && r && je(e, a, r), r;
};
const p = (t) => {
  const e = {
    grid: "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z",
    room: "M3 21V5l9-3 9 3v16h-7v-6H9v6z",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5.5 12.5L21 21",
    check: "m5 12 4 4L19 6",
    alert: "M12 3 2 21h20L12 3zm0 6v5m0 3v.1",
    motion: "M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1",
    battery: "M2 8h18v9H2zM22 11v3M5 11v3",
    wifi: "M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0m-11 4a5 5 0 0 1 8 0m-4 4h.01",
    close: "M6 6l12 12M18 6 6 18",
    edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z",
    down: "m6 9 6 6 6-6",
    chevron: "m9 18 6-6-6-6",
    report: "M4 19V5m0 14h16M8 15l3-4 3 2 5-7",
    settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 12H2m20 0h-2M12 4V2m0 20v-2M6.3 6.3 4.9 4.9m14.2 14.2-1.4-1.4m0-11.4 1.4-1.4M4.9 19.1l1.4-1.4"
  };
  return o`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${e[t] ?? e.check}></path></svg>`;
}, I = { online: "Online", offline: "Erişilemiyor", partial: "Kısmi sorun", unknown: "Durum bilinmiyor", expected_off: "Bilerek kapalı" }, ne = { motion: "Hareket", occupancy: "Varlık", battery: "Pil", connectivity: "Bağlantı" }, oe = (t, e) => {
  const a = t === "motion" ? "Hareket" : "Varlık";
  return !e || e.meaning === "missing" ? "Veri yok" : e.meaning === "active" ? `${a} algılanıyor` : e.meaning === "inactive" ? `${a} algılanmıyor` : e.meaning === "unavailable" ? "Erişilemiyor" : e.meaning === "expected_off" ? "Bilerek kapalı" : "Durum bilinmiyor";
}, O = (t) => t ? t.replaceAll("_", " ").replace(/\b\w/g, (e) => e.toLocaleUpperCase()) : "Atanmamış";
let g = class extends z {
  constructor() {
    super(...arguments), this.loading = !0, this.error = "", this.query = "", this.editing = !1, this.saving = !1, this.reportWindow = "24h", this.openGroups = {};
  }
  connectedCallback() {
    super.connectedCallback(), this.connect();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.refreshTimer && window.clearTimeout(this.refreshTimer), this.reconnectTimer && window.clearTimeout(this.reconnectTimer);
    const t = this.api;
    this.api = void 0, t?.dispose();
  }
  updated(t) {
    t.has("hass") && this.hass?.connection && !this.api && this.connect();
  }
  async connect() {
    if (!(!this.hass?.connection || this.api)) {
      this.api = new Le(this.hass.connection), await this.load();
      try {
        await this.api.subscribe((t) => this.queueRefresh(t));
      } catch (t) {
        this.error = `Canlı güncelleme bağlantısı kurulamadı: ${this.message(t)}`, this.scheduleReconnect();
      }
    }
  }
  async load() {
    if (this.api) {
      this.loading = !this.data;
      try {
        this.data = await this.api.getData(), this.error = "";
      } catch (t) {
        this.error = this.message(t);
      } finally {
        this.loading = !1;
      }
    }
  }
  message(t) {
    return t instanceof Error ? t.message : String(t);
  }
  queueRefresh(t) {
    this.refreshTimer && window.clearTimeout(this.refreshTimer), this.refreshTimer = window.setTimeout(() => {
      this.load();
    }, 80);
  }
  scheduleReconnect() {
    this.reconnectTimer = window.setTimeout(async () => {
      if (!(!this.api || !this.isConnected))
        try {
          await this.api.subscribe((t) => this.queueRefresh(t)), this.error = "";
        } catch {
          this.scheduleReconnect();
        }
    }, 5e3);
  }
  get visibleDevices() {
    if (!this.data) return [];
    const t = this.data.preferences, e = new Set(t.excluded_device_ids), a = t.included_device_ids, i = this.query.trim().toLocaleLowerCase();
    return this.data.all_devices.filter((s) => !(t.scope === "area" && s.area_id !== t.scope_value || t.scope === "floor" && s.floor_id !== t.scope_value || t.scope === "label" && !s.labels.includes(t.scope_value ?? "") || t.scope === "integration" && !(s.integrations?.length ? s.integrations.includes(t.scope_value ?? "") : s.integration === t.scope_value) || t.scope === "manual" && a !== null && !a.includes(s.id))).filter((s) => !e.has(s.id) && (!i || [s.name, s.manufacturer, s.model, s.integration, ...s.integrations ?? [], ...s.labels, ...s.entities.map((n) => n.entity_id)].some((n) => n?.toLocaleLowerCase().includes(i)))).sort((s, n) => t.sort === "health" ? this.healthRank(s.health) - this.healthRank(n.health) || s.name.localeCompare(n.name) : t.sort === "area" && this.groupName(s).localeCompare(this.groupName(n)) || s.name.localeCompare(n.name));
  }
  healthRank(t) {
    return { offline: 0, partial: 1, unknown: 2, expected_off: 3, online: 4 }[t];
  }
  groupName(t) {
    const e = this.data?.preferences.group_by ?? "area";
    return e === "floor" ? this.data?.floors.find((a) => a.id === t.floor_id)?.name ?? "Kat atanmamış" : e === "integration" ? (t.integrations?.length ? t.integrations : [t.integration].filter((a) => !!a)).map(O).join(", ") || "Entegrasyon yok" : e === "none" ? "Tüm cihazlar" : this.data?.areas.find((a) => a.id === t.area_id)?.name ?? "Atanmamış";
  }
  async patch(t) {
    if (!(!this.api || !this.data)) {
      this.saving = !0;
      try {
        const e = await this.api.setPreferences(t);
        this.data = { ...this.data, preferences: e }, this.error = "", this.editing || await this.load();
      } catch (e) {
        this.error = `Ayarlar kaydedilemedi: ${this.message(e)}`;
      } finally {
        this.saving = !1;
      }
    }
  }
  async saveEditor() {
    const { schema_version: t, ...e } = this.data.preferences;
    await this.patch(e), this.error || (this.editing = !1);
  }
  editPreference(t, e) {
    this.data && (this.data = { ...this.data, preferences: { ...this.data.preferences, [t]: e } });
  }
  async changeSetting(t, e) {
    if (!this.api) return;
    const a = t.domain === "number" ? "set_value" : t.domain === "select" ? "select_option" : "turn_on", i = t.domain === "number" ? { value: Number(e) } : t.domain === "select" ? { option: String(e) } : {};
    this.savingEntity = t.entity_id;
    try {
      await this.api.callEntity(t.entity_id, a, i), await this.load();
    } catch (r) {
      this.error = `“${t.name}” güncellenemedi: ${this.message(r)}`;
    } finally {
      this.savingEntity = void 0;
    }
  }
  async toggleSwitch(t) {
    if (this.api) {
      this.savingEntity = t.entity_id;
      try {
        await this.api.callEntity(t.entity_id, t.state === "on" ? "turn_off" : "turn_on"), await this.load();
      } catch (e) {
        this.error = `“${t.name}” güncellenemedi: ${this.message(e)}`;
      } finally {
        this.savingEntity = void 0;
      }
    }
  }
  async showReport(t = !1) {
    if (this.api)
      try {
        this.report = t ? await this.api.generateReport(this.reportWindow) : await this.api.getReport(this.reportWindow), this.error = "";
      } catch (e) {
        this.error = `Rapor alınamadı: ${this.message(e)}`;
      }
  }
  groupDevices(t) {
    const e = /* @__PURE__ */ new Map();
    for (const a of t) {
      const i = this.groupName(a);
      e.set(i, [...e.get(i) ?? [], a]);
    }
    return [...e.entries()];
  }
  selectDevice(t) {
    this.selectedId = t.id;
  }
  render() {
    if (this.loading && !this.data) return o`<div class="loading">Cihazlar yükleniyor…</div>`;
    if (!this.data) return o`<main class="shell"><h1>Cihazlar & Bakım</h1>${this.error ? o`<div class="error" role="alert">${this.error}</div>` : c}<button class="button" @click=${() => this.load()}>Yeniden dene</button></main>`;
    const t = this.visibleDevices, e = t.find((l) => l.id === this.selectedId), a = this.data.preferences.layout, i = t.filter((l) => l.health === "offline" || l.health === "partial").length, r = t.filter((l) => l.health === "online").length, s = t.filter((l) => l.health === "expected_off").length, n = t.filter((l) => l.health === "unknown").length, d = t.filter((l) => {
      const h = l.signals.battery, m = h ? this.batteryNumber(h) : null;
      return h?.meaning === "low" || h?.unit?.trim() === "%" && m !== null && m < 20;
    }).length;
    return o`<main class="shell">
      <header class="top"><div><h1>Cihazlar & Bakım</h1><p class="subtitle">${t.length} cihaz izleniyor · ${this.data.monitoring_since ? `İzleme başlangıcı ${this.formatDate(this.data.monitoring_since)}` : "İzleme başlangıç zamanı yok"}</p></div><div class="top-actions">
        ${this.data.is_admin ? o`<button class="button" @click=${() => {
      this.editing = !this.editing, this.editing || this.load();
    }}>${p(this.editing ? "close" : "edit")}<span class="button-label">${this.editing ? "Düzenlemeyi kapat" : "Düzenle"}</span></button>` : c}
        <button class="button" @click=${() => this.report ? this.report = void 0 : void this.showReport()}>${p("report")}<span class="button-label">${this.report ? "Raporu kapat" : "Raporlar"}</span></button>
      </div></header>
      ${this.error ? o`<div class="error" role="alert">${this.error}</div>` : c}
      <section class="summary" aria-label="Cihaz sağlığı özeti"><span class="summary-title">Genel durum</span><span class="metric good">${p("check")} <strong>${r}</strong> erişilebilir</span><span class="metric ${i ? "warn" : ""}">${p("alert")} <strong>${i}</strong> sorunlu</span><span class="metric"><strong>${n}</strong> belirsiz</span><span class="metric"><strong>${s}</strong> bilerek kapalı</span><span class="metric ${d ? "warn" : ""}">${p("battery")} <strong>${d}</strong> düşük pil</span></section>
      ${this.report ? this.renderReport() : c}
      ${this.editing ? this.renderEditor(this.data.all_devices) : c}
      ${this.data.is_admin && this.data.capabilities.settings ? this.renderDeviceSettings(e) : c}
      <div class="toolbar"><label class="search">${p("search")}<input aria-label="Cihazlarda ara" placeholder="Cihaz, üretici veya entity ara" .value=${this.query} @input=${(l) => this.query = l.target.value}></label>
        <select class="select" aria-label="Sıralama" .value=${this.data.preferences.sort} @change=${(l) => void this.patch({ sort: l.target.value })}><option value="name">Ada göre</option><option value="health">Sağlık durumuna göre</option><option value="area">Odaya göre</option></select>
        <div class="tabs" role="tablist" aria-label="Görünüm"><button class=${a === "inventory" ? "active" : ""} role="tab" aria-selected=${a === "inventory"} @click=${() => void this.patch({ layout: "inventory" })}>${p("grid")} Liste</button><button class=${a === "rooms" ? "active" : ""} role="tab" aria-selected=${a === "rooms"} @click=${() => void this.patch({ layout: "rooms" })}>${p("room")} Odalar</button></div>
      </div>
      ${t.length ? a === "inventory" ? this.renderInventory(t) : this.renderRooms(t) : o`<div class="empty">Bu arama ve kapsamda cihaz bulunamadı.</div>`}
      ${e ? this.renderDrawer(e) : c}
    </main>`;
  }
  renderInventory(t) {
    const e = new Set(this.data.preferences.visible_columns);
    return o`<section class="inventory"><div class="table-scroll"><table><thead><tr><th>Cihaz</th><th>Sağlık</th>${e.has("area") ? o`<th>Oda</th>` : c}${e.has("motion") ? o`<th>Hareket / varlık</th>` : c}${e.has("battery") ? o`<th>Pil</th>` : c}${e.has("connectivity") ? o`<th>Bağlantı</th>` : c}<th></th></tr></thead><tbody>
      ${t.map((a) => o`<tr class=${this.selectedId === a.id ? "selected" : ""} @click=${() => this.selectDevice(a)} tabindex="0" @keydown=${(i) => {
      (i.key === "Enter" || i.key === " ") && this.selectDevice(a);
    }}>
        <td><div class="device-name"><span class="device-glyph">${p("settings")}</span><span><span class="name">${a.name}</span>${a.model ? o`<span class="sub">${a.model}</span>` : c}<span class="sub">${this.devicePlatformLine(a)}</span></span></div></td>
        <td data-mobile><span class="health-pill ${a.health}">${p(a.health === "online" ? "check" : "alert")}${I[a.health]}</span></td>
        ${e.has("area") ? o`<td>${this.groupName(a)}</td>` : c}
        ${e.has("motion") ? o`<td data-mobile>${this.renderMotion(a)}</td>` : c}
        ${e.has("battery") ? o`<td data-mobile>${this.renderBattery(a.signals.battery)}</td>` : c}
        ${e.has("connectivity") ? o`<td data-mobile>${this.renderConnectivity(a.signals.connectivity)}</td>` : c}
        <td>${p("chevron")}</td></tr>`)}
      </tbody></table></div><footer class="table-footer"><span>${t.length} cihaz</span><span>Bir cihazı seçerek ayrıntılarını ve desteklenen ayarları açın</span></footer></section>`;
  }
  renderRooms(t) {
    return o`<section class="room-grid">${this.groupDevices(t).map(([e, a]) => o`<article class="room"><button class="room-head" aria-expanded=${this.openGroups[e] !== !1} @click=${() => this.openGroups = { ...this.openGroups, [e]: this.openGroups[e] === !1 }}>${p("room")}<span class="room-title">${e}</span><small>${a.length} cihaz</small>${p("down")}</button>${this.openGroups[e] === !1 ? c : o`<div class="room-body">${a.map((i) => this.renderDeviceCard(i))}</div>`}</article>`)}</section>`;
  }
  renderDeviceCard(t) {
    return o`<article class="device-card" role="button" tabindex="0" @click=${() => this.selectDevice(t)} @keydown=${(e) => {
      e.key === "Enter" && this.selectDevice(t);
    }}><div class="card-head"><span class="device-glyph">${p("settings")}</span><span class="name">${t.name}</span><span class="health-pill ${t.health}">${I[t.health]}</span></div><p class="card-meta">${t.model ? o`<span>${t.model}</span>` : c}<span class="card-meta-secondary">${this.devicePlatformLine(t)}</span></p><div class="signals">${this.renderMotion(t)}${this.renderBattery(t.signals.battery)}${this.renderConnectivity(t.signals.connectivity)}</div></article>`;
  }
  renderMotion(t) {
    const e = t.signals.motion, a = t.signals.occupancy, i = [e && ["motion", e], a && ["occupancy", a]].filter(Boolean), r = i.filter(([s, n], d) => i.findIndex(([, l]) => l.entity_id === n.entity_id) === d);
    return r.length ? o`${r.map(([s, n]) => {
      const d = n.meaning === "active" ? "active" : n.meaning === "unavailable" ? "warning" : n.meaning === "expected_off" ? "expected" : n.meaning === "unknown" || n.meaning === "missing" ? "unknown" : "";
      return o`<span class="signal-pill ${d}" aria-label=${`${ne[s]}: ${oe(s, n)}`}>${p("motion")}${oe(s, n)}</span>`;
    })}` : o`<span class="signal-pill unknown">${p("motion")}Veri yok</span>`;
  }
  batteryNumber(t) {
    const e = (i) => typeof i == "number" && Number.isFinite(i) ? i : typeof i == "string" && i.trim() !== "" && Number.isFinite(Number(i)) ? Number(i) : null, a = e(t.state);
    return t.meaning === "unknown" && a === null ? null : e(t.value);
  }
  renderBattery(t) {
    if (!t || t.meaning === "missing") return o`<span class="signal-pill unknown">${p("battery")}Pil verisi yok</span>`;
    if (t.meaning === "unavailable") return o`<span class="signal-pill warning">${p("battery")}Pil erişilemiyor</span>`;
    if (t.meaning === "low") return o`<span class="signal-pill low">${p("battery")}Pil düşük</span>`;
    if (t.meaning === "ok") return o`<span class="signal-pill">${p("battery")}Pil normal</span>`;
    if (t.meaning === "expected_off") return o`<span class="signal-pill expected">${p("battery")}Bilerek kapalı</span>`;
    const e = t.value, a = this.batteryNumber(t), i = a !== null && t.unit?.trim() === "%" && a < 20, r = a !== null ? `${a}${t.unit ? ` ${t.unit}` : ""}` : e === null ? t.state : `${e}${t.unit ? ` ${t.unit}` : ""}`;
    if (t.meaning === "unknown" && a === null) return o`<span class="signal-pill unknown">${p("battery")}Pil bilinmiyor</span>`;
    const s = t.meaning === "unknown" ? "unknown" : "";
    return o`<span class="signal-pill ${s} ${i ? "low" : ""}">${p("battery")}Pil ${r}${t.meaning === "unknown" ? " · durum bilinmiyor" : ""}</span>`;
  }
  renderConnectivity(t) {
    if (!t || t.meaning === "missing") return o``;
    const e = t.meaning === "unavailable" ? "Bağlantı yok" : t.meaning === "unknown" ? "Bağlantı bilinmiyor" : String(t.value ?? t.state);
    return o`<span class="signal-pill ${t.meaning === "unavailable" ? "warning" : t.meaning === "unknown" ? "unknown" : ""}">${p("wifi")}${e}</span>`;
  }
  renderDrawer(t) {
    return o`<div class="drawer-backdrop" @click=${() => this.selectedId = void 0}></div><aside class="drawer" aria-label=${`${t.name} ayrıntıları`}><div class="drawer-head"><span class="device-glyph">${p("settings")}</span><div><h2>${t.name}</h2>${t.model ? o`<div class="sub">${t.model}</div>` : c}<div class="sub">${this.devicePlatformLine(t)}</div></div><button class="button ghost close" aria-label="Kapat" @click=${() => this.selectedId = void 0}>${p("close")}</button></div>
      <section class="section"><h3>Sağlık</h3><div class="detail-row"><span>Durum</span><strong>${I[t.health]}</strong></div>${t.health_reason ? o`<div class="detail-row"><span>Açıklama</span><span>${O(t.health_reason)}</span></div>` : c}<div class="detail-row"><span>Oda</span><span>${this.groupName(t)}</span></div><div class="detail-row"><span>Etiketler</span><span>${t.labels.length ? t.labels.join(", ") : "—"}</span></div>
      ${t.signals.motion ? o`<div class="detail-row"><span>Hareket</span>${this.renderMotion(t)}</div>` : c}${t.signals.occupancy && t.signals.occupancy.entity_id !== t.signals.motion?.entity_id ? o`<div class="detail-row"><span>Varlık</span>${this.renderMotion({ ...t, signals: { ...t.signals, motion: null } })}</div>` : c}${t.signals.battery ? o`<div class="detail-row"><span>Pil</span>${this.renderBattery(t.signals.battery)}</div>` : c}</section>
      <section class="section"><h3>Varlıklar (${t.entities.length})</h3>${t.entities.map((e) => o`<div class="entity-row"><div class="entity-title"><strong>${e.name}</strong><small>${e.entity_id}${e.disabled ? " · devre dışı" : ""}</small></div><span class="sub">${e.state}</span></div>`)}</section></aside>`;
  }
  renderEditor(t) {
    const e = this.data.preferences;
    return o`<section class="settings-panel"><h2>Görünüm ve kapsam</h2><div class="settings-grid"><label class="field">Cihaz kapsamı<select .value=${e.scope} @change=${(a) => this.changeScope(a.target.value)}><option value="all">Tüm cihazlar</option><option value="area">Oda</option><option value="floor">Kat</option><option value="label">Etiket</option><option value="integration">Entegrasyon</option><option value="manual">Elle seç</option></select></label>${this.renderScopeValue(e)}<label class="field">Gruplama<select .value=${e.group_by} @change=${(a) => this.editPreference("group_by", a.target.value)}><option value="area">Odaya göre</option><option value="floor">Kata göre</option><option value="integration">Entegrasyona göre</option><option value="none">Gruplama yok</option></select></label><label class="field">Sıralama<select .value=${e.sort} @change=${(a) => this.editPreference("sort", a.target.value)}><option value="name">Ada göre</option><option value="health">Sağlığa göre</option><option value="area">Odaya göre</option></select></label><label class="field">Başlangıç görünümü<select .value=${e.layout} @change=${(a) => this.editPreference("layout", a.target.value)}><option value="inventory">Kompakt envanter</option><option value="rooms">Oda kartları</option></select></label></div>
      <label class="checkline"><input type="checkbox" .checked=${e.auto_include_new} ?disabled=${e.scope !== "manual"} @change=${(a) => this.editPreference("auto_include_new", a.target.checked)}> Yeni bulunan cihazları otomatik dahil et (elle seçilen kapsamda)</label>
      <div class="settings-grid"><label class="field">Geçmiş saklama süresi (gün)<input type="number" min="1" max="365" step="1" .value=${String(e.retention_days)} @change=${(a) => this.editPreference("retention_days", Math.max(1, Math.min(365, Number(a.target.value))))}></label><label class="checkline"><input type="checkbox" .checked=${e.weekly_report_enabled} @change=${(a) => this.editPreference("weekly_report_enabled", a.target.checked)}> Haftalık rapor bildirimi (Pazartesi 09.00)</label></div>
      <div class="subhead">Tabloda gösterilen sütunlar</div><div class="settings-grid">${[["area", "Oda"], ["motion", "Hareket / varlık"], ["battery", "Pil"], ["connectivity", "Bağlantı"]].map(([a, i]) => o`<label class="checkline"><input type="checkbox" .checked=${e.visible_columns.includes(a)} @change=${(r) => {
      const s = r.target.checked;
      this.editPreference("visible_columns", s ? [...e.visible_columns, a] : e.visible_columns.filter((n) => n !== a));
    }}>${i}</label>`)}</div>
      <div class="subhead">Cihaz istisnaları ve elle seçilen cihazlar <span class="sub">(hariç tutulanlar kapsam kuralının önceliğindedir)</span></div><div class="settings-devices">${t.map((a) => {
      const i = e.excluded_device_ids.includes(a.id), r = e.included_device_ids === null ? !i : e.included_device_ids.includes(a.id);
      return o`<label class="settings-device"><input type="checkbox" .checked=${e.scope === "manual" ? r : !i} @change=${(s) => {
        const n = s.target.checked;
        if (e.scope === "manual") {
          const d = new Set(e.included_device_ids ?? this.data.all_devices.map((h) => h.id)), l = new Set(e.excluded_device_ids);
          n ? (d.add(a.id), l.delete(a.id)) : d.delete(a.id), this.editPreference("included_device_ids", [...d]), this.editPreference("excluded_device_ids", [...l]);
        } else {
          const d = new Set(e.excluded_device_ids);
          n ? d.delete(a.id) : d.add(a.id), this.editPreference("excluded_device_ids", [...d]);
        }
      }}><span>${a.name}</span><small>${this.groupName(a)}</small></label>`;
    })}</div>
      <div class="subhead">Algılayıcı kaynakları</div><div class="sources">${t.flatMap((a) => ["motion", "occupancy", "battery", "connectivity"].map((i) => {
      const r = e.source_overrides[a.id]?.[i] ?? "", s = a.entities.filter((n) => !n.disabled && (i === "motion" ? n.domain === "binary_sensor" && n.device_class === "motion" : i === "occupancy" ? n.domain === "binary_sensor" && ["occupancy", "presence"].includes(n.device_class ?? "") : i === "battery" ? n.device_class === "battery" || n.domain === "sensor" && ["%", "v", "mv"].includes((n.unit ?? "").toLocaleLowerCase()) && `${n.entity_id} ${n.name}`.toLocaleLowerCase().includes("battery") : n.domain === "binary_sensor" && n.device_class === "connectivity"));
      return s.length ? o`<label class="field">${a.name} · ${ne[i]}<select .value=${r} @change=${(n) => {
        const d = { ...e.source_overrides, [a.id]: { motion: null, occupancy: null, battery: null, connectivity: null, ...e.source_overrides[a.id], [i]: n.target.value || null } };
        this.editPreference("source_overrides", d);
      }}><option value="">Otomatik kaynak</option>${s.map((n) => o`<option value=${n.entity_id}>${n.name} (${n.entity_id})</option>`)}</select></label>` : c;
    }))}</div>
      <div class="subhead">Bilerek kapalı kuralları</div>${e.expected_off_rules.map((a, i) => o`<div class="rule-row"><input class="plain-input" aria-label="Entity" .value=${a.entity_id} @change=${(r) => this.updateRule(i, "entity_id", r.target.value)}><input class="plain-input" aria-label="Beklenen durum" .value=${a.state} @change=${(r) => this.updateRule(i, "state", r.target.value)}><button class="button" aria-label="Kuralı sil" @click=${() => this.editPreference("expected_off_rules", e.expected_off_rules.filter((r, s) => s !== i))}>${p("close")}</button></div>`)}
      <button class="button" @click=${() => this.editPreference("expected_off_rules", [...e.expected_off_rules, { id: crypto.randomUUID(), entity_id: "", state: "off" }])}>+ Kural ekle</button>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="button" @click=${() => {
      this.editing = !1, this.load();
    }}>İptal</button><button class="button primary" ?disabled=${this.saving} @click=${() => this.saveEditor()}>{this.saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}</button></div></section>`;
  }
  changeScope(t) {
    const e = this.data.preferences;
    let a = e.included_device_ids;
    t === "manual" && e.scope !== "manual" && (a = this.visibleDevices.map((i) => i.id)), this.editPreference("scope", t), this.editPreference("scope_value", null), this.editPreference("included_device_ids", t === "manual" ? a ?? [] : null);
  }
  renderScopeValue(t) {
    const e = t.scope === "area" ? this.data.areas : t.scope === "floor" ? this.data.floors : t.scope === "label" ? this.data.labels : t.scope === "integration" ? [...new Set(this.data.all_devices.flatMap((a) => a.integrations?.length ? a.integrations : a.integration ? [a.integration] : []))].map((a) => ({ id: a, name: O(a) })) : [];
    return ["area", "floor", "label", "integration"].includes(t.scope) ? o`<label class="field">${{ area: "Oda", floor: "Kat", label: "Etiket", integration: "Entegrasyon" }[t.scope]}<select .value=${t.scope_value ?? ""} @change=${(a) => this.editPreference("scope_value", a.target.value || null)}><option value="">Seçiniz</option>${e.map((a) => o`<option value=${a.id}>${a.name}</option>`)}</select></label>` : c;
  }
  updateRule(t, e, a) {
    const i = [...this.data.preferences.expected_off_rules];
    i[t] = { ...i[t], [e]: a }, this.editPreference("expected_off_rules", i);
  }
  renderDeviceSettings(t) {
    if (!t) return c;
    const e = t.entities.filter((a) => !a.disabled && ["number", "select", "switch"].includes(a.domain) && a.entity_category === "config");
    return e.length ? o`<section class="settings-panel"><h2>${t.name} · Desteklenen ayarlar</h2>${e.map((a) => o`<div class="entity-row"><div class="entity-title"><strong>${a.name}</strong><small>${a.entity_id}${a.entity_category ? ` · ${a.entity_category}` : ""}</small></div>${a.domain === "switch" ? o`<button class="button" ?disabled=${this.savingEntity === a.entity_id || this.stateUnavailable(a)} @click=${() => this.toggleSwitch(a)}>${this.stateUnavailable(a) ? a.state === "unavailable" ? "Erişilemiyor" : "Durum bilinmiyor" : a.state === "on" ? "Açık" : "Kapalı"}</button>` : a.domain === "select" ? this.renderSelect(a) : this.renderNumber(a)}</div>`)}</section>` : c;
  }
  stateUnavailable(t) {
    return ["unknown", "unavailable"].includes(t.state);
  }
  renderSelect(t) {
    const e = Array.isArray(t.attributes.options) ? t.attributes.options : [];
    return o`<select class="select" aria-label=${t.name} ?disabled=${this.savingEntity === t.entity_id || this.stateUnavailable(t)} .value=${this.stateUnavailable(t) ? "" : t.state} @change=${(a) => void this.changeSetting(t, a.target.value)}>${this.stateUnavailable(t) ? o`<option value="">${t.state === "unavailable" ? "Erişilemiyor" : "Durum bilinmiyor"}</option>` : c}${e.map((a) => o`<option value=${a}>${a}</option>`)}</select>`;
  }
  renderNumber(t) {
    const e = t.attributes, a = Number(e.min ?? 0), i = Number(e.max ?? 100), r = Number(e.step ?? 1);
    return o`<input class="plain-input" type="number" aria-label=${t.name} .value=${this.stateUnavailable(t) ? "" : t.state} placeholder=${this.stateUnavailable(t) ? t.state === "unavailable" ? "Erişilemiyor" : "Durum bilinmiyor" : ""} min=${a} max=${i} step=${r} ?disabled=${this.savingEntity === t.entity_id || this.stateUnavailable(t)} @change=${(s) => void this.changeSetting(t, Number(s.target.value))}>`;
  }
  renderReport() {
    const t = this.report, e = t.stats;
    return o`<section class="report-panel"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><h2 style="margin:0">Bakım raporu</h2><select class="select" .value=${this.reportWindow} @change=${(a) => {
      this.reportWindow = a.target.value, this.showReport();
    }}><option value="24h">Son 24 saat</option><option value="7d">Son 7 gün</option></select><button class="button primary" style="margin-left:auto" @click=${() => this.showReport(!0)}>Rapor oluştur</button></div>
      <div class="report-stats"><div class="stat"><strong>${this.formatDuration(e.device_outage_seconds)}</strong><span>Cihaz-kesinti toplamı</span></div><div class="stat"><strong>${e.outage_starts}</strong><span>Kesinti başlangıcı</span></div><div class="stat"><strong>${e.outage_intervals}</strong><span>Kesinti aralığı</span></div><div class="stat"><strong>${e.low_battery}</strong><span>Düşük pil</span></div><div class="stat"><strong>${e.missing_data}</strong><span>Eksik veri</span></div></div>
      ${t.ongoing.length ? o`<div class="subhead">Devam eden kesintiler</div>${t.ongoing.map((a) => o`<div class="report-event"><strong>${this.deviceName(a.device_id)}</strong><span>Başlangıç ${this.formatDate(a.start)}</span><span>${this.formatDuration(a.seconds)} · sürüyor</span></div>`)}` : c}
      <div class="report-events">${t.events.filter((a) => !a.ongoing).slice(0, 8).map((a) => o`<div class="report-event"><strong>${this.deviceName(a.device_id)}</strong><span>${this.formatDate(a.start)}</span><span>${this.formatDuration(a.seconds)}</span></div>`)}</div>
      <p class="coverage">${t.coverage_since ? `Veri kapsamı ${this.formatDate(t.coverage_since)} tarihinden itibaren.` : "Veri kapsamı başlangıcı bilinmiyor."} Cihaz kesinti süreleri cihaz bazında toplanır; evin çevrimdışı süresi değildir.</p></section>`;
  }
  deviceName(t) {
    return this.data?.devices.find((e) => e.id === t)?.name ?? t;
  }
  devicePlatformLine(t) {
    const e = t.integrations?.length ? t.integrations : [t.integration].filter((a) => !!a);
    return [t.manufacturer, e.map(O).join(", ")].filter(Boolean).join(" · ") || "Üretici / entegrasyon bilgisi yok";
  }
  formatDate(t) {
    const e = new Date(t);
    return Number.isNaN(e.getTime()) ? t : new Intl.DateTimeFormat(this.hass?.language || "tr", { dateStyle: "short", timeStyle: "short" }).format(e);
  }
  formatDuration(t) {
    const e = Math.round(t / 60);
    if (e < 60) return `${e} dk`;
    const a = Math.floor(e / 60), i = e % 60;
    return i ? `${a} sa ${i} dk` : `${a} sa`;
  }
};
g.styles = ge`
    :host { display:block; color:var(--primary-text-color); --care-accent:#087f8c; --care-accent-soft:color-mix(in srgb,var(--care-accent) 11%,var(--card-background-color,#fff)); --care-warn:#a95000; --care-warn-soft:color-mix(in srgb,#d8761a 12%,var(--card-background-color,#fff)); --care-border:var(--divider-color,#d9dee3); --care-muted:var(--secondary-text-color,#66717c); }
    * { box-sizing:border-box } button, input, select { font:inherit } button { color:inherit; cursor:pointer }
    .shell { max-width:1560px; margin:0 auto; padding:20px clamp(14px,2.5vw,38px) 40px }
    .top { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; margin-bottom:14px }
    h1 { margin:0; font-size:clamp(22px,2vw,29px); letter-spacing:-.035em; font-weight:720 }
    .subtitle { margin:5px 0 0; color:var(--care-muted); font-size:13px }
    .top-actions { display:flex; gap:8px; align-items:center }
    .button { border:1px solid var(--care-border); background:var(--card-background-color,#fff); border-radius:9px; padding:8px 12px; display:inline-flex; gap:7px; align-items:center; font-size:13px; font-weight:600; min-height:36px }
    .button:hover { background:var(--secondary-background-color,#f4f6f7) }.button.primary { background:var(--care-accent); color:white; border-color:var(--care-accent) }.button.ghost { border-color:transparent; background:transparent }
    svg { width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; flex:none }
    .summary { display:flex; align-items:center; gap:10px; padding:11px 14px; border:1px solid var(--care-border); border-radius:12px; background:var(--card-background-color,#fff); margin-bottom:13px; flex-wrap:wrap }
    .summary-title { font-size:13px; font-weight:700; margin-right:auto }.metric { display:flex; gap:6px; align-items:center; color:var(--care-muted); font-size:12px; padding:4px 8px; border-radius:7px; background:var(--secondary-background-color,#f5f7f8) }.metric strong { color:var(--primary-text-color); font-size:13px }
    .metric.warn { color:var(--care-warn); background:var(--care-warn-soft) }.metric.good { color:var(--care-accent); background:var(--care-accent-soft) }
    .toolbar { display:flex; align-items:center; gap:8px; margin:0 0 13px; flex-wrap:wrap }.search { position:relative; flex:1; min-width:180px; max-width:420px }.search svg { position:absolute; left:11px; top:10px; color:var(--care-muted) }.search input { width:100%; padding:8px 12px 8px 36px; border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff); color:inherit; outline:none; min-height:38px }.search input:focus, select:focus, input:focus { outline:2px solid color-mix(in srgb,var(--care-accent) 42%,transparent); outline-offset:1px }
    .select { border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff); color:inherit; padding:8px 30px 8px 10px; min-height:38px; font-size:13px }
    .tabs { display:flex; border:1px solid var(--care-border); padding:3px; border-radius:10px; background:var(--card-background-color,#fff); margin-left:auto }.tabs button { border:0; border-radius:7px; padding:6px 9px; display:flex; gap:6px; align-items:center; background:transparent; color:var(--care-muted); font-size:12px }.tabs button.active { color:var(--primary-text-color); background:var(--secondary-background-color,#eff2f4); font-weight:700 }
    .inventory { border:1px solid var(--care-border); border-radius:12px; overflow:hidden; background:var(--card-background-color,#fff) }.table-scroll { overflow:auto; max-height:calc(100vh - 300px); min-height:180px }
    table { width:100%; border-collapse:collapse; min-width:740px } th { text-align:left; font-size:10px; letter-spacing:.075em; text-transform:uppercase; color:var(--care-muted); font-weight:650; padding:10px 12px; background:var(--secondary-background-color,#f7f8f9); white-space:nowrap; position:sticky; top:0; z-index:1 }
    td { border-top:1px solid var(--care-border); padding:9px 12px; font-size:13px; vertical-align:middle } tbody tr { cursor:pointer } tbody tr:hover, tbody tr.selected { background:var(--secondary-background-color,#f7f8f9) }.device-name { display:flex; gap:9px; align-items:center; min-width:190px }.device-name > span:last-child { min-width:0 }.device-name .name,.device-name .sub { display:block }.device-glyph { width:30px; height:30px; display:grid; place-items:center; border-radius:8px; color:var(--care-muted); background:var(--secondary-background-color,#f1f3f4) }.name { font-weight:650 }.sub { font-size:11px; color:var(--care-muted); margin-top:2px }.health-pill, .signal-pill { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:620; border-radius:999px; padding:5px 8px; white-space:nowrap; background:var(--secondary-background-color,#f2f4f5); color:var(--care-muted) }.health-pill.online { color:var(--care-accent); background:var(--care-accent-soft) }.health-pill.offline, .health-pill.partial { color:var(--care-warn); background:var(--care-warn-soft) }.health-pill.expected_off { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }
    .signal-pill.active { color:var(--care-accent); background:var(--care-accent-soft); border:1px solid color-mix(in srgb,var(--care-accent) 24%,transparent) }.signal-pill.warning { color:var(--care-warn); background:var(--care-warn-soft) }.signal-pill.expected { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }.signal-pill.low { color:var(--care-warn); background:var(--care-warn-soft); font-weight:700 }.signal-pill.unknown { border:1px dashed var(--care-border); background:transparent }
    .signal-pill svg { width:14px;height:14px }.battery { font-variant-numeric:tabular-nums; white-space:nowrap }.battery.low { color:var(--care-warn); font-weight:700 }.table-footer { border-top:1px solid var(--care-border); padding:9px 12px; color:var(--care-muted); font-size:11px; display:flex; justify-content:space-between; gap:10px }
    .room-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px }.room { border:1px solid var(--care-border); border-radius:12px; overflow:hidden; background:var(--card-background-color,#fff); min-width:0 }.room-head { width:100%; border:0; background:transparent; display:flex; align-items:center; gap:9px; padding:13px 14px; text-align:left }.room-head .room-title { font-weight:700; font-size:14px }.room-head small { color:var(--care-muted); margin-left:auto; font-size:11px }.room-body { border-top:1px solid var(--care-border); padding:9px; display:grid; gap:8px }.device-card { border:1px solid var(--care-border); border-radius:10px; padding:11px; cursor:pointer; min-width:0 }.device-card:hover { border-color:color-mix(in srgb,var(--care-accent) 42%,var(--care-border)) }.card-head { display:flex; gap:8px; align-items:flex-start }.card-head .name { flex:1; font-size:13px }.card-meta { color:var(--care-muted); font-size:11px; margin:4px 0 9px; display:grid; gap:2px }.card-meta-secondary { color:var(--care-muted) }.signals { display:flex; flex-wrap:wrap; gap:6px }.signal-pill { font-size:10px; padding:4px 7px }.card-health { margin-top:8px; display:flex; align-items:center; gap:7px; font-size:11px; color:var(--care-muted) }
    .drawer-backdrop { position:fixed; inset:0; background:#0005; z-index:8 }.drawer { position:fixed; z-index:9; right:0; top:0; bottom:0; width:min(460px,94vw); background:var(--primary-background-color,#fff); box-shadow:-12px 0 36px #0002; overflow:auto; padding:20px }.drawer-head { display:flex; align-items:flex-start; gap:12px; border-bottom:1px solid var(--care-border); padding-bottom:15px }.drawer-head h2 { margin:0; font-size:20px }.drawer-head .close { margin-left:auto }.section { padding:15px 0; border-bottom:1px solid var(--care-border) }.section h3 { margin:0 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--care-muted) }.detail-row { display:flex; justify-content:space-between; gap:16px; padding:6px 0; font-size:13px }.detail-row span:first-child { color:var(--care-muted) }.entity-row { border-top:1px solid var(--care-border); padding:10px 0; display:flex; justify-content:space-between; align-items:center; gap:10px }.entity-row:first-of-type { border:0 }.entity-title { min-width:0 }.entity-title strong { font-size:12px; display:block; overflow-wrap:anywhere }.entity-title small { color:var(--care-muted); font-size:11px }
    .settings-panel, .report-panel { border:1px solid var(--care-border); border-radius:12px; background:var(--card-background-color,#fff); padding:16px; margin-bottom:12px }.settings-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px }.field { display:flex; flex-direction:column; gap:5px; font-size:12px; color:var(--care-muted) }.field select, .field input { width:100%; border:1px solid var(--care-border); border-radius:8px; background:var(--primary-background-color,#fff); color:inherit; padding:8px; min-height:36px }.settings-panel h2,.report-panel h2 { margin:0 0 12px; font-size:16px }.subhead { margin:16px 0 8px; font-size:12px; font-weight:700 }.checkline { display:flex; gap:8px; align-items:center; font-size:12px; margin:8px 0 }.settings-devices { border:1px solid var(--care-border); border-radius:8px; max-height:210px; overflow:auto; padding:8px 10px }.settings-device { display:flex; gap:8px; padding:5px 0; align-items:center; font-size:12px }.settings-device small { color:var(--care-muted); margin-left:auto }.sources { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px }.rule-row { display:grid; grid-template-columns:1fr 1fr auto; gap:8px; margin:7px 0 }.plain-input { padding:7px 9px; border:1px solid var(--care-border); border-radius:7px; background:var(--primary-background-color,#fff); color:inherit; min-width:0 }.error { border:1px solid color-mix(in srgb,#c14635 32%,var(--care-border)); background:color-mix(in srgb,#c14635 8%,var(--card-background-color,#fff)); color:#9c3026; border-radius:9px; padding:10px 12px; margin:10px 0; font-size:13px }.empty { padding:48px 20px; text-align:center; color:var(--care-muted) }.loading { padding:60px 16px; text-align:center; color:var(--care-muted) }.report-stats { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:8px }.stat { padding:10px; border-radius:9px; background:var(--secondary-background-color,#f5f7f8) }.stat strong { display:block; font-size:18px; font-variant-numeric:tabular-nums }.stat span { display:block; color:var(--care-muted); font-size:10px; margin-top:2px }.report-events { margin-top:12px; border-top:1px solid var(--care-border) }.report-event { display:flex; gap:12px; padding:8px 0; font-size:12px; border-bottom:1px solid var(--care-border) }.report-event span:last-child { margin-left:auto; color:var(--care-muted) }.coverage { font-size:11px; color:var(--care-muted); margin-top:12px }
    @media (max-width:1100px) { .room-grid { grid-template-columns:repeat(2,minmax(0,1fr)) } }
    @media (max-width:720px) { .shell { padding:14px 12px 26px }.top { align-items:center }.top-actions .button-label { display:none }.top-actions .button { padding:8px }.summary { gap:6px; padding:9px }.summary-title { width:100%; margin:0 0 2px }.metric { font-size:11px; padding:4px 6px }.toolbar { gap:6px }.search { min-width:100%; max-width:none }.tabs { margin-left:0; order:2 }.toolbar > .select { flex:1; min-width:110px }.room-grid { grid-template-columns:minmax(0,1fr) }.table-scroll { max-height:none; overflow:visible }.inventory { border:0; background:transparent; overflow:visible } table,tbody { display:block; min-width:0 } thead { display:none } tbody { display:grid; gap:8px } tbody tr { display:flex; flex-direction:column; border:1px solid var(--care-border); border-radius:10px; padding:10px; background:var(--card-background-color,#fff) } td { display:none; border:0; padding:4px 0 } td:first-child, td[data-mobile] { display:block } td:first-child { padding:0 0 6px }.table-footer { margin-top:8px; border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff) }.settings-grid { grid-template-columns:1fr 1fr }.report-stats { grid-template-columns:repeat(2,minmax(0,1fr)) }.report-stats .stat:first-child { grid-column:span 2 }.sources { grid-template-columns:1fr }.rule-row { grid-template-columns:1fr 1fr auto } }
    @media (prefers-reduced-motion: no-preference) { .button, .device-card, tbody tr { transition:background-color .15s ease,border-color .15s ease } }
  `;
f([
  ue({ attribute: !1 })
], g.prototype, "hass", 2);
f([
  b()
], g.prototype, "data", 2);
f([
  b()
], g.prototype, "loading", 2);
f([
  b()
], g.prototype, "error", 2);
f([
  b()
], g.prototype, "query", 2);
f([
  b()
], g.prototype, "selectedId", 2);
f([
  b()
], g.prototype, "editing", 2);
f([
  b()
], g.prototype, "saving", 2);
f([
  b()
], g.prototype, "report", 2);
f([
  b()
], g.prototype, "reportWindow", 2);
f([
  b()
], g.prototype, "openGroups", 2);
f([
  b()
], g.prototype, "savingEntity", 2);
g = f([
  Te("device-care-panel")
], g);
export {
  g as DeviceCarePanel
};
