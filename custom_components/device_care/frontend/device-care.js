/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, V = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), F = /* @__PURE__ */ new WeakMap();
let le = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (V && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = F.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && F.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const me = (a) => new le(typeof a == "string" ? a : a + "", void 0, q), ge = (a, ...e) => {
  const t = a.length === 1 ? a[0] : e.reduce((i, r, s) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + a[s + 1], a[0]);
  return new le(t, a, q);
}, fe = (a, e) => {
  if (V) a.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), r = N.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = t.cssText, a.appendChild(i);
  }
}, J = V ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return me(t);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: be, defineProperty: ve, getOwnPropertyDescriptor: $e, getOwnPropertyNames: ye, getOwnPropertySymbols: xe, getPrototypeOf: _e } = Object, B = globalThis, Y = B.trustedTypes, we = Y ? Y.emptyScript : "", ke = B.reactiveElementPolyfillSupport, P = (a, e) => a, T = { toAttribute(a, e) {
  switch (e) {
    case Boolean:
      a = a ? we : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, e) {
  let t = a;
  switch (e) {
    case Boolean:
      t = a !== null;
      break;
    case Number:
      t = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(a);
      } catch {
        t = null;
      }
  }
  return t;
} }, K = (a, e) => !be(a, e), Q = { attribute: !0, type: String, converter: T, reflect: !1, useDefault: !1, hasChanged: K };
Symbol.metadata ??= Symbol("metadata"), B.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Q) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, t);
      r !== void 0 && ve(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: r, set: s } = $e(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
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
      const t = this.properties, i = [...ye(t), ...xe(t)];
      for (const r of i) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, r] of t) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const r = this._$Eu(t, i);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) t.unshift(J(r));
    } else e !== void 0 && t.push(J(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
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
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
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
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const s = (i.converter?.toAttribute !== void 0 ? i.converter : T).toAttribute(t, i.type);
      this._$Em = e, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const s = i.getPropertyOptions(r), n = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : T;
      this._$Em = r;
      const d = n.fromAttribute(t, s.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, r = !1, s) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (s = this[e]), i ??= n.getPropertyOptions(e), !((i.hasChanged ?? K)(s, t) || i.useDefault && i.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: r, wrapped: s }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), s !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
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
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[P("elementProperties")] = /* @__PURE__ */ new Map(), A[P("finalized")] = /* @__PURE__ */ new Map(), ke?.({ ReactiveElement: A }), (B.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, X = (a) => a, H = W.trustedTypes, ee = H ? H.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, ce = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + y, Ae = `<${de}>`, w = document, M = () => w.createComment(""), D = (a) => a === null || typeof a != "object" && typeof a != "function", G = Array.isArray, Ee = (a) => G(a) || typeof a?.[Symbol.iterator] == "function", L = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, te = /-->/g, ae = />/g, x = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ie = /'/g, re = /"/g, pe = /^(?:script|style|textarea|title)$/i, Se = (a) => (e, ...t) => ({ _$litType$: a, strings: e, values: t }), l = Se(1), E = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), se = /* @__PURE__ */ new WeakMap(), _ = w.createTreeWalker(w, 129);
function he(a, e) {
  if (!G(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ee !== void 0 ? ee.createHTML(e) : e;
}
const ze = (a, e) => {
  const t = a.length - 1, i = [];
  let r, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = z;
  for (let d = 0; d < t; d++) {
    const o = a[d];
    let u, m, p = -1, v = 0;
    for (; v < o.length && (n.lastIndex = v, m = n.exec(o), m !== null); ) v = n.lastIndex, n === z ? m[1] === "!--" ? n = te : m[1] !== void 0 ? n = ae : m[2] !== void 0 ? (pe.test(m[2]) && (r = RegExp("</" + m[2], "g")), n = x) : m[3] !== void 0 && (n = x) : n === x ? m[0] === ">" ? (n = r ?? z, p = -1) : m[1] === void 0 ? p = -2 : (p = n.lastIndex - m[2].length, u = m[1], n = m[3] === void 0 ? x : m[3] === '"' ? re : ie) : n === re || n === ie ? n = x : n === te || n === ae ? n = z : (n = x, r = void 0);
    const $ = n === x && a[d + 1].startsWith("/>") ? " " : "";
    s += n === z ? o + Ae : p >= 0 ? (i.push(u), o.slice(0, p) + ce + o.slice(p) + y + $) : o + y + (p === -2 ? d : $);
  }
  return [he(a, s + (a[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class R {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let s = 0, n = 0;
    const d = e.length - 1, o = this.parts, [u, m] = ze(e, t);
    if (this.el = R.createElement(u, i), _.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = _.nextNode()) !== null && o.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(ce)) {
          const v = m[n++], $ = r.getAttribute(p).split(y), U = /([.?@])?(.*)/.exec(v);
          o.push({ type: 1, index: s, name: U[2], strings: $, ctor: U[1] === "." ? Ce : U[1] === "?" ? Me : U[1] === "@" ? De : j }), r.removeAttribute(p);
        } else p.startsWith(y) && (o.push({ type: 6, index: s }), r.removeAttribute(p));
        if (pe.test(r.tagName)) {
          const p = r.textContent.split(y), v = p.length - 1;
          if (v > 0) {
            r.textContent = H ? H.emptyScript : "";
            for (let $ = 0; $ < v; $++) r.append(p[$], M()), _.nextNode(), o.push({ type: 2, index: ++s });
            r.append(p[v], M());
          }
        }
      } else if (r.nodeType === 8) if (r.data === de) o.push({ type: 2, index: s });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(y, p + 1)) !== -1; ) o.push({ type: 7, index: s }), p += y.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const i = w.createElement("template");
    return i.innerHTML = e, i;
  }
}
function S(a, e, t = a, i) {
  if (e === E) return e;
  let r = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const s = D(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== s && (r?._$AO?.(!1), s === void 0 ? r = void 0 : (r = new s(a), r._$AT(a, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = r : t._$Cl = r), r !== void 0 && (e = S(a, r._$AS(a, e.values), r, i)), e;
}
class Pe {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, r = (e?.creationScope ?? w).importNode(t, !0);
    _.currentNode = r;
    let s = _.nextNode(), n = 0, d = 0, o = i[0];
    for (; o !== void 0; ) {
      if (n === o.index) {
        let u;
        o.type === 2 ? u = new O(s, s.nextSibling, this, e) : o.type === 1 ? u = new o.ctor(s, o.name, o.strings, this, e) : o.type === 6 && (u = new Re(s, this, e)), this._$AV.push(u), o = i[++d];
      }
      n !== o?.index && (s = _.nextNode(), n++);
    }
    return _.currentNode = w, r;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class O {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = S(this, e, t), D(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ee(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = R.createElement(he(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const s = new Pe(r, this), n = s.u(this.options);
      s.p(t), this.T(n), this._$AH = s;
    }
  }
  _$AC(e) {
    let t = se.get(e.strings);
    return t === void 0 && se.set(e.strings, t = new R(e)), t;
  }
  k(e) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const s of e) r === t.length ? t.push(i = new O(this.O(M()), this.O(M()), this, this.options)) : i = t[r], i._$AI(s), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = X(e).nextSibling;
      X(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, r, s) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(e, t = this, i, r) {
    const s = this.strings;
    let n = !1;
    if (s === void 0) e = S(this, e, t, 0), n = !D(e) || e !== this._$AH && e !== E, n && (this._$AH = e);
    else {
      const d = e;
      let o, u;
      for (e = s[0], o = 0; o < s.length - 1; o++) u = S(this, d[i + o], t, o), u === E && (u = this._$AH[o]), n ||= !D(u) || u !== this._$AH[o], u === c ? e = c : e !== c && (e += (u ?? "") + s[o + 1]), this._$AH[o] = u;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ce extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class Me extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class De extends j {
  constructor(e, t, i, r, s) {
    super(e, t, i, r, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = S(this, e, t, 0) ?? c) === E) return;
    const i = this._$AH, r = e === c && i !== c || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== c && (i === c || r);
    r && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Re {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    S(this, e);
  }
}
const Oe = W.litHtmlPolyfillSupport;
Oe?.(R, O), (W.litHtmlVersions ??= []).push("3.3.3");
const Ue = (a, e, t) => {
  const i = t?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const s = t?.renderBefore ?? null;
    i._$litPart$ = r = new O(e.insertBefore(M(), s), s, void 0, t ?? {});
  }
  return r._$AI(a), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis;
class C extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ue(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return E;
  }
}
C._$litElement$ = !0, C.finalized = !0, Z.litElementHydrateSupport?.({ LitElement: C });
const Ne = Z.litElementPolyfillSupport;
Ne?.({ LitElement: C });
(Z.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = (a) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(a, e);
  }) : customElements.define(a, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: T, reflect: !1, hasChanged: K }, Be = (a = He, e, t) => {
  const { kind: i, metadata: r } = t;
  let s = globalThis.litPropertyMetadata.get(r);
  if (s === void 0 && globalThis.litPropertyMetadata.set(r, s = /* @__PURE__ */ new Map()), i === "setter" && ((a = Object.create(a)).wrapped = !0), s.set(t.name, a), i === "accessor") {
    const { name: n } = t;
    return { set(d) {
      const o = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(n, o, a, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, a, d), d;
    } };
  }
  if (i === "setter") {
    const { name: n } = t;
    return function(d) {
      const o = this[n];
      e.call(this, d), this.requestUpdate(n, o, a, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ue(a) {
  return (e, t) => typeof t == "object" ? Be(a, e, t) : ((i, r, s) => {
    const n = r.hasOwnProperty(s);
    return r.constructor.createProperty(s, i), n ? Object.getOwnPropertyDescriptor(r, s) : void 0;
  })(a, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(a) {
  return ue({ ...a, state: !0, attribute: !1 });
}
class je {
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
  callEntity(e, t, i) {
    return this.connection.sendMessagePromise({ type: "device_care/call_entity", entity_id: e, service: t, ...i ? { data: i } : {} });
  }
  async subscribe(e) {
    await this.unsubscribe?.(), this.unsubscribe = await this.connection.subscribeMessage(
      (t) => {
        t.event_type === "device_care/updated" && e(t.data?.reason ?? "state");
      },
      { type: "device_care/subscribe_updates" }
    );
  }
  async dispose() {
    const e = this.unsubscribe;
    this.unsubscribe = void 0, e && e();
  }
}
var Le = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, f = (a, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Ie(e, t) : e, s = a.length - 1, n; s >= 0; s--)
    (n = a[s]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && Le(e, t, r), r;
};
const h = (a) => {
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
  return l`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${e[a] ?? e.check}></path></svg>`;
}, I = { online: "Online", offline: "Erişilemiyor", partial: "Kısmi sorun", unknown: "Durum bilinmiyor", expected_off: "Bilerek kapalı" }, ne = { motion: "Hareket", occupancy: "Varlık", battery: "Pil", connectivity: "Bağlantı" }, oe = (a, e) => {
  const t = a === "motion" ? "Hareket" : "Varlık";
  return !e || e.meaning === "missing" ? "Veri yok" : e.meaning === "active" ? `${t} algılanıyor` : e.meaning === "inactive" ? `${t} algılanmıyor` : e.meaning === "unavailable" ? "Erişilemiyor" : e.meaning === "expected_off" ? "Bilerek kapalı" : "Durum bilinmiyor";
}, k = (a) => a ? a.replaceAll("_", " ").replace(/\b\w/g, (e) => e.toLocaleUpperCase()) : "Atanmamış";
let g = class extends C {
  constructor() {
    super(...arguments), this.loading = !0, this.error = "", this.query = "", this.editing = !1, this.saving = !1, this.reportWindow = "24h", this.openGroups = {};
  }
  connectedCallback() {
    super.connectedCallback(), this.connect();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.refreshTimer && window.clearTimeout(this.refreshTimer), this.reconnectTimer && window.clearTimeout(this.reconnectTimer);
    const a = this.api;
    this.api = void 0, a?.dispose();
  }
  updated(a) {
    a.has("hass") && this.hass?.connection && !this.api && this.connect();
  }
  async connect() {
    if (!(!this.hass?.connection || this.api)) {
      this.api = new je(this.hass.connection), await this.load();
      try {
        await this.api.subscribe((a) => this.queueRefresh(a));
      } catch (a) {
        this.error = `Canlı güncelleme bağlantısı kurulamadı: ${this.message(a)}`, this.scheduleReconnect();
      }
    }
  }
  async load() {
    if (this.api) {
      this.loading = !this.data;
      try {
        this.data = await this.api.getData(), this.error = "";
      } catch (a) {
        this.error = this.message(a);
      } finally {
        this.loading = !1;
      }
    }
  }
  message(a) {
    return a instanceof Error ? a.message : String(a);
  }
  queueRefresh(a) {
    this.refreshTimer && window.clearTimeout(this.refreshTimer), this.refreshTimer = window.setTimeout(() => {
      this.load();
    }, 80);
  }
  scheduleReconnect() {
    this.reconnectTimer = window.setTimeout(async () => {
      if (!(!this.api || !this.isConnected))
        try {
          await this.api.subscribe((a) => this.queueRefresh(a)), this.error = "";
        } catch {
          this.scheduleReconnect();
        }
    }, 5e3);
  }
  get visibleDevices() {
    if (!this.data) return [];
    const a = this.data.preferences, e = new Set(a.excluded_device_ids), t = a.included_device_ids, i = this.query.trim().toLocaleLowerCase();
    return this.data.all_devices.filter((s) => !(a.scope === "area" && s.area_id !== a.scope_value || a.scope === "floor" && s.floor_id !== a.scope_value || a.scope === "label" && !s.labels.includes(a.scope_value ?? "") || a.scope === "integration" && !(s.integrations?.includes(a.scope_value ?? "") ?? s.integration === a.scope_value) || a.scope === "manual" && t !== null && !t.includes(s.id))).filter((s) => !e.has(s.id) && (!i || [s.name, s.manufacturer, s.model, s.integration, ...s.integrations, ...s.labels, ...s.entities.map((n) => n.entity_id)].some((n) => n?.toLocaleLowerCase().includes(i)))).sort((s, n) => a.sort === "health" ? this.healthRank(s.health) - this.healthRank(n.health) || s.name.localeCompare(n.name) : a.sort === "area" && this.groupName(s).localeCompare(this.groupName(n)) || s.name.localeCompare(n.name));
  }
  healthRank(a) {
    return { offline: 0, partial: 1, unknown: 2, expected_off: 3, online: 4 }[a];
  }
  groupName(a) {
    const e = this.data?.preferences.group_by ?? "area";
    return e === "floor" ? this.data?.floors.find((t) => t.id === a.floor_id)?.name ?? "Kat atanmamış" : e === "integration" ? (a.integrations?.length ? a.integrations : [a.integration].filter((t) => !!t)).map(k).join(", ") || "Entegrasyon yok" : e === "none" ? "Tüm cihazlar" : this.data?.areas.find((t) => t.id === a.area_id)?.name ?? "Atanmamış";
  }
  async patch(a) {
    if (!(!this.api || !this.data)) {
      this.saving = !0;
      try {
        const e = await this.api.setPreferences(a);
        this.data = { ...this.data, preferences: e }, this.error = "", this.editing || await this.load();
      } catch (e) {
        this.error = `Ayarlar kaydedilemedi: ${this.message(e)}`;
      } finally {
        this.saving = !1;
      }
    }
  }
  async saveEditor() {
    const { schema_version: a, ...e } = this.data.preferences;
    await this.patch(e), this.error || (this.editing = !1);
  }
  editPreference(a, e) {
    this.data && (this.data = { ...this.data, preferences: { ...this.data.preferences, [a]: e } });
  }
  async changeSetting(a, e) {
    if (!this.api) return;
    const t = a.domain === "number" ? "set_value" : a.domain === "select" ? "select_option" : "turn_on", i = a.domain === "number" ? { value: Number(e) } : a.domain === "select" ? { option: String(e) } : {};
    this.savingEntity = a.entity_id;
    try {
      await this.api.callEntity(a.entity_id, t, i), await this.load();
    } catch (r) {
      this.error = `“${a.name}” güncellenemedi: ${this.message(r)}`;
    } finally {
      this.savingEntity = void 0;
    }
  }
  async toggleSwitch(a) {
    if (this.api) {
      this.savingEntity = a.entity_id;
      try {
        await this.api.callEntity(a.entity_id, a.state === "on" ? "turn_off" : "turn_on"), await this.load();
      } catch (e) {
        this.error = `“${a.name}” güncellenemedi: ${this.message(e)}`;
      } finally {
        this.savingEntity = void 0;
      }
    }
  }
  async showReport(a = !1) {
    if (this.api)
      try {
        this.report = a ? await this.api.generateReport(this.reportWindow) : await this.api.getReport(this.reportWindow), this.error = "";
      } catch (e) {
        this.error = `Rapor alınamadı: ${this.message(e)}`;
      }
  }
  groupDevices(a) {
    const e = /* @__PURE__ */ new Map();
    for (const t of a) {
      const i = this.groupName(t);
      e.set(i, [...e.get(i) ?? [], t]);
    }
    return [...e.entries()];
  }
  selectDevice(a) {
    this.selectedId = a.id;
  }
  render() {
    if (this.loading && !this.data) return l`<div class="loading">Cihazlar yükleniyor…</div>`;
    if (!this.data) return l`<main class="shell"><h1>Cihazlar & Bakım</h1>${this.error ? l`<div class="error" role="alert">${this.error}</div>` : c}<button class="button" @click=${() => this.load()}>Yeniden dene</button></main>`;
    const a = this.visibleDevices, e = a.find((o) => o.id === this.selectedId), t = this.data.preferences.layout, i = a.filter((o) => o.health === "offline" || o.health === "partial").length, r = a.filter((o) => o.health === "online").length, s = a.filter((o) => o.health === "expected_off").length, n = a.filter((o) => o.health === "unknown").length, d = a.filter((o) => o.signals.battery?.value !== null && Number(o.signals.battery?.value) < 20).length;
    return l`<main class="shell">
      <header class="top"><div><h1>Cihazlar & Bakım</h1><p class="subtitle">${a.length} cihaz izleniyor · ${this.data.monitoring_since ? `İzleme başlangıcı ${this.formatDate(this.data.monitoring_since)}` : "İzleme başlangıç zamanı yok"}</p></div><div class="top-actions">
        ${this.data.is_admin ? l`<button class="button" @click=${() => {
      this.editing = !this.editing, this.editing || this.load();
    }}>${h(this.editing ? "close" : "edit")}<span class="button-label">${this.editing ? "Düzenlemeyi kapat" : "Düzenle"}</span></button>` : c}
        <button class="button" @click=${() => this.report ? this.report = void 0 : void this.showReport()}>${h("report")}<span class="button-label">${this.report ? "Raporu kapat" : "Raporlar"}</span></button>
      </div></header>
      ${this.error ? l`<div class="error" role="alert">${this.error}</div>` : c}
      <section class="summary" aria-label="Cihaz sağlığı özeti"><span class="summary-title">Genel durum</span><span class="metric good">${h("check")} <strong>${r}</strong> erişilebilir</span><span class="metric ${i ? "warn" : ""}">${h("alert")} <strong>${i}</strong> sorunlu</span><span class="metric"><strong>${n}</strong> belirsiz</span><span class="metric"><strong>${s}</strong> bilerek kapalı</span><span class="metric ${d ? "warn" : ""}">${h("battery")} <strong>${d}</strong> düşük pil</span></section>
      ${this.report ? this.renderReport() : c}
      ${this.editing ? this.renderEditor(this.data.all_devices) : c}
      ${this.data.is_admin && this.data.capabilities.settings ? this.renderDeviceSettings(e) : c}
      <div class="toolbar"><label class="search">${h("search")}<input aria-label="Cihazlarda ara" placeholder="Cihaz, üretici veya entity ara" .value=${this.query} @input=${(o) => this.query = o.target.value}></label>
        <select class="select" aria-label="Sıralama" .value=${this.data.preferences.sort} @change=${(o) => void this.patch({ sort: o.target.value })}><option value="name">Ada göre</option><option value="health">Sağlık durumuna göre</option><option value="area">Odaya göre</option></select>
        <div class="tabs" role="tablist" aria-label="Görünüm"><button class=${t === "inventory" ? "active" : ""} role="tab" aria-selected=${t === "inventory"} @click=${() => void this.patch({ layout: "inventory" })}>${h("grid")} Liste</button><button class=${t === "rooms" ? "active" : ""} role="tab" aria-selected=${t === "rooms"} @click=${() => void this.patch({ layout: "rooms" })}>${h("room")} Odalar</button></div>
      </div>
      ${a.length ? t === "inventory" ? this.renderInventory(a) : this.renderRooms(a) : l`<div class="empty">Bu arama ve kapsamda cihaz bulunamadı.</div>`}
      ${e ? this.renderDrawer(e) : c}
    </main>`;
  }
  renderInventory(a) {
    const e = new Set(this.data.preferences.visible_columns);
    return l`<section class="inventory"><div class="table-scroll"><table><thead><tr><th>Cihaz</th><th>Sağlık</th>${e.has("area") ? l`<th>Oda</th>` : c}${e.has("motion") ? l`<th>Hareket / varlık</th>` : c}${e.has("battery") ? l`<th>Pil</th>` : c}${e.has("connectivity") ? l`<th>Bağlantı</th>` : c}<th></th></tr></thead><tbody>
      ${a.map((t) => l`<tr class=${this.selectedId === t.id ? "selected" : ""} @click=${() => this.selectDevice(t)} tabindex="0" @keydown=${(i) => {
      (i.key === "Enter" || i.key === " ") && this.selectDevice(t);
    }}>
        <td><div class="device-name"><span class="device-glyph">${h("settings")}</span><span><span class="name">${t.name}</span><span class="sub">${[t.manufacturer, t.model].filter(Boolean).join(" · ") || k(t.integration)}</span></span></div></td>
        <td data-mobile><span class="health-pill ${t.health}">${h(t.health === "online" ? "check" : "alert")}${I[t.health]}</span></td>
        ${e.has("area") ? l`<td>${this.groupName(t)}</td>` : c}
        ${e.has("motion") ? l`<td data-mobile>${this.renderMotion(t)}</td>` : c}
        ${e.has("battery") ? l`<td data-mobile>${this.renderBattery(t.signals.battery)}</td>` : c}
        ${e.has("connectivity") ? l`<td data-mobile>${this.renderConnectivity(t.signals.connectivity)}</td>` : c}
        <td>${h("chevron")}</td></tr>`)}
      </tbody></table></div><footer class="table-footer"><span>${a.length} cihaz</span><span>Bir cihazı seçerek ayrıntılarını ve desteklenen ayarları açın</span></footer></section>`;
  }
  renderRooms(a) {
    return l`<section class="room-grid">${this.groupDevices(a).map(([e, t]) => l`<article class="room"><button class="room-head" aria-expanded=${this.openGroups[e] !== !1} @click=${() => this.openGroups = { ...this.openGroups, [e]: this.openGroups[e] === !1 }}>${h("room")}<span class="room-title">${e}</span><small>${t.length} cihaz</small>${h("down")}</button>${this.openGroups[e] === !1 ? c : l`<div class="room-body">${t.map((i) => this.renderDeviceCard(i))}</div>`}</article>`)}</section>`;
  }
  renderDeviceCard(a) {
    return l`<article class="device-card" role="button" tabindex="0" @click=${() => this.selectDevice(a)} @keydown=${(e) => {
      e.key === "Enter" && this.selectDevice(a);
    }}><div class="card-head"><span class="device-glyph">${h("settings")}</span><span class="name">${a.name}</span><span class="health-pill ${a.health}">${I[a.health]}</span></div><p class="card-meta">${[a.manufacturer, a.model].filter(Boolean).join(" · ") || k(a.integration)}</p><div class="signals">${this.renderMotion(a)}${this.renderBattery(a.signals.battery)}${this.renderConnectivity(a.signals.connectivity)}</div></article>`;
  }
  renderMotion(a) {
    const e = a.signals.motion, t = a.signals.occupancy;
    [e, t].some((r) => r?.meaning === "active"), [e, t].some((r) => r?.meaning === "unavailable");
    const i = [e && ["motion", e], t && ["occupancy", t]].filter(Boolean);
    return i.length ? l`${i.map(([r, s]) => {
      const n = s.meaning === "active" ? "active" : s.meaning === "unavailable" ? "warning" : s.meaning === "expected_off" ? "expected" : s.meaning === "unknown" || s.meaning === "missing" ? "unknown" : "";
      return l`<span class="signal-pill ${n}" aria-label=${`${ne[r]}: ${oe(r, s)}`}>${h("motion")}${oe(r, s)}</span>`;
    })}` : l`<span class="signal-pill unknown">${h("motion")}Veri yok</span>`;
  }
  renderBattery(a) {
    if (!a || a.meaning === "missing") return l`<span class="signal-pill unknown">${h("battery")}Pil verisi yok</span>`;
    const e = typeof a.value == "number" && a.value <= 20, t = a.value === null ? a.state : `${a.value}${a.unit ? ` ${a.unit}` : ""}`;
    return l`<span class="signal-pill ${a.meaning === "unavailable" ? "warning" : a.meaning === "unknown" ? "unknown" : ""} ${e ? "low" : ""}">${h("battery")}${a.meaning === "unavailable" ? "Pil erişilemiyor" : a.meaning === "unknown" ? "Pil bilinmiyor" : `Pil ${t}`}</span>`;
  }
  renderConnectivity(a) {
    if (!a || a.meaning === "missing") return l``;
    const e = a.meaning === "unavailable" ? "Bağlantı yok" : a.meaning === "unknown" ? "Bağlantı bilinmiyor" : String(a.value ?? a.state);
    return l`<span class="signal-pill ${a.meaning === "unavailable" ? "warning" : a.meaning === "unknown" ? "unknown" : ""}">${h("wifi")}${e}</span>`;
  }
  renderDrawer(a) {
    return l`<div class="drawer-backdrop" @click=${() => this.selectedId = void 0}></div><aside class="drawer" aria-label=${`${a.name} ayrıntıları`}><div class="drawer-head"><span class="device-glyph">${h("settings")}</span><div><h2>${a.name}</h2><div class="sub">${[a.manufacturer, a.model, k(a.integration)].filter(Boolean).join(" · ")}</div></div><button class="button ghost close" aria-label="Kapat" @click=${() => this.selectedId = void 0}>${h("close")}</button></div>
      <section class="section"><h3>Sağlık</h3><div class="detail-row"><span>Durum</span><strong>${I[a.health]}</strong></div>${a.health_reason ? l`<div class="detail-row"><span>Açıklama</span><span>${k(a.health_reason)}</span></div>` : c}<div class="detail-row"><span>Oda</span><span>${this.groupName(a)}</span></div><div class="detail-row"><span>Etiketler</span><span>${a.labels.length ? a.labels.join(", ") : "—"}</span></div>
      ${a.signals.motion ? l`<div class="detail-row"><span>Hareket</span>${this.renderMotion(a)}</div>` : c}${a.signals.occupancy ? l`<div class="detail-row"><span>Varlık</span>${this.renderMotion({ ...a, signals: { ...a.signals, motion: null } })}</div>` : c}${a.signals.battery ? l`<div class="detail-row"><span>Pil</span>${this.renderBattery(a.signals.battery)}</div>` : c}</section>
      <section class="section"><h3>Varlıklar (${a.entities.length})</h3>${a.entities.map((e) => l`<div class="entity-row"><div class="entity-title"><strong>${e.name}</strong><small>${e.entity_id}${e.disabled ? " · devre dışı" : ""}</small></div><span class="sub">${e.state}</span></div>`)}</section></aside>`;
  }
  renderEditor(a) {
    const e = this.data.preferences;
    return l`<section class="settings-panel"><h2>Görünüm ve kapsam</h2><div class="settings-grid"><label class="field">Cihaz kapsamı<select .value=${e.scope} @change=${(t) => this.changeScope(t.target.value)}><option value="all">Tüm cihazlar</option><option value="area">Oda</option><option value="floor">Kat</option><option value="label">Etiket</option><option value="integration">Entegrasyon</option><option value="manual">Elle seç</option></select></label>${this.renderScopeValue(e)}<label class="field">Gruplama<select .value=${e.group_by} @change=${(t) => this.editPreference("group_by", t.target.value)}><option value="area">Odaya göre</option><option value="floor">Kata göre</option><option value="integration">Entegrasyona göre</option><option value="none">Gruplama yok</option></select></label><label class="field">Sıralama<select .value=${e.sort} @change=${(t) => this.editPreference("sort", t.target.value)}><option value="name">Ada göre</option><option value="health">Sağlığa göre</option><option value="area">Odaya göre</option></select></label><label class="field">Başlangıç görünümü<select .value=${e.layout} @change=${(t) => this.editPreference("layout", t.target.value)}><option value="inventory">Kompakt envanter</option><option value="rooms">Oda kartları</option></select></label></div>
      <label class="checkline"><input type="checkbox" .checked=${e.auto_include_new} ?disabled=${e.scope !== "manual"} @change=${(t) => this.editPreference("auto_include_new", t.target.checked)}> Yeni bulunan cihazları otomatik dahil et (elle seçilen kapsamda)</label>
      <div class="settings-grid"><label class="field">Geçmiş saklama süresi (gün)<input type="number" min="1" max="365" step="1" .value=${String(e.retention_days)} @change=${(t) => this.editPreference("retention_days", Math.max(1, Math.min(365, Number(t.target.value))))}></label><label class="checkline"><input type="checkbox" .checked=${e.weekly_report_enabled} @change=${(t) => this.editPreference("weekly_report_enabled", t.target.checked)}> Haftalık rapor bildirimi (Pazartesi 09.00)</label></div>
      <div class="subhead">Tabloda gösterilen sütunlar</div><div class="settings-grid">${[["area", "Oda"], ["motion", "Hareket / varlık"], ["battery", "Pil"], ["connectivity", "Bağlantı"]].map(([t, i]) => l`<label class="checkline"><input type="checkbox" .checked=${e.visible_columns.includes(t)} @change=${(r) => {
      const s = r.target.checked;
      this.editPreference("visible_columns", s ? [...e.visible_columns, t] : e.visible_columns.filter((n) => n !== t));
    }}>${i}</label>`)}</div>
      <div class="subhead">Cihaz istisnaları ve elle seçilen cihazlar <span class="sub">(hariç tutulanlar kapsam kuralının önceliğindedir)</span></div><div class="settings-devices">${a.map((t) => {
      const i = e.excluded_device_ids.includes(t.id), r = e.included_device_ids === null ? !i : e.included_device_ids.includes(t.id);
      return l`<label class="settings-device"><input type="checkbox" .checked=${e.scope === "manual" ? r : !i} @change=${(s) => {
        const n = s.target.checked;
        if (e.scope === "manual") {
          const d = new Set(e.included_device_ids ?? this.data.all_devices.map((u) => u.id)), o = new Set(e.excluded_device_ids);
          n ? (d.add(t.id), o.delete(t.id)) : d.delete(t.id), this.editPreference("included_device_ids", [...d]), this.editPreference("excluded_device_ids", [...o]);
        } else {
          const d = new Set(e.excluded_device_ids);
          n ? d.delete(t.id) : d.add(t.id), this.editPreference("excluded_device_ids", [...d]);
        }
      }}><span>${t.name}</span><small>${this.groupName(t)}</small></label>`;
    })}</div>
      <div class="subhead">Algılayıcı kaynakları</div><div class="sources">${a.flatMap((t) => ["motion", "occupancy", "battery", "connectivity"].map((i) => {
      const r = e.source_overrides[t.id]?.[i] ?? "", s = t.entities.filter((n) => i === "motion" ? n.domain === "binary_sensor" && n.device_class === "motion" : i === "occupancy" ? n.domain === "binary_sensor" && ["occupancy", "presence"].includes(n.device_class ?? "") : i === "battery" ? n.device_class === "battery" : ["binary_sensor", "sensor"].includes(n.domain) && /connect|signal|rssi|lqi/i.test(`${n.entity_id} ${n.name}`));
      return s.length ? l`<label class="field">${t.name} · ${ne[i]}<select .value=${r} @change=${(n) => {
        const d = { ...e.source_overrides, [t.id]: { motion: null, occupancy: null, battery: null, connectivity: null, ...e.source_overrides[t.id], [i]: n.target.value || null } };
        this.editPreference("source_overrides", d);
      }}><option value="">Otomatik kaynak</option>${s.map((n) => l`<option value=${n.entity_id}>${n.name} (${n.entity_id})</option>`)}</select></label>` : c;
    }))}</div>
      <div class="subhead">Bilerek kapalı kuralları</div>${e.expected_off_rules.map((t, i) => l`<div class="rule-row"><input class="plain-input" aria-label="Entity" .value=${t.entity_id} @change=${(r) => this.updateRule(i, "entity_id", r.target.value)}><input class="plain-input" aria-label="Beklenen durum" .value=${t.state} @change=${(r) => this.updateRule(i, "state", r.target.value)}><button class="button" aria-label="Kuralı sil" @click=${() => this.editPreference("expected_off_rules", e.expected_off_rules.filter((r, s) => s !== i))}>${h("close")}</button></div>`)}
      <button class="button" @click=${() => this.editPreference("expected_off_rules", [...e.expected_off_rules, { id: crypto.randomUUID(), entity_id: "", state: "off" }])}>+ Kural ekle</button>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="button" @click=${() => {
      this.editing = !1, this.load();
    }}>İptal</button><button class="button primary" ?disabled=${this.saving} @click=${() => this.saveEditor()}>{this.saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}</button></div></section>`;
  }
  changeScope(a) {
    const e = this.data.preferences;
    let t = e.included_device_ids;
    a === "manual" && e.scope !== "manual" && (t = this.visibleDevices.map((i) => i.id)), this.editPreference("scope", a), this.editPreference("scope_value", null), this.editPreference("included_device_ids", a === "manual" ? t ?? [] : null);
  }
  renderScopeValue(a) {
    const e = a.scope === "area" ? this.data.areas : a.scope === "floor" ? this.data.floors : a.scope === "label" ? this.data.labels : a.scope === "integration" ? [...new Set(this.data.all_devices.flatMap((t) => t.integrations?.length ? t.integrations : t.integration ? [t.integration] : []))].map((t) => ({ id: t, name: k(t) })) : [];
    return ["area", "floor", "label", "integration"].includes(a.scope) ? l`<label class="field">${{ area: "Oda", floor: "Kat", label: "Etiket", integration: "Entegrasyon" }[a.scope]}<select .value=${a.scope_value ?? ""} @change=${(t) => this.editPreference("scope_value", t.target.value || null)}><option value="">Seçiniz</option>${e.map((t) => l`<option value=${t.id}>${t.name}</option>`)}</select></label>` : c;
  }
  updateRule(a, e, t) {
    const i = [...this.data.preferences.expected_off_rules];
    i[a] = { ...i[a], [e]: t }, this.editPreference("expected_off_rules", i);
  }
  renderDeviceSettings(a) {
    if (!a) return c;
    const e = a.entities.filter((t) => !t.disabled && ["number", "select", "switch"].includes(t.domain) && t.entity_category === "config");
    return e.length ? l`<section class="settings-panel"><h2>${a.name} · Desteklenen ayarlar</h2>${e.map((t) => l`<div class="entity-row"><div class="entity-title"><strong>${t.name}</strong><small>${t.entity_id}${t.entity_category ? ` · ${t.entity_category}` : ""}</small></div>${t.domain === "switch" ? l`<button class="button" ?disabled=${this.savingEntity === t.entity_id || this.stateUnavailable(t)} @click=${() => this.toggleSwitch(t)}>${this.stateUnavailable(t) ? t.state === "unavailable" ? "Erişilemiyor" : "Durum bilinmiyor" : t.state === "on" ? "Açık" : "Kapalı"}</button>` : t.domain === "select" ? this.renderSelect(t) : this.renderNumber(t)}</div>`)}</section>` : c;
  }
  stateUnavailable(a) {
    return ["unknown", "unavailable"].includes(a.state);
  }
  renderSelect(a) {
    const e = Array.isArray(a.attributes.options) ? a.attributes.options : [];
    return l`<select class="select" aria-label=${a.name} ?disabled=${this.savingEntity === a.entity_id || this.stateUnavailable(a)} .value=${this.stateUnavailable(a) ? "" : a.state} @change=${(t) => void this.changeSetting(a, t.target.value)}>${this.stateUnavailable(a) ? l`<option value="">${a.state === "unavailable" ? "Erişilemiyor" : "Durum bilinmiyor"}</option>` : c}${e.map((t) => l`<option value=${t}>${t}</option>`)}</select>`;
  }
  renderNumber(a) {
    const e = a.attributes, t = Number(e.min ?? 0), i = Number(e.max ?? 100), r = Number(e.step ?? 1);
    return l`<input class="plain-input" type="number" aria-label=${a.name} .value=${this.stateUnavailable(a) ? "" : a.state} placeholder=${this.stateUnavailable(a) ? a.state === "unavailable" ? "Erişilemiyor" : "Durum bilinmiyor" : ""} min=${t} max=${i} step=${r} ?disabled=${this.savingEntity === a.entity_id || this.stateUnavailable(a)} @change=${(s) => void this.changeSetting(a, Number(s.target.value))}>`;
  }
  renderReport() {
    const a = this.report, e = a.stats;
    return l`<section class="report-panel"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><h2 style="margin:0">Bakım raporu</h2><select class="select" .value=${this.reportWindow} @change=${(t) => {
      this.reportWindow = t.target.value, this.showReport();
    }}><option value="24h">Son 24 saat</option><option value="7d">Son 7 gün</option></select><button class="button primary" style="margin-left:auto" @click=${() => this.showReport(!0)}>Rapor oluştur</button></div>
      <div class="report-stats"><div class="stat"><strong>${this.formatDuration(e.device_outage_seconds)}</strong><span>Cihaz-kesinti toplamı</span></div><div class="stat"><strong>${e.outage_starts}</strong><span>Kesinti başlangıcı</span></div><div class="stat"><strong>${e.outage_intervals}</strong><span>Kesinti aralığı</span></div><div class="stat"><strong>${e.low_battery}</strong><span>Düşük pil</span></div><div class="stat"><strong>${e.missing_data}</strong><span>Eksik veri</span></div></div>
      ${a.ongoing.length ? l`<div class="subhead">Devam eden kesintiler</div>${a.ongoing.map((t) => l`<div class="report-event"><strong>${this.deviceName(t.device_id)}</strong><span>Başlangıç ${this.formatDate(t.start)}</span><span>${this.formatDuration(t.seconds)} · sürüyor</span></div>`)}` : c}
      <div class="report-events">${a.events.filter((t) => !t.ongoing).slice(0, 8).map((t) => l`<div class="report-event"><strong>${this.deviceName(t.device_id)}</strong><span>${this.formatDate(t.start)}</span><span>${this.formatDuration(t.seconds)}</span></div>`)}</div>
      <p class="coverage">${a.coverage_since ? `Veri kapsamı ${this.formatDate(a.coverage_since)} tarihinden itibaren.` : "Veri kapsamı başlangıcı bilinmiyor."} Cihaz kesinti süreleri cihaz bazında toplanır; evin çevrimdışı süresi değildir.</p></section>`;
  }
  deviceName(a) {
    return this.data?.devices.find((e) => e.id === a)?.name ?? a;
  }
  formatDate(a) {
    const e = new Date(a);
    return Number.isNaN(e.getTime()) ? a : new Intl.DateTimeFormat(this.hass?.language || "tr", { dateStyle: "short", timeStyle: "short" }).format(e);
  }
  formatDuration(a) {
    const e = Math.round(a / 60);
    if (e < 60) return `${e} dk`;
    const t = Math.floor(e / 60), i = e % 60;
    return i ? `${t} sa ${i} dk` : `${t} sa`;
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
    td { border-top:1px solid var(--care-border); padding:9px 12px; font-size:13px; vertical-align:middle } tbody tr { cursor:pointer } tbody tr:hover, tbody tr.selected { background:var(--secondary-background-color,#f7f8f9) }.device-name { display:flex; gap:9px; align-items:center; min-width:190px }.device-glyph { width:30px; height:30px; display:grid; place-items:center; border-radius:8px; color:var(--care-muted); background:var(--secondary-background-color,#f1f3f4) }.name { font-weight:650 }.sub { font-size:11px; color:var(--care-muted); margin-top:2px }.health-pill, .signal-pill { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:620; border-radius:999px; padding:5px 8px; white-space:nowrap; background:var(--secondary-background-color,#f2f4f5); color:var(--care-muted) }.health-pill.online { color:var(--care-accent); background:var(--care-accent-soft) }.health-pill.offline, .health-pill.partial { color:var(--care-warn); background:var(--care-warn-soft) }.health-pill.expected_off { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }
    .signal-pill.active { color:var(--care-accent); background:var(--care-accent-soft); border:1px solid color-mix(in srgb,var(--care-accent) 24%,transparent) }.signal-pill.warning { color:var(--care-warn); background:var(--care-warn-soft) }.signal-pill.expected { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }.signal-pill.low { color:var(--care-warn); background:var(--care-warn-soft); font-weight:700 }.signal-pill.unknown { border:1px dashed var(--care-border); background:transparent }
    .signal-pill svg { width:14px;height:14px }.battery { font-variant-numeric:tabular-nums; white-space:nowrap }.battery.low { color:var(--care-warn); font-weight:700 }.table-footer { border-top:1px solid var(--care-border); padding:9px 12px; color:var(--care-muted); font-size:11px; display:flex; justify-content:space-between; gap:10px }
    .room-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px }.room { border:1px solid var(--care-border); border-radius:12px; overflow:hidden; background:var(--card-background-color,#fff); min-width:0 }.room-head { width:100%; border:0; background:transparent; display:flex; align-items:center; gap:9px; padding:13px 14px; text-align:left }.room-head .room-title { font-weight:700; font-size:14px }.room-head small { color:var(--care-muted); margin-left:auto; font-size:11px }.room-body { border-top:1px solid var(--care-border); padding:9px; display:grid; gap:8px }.device-card { border:1px solid var(--care-border); border-radius:10px; padding:11px; cursor:pointer; min-width:0 }.device-card:hover { border-color:color-mix(in srgb,var(--care-accent) 42%,var(--care-border)) }.card-head { display:flex; gap:8px; align-items:flex-start }.card-head .name { flex:1; font-size:13px }.card-meta { color:var(--care-muted); font-size:11px; margin:4px 0 9px }.signals { display:flex; flex-wrap:wrap; gap:6px }.signal-pill { font-size:10px; padding:4px 7px }.card-health { margin-top:8px; display:flex; align-items:center; gap:7px; font-size:11px; color:var(--care-muted) }
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
