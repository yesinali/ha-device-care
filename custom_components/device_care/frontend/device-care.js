/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, X = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), j = /* @__PURE__ */ new WeakMap();
let ce = class {
  constructor(e, a, i) {
    if (this._$cssResult$ = !0, i !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = a;
  }
  get styleSheet() {
    let e = this.o;
    const a = this.t;
    if (X && e === void 0) {
      const i = a !== void 0 && a.length === 1;
      i && (e = j.get(a)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && j.set(a, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const fe = (t) => new ce(typeof t == "string" ? t : t + "", void 0, Y), ve = (t, ...e) => {
  const a = t.length === 1 ? t[0] : e.reduce((i, r, s) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[s + 1], t[0]);
  return new ce(a, t, Y);
}, ge = (t, e) => {
  if (X) t.adoptedStyleSheets = e.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of e) {
    const i = document.createElement("style"), r = Z.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = a.cssText, t.appendChild(i);
  }
}, Q = X ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let a = "";
  for (const i of e.cssRules) a += i.cssText;
  return fe(a);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: be, defineProperty: ye, getOwnPropertyDescriptor: xe, getOwnPropertyNames: ke, getOwnPropertySymbols: ze, getPrototypeOf: we } = Object, U = globalThis, $ = U.trustedTypes, Ee = $ ? $.emptyScript : "", Ae = U.reactiveElementPolyfillSupport, T = (t, e) => t, W = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ee : null;
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
} }, J = (t, e) => !be(t, e), _ = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: J };
Symbol.metadata ??= Symbol("metadata"), U.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, a = _) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(e, a), !a.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, a);
      r !== void 0 && ye(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, a, i) {
    const { get: r, set: s } = xe(this.prototype, e) ?? { get() {
      return this[a];
    }, set(n) {
      this[a] = n;
    } };
    return { get: r, set(n) {
      const c = r?.call(this);
      s?.call(this, n), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? _;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const e = we(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const a = this.properties, i = [...ke(a), ...ze(a)];
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
      for (const r of i) a.unshift(Q(r));
    } else e !== void 0 && a.push(Q(e));
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
    return ge(e, this.constructor.elementStyles), e;
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
      const s = (i.converter?.toAttribute !== void 0 ? i.converter : W).toAttribute(a, i.type);
      this._$Em = e, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(e, a) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const s = i.getPropertyOptions(r), n = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : W;
      this._$Em = r;
      const c = n.fromAttribute(a, s.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, a, i, r = !1, s) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (s = this[e]), i ??= n.getPropertyOptions(e), !((i.hasChanged ?? J)(s, a) || i.useDefault && i.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, i)))) return;
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
        const { wrapped: n } = s, c = this[r];
        n !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, s, c);
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[T("elementProperties")] = /* @__PURE__ */ new Map(), A[T("finalized")] = /* @__PURE__ */ new Map(), Ae?.({ ReactiveElement: A }), (U.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, ee = (t) => t, L = G.trustedTypes, te = L ? L.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, de = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, pe = "?" + x, Pe = `<${pe}>`, w = document, R = () => w.createComment(""), H = (t) => t === null || typeof t != "object" && typeof t != "function", F = Array.isArray, Ne = (t) => F(t) || typeof t?.[Symbol.iterator] == "function", q = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ae = /-->/g, ie = />/g, k = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), re = /'/g, se = /"/g, ue = /^(?:script|style|textarea|title)$/i, Me = (t) => (e, ...a) => ({ _$litType$: t, strings: e, values: a }), o = Me(1), P = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ne = /* @__PURE__ */ new WeakMap(), z = w.createTreeWalker(w, 129);
function he(t, e) {
  if (!F(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return te !== void 0 ? te.createHTML(e) : e;
}
const Te = (t, e) => {
  const a = t.length - 1, i = [];
  let r, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = M;
  for (let c = 0; c < a; c++) {
    const l = t[c];
    let u, m, h = -1, b = 0;
    for (; b < l.length && (n.lastIndex = b, m = n.exec(l), m !== null); ) b = n.lastIndex, n === M ? m[1] === "!--" ? n = ae : m[1] !== void 0 ? n = ie : m[2] !== void 0 ? (ue.test(m[2]) && (r = RegExp("</" + m[2], "g")), n = k) : m[3] !== void 0 && (n = k) : n === k ? m[0] === ">" ? (n = r ?? M, h = -1) : m[1] === void 0 ? h = -2 : (h = n.lastIndex - m[2].length, u = m[1], n = m[3] === void 0 ? k : m[3] === '"' ? se : re) : n === se || n === re ? n = k : n === ae || n === ie ? n = M : (n = k, r = void 0);
    const y = n === k && t[c + 1].startsWith("/>") ? " " : "";
    s += n === M ? l + Pe : h >= 0 ? (i.push(u), l.slice(0, h) + de + l.slice(h) + x + y) : l + x + (h === -2 ? c : y);
  }
  return [he(t, s + (t[a] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class S {
  constructor({ strings: e, _$litType$: a }, i) {
    let r;
    this.parts = [];
    let s = 0, n = 0;
    const c = e.length - 1, l = this.parts, [u, m] = Te(e, a);
    if (this.el = S.createElement(u, i), z.currentNode = this.el.content, a === 2 || a === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = z.nextNode()) !== null && l.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(de)) {
          const b = m[n++], y = r.getAttribute(h).split(x), V = /([.?@])?(.*)/.exec(b);
          l.push({ type: 1, index: s, name: V[2], strings: y, ctor: V[1] === "." ? Re : V[1] === "?" ? He : V[1] === "@" ? Se : C }), r.removeAttribute(h);
        } else h.startsWith(x) && (l.push({ type: 6, index: s }), r.removeAttribute(h));
        if (ue.test(r.tagName)) {
          const h = r.textContent.split(x), b = h.length - 1;
          if (b > 0) {
            r.textContent = L ? L.emptyScript : "";
            for (let y = 0; y < b; y++) r.append(h[y], R()), z.nextNode(), l.push({ type: 2, index: ++s });
            r.append(h[b], R());
          }
        }
      } else if (r.nodeType === 8) if (r.data === pe) l.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(x, h + 1)) !== -1; ) l.push({ type: 7, index: s }), h += x.length - 1;
      }
      s++;
    }
  }
  static createElement(e, a) {
    const i = w.createElement("template");
    return i.innerHTML = e, i;
  }
}
function N(t, e, a = t, i) {
  if (e === P) return e;
  let r = i !== void 0 ? a._$Co?.[i] : a._$Cl;
  const s = H(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== s && (r?._$AO?.(!1), s === void 0 ? r = void 0 : (r = new s(t), r._$AT(t, a, i)), i !== void 0 ? (a._$Co ??= [])[i] = r : a._$Cl = r), r !== void 0 && (e = N(t, r._$AS(t, e.values), r, i)), e;
}
class Ie {
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
    z.currentNode = r;
    let s = z.nextNode(), n = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let u;
        l.type === 2 ? u = new O(s, s.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (u = new Oe(s, this, e)), this._$AV.push(u), l = i[++c];
      }
      n !== l?.index && (s = z.nextNode(), n++);
    }
    return z.currentNode = w, r;
  }
  p(e) {
    let a = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, a), a += i.strings.length - 2) : i._$AI(e[a])), a++;
  }
}
class O {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, a, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = a, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = N(this, e, a), H(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== P && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ne(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && H(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: a, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = S.createElement(he(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(a);
    else {
      const s = new Ie(r, this), n = s.u(this.options);
      s.p(a), this.T(n), this._$AH = s;
    }
  }
  _$AC(e) {
    let a = ne.get(e.strings);
    return a === void 0 && ne.set(e.strings, a = new S(e)), a;
  }
  k(e) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let i, r = 0;
    for (const s of e) r === a.length ? a.push(i = new O(this.O(R()), this.O(R()), this, this.options)) : i = a[r], i._$AI(s), r++;
    r < a.length && (this._$AR(i && i._$AB.nextSibling, r), a.length = r);
  }
  _$AR(e = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); e !== this._$AB; ) {
      const i = ee(e).nextSibling;
      ee(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class C {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, a, i, r, s) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = a, this._$AM = r, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(e, a = this, i, r) {
    const s = this.strings;
    let n = !1;
    if (s === void 0) e = N(this, e, a, 0), n = !H(e) || e !== this._$AH && e !== P, n && (this._$AH = e);
    else {
      const c = e;
      let l, u;
      for (e = s[0], l = 0; l < s.length - 1; l++) u = N(this, c[i + l], a, l), u === P && (u = this._$AH[l]), n ||= !H(u) || u !== this._$AH[l], u === d ? e = d : e !== d && (e += (u ?? "") + s[l + 1]), this._$AH[l] = u;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Re extends C {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class He extends C {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Se extends C {
  constructor(e, a, i, r, s) {
    super(e, a, i, r, s), this.type = 5;
  }
  _$AI(e, a = this) {
    if ((e = N(this, e, a, 0) ?? d) === P) return;
    const i = this._$AH, r = e === d && i !== d || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Oe {
  constructor(e, a, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    N(this, e);
  }
}
const Ve = G.litHtmlPolyfillSupport;
Ve?.(S, O), (G.litHtmlVersions ??= []).push("3.3.3");
const Ze = (t, e, a) => {
  const i = a?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const s = a?.renderBefore ?? null;
    i._$litPart$ = r = new O(e.insertBefore(R(), s), s, void 0, a ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis;
class I extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ze(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return P;
  }
}
I._$litElement$ = !0, I.finalized = !0, K.litElementHydrateSupport?.({ LitElement: I });
const We = K.litElementPolyfillSupport;
We?.({ LitElement: I });
(K.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = (t) => (e, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ue = { attribute: !0, type: String, converter: W, reflect: !1, hasChanged: J }, Ce = (t = Ue, e, a) => {
  const { kind: i, metadata: r } = a;
  let s = globalThis.litPropertyMetadata.get(r);
  if (s === void 0 && globalThis.litPropertyMetadata.set(r, s = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(a.name, t), i === "accessor") {
    const { name: n } = a;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, l, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, t, c), c;
    } };
  }
  if (i === "setter") {
    const { name: n } = a;
    return function(c) {
      const l = this[n];
      e.call(this, c), this.requestUpdate(n, l, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function me(t) {
  return (e, a) => typeof a == "object" ? Ce(t, e, a) : ((i, r, s) => {
    const n = r.hasOwnProperty(s);
    return r.constructor.createProperty(s, i), n ? Object.getOwnPropertyDescriptor(r, s) : void 0;
  })(t, e, a);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(t) {
  return me({ ...t, state: !0, attribute: !1 });
}
class qe {
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
const Be = "data:image/png;base64,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";
var De = Object.defineProperty, Xe = Object.getOwnPropertyDescriptor, v = (t, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Xe(e, a) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (r = (i ? n(e, a, r) : n(r)) || r);
  return i && r && De(e, a, r), r;
};
const p = (t) => {
  const e = {
    grid: "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z",
    room: "M3 21V5l9-3 9 3v16h-7v-6H9v6z",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5.5 12.5L21 21",
    check: "m5 12 4 4L19 6",
    alert: "M12 3 2 21h20L12 3zm0 6v5m0 3v.1",
    motion: "M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1",
    light: "M9 18h6m-5 4h4m-5-8a6 6 0 1 1 6 0c-1 1-1 2-1 4h-4c0-2 0-3-1-4z",
    switch: "M4 7h16v10H4zM8 12h.01",
    remote: "M8 3h8v18H8zM12 7h.01M10 11h4m-4 3h4m-4 3h4",
    sensor: "M4 12a8 8 0 0 1 16 0M7 12a5 5 0 0 1 10 0m-7 0a2 2 0 0 1 4 0m-2 4v4",
    fan: "M12 12c-1-3-1-8 2-9 3-1 4 3 1 7m-3 2c3-1 8-1 9 2 1 3-3 4-7 1m-2-3c1 3 1 8-2 9-3 1-4-3-1-7m3-2c-3 1-8 1-9-2-1-3 3-4 7-1",
    lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4m-4 4v2",
    climate: "M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0zM12 17v-7",
    camera: "M3 8h4l2-3h6l2 3h4v12H3zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    cover: "M4 4h16v16H4zM8 8h8m-8 4h8m-8 4h8",
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
}, B = { online: "Online", offline: "Erişilemiyor", partial: "Kısmi sorun", unknown: "Durum bilinmiyor", expected_off: "Bilerek kapalı" }, oe = { motion: "Hareket", occupancy: "Varlık", battery: "Pil", connectivity: "Bağlantı" }, le = (t, e) => {
  const a = t === "motion" ? "Hareket" : "Varlık";
  return !e || e.meaning === "missing" ? "Veri yok" : e.meaning === "active" ? `${a} algılanıyor` : e.meaning === "inactive" ? `${a} algılanmıyor` : e.meaning === "unavailable" ? "Erişilemiyor" : e.meaning === "expected_off" ? "Bilerek kapalı" : "Durum bilinmiyor";
}, E = (t) => t ? t.replaceAll("_", " ").replace(/\b\w/g, (e) => e.toLocaleUpperCase()) : "Atanmamış", D = (t) => ({
  no_health_source: "Çevrimdışı durumunu bildiren bir sensör yok.",
  no_connectivity_source: "Bağlantı sensörü yok; erişilebilirlik doğrulanamıyor.",
  no_reachability_source: "Bu cihaz türü anlık bağlantı bilgisi sağlamıyor.",
  health_source_unavailable: "Bağlantı kaynağı şu anda veri vermiyor.",
  health_source_unknown: "Bağlantı durumu doğrulanamıyor.",
  connectivity_off: "Bağlantı sensörü cihazı çevrimdışı gösteriyor.",
  configured_expected_off: "Kapalı durumu ayarlarda beklenen durum olarak tanımlanmış.",
  device_problem: "Cihaz bir sorun bildiriyor.",
  mixed_connectivity_sources: "Bağlantı sensörleri birbiriyle uyuşmuyor.",
  state_available: "Home Assistant cihazdan güncel durum alıyor.",
  primary_source_missing: "Seçilen bağlantı sensörü bulunamıyor.",
  invalid_primary_source: "Seçilen kaynak bağlantı sensörü değil.",
  connectivity_unavailable: "Bağlantı sensörü şu anda veri vermiyor.",
  partial_failure: "Cihazın bazı işlevleri çalışmıyor olabilir."
})[t] ?? "Durumla ilgili ek açıklama mevcut.";
let f = class extends I {
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
      this.api = new qe(this.hass.connection), await this.load();
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
  healthText(t) {
    return t.health !== "unknown" || this.deviceType(t) !== "remote" ? B[t.health] : t.health_reason === "no_reachability_source" ? "Erişilebilirlik bilgisi yok" : "Bağlantı doğrulanamıyor";
  }
  groupName(t) {
    const e = this.data?.preferences.group_by ?? "area";
    return e === "floor" ? this.data?.floors.find((a) => a.id === t.floor_id)?.name ?? "Kat atanmamış" : e === "integration" ? (t.integrations?.length ? t.integrations : [t.integration].filter((a) => !!a)).map(E).join(", ") || "Entegrasyon yok" : e === "none" ? "Tüm cihazlar" : this.data?.areas.find((a) => a.id === t.area_id)?.name ?? "Atanmamış";
  }
  areaName(t) {
    return this.data?.areas.find((e) => e.id === t.area_id)?.name ?? "Oda atanmamış";
  }
  deviceType(t) {
    return t.device_type ? t.device_type : t.entities.some((e) => e.domain === "remote") ? "remote" : t.entities.some((e) => e.domain === "light") ? "light" : t.entities.some((e) => e.domain === "switch") ? "switch" : t.entities.some((e) => e.device_class === "motion" || e.device_class === "occupancy") ? "sensor" : "other";
  }
  deviceIcon(t) {
    const e = this.deviceType(t);
    return p(e === "light" ? "light" : e === "switch" ? "switch" : e === "remote" ? "remote" : e === "sensor" ? "sensor" : e === "fan" ? "fan" : e === "lock" ? "lock" : e === "climate" ? "climate" : e === "camera" ? "camera" : e === "cover" ? "cover" : "settings");
  }
  statusText(t) {
    const e = this.deviceType(t);
    if (e === "light" || e === "switch" || e === "cover" || e === "fan" || e === "lock" || e === "climate") {
      const i = t.entities.find((c) => c.domain === e && !c.disabled);
      if (!i) return o`<span class="signal-pill unknown">${this.deviceIcon(t)}Durum ölçümü yok</span>`;
      if (i.state === "unavailable") return o`<span class="signal-pill state-unavailable">${this.deviceIcon(t)}Durum erişilemiyor</span>`;
      if (i.state === "unknown") return o`<span class="signal-pill unknown">${this.deviceIcon(t)}Durum bilinmiyor</span>`;
      if (e === "climate") {
        const c = i.state === "off" ? "Kapalı" : i.state === "unknown" ? "Durum bilinmiyor" : E(i.state), l = i.attributes.current_temperature, u = typeof l == "number" && Number.isFinite(l) ? ` · ${l}°${typeof i.attributes.temperature_unit == "string" ? i.attributes.temperature_unit : ""}` : "";
        return o`<span class="signal-pill ${i.state === "off" ? "state-off" : "state-on"}">${this.deviceIcon(t)}${c}${i.state !== "off" ? u : ""}</span>`;
      }
      if (e === "cover") {
        const c = { open: "Açık", closed: "Kapalı", opening: "Açılıyor", closing: "Kapanıyor" }[i.state] ?? i.state;
        return o`<span class="signal-pill ${i.state === "closed" ? "state-off" : "state-on"}">${this.deviceIcon(t)}${c}</span>`;
      }
      if (e === "lock") {
        const c = i.state === "locked";
        return !c && i.state !== "unlocked" ? o`<span class="signal-pill unknown">${this.deviceIcon(t)}Durum bilinmiyor</span>` : o`<span class="signal-pill ${c ? "state-off" : "state-on"}">${this.deviceIcon(t)}${c ? "Kilitli" : "Kilit açık"}</span>`;
      }
      if (!["on", "off"].includes(i.state)) return o`<span class="signal-pill unknown">${this.deviceIcon(t)}Durum bilinmiyor</span>`;
      const r = i.state === "on", s = Number(i.attributes.brightness), n = e === "light" && r && Number.isFinite(s) ? ` · %${Math.round(s / 255 * 100)}` : "";
      return o`<span class="signal-pill ${r ? "state-on" : "state-off"}">${this.deviceIcon(t)}${r ? "Açık" : "Kapalı"}${n}</span>`;
    }
    if (e === "remote") {
      const i = t.activity, r = i?.last_event_at ? this.formatDate(i.last_event_at) : null, s = i?.event_type ? ` · ${E(i.event_type)}` : "";
      return o`${t.signals.connectivity ? this.renderConnectivity(t.signals.connectivity) : o`<span class="signal-pill unknown">${this.deviceIcon(t)}Anlık bağlantı bilgisi yok</span>`}${r || i?.event_type ? o`<span class="signal-pill">${p("remote")}${r ? `Son basış ${r}` : "Son olay zamanı yok"}${s}</span>` : d}${t.signals.battery ? this.renderBattery(t.signals.battery) : d}`;
    }
    return t.signals.motion || t.signals.occupancy ? this.renderMotion(t) : t.signals.battery ? this.renderBattery(t.signals.battery) : t.signals.connectivity?.meaning === "unavailable" ? o`<span class="signal-pill state-unavailable">${p("wifi")}Erişilemiyor</span>` : t.signals.connectivity ? this.renderConnectivity(t.signals.connectivity) : o`<span class="signal-pill unknown">${this.deviceIcon(t)}Bu cihaz türünde durum ölçümü yok</span>`;
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
    if (!this.data) return o`<main class="shell"><h1>Cihazlar & Bakım</h1>${this.error ? o`<div class="error" role="alert">${this.error}</div>` : d}<button class="button" @click=${() => this.load()}>Yeniden dene</button></main>`;
    const t = this.visibleDevices, e = t.find((l) => l.id === this.selectedId), a = this.data.preferences.layout, i = t.filter((l) => l.health === "offline" || l.health === "partial").length, r = t.filter((l) => l.health === "online").length, s = t.filter((l) => l.health === "expected_off").length, n = t.filter((l) => l.health === "unknown").length, c = t.filter((l) => {
      const u = l.signals.battery, m = u ? this.batteryNumber(u) : null;
      return u?.meaning === "low" || u?.unit?.trim() === "%" && m !== null && m < 20;
    }).length;
    return o`<main class="shell">
      <header class="top"><div><h1 class="brand-title"><img src=${Be} alt="" aria-hidden="true">Cihazlar & Bakım</h1><p class="subtitle">${t.length} cihaz izleniyor · ${this.data.monitoring_since ? `İzleme başlangıcı ${this.formatDate(this.data.monitoring_since)}` : "İzleme başlangıç zamanı yok"}</p></div><div class="top-actions">
        ${this.data.is_admin ? o`<button class="button" @click=${() => {
      this.editing = !this.editing, this.editing || this.load();
    }}>${p(this.editing ? "close" : "edit")}<span class="button-label">${this.editing ? "Düzenlemeyi kapat" : "Düzenle"}</span></button>` : d}
        <button class="button" @click=${() => this.report ? this.report = void 0 : void this.showReport()}>${p("report")}<span class="button-label">${this.report ? "Raporu kapat" : "Raporlar"}</span></button>
      </div></header>
      ${this.error ? o`<div class="error" role="alert">${this.error}</div>` : d}
      <section class="summary" aria-label="Cihaz sağlığı özeti"><span class="summary-title">Genel durum</span><span class="metric good">${p("check")} <strong>${r}</strong> erişilebilir</span><span class="metric ${i ? "warn" : ""}">${p("alert")} <strong>${i}</strong> sorunlu</span><span class="metric"><strong>${n}</strong> belirsiz</span><span class="metric"><strong>${s}</strong> bilerek kapalı</span><span class="metric ${c ? "warn" : ""}">${p("battery")} <strong>${c}</strong> düşük pil</span></section>
      ${this.report ? this.renderReport() : d}
      ${this.editing ? this.renderEditor(this.data.all_devices) : d}
      ${this.data.is_admin && this.data.capabilities.settings ? this.renderDeviceSettings(e) : d}
      <div class="toolbar"><label class="search">${p("search")}<input aria-label="Cihazlarda ara" placeholder="Cihaz, üretici veya entity ara" .value=${this.query} @input=${(l) => this.query = l.target.value}></label>
        <select class="select" aria-label="Sıralama" .value=${this.data.preferences.sort} @change=${(l) => void this.patch({ sort: l.target.value })}><option value="name">Ada göre</option><option value="health">Sağlık durumuna göre</option><option value="area">Odaya göre</option></select>
        <div class="tabs" role="tablist" aria-label="Görünüm"><button class=${a === "inventory" ? "active" : ""} role="tab" aria-selected=${a === "inventory"} @click=${() => void this.patch({ layout: "inventory" })}>${p("grid")} Liste</button><button class=${a === "rooms" ? "active" : ""} role="tab" aria-selected=${a === "rooms"} @click=${() => void this.patch({ layout: "rooms" })}>${p("room")} Odalar</button></div>
      </div>
      ${t.length ? a === "inventory" ? this.renderInventory(t) : this.renderRooms(t) : o`<div class="empty">Bu arama ve kapsamda cihaz bulunamadı.</div>`}
      ${e ? this.renderDrawer(e) : d}
    </main>`;
  }
  renderInventory(t) {
    const e = new Set(this.data.preferences.visible_columns);
    return o`<section class="inventory"><div class="table-scroll"><table><thead><tr><th>Cihaz</th><th>Sağlık</th>${e.has("area") ? o`<th>Oda</th>` : d}${e.has("motion") ? o`<th>Durum</th>` : d}${e.has("battery") ? o`<th>Pil</th>` : d}${e.has("connectivity") ? o`<th>Bağlantı</th>` : d}<th></th></tr></thead><tbody>
      ${t.map((a) => o`<tr class=${this.selectedId === a.id ? "selected" : ""} @click=${() => this.selectDevice(a)} tabindex="0" @keydown=${(i) => {
      (i.key === "Enter" || i.key === " ") && this.selectDevice(a);
    }}>
        <td><div class="device-name"><span class="device-glyph type-${this.deviceType(a)}">${this.deviceIcon(a)}</span><span><span class="name">${a.name}</span>${a.model ? o`<span class="sub">${a.model}</span>` : d}<span class="sub">${this.devicePlatformLine(a)}</span></span></div></td>
        <td data-mobile><span class="health-pill ${a.health}" title=${a.health_reason ? D(a.health_reason) : B[a.health]}>${p(a.health === "online" ? "check" : "alert")}${this.healthText(a)}</span></td>
        ${e.has("area") ? o`<td>${this.areaName(a)}</td>` : d}
        ${e.has("motion") ? o`<td data-mobile>${this.statusText(a)}</td>` : d}
        ${e.has("battery") ? o`<td data-mobile>${this.renderDeviceBattery(a)}</td>` : d}
        ${e.has("connectivity") ? o`<td data-mobile>${this.renderConnectivity(a.signals.connectivity)}</td>` : d}
        <td>${p("chevron")}</td></tr>`)}
      </tbody></table></div><footer class="table-footer"><span>${t.length} cihaz</span><span>Bir cihazı seçerek ayrıntılarını ve desteklenen ayarları açın</span></footer></section>`;
  }
  renderRooms(t) {
    return o`<section class="room-grid">${this.groupDevices(t).map(([e, a]) => o`<article class="room"><button class="room-head" aria-expanded=${this.openGroups[e] !== !1} @click=${() => this.openGroups = { ...this.openGroups, [e]: this.openGroups[e] === !1 }}>${p("room")}<span class="room-title">${e}</span><small>${a.length} cihaz</small>${p("down")}</button>${this.openGroups[e] === !1 ? d : o`<div class="room-body">${a.map((i) => this.renderDeviceCard(i))}</div>`}</article>`)}</section>`;
  }
  renderDeviceCard(t) {
    return o`<article class="device-card" role="button" tabindex="0" @click=${() => this.selectDevice(t)} @keydown=${(e) => {
      e.key === "Enter" && this.selectDevice(t);
    }}><div class="card-head"><span class="device-glyph type-${this.deviceType(t)}">${this.deviceIcon(t)}</span><span class="name">${t.name}</span><span class="health-pill ${t.health}" title=${t.health_reason ? D(t.health_reason) : B[t.health]}>${this.healthText(t)}</span></div><p class="card-meta">${t.model ? o`<span>${t.model}</span>` : d}<span class="card-meta-secondary">${this.devicePlatformLine(t)}</span></p><div class="signals">${this.statusText(t)}</div></article>`;
  }
  renderMotion(t) {
    const e = t.signals.motion, a = t.signals.occupancy, i = [e && ["motion", e], a && ["occupancy", a]].filter(Boolean), r = i.filter(([s, n], c) => i.findIndex(([, l]) => l.entity_id === n.entity_id) === c);
    return r.length ? o`${r.map(([s, n]) => {
      const c = n.meaning === "active" ? "active" : n.meaning === "unavailable" ? "warning" : n.meaning === "expected_off" ? "expected" : n.meaning === "unknown" || n.meaning === "missing" ? "unknown" : "";
      return o`<span class="signal-pill ${c}" aria-label=${`${oe[s]}: ${le(s, n)}`}>${p("motion")}${le(s, n)}</span>`;
    })}` : o`<span class="signal-pill unknown">${p("motion")}Veri yok</span>`;
  }
  batteryNumber(t) {
    const e = (i) => typeof i == "number" && Number.isFinite(i) ? i : typeof i == "string" && i.trim() !== "" && Number.isFinite(Number(i)) ? Number(i) : null, a = e(t.state);
    return t.meaning === "unknown" && a === null ? null : e(t.value);
  }
  renderBattery(t) {
    if (!t || t.meaning === "missing") return o`<span class="signal-pill unknown">${p("battery")}Pil verisi yok</span>`;
    if (t.meaning === "unavailable" || t.state === "unavailable") return o`<span class="signal-pill warning">${p("battery")}Pil erişilemiyor</span>`;
    if (t.state === "unknown") return o`<span class="signal-pill unknown">${p("battery")}Pil bilinmiyor</span>`;
    if (t.meaning === "low") return o`<span class="signal-pill low">${p("battery")}Pil düşük</span>`;
    if (t.meaning === "ok") return o`<span class="signal-pill">${p("battery")}Pil normal</span>`;
    if (t.meaning === "expected_off") return o`<span class="signal-pill expected">${p("battery")}Bilerek kapalı</span>`;
    const e = t.value, a = this.batteryNumber(t), i = a !== null && t.unit?.trim() === "%" && a < 20, r = a !== null ? `${a}${t.unit ? ` ${t.unit}` : ""}` : e === null ? t.state : `${e}${t.unit ? ` ${t.unit}` : ""}`;
    if (t.meaning === "unknown" && a === null) return o`<span class="signal-pill unknown">${p("battery")}Pil bilinmiyor</span>`;
    const s = t.meaning === "unknown" && a === null ? "unknown" : "", n = t.meaning === "unknown" && a === null ? " · durum bilinmiyor" : "";
    return o`<span class="signal-pill ${s} ${i ? "low" : ""}">${p("battery")}Pil ${r}${n}</span>`;
  }
  renderDeviceBattery(t) {
    if (t.signals.battery) return this.renderBattery(t.signals.battery);
    const e = t.capabilities?.includes("battery") ?? t.entities.some((a) => a.device_class === "battery" || `${a.entity_id} ${a.name}`.toLocaleLowerCase().includes("battery"));
    return o`<span class="signal-pill unknown">${p("battery")}${e ? "Pil verisi yok" : "Pil ölçümü yok"}</span>`;
  }
  renderConnectivity(t) {
    if (!t || t.meaning === "missing") return o``;
    const e = t.meaning === "unavailable" ? "Bağlantı erişilemiyor" : t.meaning === "unknown" ? "Bağlantı bilinmiyor" : t.meaning === "active" ? "Bağlı" : t.meaning === "inactive" ? "Bağlantı yok" : String(t.value ?? t.state);
    return o`<span class="signal-pill ${t.meaning === "unavailable" ? "warning" : t.meaning === "unknown" ? "unknown" : ""}">${p("wifi")}${e}</span>`;
  }
  renderDrawer(t) {
    return o`<div class="drawer-backdrop" @click=${() => this.selectedId = void 0}></div><aside class="drawer" aria-label=${`${t.name} ayrıntıları`}><div class="drawer-head"><span class="device-glyph type-${this.deviceType(t)}">${this.deviceIcon(t)}</span><div><h2>${t.name}</h2>${t.model ? o`<div class="sub">${t.model}</div>` : d}<div class="sub">${this.devicePlatformLine(t)}</div></div><button class="button ghost close" aria-label="Kapat" @click=${() => this.selectedId = void 0}>${p("close")}</button></div>
      <section class="section"><h3>Sağlık</h3><div class="detail-row"><span>Durum</span><strong>${this.healthText(t)}</strong></div>${t.health_reason ? o`<div class="detail-row"><span>Açıklama</span><span>${D(t.health_reason)}</span></div>` : d}<div class="detail-row"><span>Oda</span><span>${this.areaName(t)}</span></div><div class="detail-row"><span>Etiketler</span><span>${t.labels.length ? t.labels.join(", ") : "—"}</span></div>
      ${t.device_type === "remote" ? o`<div class="detail-row"><span>Anlık bağlantı</span><span>${t.signals.connectivity ? "Bağlantı sensörü mevcut" : "Anlık bağlantı bilgisi yok"}</span></div>${t.activity?.event_type || t.activity?.last_event_at ? o`<div class="detail-row"><span>Son basış / etkinlik</span><span>${t.activity.last_event_at ? this.formatDate(t.activity.last_event_at) : "Zaman bilgisi yok"}${t.activity.event_type ? ` · ${E(t.activity.event_type)}` : ""}</span></div>` : d}` : d}
      ${t.signals.motion ? o`<div class="detail-row"><span>Hareket</span>${this.renderMotion(t)}</div>` : d}${t.signals.occupancy && t.signals.occupancy.entity_id !== t.signals.motion?.entity_id ? o`<div class="detail-row"><span>Varlık</span>${this.renderMotion({ ...t, signals: { ...t.signals, motion: null } })}</div>` : d}${t.signals.battery ? o`<div class="detail-row"><span>Pil</span>${this.renderBattery(t.signals.battery)}</div>` : d}</section>
      <section class="section"><h3>Varlıklar (${t.entities.length})</h3>${t.entities.map((e) => o`<div class="entity-row"><div class="entity-title"><strong>${e.name}</strong><small>${e.entity_id}${e.disabled ? " · devre dışı" : ""}</small></div><span class="sub">${e.state}</span></div>`)}</section></aside>`;
  }
  renderEditor(t) {
    const e = this.data.preferences;
    return o`<section class="settings-panel"><h2>Görünüm ve kapsam</h2><div class="settings-grid"><label class="field">Cihaz kapsamı<select .value=${e.scope} @change=${(a) => this.changeScope(a.target.value)}><option value="all">Tüm cihazlar</option><option value="area">Oda</option><option value="floor">Kat</option><option value="label">Etiket</option><option value="integration">Entegrasyon</option><option value="manual">Elle seç</option></select></label>${this.renderScopeValue(e)}<label class="field">Gruplama<select .value=${e.group_by} @change=${(a) => this.editPreference("group_by", a.target.value)}><option value="area">Odaya göre</option><option value="floor">Kata göre</option><option value="integration">Entegrasyona göre</option><option value="none">Gruplama yok</option></select></label><label class="field">Sıralama<select .value=${e.sort} @change=${(a) => this.editPreference("sort", a.target.value)}><option value="name">Ada göre</option><option value="health">Sağlığa göre</option><option value="area">Odaya göre</option></select></label><label class="field">Başlangıç görünümü<select .value=${e.layout} @change=${(a) => this.editPreference("layout", a.target.value)}><option value="inventory">Kompakt envanter</option><option value="rooms">Oda kartları</option></select></label></div>
      <label class="checkline"><input type="checkbox" .checked=${e.auto_include_new} ?disabled=${e.scope !== "manual"} @change=${(a) => this.editPreference("auto_include_new", a.target.checked)}> Yeni bulunan cihazları otomatik dahil et (elle seçilen kapsamda)</label>
      <div class="settings-grid"><label class="field">Geçmiş saklama süresi (gün)<input type="number" min="1" max="365" step="1" .value=${String(e.retention_days)} @change=${(a) => this.editPreference("retention_days", Math.max(1, Math.min(365, Number(a.target.value))))}></label><label class="checkline"><input type="checkbox" .checked=${e.weekly_report_enabled} @change=${(a) => this.editPreference("weekly_report_enabled", a.target.checked)}> Haftalık rapor bildirimi (Pazartesi 09.00)</label></div>
      <div class="subhead">Tabloda gösterilen sütunlar</div><div class="settings-grid">${[["area", "Oda"], ["motion", "Durum"], ["battery", "Pil"], ["connectivity", "Bağlantı"]].map(([a, i]) => o`<label class="checkline"><input type="checkbox" .checked=${e.visible_columns.includes(a)} @change=${(r) => {
      const s = r.target.checked;
      this.editPreference("visible_columns", s ? [...e.visible_columns, a] : e.visible_columns.filter((n) => n !== a));
    }}>${i}</label>`)}</div>
      <div class="subhead">Cihaz istisnaları ve elle seçilen cihazlar <span class="sub">(hariç tutulanlar kapsam kuralının önceliğindedir)</span></div><div class="settings-devices">${t.map((a) => {
      const i = e.excluded_device_ids.includes(a.id), r = e.included_device_ids === null ? !i : e.included_device_ids.includes(a.id);
      return o`<label class="settings-device"><input type="checkbox" .checked=${e.scope === "manual" ? r : !i} @change=${(s) => {
        const n = s.target.checked;
        if (e.scope === "manual") {
          const c = new Set(e.included_device_ids ?? this.data.all_devices.map((u) => u.id)), l = new Set(e.excluded_device_ids);
          n ? (c.add(a.id), l.delete(a.id)) : c.delete(a.id), this.editPreference("included_device_ids", [...c]), this.editPreference("excluded_device_ids", [...l]);
        } else {
          const c = new Set(e.excluded_device_ids);
          n ? c.delete(a.id) : c.add(a.id), this.editPreference("excluded_device_ids", [...c]);
        }
      }}><span>${a.name}</span><small>${this.groupName(a)}</small></label>`;
    })}</div>
      <div class="subhead">Algılayıcı kaynakları</div><div class="sources">${t.flatMap((a) => ["motion", "occupancy", "battery", "connectivity"].map((i) => {
      const r = e.source_overrides[a.id]?.[i] ?? "", s = a.entities.filter((n) => !n.disabled && (i === "motion" ? n.domain === "binary_sensor" && n.device_class === "motion" : i === "occupancy" ? n.domain === "binary_sensor" && ["occupancy", "presence"].includes(n.device_class ?? "") : i === "battery" ? n.device_class === "battery" || n.domain === "sensor" && ["%", "v", "mv"].includes((n.unit ?? "").toLocaleLowerCase()) && `${n.entity_id} ${n.name}`.toLocaleLowerCase().includes("battery") : n.domain === "binary_sensor" && n.device_class === "connectivity"));
      return s.length ? o`<label class="field">${a.name} · ${oe[i]}<select .value=${r} @change=${(n) => {
        const c = { ...e.source_overrides, [a.id]: { motion: null, occupancy: null, battery: null, connectivity: null, ...e.source_overrides[a.id], [i]: n.target.value || null } };
        this.editPreference("source_overrides", c);
      }}><option value="">Otomatik kaynak</option>${s.map((n) => o`<option value=${n.entity_id}>${n.name} (${n.entity_id})</option>`)}</select></label>` : d;
    }))}</div>
      <div class="subhead">Bilerek kapalı kuralları</div>${e.expected_off_rules.map((a, i) => o`<div class="rule-row"><input class="plain-input" aria-label="Entity" .value=${a.entity_id} @change=${(r) => this.updateRule(i, "entity_id", r.target.value)}><input class="plain-input" aria-label="Beklenen durum" .value=${a.state} @change=${(r) => this.updateRule(i, "state", r.target.value)}><button class="button" aria-label="Kuralı sil" @click=${() => this.editPreference("expected_off_rules", e.expected_off_rules.filter((r, s) => s !== i))}>${p("close")}</button></div>`)}
      <button class="button" @click=${() => this.editPreference("expected_off_rules", [...e.expected_off_rules, { id: crypto.randomUUID(), entity_id: "", state: "off" }])}>+ Kural ekle</button>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="button" @click=${() => {
      this.editing = !1, this.load();
    }}>İptal</button><button class="button primary" ?disabled=${this.saving} @click=${() => this.saveEditor()}>${this.saving ? "Kaydediliyor…" : "Değişiklikleri kaydet"}</button></div></section>`;
  }
  changeScope(t) {
    const e = this.data.preferences;
    let a = e.included_device_ids;
    t === "manual" && e.scope !== "manual" && (a = this.visibleDevices.map((i) => i.id)), this.editPreference("scope", t), this.editPreference("scope_value", null), this.editPreference("included_device_ids", t === "manual" ? a ?? [] : null);
  }
  renderScopeValue(t) {
    const e = t.scope === "area" ? this.data.areas : t.scope === "floor" ? this.data.floors : t.scope === "label" ? this.data.labels : t.scope === "integration" ? [...new Set(this.data.all_devices.flatMap((a) => a.integrations?.length ? a.integrations : a.integration ? [a.integration] : []))].map((a) => ({ id: a, name: E(a) })) : [];
    return ["area", "floor", "label", "integration"].includes(t.scope) ? o`<label class="field">${{ area: "Oda", floor: "Kat", label: "Etiket", integration: "Entegrasyon" }[t.scope]}<select .value=${t.scope_value ?? ""} @change=${(a) => this.editPreference("scope_value", a.target.value || null)}><option value="">Seçiniz</option>${e.map((a) => o`<option value=${a.id}>${a.name}</option>`)}</select></label>` : d;
  }
  updateRule(t, e, a) {
    const i = [...this.data.preferences.expected_off_rules];
    i[t] = { ...i[t], [e]: a }, this.editPreference("expected_off_rules", i);
  }
  renderDeviceSettings(t) {
    if (!t) return d;
    const e = t.entities.filter((a) => !a.disabled && ["number", "select", "switch"].includes(a.domain) && a.entity_category === "config");
    return e.length ? o`<section class="settings-panel"><h2>${t.name} · Desteklenen ayarlar</h2>${e.map((a) => o`<div class="entity-row"><div class="entity-title"><strong>${a.name}</strong><small>${a.entity_id}${a.entity_category ? ` · ${a.entity_category}` : ""}</small></div>${a.domain === "switch" ? o`<button class="button" ?disabled=${this.savingEntity === a.entity_id || this.stateUnavailable(a)} @click=${() => this.toggleSwitch(a)}>${this.stateUnavailable(a) ? a.state === "unavailable" ? "Erişilemiyor" : "Durum bilinmiyor" : a.state === "on" ? "Açık" : "Kapalı"}</button>` : a.domain === "select" ? this.renderSelect(a) : this.renderNumber(a)}</div>`)}</section>` : d;
  }
  stateUnavailable(t) {
    return ["unknown", "unavailable"].includes(t.state);
  }
  renderSelect(t) {
    const e = Array.isArray(t.attributes.options) ? t.attributes.options : [];
    return o`<select class="select" aria-label=${t.name} ?disabled=${this.savingEntity === t.entity_id || this.stateUnavailable(t)} .value=${this.stateUnavailable(t) ? "" : t.state} @change=${(a) => void this.changeSetting(t, a.target.value)}>${this.stateUnavailable(t) ? o`<option value="">${t.state === "unavailable" ? "Erişilemiyor" : "Durum bilinmiyor"}</option>` : d}${e.map((a) => o`<option value=${a}>${a}</option>`)}</select>`;
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
      ${t.ongoing.length ? o`<div class="subhead">Devam eden kesintiler</div>${t.ongoing.map((a) => o`<div class="report-event"><strong>${this.deviceName(a.device_id)}</strong><span>Başlangıç ${this.formatDate(a.start)}</span><span>${this.formatDuration(a.seconds)} · sürüyor</span></div>`)}` : d}
      <div class="report-events">${t.events.filter((a) => !a.ongoing).slice(0, 8).map((a) => o`<div class="report-event"><strong>${this.deviceName(a.device_id)}</strong><span>${this.formatDate(a.start)}</span><span>${this.formatDuration(a.seconds)}</span></div>`)}</div>
      <p class="coverage">${t.coverage_since ? `Veri kapsamı ${this.formatDate(t.coverage_since)} tarihinden itibaren.` : "Veri kapsamı başlangıcı bilinmiyor."} Cihaz kesinti süreleri cihaz bazında toplanır; evin çevrimdışı süresi değildir.</p></section>`;
  }
  deviceName(t) {
    return this.data?.devices.find((e) => e.id === t)?.name ?? t;
  }
  devicePlatformLine(t) {
    const e = t.integrations?.length ? t.integrations : [t.integration].filter((a) => !!a);
    return [t.manufacturer, e.map(E).join(", ")].filter(Boolean).join(" · ") || "Üretici / entegrasyon bilgisi yok";
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
f.styles = ve`
    :host { display:block; color:var(--primary-text-color); --care-accent:#087f8c; --care-accent-ink:color-mix(in srgb,var(--care-accent) 65%,var(--primary-text-color,#111)); --care-blue-ink:color-mix(in srgb,#2169a6 60%,var(--primary-text-color,#111)); --care-amber-ink:color-mix(in srgb,#9a6200 58%,var(--primary-text-color,#111)); --care-violet-ink:color-mix(in srgb,#6555a5 62%,var(--primary-text-color,#111)); --care-warn:#a95000; --care-warn-ink:color-mix(in srgb,#c56a17 58%,var(--primary-text-color,#111)); --care-accent-soft:color-mix(in srgb,var(--care-accent) 11%,var(--card-background-color,#fff)); --care-warn-soft:color-mix(in srgb,#d8761a 12%,var(--card-background-color,#fff)); --care-border:var(--divider-color,#d9dee3); --care-muted:var(--secondary-text-color,#66717c); }
    * { box-sizing:border-box } button, input, select { font:inherit } button { color:inherit; cursor:pointer }
    .shell { max-width:1560px; margin:0 auto; padding:20px clamp(14px,2.5vw,38px) 40px }
    .top { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; margin-bottom:14px }
    h1 { margin:0; font-size:clamp(22px,2vw,29px); letter-spacing:-.035em; font-weight:720 }
    .brand-title { display:flex; align-items:center; gap:10px }.brand-title img { width:38px; height:38px; object-fit:contain; flex:none }
    .subtitle { margin:5px 0 0; color:var(--care-muted); font-size:13px }
    .top-actions { display:flex; gap:8px; align-items:center }
    .button { border:1px solid var(--care-border); background:var(--card-background-color,#fff); border-radius:9px; padding:8px 12px; display:inline-flex; gap:7px; align-items:center; font-size:13px; font-weight:600; min-height:36px }
    .button:hover { background:var(--secondary-background-color,#f4f6f7) }.button.primary { background:var(--care-accent); color:white; border-color:var(--care-accent) }.button.ghost { border-color:transparent; background:transparent }
    svg { width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; flex:none }
    .summary { display:flex; align-items:center; gap:10px; padding:11px 14px; border:1px solid color-mix(in srgb,var(--care-accent) 22%,var(--care-border)); border-left:3px solid var(--care-accent); border-radius:12px; background:var(--card-background-color,#fff); margin-bottom:13px; flex-wrap:wrap }
    .summary-title { font-size:13px; font-weight:700; margin-right:auto }.metric { display:flex; gap:6px; align-items:center; color:var(--care-muted); font-size:12px; padding:4px 8px; border-radius:7px; background:var(--secondary-background-color,#f5f7f8) }.metric strong { color:var(--primary-text-color); font-size:13px }
    .metric.warn { color:var(--care-warn-ink); background:var(--care-warn-soft) }.metric.good { color:var(--care-accent-ink); background:var(--care-accent-soft) }
    .toolbar { display:flex; align-items:center; gap:8px; margin:0 0 13px; flex-wrap:wrap }.search { position:relative; flex:1; min-width:180px; max-width:420px }.search svg { position:absolute; left:11px; top:10px; color:var(--care-muted) }.search input { width:100%; padding:8px 12px 8px 36px; border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff); color:inherit; outline:none; min-height:38px }.search input:focus, select:focus, input:focus { outline:2px solid color-mix(in srgb,var(--care-accent) 42%,transparent); outline-offset:1px }
    .select { border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff); color:inherit; padding:8px 30px 8px 10px; min-height:38px; font-size:13px }
    .tabs { display:flex; border:1px solid var(--care-border); padding:3px; border-radius:10px; background:var(--card-background-color,#fff); margin-left:auto }.tabs button { border:0; border-radius:7px; padding:6px 9px; display:flex; gap:6px; align-items:center; background:transparent; color:var(--care-muted); font-size:12px }.tabs button.active { color:var(--primary-text-color); background:var(--secondary-background-color,#eff2f4); font-weight:700 }
    .inventory { border:1px solid var(--care-border); border-radius:12px; overflow:hidden; background:var(--card-background-color,#fff) }.table-scroll { overflow:auto; max-height:calc(100vh - 300px); min-height:180px }
    table { width:100%; border-collapse:collapse; min-width:740px } th { text-align:left; font-size:10px; letter-spacing:.075em; text-transform:uppercase; color:var(--care-muted); font-weight:650; padding:10px 12px; background:var(--secondary-background-color,#f7f8f9); white-space:nowrap; position:sticky; top:0; z-index:1 }
    td { border-top:1px solid var(--care-border); padding:9px 12px; font-size:13px; vertical-align:middle } tbody tr { cursor:pointer } tbody tr:hover, tbody tr.selected { background:var(--secondary-background-color,#f7f8f9) }.device-name { display:flex; gap:9px; align-items:center; min-width:190px }.device-name > span:last-child { min-width:0 }.device-name .name,.device-name .sub { display:block }.device-glyph { width:30px; height:30px; display:grid; place-items:center; border-radius:8px; color:var(--care-muted); background:var(--secondary-background-color,#f1f3f4) }.name { font-weight:650 }.sub { font-size:11px; color:var(--care-muted); margin-top:2px }.health-pill, .signal-pill { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:620; border-radius:999px; padding:5px 8px; white-space:nowrap; background:var(--secondary-background-color,#f2f4f5); color:var(--care-muted) }.health-pill.online { color:var(--care-accent); background:var(--care-accent-soft) }.health-pill.offline, .health-pill.partial { color:var(--care-warn); background:var(--care-warn-soft) }.health-pill.expected_off { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }
    .signal-pill.active { color:var(--care-accent); background:var(--care-accent-soft); border:1px solid color-mix(in srgb,var(--care-accent) 24%,transparent) }.signal-pill.warning { color:var(--care-warn); background:var(--care-warn-soft) }.signal-pill.expected { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }.signal-pill.low { color:var(--care-warn); background:var(--care-warn-soft); font-weight:700 }.signal-pill.unknown { border:1px dashed var(--care-border); background:transparent }
    .signal-pill svg { width:14px;height:14px }.battery { font-variant-numeric:tabular-nums; white-space:nowrap }.battery.low { color:var(--care-warn); font-weight:700 }.table-footer { border-top:1px solid var(--care-border); padding:9px 12px; color:var(--care-muted); font-size:11px; display:flex; justify-content:space-between; gap:10px }
    .room-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); align-items:start; gap:12px }.room { align-self:start; border:1px solid var(--care-border); border-radius:12px; overflow:hidden; background:var(--card-background-color,#fff); min-width:0 }.room-head { width:100%; border:0; background:transparent; display:flex; align-items:center; gap:9px; padding:13px 14px; text-align:left }.room-head .room-title { font-weight:700; font-size:14px }.room-head small { color:var(--care-muted); margin-left:auto; font-size:11px }.room-body { border-top:1px solid var(--care-border); padding:9px; display:grid; align-content:start; gap:8px }.device-card { border:1px solid var(--care-border); border-radius:10px; padding:11px; cursor:pointer; min-width:0 }.device-card:hover { border-color:color-mix(in srgb,var(--care-accent) 42%,var(--care-border)) }.card-head { display:flex; gap:8px; align-items:flex-start }.card-head .name { flex:1; font-size:13px }.card-meta { color:var(--care-muted); font-size:11px; margin:4px 0 9px; display:grid; gap:2px }.card-meta-secondary { color:var(--care-muted) }.signals { display:flex; flex-wrap:wrap; gap:6px }.signal-pill { font-size:10px; padding:4px 7px }.card-health { margin-top:8px; display:flex; align-items:center; gap:7px; font-size:11px; color:var(--care-muted) }
    .device-glyph.type-motion,.device-glyph.type-sensor { color:#087f8c; background:color-mix(in srgb,#087f8c 12%,var(--card-background-color,#fff)) }.device-glyph.type-light { color:#9a6200; background:color-mix(in srgb,#db9b26 18%,var(--card-background-color,#fff)) }.device-glyph.type-switch,.device-glyph.type-cover { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }.device-glyph.type-remote,.device-glyph.type-camera { color:#2169a6; background:color-mix(in srgb,#2169a6 12%,var(--card-background-color,#fff)) }.device-glyph.type-lock,.device-glyph.type-fan,.device-glyph.type-climate { color:#785694; background:color-mix(in srgb,#785694 12%,var(--card-background-color,#fff)) }
    .signal-pill.state-on { color:#087f8c; background:color-mix(in srgb,#087f8c 12%,var(--card-background-color,#fff)) }.signal-pill.state-off { color:var(--care-muted); background:var(--secondary-background-color,#f2f4f5) }.signal-pill.state-unavailable { color:var(--care-warn); background:var(--care-warn-soft) }
    tbody tr.selected { box-shadow:inset 3px 0 var(--care-accent) }.device-card:focus-visible,.room-head:focus-visible,.button:focus-visible { outline:2px solid color-mix(in srgb,var(--care-accent) 65%,var(--primary-text-color)); outline-offset:2px }
    .health-pill.online,.signal-pill.active,.signal-pill.state-on,.metric.good { color:var(--care-accent-ink) }.health-pill.offline,.health-pill.partial,.signal-pill.warning,.signal-pill.low,.signal-pill.state-unavailable,.metric.warn { color:var(--care-warn-ink) }.health-pill.expected_off,.signal-pill.expected { color:var(--care-violet-ink) }.tabs button.active { color:var(--care-accent-ink); background:var(--care-accent-soft) }
    .device-glyph.type-motion,.device-glyph.type-sensor { color:var(--care-accent-ink); background:var(--care-accent-soft) }.device-glyph.type-light { color:var(--care-amber-ink) }.device-glyph.type-switch,.device-glyph.type-cover,.device-glyph.type-lock,.device-glyph.type-fan,.device-glyph.type-climate { color:var(--care-violet-ink) }.device-glyph.type-remote,.device-glyph.type-camera { color:var(--care-blue-ink) }
    .drawer-backdrop { position:fixed; inset:0; background:#0005; z-index:8 }.drawer { position:fixed; z-index:9; right:0; top:0; bottom:0; width:min(460px,94vw); background:var(--primary-background-color,#fff); box-shadow:-12px 0 36px #0002; overflow:auto; padding:20px }.drawer-head { display:flex; align-items:flex-start; gap:12px; border-bottom:1px solid var(--care-border); padding-bottom:15px }.drawer-head h2 { margin:0; font-size:20px }.drawer-head .close { margin-left:auto }.section { padding:15px 0; border-bottom:1px solid var(--care-border) }.section h3 { margin:0 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--care-muted) }.detail-row { display:flex; justify-content:space-between; gap:16px; padding:6px 0; font-size:13px }.detail-row span:first-child { color:var(--care-muted) }.entity-row { border-top:1px solid var(--care-border); padding:10px 0; display:flex; justify-content:space-between; align-items:center; gap:10px }.entity-row:first-of-type { border:0 }.entity-title { min-width:0 }.entity-title strong { font-size:12px; display:block; overflow-wrap:anywhere }.entity-title small { color:var(--care-muted); font-size:11px }
    .settings-panel, .report-panel { border:1px solid var(--care-border); border-radius:12px; background:var(--card-background-color,#fff); padding:16px; margin-bottom:12px }.settings-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px }.field { display:flex; flex-direction:column; gap:5px; font-size:12px; color:var(--care-muted) }.field select, .field input { width:100%; border:1px solid var(--care-border); border-radius:8px; background:var(--primary-background-color,#fff); color:inherit; padding:8px; min-height:36px }.settings-panel h2,.report-panel h2 { margin:0 0 12px; font-size:16px }.subhead { margin:16px 0 8px; font-size:12px; font-weight:700 }.checkline { display:flex; gap:8px; align-items:center; font-size:12px; margin:8px 0 }.settings-devices { border:1px solid var(--care-border); border-radius:8px; max-height:210px; overflow:auto; padding:8px 10px }.settings-device { display:flex; gap:8px; padding:5px 0; align-items:center; font-size:12px }.settings-device small { color:var(--care-muted); margin-left:auto }.sources { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px }.rule-row { display:grid; grid-template-columns:1fr 1fr auto; gap:8px; margin:7px 0 }.plain-input { padding:7px 9px; border:1px solid var(--care-border); border-radius:7px; background:var(--primary-background-color,#fff); color:inherit; min-width:0 }.error { border:1px solid color-mix(in srgb,#c14635 32%,var(--care-border)); background:color-mix(in srgb,#c14635 8%,var(--card-background-color,#fff)); color:#9c3026; border-radius:9px; padding:10px 12px; margin:10px 0; font-size:13px }.empty { padding:48px 20px; text-align:center; color:var(--care-muted) }.loading { padding:60px 16px; text-align:center; color:var(--care-muted) }.report-stats { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:8px }.stat { padding:10px; border-radius:9px; background:var(--secondary-background-color,#f5f7f8) }.stat strong { display:block; font-size:18px; font-variant-numeric:tabular-nums }.stat span { display:block; color:var(--care-muted); font-size:10px; margin-top:2px }.report-events { margin-top:12px; border-top:1px solid var(--care-border) }.report-event { display:flex; gap:12px; padding:8px 0; font-size:12px; border-bottom:1px solid var(--care-border) }.report-event span:last-child { margin-left:auto; color:var(--care-muted) }.coverage { font-size:11px; color:var(--care-muted); margin-top:12px }
    @media (max-width:1100px) { .room-grid { grid-template-columns:repeat(2,minmax(0,1fr)); align-items:start } }
    @media (max-width:720px) { .shell { padding:14px 12px 26px }.top { align-items:center }.top-actions .button-label { display:none }.top-actions .button { padding:8px }.summary { gap:6px; padding:9px }.summary-title { width:100%; margin:0 0 2px }.metric { font-size:11px; padding:4px 6px }.toolbar { gap:6px }.search { min-width:100%; max-width:none }.tabs { margin-left:0; order:2 }.toolbar > .select { flex:1; min-width:110px }.room-grid { grid-template-columns:minmax(0,1fr) }.table-scroll { max-height:none; overflow:visible }.inventory { border:0; background:transparent; overflow:visible } table,tbody { display:block; min-width:0 } thead { display:none } tbody { display:grid; gap:8px } tbody tr { display:flex; flex-direction:column; border:1px solid var(--care-border); border-radius:10px; padding:10px; background:var(--card-background-color,#fff) } td { display:none; border:0; padding:4px 0 } td:first-child, td[data-mobile] { display:block } td:first-child { padding:0 0 6px }.table-footer { margin-top:8px; border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff) }.settings-grid { grid-template-columns:1fr 1fr }.report-stats { grid-template-columns:repeat(2,minmax(0,1fr)) }.report-stats .stat:first-child { grid-column:span 2 }.sources { grid-template-columns:1fr }.rule-row { grid-template-columns:1fr 1fr auto } }
    @media (prefers-reduced-motion: no-preference) { .button, .device-card, tbody tr { transition:background-color .15s ease,border-color .15s ease } }
  `;
v([
  me({ attribute: !1 })
], f.prototype, "hass", 2);
v([
  g()
], f.prototype, "data", 2);
v([
  g()
], f.prototype, "loading", 2);
v([
  g()
], f.prototype, "error", 2);
v([
  g()
], f.prototype, "query", 2);
v([
  g()
], f.prototype, "selectedId", 2);
v([
  g()
], f.prototype, "editing", 2);
v([
  g()
], f.prototype, "saving", 2);
v([
  g()
], f.prototype, "report", 2);
v([
  g()
], f.prototype, "reportWindow", 2);
v([
  g()
], f.prototype, "openGroups", 2);
v([
  g()
], f.prototype, "savingEntity", 2);
f = v([
  Le("device-care-panel")
], f);
export {
  f as DeviceCarePanel
};
