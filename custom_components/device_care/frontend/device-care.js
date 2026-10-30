/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, Z = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, W = Symbol(), X = /* @__PURE__ */ new WeakMap();
let ie = class {
  constructor(e, a, n) {
    if (this._$cssResult$ = !0, n !== W) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = a;
  }
  get styleSheet() {
    let e = this.o;
    const a = this.t;
    if (Z && e === void 0) {
      const n = a !== void 0 && a.length === 1;
      n && (e = X.get(a)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && X.set(a, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const de = (t) => new ie(typeof t == "string" ? t : t + "", void 0, W), ue = (t, ...e) => {
  const a = t.length === 1 ? t[0] : e.reduce((n, i, r) => n + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + t[r + 1], t[0]);
  return new ie(a, t, W);
}, pe = (t, e) => {
  if (Z) t.adoptedStyleSheets = e.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of e) {
    const n = document.createElement("style"), i = H.litNonce;
    i !== void 0 && n.setAttribute("nonce", i), n.textContent = a.cssText, t.appendChild(n);
  }
}, G = Z ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let a = "";
  for (const n of e.cssRules) a += n.cssText;
  return de(a);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: he, defineProperty: me, getOwnPropertyDescriptor: ve, getOwnPropertyNames: fe, getOwnPropertySymbols: ge, getPrototypeOf: be } = Object, L = globalThis, J = L.trustedTypes, ye = J ? J.emptyScript : "", xe = L.reactiveElementPolyfillSupport, z = (t, e) => t, V = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ye : null;
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
} }, B = (t, e) => !he(t, e), K = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: B };
Symbol.metadata ??= Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let R = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, a = K) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(e, a), !a.noAccessor) {
      const n = Symbol(), i = this.getPropertyDescriptor(e, n, a);
      i !== void 0 && me(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, a, n) {
    const { get: i, set: r } = ve(this.prototype, e) ?? { get() {
      return this[a];
    }, set(s) {
      this[a] = s;
    } };
    return { get: i, set(s) {
      const l = i?.call(this);
      r?.call(this, s), this.requestUpdate(e, l, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? K;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = be(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const a = this.properties, n = [...fe(a), ...ge(a)];
      for (const i of n) this.createProperty(i, a[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const a = litPropertyMetadata.get(e);
      if (a !== void 0) for (const [n, i] of a) this.elementProperties.set(n, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, n] of this.elementProperties) {
      const i = this._$Eu(a, n);
      i !== void 0 && this._$Eh.set(i, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const a = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const i of n) a.unshift(G(i));
    } else e !== void 0 && a.push(G(e));
    return a;
  }
  static _$Eu(e, a) {
    const n = a.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const n of a.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return pe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, a, n) {
    this._$AK(e, n);
  }
  _$ET(e, a) {
    const n = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, n);
    if (i !== void 0 && n.reflect === !0) {
      const r = (n.converter?.toAttribute !== void 0 ? n.converter : V).toAttribute(a, n.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, a) {
    const n = this.constructor, i = n._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const r = n.getPropertyOptions(i), s = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : V;
      this._$Em = i;
      const l = s.fromAttribute(a, r.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, a, n, i = !1, r) {
    if (e !== void 0) {
      const s = this.constructor;
      if (i === !1 && (r = this[e]), n ??= s.getPropertyOptions(e), !((n.hasChanged ?? B)(r, a) || n.useDefault && n.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(s._$Eu(e, n)))) return;
      this.C(e, a, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, a, { useDefault: n, reflect: i, wrapped: r }, s) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, s ?? a ?? this[e]), r !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (a = void 0), this._$AL.set(e, a)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [i, r] of n) {
        const { wrapped: s } = r, l = this[i];
        s !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, r, l);
      }
    }
    let e = !1;
    const a = this._$AL;
    try {
      e = this.shouldUpdate(a), e ? (this.willUpdate(a), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(a)) : this._$EM();
    } catch (n) {
      throw e = !1, this._$EM(), n;
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
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[z("elementProperties")] = /* @__PURE__ */ new Map(), R[z("finalized")] = /* @__PURE__ */ new Map(), xe?.({ ReactiveElement: R }), (L.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, j = (t) => t, O = q.trustedTypes, Q = O ? O.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, re = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, se = "?" + x, ke = `<${se}>`, S = document, E = () => S.createComment(""), N = (t) => t === null || typeof t != "object" && typeof t != "function", F = Array.isArray, Te = (t) => F(t) || typeof t?.[Symbol.iterator] == "function", D = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, $ = /-->/g, ee = />/g, k = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), te = /'/g, ae = /"/g, oe = /^(?:script|style|textarea|title)$/i, Se = (t) => (e, ...a) => ({ _$litType$: t, strings: e, values: a }), o = Se(1), w = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ne = /* @__PURE__ */ new WeakMap(), T = S.createTreeWalker(S, 129);
function le(t, e) {
  if (!F(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(e) : e;
}
const Re = (t, e) => {
  const a = t.length - 1, n = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = U;
  for (let l = 0; l < a; l++) {
    const c = t[l];
    let p, m, h = -1, b = 0;
    for (; b < c.length && (s.lastIndex = b, m = s.exec(c), m !== null); ) b = s.lastIndex, s === U ? m[1] === "!--" ? s = $ : m[1] !== void 0 ? s = ee : m[2] !== void 0 ? (oe.test(m[2]) && (i = RegExp("</" + m[2], "g")), s = k) : m[3] !== void 0 && (s = k) : s === k ? m[0] === ">" ? (s = i ?? U, h = -1) : m[1] === void 0 ? h = -2 : (h = s.lastIndex - m[2].length, p = m[1], s = m[3] === void 0 ? k : m[3] === '"' ? ae : te) : s === ae || s === te ? s = k : s === $ || s === ee ? s = U : (s = k, i = void 0);
    const y = s === k && t[l + 1].startsWith("/>") ? " " : "";
    r += s === U ? c + ke : h >= 0 ? (n.push(p), c.slice(0, h) + re + c.slice(h) + x + y) : c + x + (h === -2 ? l : y);
  }
  return [le(t, r + (t[a] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class P {
  constructor({ strings: e, _$litType$: a }, n) {
    let i;
    this.parts = [];
    let r = 0, s = 0;
    const l = e.length - 1, c = this.parts, [p, m] = Re(e, a);
    if (this.el = P.createElement(p, n), T.currentNode = this.el.content, a === 2 || a === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = T.nextNode()) !== null && c.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(re)) {
          const b = m[s++], y = i.getAttribute(h).split(x), I = /([.?@])?(.*)/.exec(b);
          c.push({ type: 1, index: r, name: I[2], strings: y, ctor: I[1] === "." ? _e : I[1] === "?" ? Ue : I[1] === "@" ? ze : C }), i.removeAttribute(h);
        } else h.startsWith(x) && (c.push({ type: 6, index: r }), i.removeAttribute(h));
        if (oe.test(i.tagName)) {
          const h = i.textContent.split(x), b = h.length - 1;
          if (b > 0) {
            i.textContent = O ? O.emptyScript : "";
            for (let y = 0; y < b; y++) i.append(h[y], E()), T.nextNode(), c.push({ type: 2, index: ++r });
            i.append(h[b], E());
          }
        }
      } else if (i.nodeType === 8) if (i.data === se) c.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(x, h + 1)) !== -1; ) c.push({ type: 7, index: r }), h += x.length - 1;
      }
      r++;
    }
  }
  static createElement(e, a) {
    const n = S.createElement("template");
    return n.innerHTML = e, n;
  }
}
function _(t, e, a = t, n) {
  if (e === w) return e;
  let i = n !== void 0 ? a._$Co?.[n] : a._$Cl;
  const r = N(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(t), i._$AT(t, a, n)), n !== void 0 ? (a._$Co ??= [])[n] = i : a._$Cl = i), i !== void 0 && (e = _(t, i._$AS(t, e.values), i, n)), e;
}
class we {
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
    const { el: { content: a }, parts: n } = this._$AD, i = (e?.creationScope ?? S).importNode(a, !0);
    T.currentNode = i;
    let r = T.nextNode(), s = 0, l = 0, c = n[0];
    for (; c !== void 0; ) {
      if (s === c.index) {
        let p;
        c.type === 2 ? p = new M(r, r.nextSibling, this, e) : c.type === 1 ? p = new c.ctor(r, c.name, c.strings, this, e) : c.type === 6 && (p = new Ae(r, this, e)), this._$AV.push(p), c = n[++l];
      }
      s !== c?.index && (r = T.nextNode(), s++);
    }
    return T.currentNode = S, i;
  }
  p(e) {
    let a = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, a), a += n.strings.length - 2) : n._$AI(e[a])), a++;
  }
}
class M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, a, n, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = a, this._$AM = n, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    e = _(this, e, a), N(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== w && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Te(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && N(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: a, _$litType$: n } = e, i = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = P.createElement(le(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === i) this._$AH.p(a);
    else {
      const r = new we(i, this), s = r.u(this.options);
      r.p(a), this.T(s), this._$AH = r;
    }
  }
  _$AC(e) {
    let a = ne.get(e.strings);
    return a === void 0 && ne.set(e.strings, a = new P(e)), a;
  }
  k(e) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let n, i = 0;
    for (const r of e) i === a.length ? a.push(n = new M(this.O(E()), this.O(E()), this, this.options)) : n = a[i], n._$AI(r), i++;
    i < a.length && (this._$AR(n && n._$AB.nextSibling, i), a.length = i);
  }
  _$AR(e = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); e !== this._$AB; ) {
      const n = j(e).nextSibling;
      j(e).remove(), e = n;
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
  constructor(e, a, n, i, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = a, this._$AM = i, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = d;
  }
  _$AI(e, a = this, n, i) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) e = _(this, e, a, 0), s = !N(e) || e !== this._$AH && e !== w, s && (this._$AH = e);
    else {
      const l = e;
      let c, p;
      for (e = r[0], c = 0; c < r.length - 1; c++) p = _(this, l[n + c], a, c), p === w && (p = this._$AH[c]), s ||= !N(p) || p !== this._$AH[c], p === d ? e = d : e !== d && (e += (p ?? "") + r[c + 1]), this._$AH[c] = p;
    }
    s && !i && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class _e extends C {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Ue extends C {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class ze extends C {
  constructor(e, a, n, i, r) {
    super(e, a, n, i, r), this.type = 5;
  }
  _$AI(e, a = this) {
    if ((e = _(this, e, a, 0) ?? d) === w) return;
    const n = this._$AH, i = e === d && n !== d || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, r = e !== d && (n === d || i);
    i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ae {
  constructor(e, a, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    _(this, e);
  }
}
const Ee = q.litHtmlPolyfillSupport;
Ee?.(P, M), (q.litHtmlVersions ??= []).push("3.3.3");
const Ne = (t, e, a) => {
  const n = a?.renderBefore ?? e;
  let i = n._$litPart$;
  if (i === void 0) {
    const r = a?.renderBefore ?? null;
    n._$litPart$ = i = new M(e.insertBefore(E(), r), r, void 0, a ?? {});
  }
  return i._$AI(t), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis;
class A extends R {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
A._$litElement$ = !0, A.finalized = !0, Y.litElementHydrateSupport?.({ LitElement: A });
const Pe = Y.litElementPolyfillSupport;
Pe?.({ LitElement: A });
(Y.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = (t) => (e, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ie = { attribute: !0, type: String, converter: V, reflect: !1, hasChanged: B }, He = (t = Ie, e, a) => {
  const { kind: n, metadata: i } = a;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), n === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(a.name, t), n === "accessor") {
    const { name: s } = a;
    return { set(l) {
      const c = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(s, c, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(s, void 0, t, l), l;
    } };
  }
  if (n === "setter") {
    const { name: s } = a;
    return function(l) {
      const c = this[s];
      e.call(this, l), this.requestUpdate(s, c, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function ce(t) {
  return (e, a) => typeof a == "object" ? He(t, e, a) : ((n, i, r) => {
    const s = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, n), s ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(t, e, a);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(t) {
  return ce({ ...t, state: !0, attribute: !1 });
}
class Ve {
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
  callEntity(e, a, n, i = !1) {
    return this.connection.sendMessagePromise({ type: "device_care/call_entity", entity_id: e, service: a, controls_unlocked: i, ...n ? { data: n } : {} });
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
const Oe = "data:image/png;base64,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", Le = {
  devices_and_care: { "tr-TR": "Cihazlar & Bakım", "en-US": "Devices & Care" },
  loading_devices: { "tr-TR": "Cihazlar yükleniyor…", "en-US": "Loading devices…" },
  retry: { "tr-TR": "Yeniden dene", "en-US": "Retry" },
  devices_monitored: { "tr-TR": "cihaz izleniyor", "en-US": "devices monitored" },
  monitoring_since: { "tr-TR": "İzleme başlangıcı", "en-US": "Monitoring since" },
  monitoring_start_time_unavailable: { "tr-TR": "İzleme başlangıç zamanı yok", "en-US": "Monitoring start time unavailable" },
  close_editor: { "tr-TR": "Düzenlemeyi kapat", "en-US": "Close editor" },
  edit: { "tr-TR": "Düzenle", "en-US": "Edit" },
  close_report: { "tr-TR": "Raporu kapat", "en-US": "Close report" },
  reports: { "tr-TR": "Raporlar", "en-US": "Reports" },
  device_health_summary: { "tr-TR": "Cihaz sağlığı özeti", "en-US": "Device health summary" },
  overall_status: { "tr-TR": "Genel durum", "en-US": "Overall status" },
  reachable: { "tr-TR": "erişilebilir", "en-US": "reachable" },
  issues: { "tr-TR": "sorunlu", "en-US": "issues" },
  unknown: { "tr-TR": "belirsiz", "en-US": "unknown" },
  expected_off: { "tr-TR": "bilerek kapalı", "en-US": "expected off" },
  low_battery: { "tr-TR": "düşük pil", "en-US": "low battery" },
  search_devices: { "tr-TR": "Cihazlarda ara", "en-US": "Search devices" },
  search_device_manufacturer_or_entity: { "tr-TR": "Cihaz, üretici veya entity ara", "en-US": "Search device, manufacturer, or entity" },
  sort_by: { "tr-TR": "Sıralama", "en-US": "Sort by" },
  name: { "tr-TR": "Ada göre", "en-US": "Name" },
  health: { "tr-TR": "Sağlık durumuna göre", "en-US": "Health" },
  area: { "tr-TR": "Odaya göre", "en-US": "Area" },
  view: { "tr-TR": "Görünüm", "en-US": "View" },
  list: { "tr-TR": "Liste", "en-US": "List" },
  rooms: { "tr-TR": "Odalar", "en-US": "Rooms" },
  device: { "tr-TR": "Cihaz", "en-US": "Device" },
  health_2: { "tr-TR": "Sağlık", "en-US": "Health" },
  area_2: { "tr-TR": "Oda", "en-US": "Area" },
  status: { "tr-TR": "Durum", "en-US": "Status" },
  battery: { "tr-TR": "Pil", "en-US": "Battery" },
  connectivity: { "tr-TR": "Bağlantı", "en-US": "Connectivity" },
  firmware: { "tr-TR": "Firmware", "en-US": "Firmware" },
  devices: { "tr-TR": "cihaz", "en-US": "devices" },
  select_a_device_to_view_details_and_supp: { "tr-TR": "Bir cihazı seçerek ayrıntılarını ve desteklenen ayarları açın", "en-US": "Select a device to view details and supported settings" },
  all_devices: { "tr-TR": "Tüm cihazlar", "en-US": "All devices" },
  unassigned: { "tr-TR": "Atanmamış", "en-US": "Unassigned" },
  no_area_assigned: { "tr-TR": "Oda atanmamış", "en-US": "No area assigned" },
  no_floor_assigned: { "tr-TR": "Kat atanmamış", "en-US": "No floor assigned" },
  no_integration: { "tr-TR": "Entegrasyon yok", "en-US": "No integration" },
  manufacturer_integration_unavailable: { "tr-TR": "Üretici / entegrasyon bilgisi yok", "en-US": "Manufacturer / integration unavailable" },
  no_data: { "tr-TR": "Veri yok", "en-US": "No data" },
  motion: { "tr-TR": "Hareket", "en-US": "Motion" },
  presence: { "tr-TR": "Varlık", "en-US": "Presence" },
  motion_detected: { "tr-TR": "Hareket algılanıyor", "en-US": "Motion detected" },
  presence_detected: { "tr-TR": "Varlık algılanıyor", "en-US": "Presence detected" },
  no_motion_detected: { "tr-TR": "Hareket algılanmıyor", "en-US": "No motion detected" },
  no_presence_detected: { "tr-TR": "Varlık algılanmıyor", "en-US": "No presence detected" },
  status_unknown: { "tr-TR": "Durum bilinmiyor", "en-US": "Status unknown" },
  unavailable: { "tr-TR": "Erişilemiyor", "en-US": "Unavailable" },
  expected_off_2: { "tr-TR": "Bilerek kapalı", "en-US": "Expected off" },
  no_status_measurement: { "tr-TR": "Durum ölçümü yok", "en-US": "No status measurement" },
  status_unavailable: { "tr-TR": "Durum erişilemiyor", "en-US": "Status unavailable" },
  tv_status_unavailable: { "tr-TR": "TV durumu yok", "en-US": "TV status unavailable" },
  tv_unavailable: { "tr-TR": "TV erişilemiyor", "en-US": "TV unavailable" },
  tv_status_unknown: { "tr-TR": "TV durumu bilinmiyor", "en-US": "TV status unknown" },
  button_no_live_state: { "tr-TR": "Düğme · anlık durum yok", "en-US": "Button · no live state" },
  no_status_measurement_for_this_device_ty: { "tr-TR": "Bu cihaz türünde durum ölçümü yok", "en-US": "No status measurement for this device type" },
  on: { "tr-TR": "Açık", "en-US": "On" },
  off: { "tr-TR": "Kapalı", "en-US": "Off" },
  opening: { "tr-TR": "Açılıyor", "en-US": "Opening" },
  closing: { "tr-TR": "Kapanıyor", "en-US": "Closing" },
  locked: { "tr-TR": "Kilitli", "en-US": "Locked" },
  unlocked: { "tr-TR": "Kilit açık", "en-US": "Unlocked" },
  playing: { "tr-TR": "Oynatıyor", "en-US": "Playing" },
  paused: { "tr-TR": "Duraklatıldı", "en-US": "Paused" },
  idle: { "tr-TR": "Boşta", "en-US": "Idle" },
  standby: { "tr-TR": "Beklemede", "en-US": "Standby" },
  buffering: { "tr-TR": "Yükleniyor", "en-US": "Buffering" },
  live_connectivity_unavailable: { "tr-TR": "Anlık bağlantı bilgisi yok", "en-US": "Live connectivity unavailable" },
  last_press: { "tr-TR": "Son basış", "en-US": "Last press" },
  event_time_unavailable: { "tr-TR": "Son olay zamanı yok", "en-US": "Event time unavailable" },
  battery_data_unavailable: { "tr-TR": "Pil verisi yok", "en-US": "Battery data unavailable" },
  no_battery_measurement: { "tr-TR": "Pil ölçümü yok", "en-US": "No battery measurement" },
  battery_unavailable: { "tr-TR": "Pil erişilemiyor", "en-US": "Battery unavailable" },
  battery_status_unknown: { "tr-TR": "Pil bilinmiyor", "en-US": "Battery status unknown" },
  low_battery_2: { "tr-TR": "Pil düşük", "en-US": "Low battery" },
  battery_normal: { "tr-TR": "Pil normal", "en-US": "Battery normal" },
  connectivity_unavailable: { "tr-TR": "Bağlantı erişilemiyor", "en-US": "Connectivity unavailable" },
  connectivity_unknown: { "tr-TR": "Bağlantı bilinmiyor", "en-US": "Connectivity unknown" },
  connected: { "tr-TR": "Bağlı", "en-US": "Connected" },
  not_connected: { "tr-TR": "Bağlantı yok", "en-US": "Not connected" },
  version: { "tr-TR": "Sürüm", "en-US": "Version" },
  update_status_unknown: { "tr-TR": "güncellik bilinmiyor", "en-US": "update status unknown" },
  no_ha_update_source_exposed: { "tr-TR": "HA güncelleme kaynağı yok", "en-US": "No Home Assistant update source exposed" },
  unavailable_2: { "tr-TR": "Erişilemiyor", "en-US": "Unavailable" },
  update_available: { "tr-TR": "Güncelleme var", "en-US": "Update available" },
  up_to_date: { "tr-TR": "Güncel", "en-US": "Up to date" },
  skipped: { "tr-TR": "Atlandı", "en-US": "Skipped" },
  installed: { "tr-TR": "Yüklü", "en-US": "Installed" },
  latest: { "tr-TR": "En yeni", "en-US": "Latest" },
  description: { "tr-TR": "Açıklama", "en-US": "Description" },
  firmware_update: { "tr-TR": "Firmware güncellemesi", "en-US": "Firmware update" },
  view_and_scope: { "tr-TR": "Görünüm ve kapsam", "en-US": "View and scope" },
  device_scope: { "tr-TR": "Cihaz kapsamı", "en-US": "Device scope" },
  floor: { "tr-TR": "Kat", "en-US": "Floor" },
  label: { "tr-TR": "Etiket", "en-US": "Label" },
  integration: { "tr-TR": "Entegrasyon", "en-US": "Integration" },
  select: { "tr-TR": "Seçiniz", "en-US": "Select" },
  select_manually: { "tr-TR": "Elle seç", "en-US": "Select manually" },
  group_by: { "tr-TR": "Gruplama", "en-US": "Group by" },
  integration_2: { "tr-TR": "Entegrasyona göre", "en-US": "Integration" },
  no_grouping: { "tr-TR": "Gruplama yok", "en-US": "No grouping" },
  health_3: { "tr-TR": "Sağlığa göre", "en-US": "Health" },
  default_layout: { "tr-TR": "Başlangıç görünümü", "en-US": "Default layout" },
  compact_inventory: { "tr-TR": "Kompakt envanter", "en-US": "Compact inventory" },
  room_cards: { "tr-TR": "Oda kartları", "en-US": "Room cards" },
  automatically_include_new_devices_manual: { "tr-TR": "Yeni bulunan cihazları otomatik dahil et (elle seçilen kapsamda)", "en-US": "Automatically include new devices (manual scope)" },
  history_retention_days: { "tr-TR": "Geçmiş saklama süresi (gün)", "en-US": "History retention (days)" },
  weekly_report_notification_monday_9_00_a: { "tr-TR": "Haftalık rapor bildirimi (Pazartesi 09.00)", "en-US": "Weekly report notification (Monday 9:00 AM)" },
  visible_table_columns: { "tr-TR": "Tabloda gösterilen sütunlar", "en-US": "Visible table columns" },
  device_exclusions_and_manual_selection: { "tr-TR": "Cihaz istisnaları ve elle seçilen cihazlar", "en-US": "Device exclusions and manual selection" },
  exclusions_take_precedence_over_scope_ru: { "tr-TR": "hariç tutulanlar kapsam kuralının önceliğindedir", "en-US": "Exclusions take precedence over scope rules" },
  signal_sources: { "tr-TR": "Algılayıcı kaynakları", "en-US": "Signal sources" },
  automatic_source: { "tr-TR": "Otomatik kaynak", "en-US": "Automatic source" },
  expected_off_rules: { "tr-TR": "Bilerek kapalı kuralları", "en-US": "Expected-off rules" },
  expected_state: { "tr-TR": "Beklenen durum", "en-US": "Expected state" },
  delete_rule: { "tr-TR": "Kuralı sil", "en-US": "Delete rule" },
  add_rule: { "tr-TR": "Kural ekle", "en-US": "Add rule" },
  cancel: { "tr-TR": "İptal", "en-US": "Cancel" },
  saving: { "tr-TR": "Kaydediliyor…", "en-US": "Saving…" },
  save_changes: { "tr-TR": "Değişiklikleri kaydet", "en-US": "Save changes" },
  supported_settings: { "tr-TR": "Desteklenen ayarlar", "en-US": "Supported settings" },
  values_are_read_only_while_locked_check_: { "tr-TR": "Kilitliyken değerler yalnızca görüntülenir. Değişiklik için yukarıdaki onay kutusunu açın.", "en-US": "Values are read-only while locked. Check the box above to make changes." },
  allow_device_setting_changes: { "tr-TR": "Cihaz ayarlarını değiştirmeye izin ver", "en-US": "Allow device setting changes" },
  device_settings_unlocked: { "tr-TR": "Cihaz ayarı değişikliklerine izin verildi", "en-US": "Device settings unlocked" },
  device_settings_locked: { "tr-TR": "Cihaz ayarları kilitli", "en-US": "Device settings locked" },
  eligible_settings_can_be_changed_for_thi: { "tr-TR": "Bu oturumda uygun ayarlar değiştirilebilir. İşiniz bitince kilitleyin.", "en-US": "Eligible settings can be changed for this session. Lock when finished." },
  check_the_box_to_enable_changes_editing_: { "tr-TR": "Değişiklikleri açmak için kutuyu işaretleyin. Ayar değiştirme izni varsayılan olarak kapalıdır.", "en-US": "Check the box to enable changes. Editing is off by default." },
  no_valid_option: { "tr-TR": "geçerli seçenek yok", "en-US": "no valid option" },
  maintenance_report: { "tr-TR": "Bakım raporu", "en-US": "Maintenance report" },
  last_24_hours: { "tr-TR": "Son 24 saat", "en-US": "Last 24 hours" },
  last_7_days: { "tr-TR": "Son 7 gün", "en-US": "Last 7 days" },
  generate_report: { "tr-TR": "Rapor oluştur", "en-US": "Generate report" },
  device_outage_total: { "tr-TR": "Cihaz-kesinti toplamı", "en-US": "Device outage total" },
  outage_starts: { "tr-TR": "Kesinti başlangıcı", "en-US": "Outage starts" },
  outage_intervals: { "tr-TR": "Kesinti aralığı", "en-US": "Outage intervals" },
  low_battery_3: { "tr-TR": "Düşük pil", "en-US": "Low battery" },
  missing_data: { "tr-TR": "Eksik veri", "en-US": "Missing data" },
  ongoing_outages: { "tr-TR": "Devam eden kesintiler", "en-US": "Ongoing outages" },
  started: { "tr-TR": "Başlangıç", "en-US": "Started" },
  ongoing: { "tr-TR": "sürüyor", "en-US": "ongoing" },
  data_coverage: { "tr-TR": "Veri kapsamı", "en-US": "Data coverage" },
  data_coverage_start_is_unknown: { "tr-TR": "Veri kapsamı başlangıcı bilinmiyor.", "en-US": "Data coverage start is unknown." },
  onward: { "tr-TR": "tarihinden itibaren.", "en-US": "onward." },
  device_outage_durations_are_summed_per_d: { "tr-TR": "Cihaz kesinti süreleri cihaz bazında toplanır; evin çevrimdışı süresi değildir.", "en-US": "Device outage durations are summed per device; this is not the home outage duration." },
  no_sensor_reports_offline_status: { "tr-TR": "Çevrimdışı durumunu bildiren bir sensör yok.", "en-US": "No sensor reports offline status." },
  no_connectivity_sensor_reachability_cann: { "tr-TR": "Bağlantı sensörü yok; erişilebilirlik doğrulanamıyor.", "en-US": "No connectivity sensor; reachability cannot be verified." },
  this_device_type_does_not_provide_live_c: { "tr-TR": "Bu cihaz türü anlık bağlantı bilgisi sağlamıyor.", "en-US": "This device type does not provide live connectivity information." },
  the_connectivity_source_is_not_providing: { "tr-TR": "Bağlantı kaynağı şu anda veri vermiyor.", "en-US": "The connectivity source is not providing data." },
  connectivity_cannot_be_verified: { "tr-TR": "Bağlantı durumu doğrulanamıyor.", "en-US": "Connectivity cannot be verified." },
  the_connectivity_sensor_reports_the_devi: { "tr-TR": "Bağlantı sensörü cihazı çevrimdışı gösteriyor.", "en-US": "The connectivity sensor reports the device as offline." },
  the_off_state_is_configured_as_expected: { "tr-TR": "Kapalı durumu ayarlarda beklenen durum olarak tanımlanmış.", "en-US": "The off state is configured as expected." },
  the_device_reports_a_problem: { "tr-TR": "Cihaz bir sorun bildiriyor.", "en-US": "The device reports a problem." },
  connectivity_sensors_disagree: { "tr-TR": "Bağlantı sensörleri birbiriyle uyuşmuyor.", "en-US": "Connectivity sensors disagree." },
  ha_is_receiving_current_state_from_the_d: { "tr-TR": "Home Assistant cihazdan güncel durum alıyor.", "en-US": "Home Assistant is receiving current state from the device." },
  the_selected_connectivity_sensor_was_not: { "tr-TR": "Seçilen bağlantı sensörü bulunamıyor.", "en-US": "The selected connectivity sensor was not found." },
  the_selected_source_is_not_a_connectivit: { "tr-TR": "Seçilen kaynak bağlantı sensörü değil.", "en-US": "The selected source is not a connectivity sensor." },
  partial_issue: { "tr-TR": "Kısmi sorun", "en-US": "Partial issue" },
  reachability_unavailable: { "tr-TR": "Erişilebilirlik bilgisi yok", "en-US": "Reachability unavailable" },
  connectivity_cannot_be_verified_2: { "tr-TR": "Bağlantı doğrulanamıyor", "en-US": "Connectivity cannot be verified" },
  additional_status_details_are_available: { "tr-TR": "Durumla ilgili ek açıklama mevcut.", "en-US": "Additional status details are available." },
  could_not_connect_to_live_updates: { "tr-TR": "Canlı güncelleme bağlantısı kurulamadı:", "en-US": "Could not connect to live updates:" },
  could_not_save_settings: { "tr-TR": "Ayarlar kaydedilemedi:", "en-US": "Could not save settings:" },
  could_not_load_report: { "tr-TR": "Rapor alınamadı:", "en-US": "Could not load report:" },
  could_not_be_updated: { "tr-TR": "güncellenemedi:", "en-US": "could not be updated:" },
  value: { "tr-TR": "Değer", "en-US": "Value" },
  must_be_in_the_range: { "tr-TR": "aralığında ve", "en-US": "must be in the range" },
  and_match_the_step_size: { "tr-TR": "adımına uygun olmalı.", "en-US": "and match the step size." },
  select_a_valid_option_from_the_list: { "tr-TR": "Listeden geçerli bir seçenek seçin.", "en-US": "Select a valid option from the list." },
  no_devices_match_this_search_and_scope: { "tr-TR": "Bu arama ve kapsamda cihaz bulunamadı.", "en-US": "No devices match this search and scope." },
  details: { "tr-TR": "Ayrıntılar", "en-US": "Details" },
  entities: { "tr-TR": "Varlıklar", "en-US": "Entities" },
  last_press_activity: { "tr-TR": "Son basış / etkinlik", "en-US": "Last press / activity" },
  timestamp_unavailable: { "tr-TR": "Zaman bilgisi yok", "en-US": "Timestamp unavailable" },
  disabled: { "tr-TR": "devre dışı", "en-US": "disabled" },
  battery_2: { "tr-TR": "Pil ", "en-US": "Battery " },
  status_unknown_2: { "tr-TR": "durum bilinmiyor", "en-US": "status unknown" },
  entity: { "tr-TR": "entity", "en-US": "entity" },
  manufacturer: { "tr-TR": "Üretici", "en-US": "Manufacturer" },
  online: { "tr-TR": "Online", "en-US": "Online" },
  unknown_status: { "tr-TR": "Durum bilinmiyor", "en-US": "Status unknown" },
  expected_off_title: { "tr-TR": "Bilerek kapalı", "en-US": "Expected off" },
  no_motion: { "tr-TR": "Hareket algılanmıyor", "en-US": "No motion detected" },
  no_presence: { "tr-TR": "Varlık algılanmıyor", "en-US": "No presence detected" },
  status_measurement_unavailable: { "tr-TR": "Durum ölçümü yok", "en-US": "No status measurement" },
  battery_low: { "tr-TR": "Pil düşük", "en-US": "Low battery" },
  firmware_status: { "tr-TR": "Firmware durumu", "en-US": "Firmware status" },
  ha_reported_software: { "tr-TR": "HA cihaz kaydındaki yazılım", "en-US": "Software reported in HA device registry" },
  no_update_source_sentence: { "tr-TR": "Home Assistant bu cihaz için güncelleme kaynağı sunmuyor; yüklü veya en son firmware sürümü doğrulanamıyor.", "en-US": "Home Assistant does not expose an update source for this device; installed or latest firmware cannot be verified." },
  installed_version_unknown: { "tr-TR": "Yüklü sürüm bilinmiyor", "en-US": "Installed version unknown" },
  open_release_notes: { "tr-TR": "Sürüm notlarını aç", "en-US": "Open release notes" },
  close: { "tr-TR": "Kapat", "en-US": "Close" },
  entity_disabled: { "tr-TR": "devre dışı", "en-US": "disabled" },
  settings_unlocked_hint: { "tr-TR": "Bu oturumda uygun ayarlar değiştirilebilir. İşiniz bitince kilitleyin.", "en-US": "Eligible settings can be changed for this session. Lock when finished." },
  settings_locked_hint: { "tr-TR": "Değişiklikleri açmak için kutuyu işaretleyin. Ayar değiştirme izni varsayılan olarak kapalıdır.", "en-US": "Check the box to enable changes. Editing is off by default." },
  invalid_setting_option: { "tr-TR": "Listeden geçerli bir seçenek seçin.", "en-US": "Select a valid option from the list." },
  setting_value_range: { "tr-TR": "Değer aralığa ve adıma uygun olmalı.", "en-US": "Value must be within range and match the step size." },
  report_error: { "tr-TR": "Rapor alınamadı:", "en-US": "Could not load report:" },
  setting_save_error: { "tr-TR": "Ayarlar kaydedilemedi:", "en-US": "Could not save settings:" },
  live_update_error: { "tr-TR": "Canlı güncelleme bağlantısı kurulamadı:", "en-US": "Could not connect to live updates:" },
  device_update_error: { "tr-TR": "güncellenemedi:", "en-US": "could not be updated:" },
  no_health_sensor: { "tr-TR": "Çevrimdışı durumunu bildiren bir sensör yok.", "en-US": "No sensor reports offline status." },
  no_connectivity_sensor: { "tr-TR": "Bağlantı sensörü yok; erişilebilirlik doğrulanamıyor.", "en-US": "No connectivity sensor; reachability cannot be verified." },
  no_live_connectivity_for_type: { "tr-TR": "Bu cihaz türü anlık bağlantı bilgisi sağlamıyor.", "en-US": "This device type does not provide live connectivity information." },
  connectivity_source_no_data: { "tr-TR": "Bağlantı kaynağı şu anda veri vermiyor.", "en-US": "The connectivity source is not providing data." },
  connectivity_not_verified: { "tr-TR": "Bağlantı durumu doğrulanamıyor.", "en-US": "Connectivity cannot be verified." },
  connectivity_reports_offline: { "tr-TR": "Bağlantı sensörü cihazı çevrimdışı gösteriyor.", "en-US": "The connectivity sensor reports the device as offline." },
  configured_off_expected: { "tr-TR": "Kapalı durumu ayarlarda beklenen durum olarak tanımlanmış.", "en-US": "The off state is configured as expected." },
  device_reports_problem: { "tr-TR": "Cihaz bir sorun bildiriyor.", "en-US": "The device reports a problem." },
  ha_receives_current_state: { "tr-TR": "Home Assistant cihazdan güncel durum alıyor.", "en-US": "Home Assistant is receiving current state from the device." },
  selected_connectivity_not_found: { "tr-TR": "Seçilen bağlantı sensörü bulunamıyor.", "en-US": "The selected connectivity sensor was not found." },
  selected_source_not_connectivity: { "tr-TR": "Seçilen kaynak bağlantı sensörü değil.", "en-US": "The selected source is not a connectivity sensor." },
  partial_device_failure: { "tr-TR": "Cihazın bazı işlevleri çalışmıyor olabilir.", "en-US": "Some device functions may not be working." },
  status_details_available: { "tr-TR": "Durumla ilgili ek açıklama mevcut.", "en-US": "Additional status details are available." },
  not_assigned: { "tr-TR": "Atanmamış", "en-US": "Unassigned" },
  floor_unassigned: { "tr-TR": "Kat atanmamış", "en-US": "No floor assigned" },
  no_devices_match: { "tr-TR": "Bu arama ve kapsamda cihaz bulunamadı.", "en-US": "No devices match this search and scope." },
  no_device_status_for_type: { "tr-TR": "Bu cihaz türünde durum ölçümü yok", "en-US": "No status measurement for this device type" },
  button_no_live_status: { "tr-TR": "Düğme · anlık durum yok", "en-US": "Button · no live state" },
  last_press_short: { "tr-TR": "Son basış", "en-US": "Last press" },
  no_event_time: { "tr-TR": "Son olay zamanı yok", "en-US": "Event time unavailable" },
  must_be_in_range_step: { "tr-TR": "aralığında ve adımına uygun olmalı.", "en-US": "must be within range and match the step size." },
  scope_exclusion_note: { "tr-TR": "(hariç tutulanlar kapsam kuralının önceliğindedir)", "en-US": "(excluded devices take precedence over scope rules)" },
  loading_state: { "tr-TR": "Yükleniyor", "en-US": "Buffering" },
  paused_state: { "tr-TR": "Duraklatıldı", "en-US": "Paused" },
  event_buffering: { "tr-TR": "Yükleniyor", "en-US": "Buffering" },
  motion_label: { "tr-TR": "Hareket", "en-US": "Motion" },
  presence_label: { "tr-TR": "Varlık", "en-US": "Presence" },
  battery_label: { "tr-TR": "Pil", "en-US": "Battery" },
  connectivity_label: { "tr-TR": "Bağlantı", "en-US": "Connectivity" },
  connectivity_sensor_no_data: { "tr-TR": "Bağlantı sensörü şu anda veri vermiyor.", "en-US": "The connectivity sensor is not providing data." },
  all_areas_unassigned: { "tr-TR": "Atanmamış", "en-US": "Unassigned" },
  group_all_devices: { "tr-TR": "Tüm cihazlar", "en-US": "All devices" },
  device_count: { "tr-TR": "cihaz", "en-US": "devices" },
  area_not_assigned: { "tr-TR": "Oda atanmamış", "en-US": "No area assigned" },
  title_details: { "tr-TR": "ayrıntıları", "en-US": "details" },
  save_report: { "tr-TR": "Rapor oluştur", "en-US": "Generate report" },
  report_title: { "tr-TR": "Bakım raporu", "en-US": "Maintenance report" },
  outage_duration_context: { "tr-TR": "sürüyor", "en-US": "ongoing" },
  last_activity_time_prefix: { "tr-TR": "Son basış ", "en-US": "Last press " },
  monitoring_devices: { "tr-TR": " cihaz izleniyor · ", "en-US": " devices monitored · " },
  monitoring_since_label: { "tr-TR": "İzleme başlangıcı ", "en-US": "Monitoring since " },
  monitoring_start_unavailable: { "tr-TR": "İzleme başlangıç zamanı yok", "en-US": "Monitoring start time unavailable" },
  no_area: { "tr-TR": "Oda atanmamış", "en-US": "No area assigned" },
  no_floor: { "tr-TR": "Kat atanmamış", "en-US": "No floor assigned" },
  no_integration_value: { "tr-TR": "Entegrasyon yok", "en-US": "No integration" },
  no_manufacturer_integration: { "tr-TR": "Üretici / entegrasyon bilgisi yok", "en-US": "Manufacturer / integration information unavailable" },
  status_no_sensor: { "tr-TR": "Durum ölçümü yok", "en-US": "No status sensor" },
  status_unavailable_sensor: { "tr-TR": "Durum erişilemiyor", "en-US": "Status unavailable" },
  sensor_presence: { "tr-TR": "Bağlantı sensörü mevcut", "en-US": "Connectivity sensor available" },
  battery_has_no_data: { "tr-TR": "Pil verisi yok", "en-US": "Battery data unavailable" },
  no_battery_measurement_for_device: { "tr-TR": "Pil ölçümü yok", "en-US": "No battery measurement" },
  firmware_state_title: { "tr-TR": "Firmware durumu", "en-US": "Firmware status" },
  open_version_notes: { "tr-TR": "Sürüm notlarını aç", "en-US": "Open release notes" },
  installed_version_prefix: { "tr-TR": "Yüklü: ", "en-US": "Installed: " },
  latest_version_prefix: { "tr-TR": " · En son: ", "en-US": " · Latest: " },
  skipped_version_prefix: { "tr-TR": " · Atlanan: ", "en-US": " · Skipped: " },
  coverage_since_prefix: { "tr-TR": "Veri kapsamı ", "en-US": "Data coverage since " },
  coverage_since_suffix: { "tr-TR": " tarihinden itibaren.", "en-US": "." },
  remote_live_status_label: { "tr-TR": "Anlık bağlantı", "en-US": "Live connectivity" },
  add_expected_off_rule: { "tr-TR": "+ Kural ekle", "en-US": "+ Add rule" },
  entity_accessible_name: { "tr-TR": "Entity", "en-US": "Entity" },
  rule_accessible_name: { "tr-TR": "Beklenen durum", "en-US": "Expected state" },
  close_drawer: { "tr-TR": "Kapat", "en-US": "Close" },
  entity_disabled_suffix: { "tr-TR": " · devre dışı", "en-US": " · disabled" },
  no_device_match: { "tr-TR": "Bu arama ve kapsamda cihaz bulunamadı.", "en-US": "No devices match this search and scope." },
  no_settings_options: { "tr-TR": " · geçerli seçenek yok", "en-US": " · no valid options" },
  state_unavailable_text: { "tr-TR": "Pil erişilemiyor", "en-US": "Battery unavailable" },
  title_error_value: { "tr-TR": "Değer ", "en-US": "Value " },
  range_middle: { "tr-TR": " aralığında ve ", "en-US": " must be in the range " },
  step_suffix: { "tr-TR": " adımına uygun olmalı.", "en-US": " and match the step size." },
  select_valid_option: { "tr-TR": "Listeden geçerli bir seçenek seçin.", "en-US": "Select a valid option from the list." },
  updates_available: { "tr-TR": "Güncelleme var", "en-US": "Update available" },
  update_skipped: { "tr-TR": "Atlandı", "en-US": "Skipped" },
  update_unavailable: { "tr-TR": "Erişilemiyor", "en-US": "Unavailable" },
  update_unknown: { "tr-TR": "Durum bilinmiyor", "en-US": "Status unknown" },
  device_error_prefix: { "tr-TR": " güncellenemedi: ", "en-US": " could not be updated: " },
  preference_error_prefix: { "tr-TR": "Ayarlar kaydedilemedi: ", "en-US": "Could not save settings: " },
  report_error_prefix: { "tr-TR": "Rapor alınamadı: ", "en-US": "Could not load report: " },
  connection_error_prefix: { "tr-TR": "Canlı güncelleme bağlantısı kurulamadı: ", "en-US": "Could not connect to live updates: " },
  expected_off_hint: { "tr-TR": "Kilitliyken değerler yalnızca görüntülenir. Değişiklik için yukarıdaki onay kutusunu açın.", "en-US": "Values are read-only while locked. Check the box above to make changes." },
  no_data_coverage_start: { "tr-TR": "Veri kapsamı başlangıcı bilinmiyor.", "en-US": "Data coverage start is unknown." },
  per_device_outage_note: { "tr-TR": " Cihaz kesinti süreleri cihaz bazında toplanır; evin çevrimdışı süresi değildir.", "en-US": " Device outage durations are summed per device; this is not the home outage duration." },
  battery_unknown: { "tr-TR": "Pil bilinmiyor", "en-US": "Battery status unknown" },
  labels: { "tr-TR": "Etiketler", "en-US": "Labels" },
  open: { "tr-TR": "Açık", "en-US": "Open" },
  report_generated: { "tr-TR": "Rapor oluştur", "en-US": "Generate report" },
  no_firmware_update_source: { "tr-TR": "HA güncelleme kaynağı yok", "en-US": "No HA firmware update source exposed" },
  firmware_update_title: { "tr-TR": "Firmware güncellemesi", "en-US": "Firmware update" },
  installed_version: { "tr-TR": "Yüklü", "en-US": "Installed" },
  latest_version: { "tr-TR": "En son", "en-US": "Latest" },
  skipped_version: { "tr-TR": "Atlanan", "en-US": "Skipped" },
  release_notes: { "tr-TR": "Sürüm notlarını aç", "en-US": "Open release notes" },
  firmware_freshness_unknown: { "tr-TR": "güncellik bilinmiyor", "en-US": "update status unknown" },
  event_time_label: { "tr-TR": "Zaman bilgisi yok", "en-US": "Timestamp unavailable" },
  motion_detected_title: { "tr-TR": "Hareket", "en-US": "Motion" },
  last_activity_title: { "tr-TR": "Son basış / etkinlik", "en-US": "Last press / activity" },
  start_time: { "tr-TR": "Başlangıç", "en-US": "Started" },
  report_coverage_sentence: { "tr-TR": "Veri kapsamı", "en-US": "Data coverage" },
  coverage_start_unknown: { "tr-TR": "Veri kapsamı başlangıcı bilinmiyor.", "en-US": "Data coverage start is unknown." },
  room_unassigned: { "tr-TR": "Oda atanmamış", "en-US": "No area assigned" },
  floor_unassigned_label: { "tr-TR": "Kat atanmamış", "en-US": "No floor assigned" },
  integration_unavailable: { "tr-TR": "Entegrasyon yok", "en-US": "No integration" },
  manufacturer_integration_missing: { "tr-TR": "Üretici / entegrasyon bilgisi yok", "en-US": "Manufacturer / integration unavailable" },
  button_close: { "tr-TR": "Kapat", "en-US": "Close" },
  explicit_select_option_missing: { "tr-TR": "geçerli seçenek yok", "en-US": "no valid option" },
  auto_include_new_manual: { "tr-TR": "Yeni bulunan cihazları otomatik dahil et (elle seçilen kapsamda)", "en-US": "Automatically include new devices (manual scope)" },
  rule_delete: { "tr-TR": "Kuralı sil", "en-US": "Delete rule" },
  rule_entity: { "tr-TR": "Entity", "en-US": "Entity" },
  rule_expected_state: { "tr-TR": "Beklenen durum", "en-US": "Expected state" },
  rule_add: { "tr-TR": "+ Kural ekle", "en-US": "+ Add rule" },
  edit_cancel: { "tr-TR": "İptal", "en-US": "Cancel" },
  edit_save: { "tr-TR": "Değişiklikleri kaydet", "en-US": "Save changes" },
  edit_saving: { "tr-TR": "Kaydediliyor…", "en-US": "Saving…" },
  option_not_valid: { "tr-TR": " · geçerli seçenek yok", "en-US": " · no valid option" },
  state_unavailable: { "tr-TR": "Erişilemiyor", "en-US": "Unavailable" },
  state_unknown: { "tr-TR": "Durum bilinmiyor", "en-US": "Status unknown" },
  state_on: { "tr-TR": "Açık", "en-US": "On" },
  state_off: { "tr-TR": "Kapalı", "en-US": "Off" },
  additional_scope_note: { "tr-TR": "(hariç tutulanlar kapsam kuralının önceliğindedir)", "en-US": "(excluded devices take precedence over scope rules)" },
  disabled_suffix: { "tr-TR": " · devre dışı", "en-US": " · disabled" },
  release_unknown: { "tr-TR": "Yüklü sürüm bilinmiyor", "en-US": "Installed version unknown" },
  no_ha_update_source_detail: { "tr-TR": "Home Assistant bu cihaz için güncelleme kaynağı sunmuyor; yüklü veya en son firmware sürümü doğrulanamıyor.", "en-US": "Home Assistant does not expose an update source for this device; installed or latest firmware cannot be verified." },
  monitoring_unknown: { "tr-TR": "İzleme başlangıç zamanı yok", "en-US": "Monitoring start time unavailable" },
  monitoring_since_prefix: { "tr-TR": "İzleme başlangıcı ", "en-US": "Monitoring since " },
  running: { "tr-TR": "sürüyor", "en-US": "ongoing" },
  settings_save_error: { "tr-TR": "Ayarlar kaydedilemedi", "en-US": "Could not save settings" },
  group_by_floor: { "tr-TR": "Kata göre", "en-US": "Floor" },
  battery_unknown_suffix: { "tr-TR": " · durum bilinmiyor", "en-US": " · status unknown" },
  battery_value_unknown: { "tr-TR": "Pil bilinmiyor", "en-US": "Battery status unknown" },
  firmware_section_heading: { "tr-TR": "Firmware durumu", "en-US": "Firmware status" },
  labels_field: { "tr-TR": "Etiketler", "en-US": "Labels" },
  device_scope_unassigned: { "tr-TR": "Atanmamış", "en-US": "Unassigned" },
  home_assistant_unreachable: { "tr-TR": "Home Assistant bağlantısı kullanılamıyor.", "en-US": "Home Assistant connection is unavailable." },
  request_failed: { "tr-TR": "İstek tamamlanamadı.", "en-US": "The request could not be completed." },
  technical_details: { "tr-TR": "Teknik ayrıntı", "en-US": "Technical details" }
};
function Ce(t, e) {
  return Le[e][t];
}
function De(t) {
  return (t?.locale?.language || t?.language || "en-US").replaceAll("_", "-").toLowerCase().startsWith("tr") ? "tr-TR" : "en-US";
}
function Ze(t, e, a) {
  const n = new Date(t);
  if (Number.isNaN(n.getTime())) return t;
  const i = { dateStyle: "short", timeStyle: "short" };
  a && (i.timeZone = a);
  try {
    return new Intl.DateTimeFormat(e, i).format(n);
  } catch {
    return delete i.timeZone, new Intl.DateTimeFormat(e, i).format(n);
  }
}
function We(t, e) {
  const a = Math.round(t / 60);
  if (e === "tr-TR") {
    if (a < 60) return `${a} dk`;
    const r = Math.floor(a / 60), s = a % 60;
    return s ? `${r} sa ${s} dk` : `${r} sa`;
  }
  if (a < 60) return `${a} min`;
  const n = Math.floor(a / 60), i = a % 60;
  return i ? `${n} hr ${i} min` : `${n} hr`;
}
var Be = Object.defineProperty, qe = Object.getOwnPropertyDescriptor, f = (t, e, a, n) => {
  for (var i = n > 1 ? void 0 : n ? qe(e, a) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (i = (n ? s(e, a, i) : s(i)) || i);
  return n && i && Be(e, a, i), i;
};
const u = (t) => {
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
    television: "M3 5h18v13H3zM8 22l4-4 4 4",
    button: "M4 4h16v16H4zM12 9v6m-3-3h6",
    relay: "M3 7h18v10H3zM7 12h4m2 0h4",
    outlet: "M4 4h16v16H4zM9 9v3m6-3v3m-5 3h4",
    media: "M4 5h16v12H4zM8 21h8m-4-4v4",
    battery: "M2 8h18v9H2zM22 11v3M5 11v3",
    wifi: "M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0m-11 4a5 5 0 0 1 8 0m-4 4h.01",
    close: "M6 6l12 12M18 6 6 18",
    edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z",
    down: "m6 9 6 6 6-6",
    chevron: "m9 18 6-6-6-6",
    report: "M4 19V5m0 14h16M8 15l3-4 3 2 5-7",
    settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 12H2m20 0h-2M12 4V2m0 20v-2M6.3 6.3 4.9 4.9m14.2 14.2-1.4-1.4m0-11.4 1.4-1.4M4.9 19.1l1.4-1.4"
  };
  return o`<svg viewBox="0 0 24 24" data-icon=${t} aria-hidden="true"><path d=${e[t] ?? e.check}></path></svg>`;
}, Fe = /* @__PURE__ */ new Set(["mdi:television", "mdi:lightbulb", "mdi:lightbulb-on", "mdi:lightbulb-outline", "mdi:lightbulb-group", "mdi:remote", "mdi:remote-tv", "mdi:button-pointer", "mdi:gesture-tap-button", "mdi:power-socket", "mdi:power-socket-eu", "mdi:power-socket-us", "mdi:toggle-switch", "mdi:toggle-switch-variant", "mdi:motion-sensor", "mdi:battery", "mdi:thermostat", "mdi:thermometer", "mdi:fan", "mdi:lock", "mdi:lock-open", "mdi:camera", "mdi:blinds", "mdi:window-shutter", "mdi:door", "mdi:door-open", "mdi:media-player", "mdi:power"]);
let v = class extends A {
  constructor() {
    super(...arguments), this.loading = !0, this.error = "", this.query = "", this.editing = !1, this.saving = !1, this.settingsUnlocked = !1, this.reportWindow = "24h", this.openGroups = {};
  }
  get uiLanguage() {
    return De(this.hass);
  }
  t(t) {
    return Ce(this.uiLanguage, t);
  }
  healthLabel(t) {
    return this.t({ online: "online", offline: "unavailable", partial: "partial_issue", unknown: "unknown_status", expected_off: "expected_off_title" }[t]);
  }
  roleLabel(t) {
    return this.t({ motion: "motion_label", occupancy: "presence_label", battery: "battery_label", connectivity: "connectivity_label" }[t]);
  }
  signalText(t, e) {
    return !e || e.meaning === "missing" ? this.t("no_data") : e.meaning === "active" ? this.t(t === "motion" ? "motion_detected" : "presence_detected") : e.meaning === "inactive" ? this.t(t === "motion" ? "no_motion" : "no_presence") : e.meaning === "unavailable" ? this.t("unavailable") : e.meaning === "expected_off" ? this.t("expected_off_title") : this.t("unknown_status");
  }
  healthReasonText(t) {
    const e = { no_health_source: "no_health_sensor", no_connectivity_source: "no_connectivity_sensor", no_reachability_source: "no_live_connectivity_for_type", health_source_unavailable: "connectivity_source_no_data", health_source_unknown: "connectivity_not_verified", connectivity_off: "connectivity_reports_offline", configured_expected_off: "configured_off_expected", device_problem: "device_reports_problem", mixed_connectivity_sources: "connectivity_sensors_disagree", state_available: "ha_receives_current_state", primary_source_missing: "selected_connectivity_not_found", invalid_primary_source: "selected_source_not_connectivity", connectivity_unavailable: "connectivity_sensor_no_data", partial_failure: "partial_device_failure" };
    return this.t(e[t] ?? "status_details_available");
  }
  humanize(t) {
    return t ? t.replaceAll("_", " ").replace(/\b\w/g, (e) => e.toLocaleUpperCase()) : this.t("not_assigned");
  }
  connectedCallback() {
    super.connectedCallback(), this.connect();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.settingsUnlocked = !1, this.refreshTimer && window.clearTimeout(this.refreshTimer), this.reconnectTimer && window.clearTimeout(this.reconnectTimer);
    const t = this.api;
    this.api = void 0, t?.dispose();
  }
  updated(t) {
    t.has("hass") && this.hass?.connection && !this.api && this.connect();
  }
  async connect() {
    if (!(!this.hass?.connection || this.api)) {
      this.settingsUnlocked = !1, this.api = new Ve(this.hass.connection), await this.load();
      try {
        await this.api.subscribe((t) => this.queueRefresh(t));
      } catch (t) {
        this.error = `${this.t("live_update_error")}: ${this.message(t)}`, this.scheduleReconnect();
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
    const e = t instanceof Error ? t.message : String(t);
    return /backend unavailable|connection (?:lost|closed|unavailable)|not connected|networkerror|failed to fetch/i.test(e) ? this.t("home_assistant_unreachable") : this.uiLanguage === "en-US" ? e : `${this.t("request_failed")} ${this.t("technical_details")}: ${e}`;
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
          await this.api.subscribe((t) => this.queueRefresh(t)), this.settingsUnlocked = !1, this.error = "";
        } catch {
          this.scheduleReconnect();
        }
    }, 5e3);
  }
  get visibleDevices() {
    if (!this.data) return [];
    const t = this.data.preferences, e = new Set(t.excluded_device_ids), a = t.included_device_ids, n = this.query.trim().toLocaleLowerCase();
    return this.data.all_devices.filter((r) => !(t.scope === "area" && r.area_id !== t.scope_value || t.scope === "floor" && r.floor_id !== t.scope_value || t.scope === "label" && !r.labels.includes(t.scope_value ?? "") || t.scope === "integration" && !(r.integrations?.length ? r.integrations.includes(t.scope_value ?? "") : r.integration === t.scope_value) || t.scope === "manual" && a !== null && !a.includes(r.id))).filter((r) => !e.has(r.id) && (!n || [r.name, r.manufacturer, r.model, r.integration, ...r.integrations ?? [], ...r.labels, ...r.entities.map((s) => s.entity_id)].some((s) => s?.toLocaleLowerCase().includes(n)))).sort((r, s) => t.sort === "health" ? this.healthRank(r.health) - this.healthRank(s.health) || r.name.localeCompare(s.name) : t.sort === "area" && this.groupName(r).localeCompare(this.groupName(s)) || r.name.localeCompare(s.name));
  }
  healthRank(t) {
    return { offline: 0, partial: 1, unknown: 2, expected_off: 3, online: 4 }[t];
  }
  healthText(t) {
    return t.health !== "unknown" || this.deviceType(t) !== "remote" ? this.healthLabel(t.health) : t.health_reason === "no_reachability_source" ? this.t("reachability_unavailable") : this.t("connectivity_not_verified");
  }
  groupName(t) {
    const e = this.data?.preferences.group_by ?? "area";
    return e === "floor" ? this.data?.floors.find((a) => a.id === t.floor_id)?.name ?? this.t("floor_unassigned") : e === "integration" ? (t.integrations?.length ? t.integrations : [t.integration].filter((a) => !!a)).map((a) => this.humanize(a)).join(", ") || this.t("no_integration") : e === "none" ? this.t("group_all_devices") : this.data?.areas.find((a) => a.id === t.area_id)?.name ?? this.t("not_assigned");
  }
  areaName(t) {
    return this.data?.areas.find((e) => e.id === t.area_id)?.name ?? this.t("no_area_assigned");
  }
  deviceType(t) {
    if (t.device_type) return t.device_type;
    for (const e of ["light", "switch", "camera", "cover", "climate", "fan", "lock"]) if (t.entities.some((a) => a.domain === e)) return e;
    return t.entities.some((e) => e.domain === "remote") || t.entities.some((e) => e.domain === "event") ? "remote" : t.entities.some((e) => ["button", "input_button"].includes(e.domain) || e.device_class === "button") ? "button" : t.entities.some((e) => e.domain === "media_player" && ["tv", "television"].includes(e.device_class ?? "")) ? "tv" : t.entities.some((e) => e.device_class === "motion" || e.device_class === "occupancy") ? "sensor" : "other";
  }
  deviceIcon(t) {
    const e = this.deviceType(t), a = { remote: "remote", button: "button", light: "light", switch: "switch", fan: "fan", lock: "lock", climate: "climate", camera: "camera", cover: "cover", tv: "media_player" }, n = e === "remote" ? t.entities.find((l) => !l.disabled && (l.domain === "remote" || l.domain === "event")) : e === "button" ? t.entities.find((l) => !l.disabled && (l.domain === "button" || l.domain === "input_button" || l.device_class === "button")) : t.entities.find((l) => !l.disabled && l.domain === a[e]) ?? t.entities.find((l) => !l.disabled && l.domain === "media_player" && ["tv", "television"].includes(l.device_class ?? "")) ?? t.entities.find((l) => !l.disabled), i = n?.icon ?? n?.attributes.icon;
    if (typeof i == "string" && Fe.has(i)) return o`<ha-icon .icon=${i} aria-hidden="true" data-mdi=${i}></ha-icon>`;
    const r = n;
    let s = e === "light" ? "light" : e === "switch" ? "relay" : e === "remote" ? "remote" : e === "button" ? "button" : e === "tv" ? "television" : e === "sensor" ? "sensor" : e === "fan" ? "fan" : e === "lock" ? "lock" : e === "climate" ? "climate" : e === "camera" ? "camera" : e === "cover" ? "cover" : "settings";
    return e !== "remote" && (r?.domain === "button" || r?.domain === "input_button" || r?.device_class === "button") ? s = "button" : r?.domain === "media_player" ? s = ["tv", "television"].includes(r.device_class ?? "") || e === "tv" ? "television" : "media" : r?.domain === "switch" && ["outlet", "plug"].includes(r.device_class ?? "") && (s = "outlet"), u(s);
  }
  statusText(t) {
    const e = this.deviceType(t);
    if (e === "light" || e === "switch" || e === "cover" || e === "fan" || e === "lock" || e === "climate") {
      const n = t.entities.find((l) => l.domain === e && !l.disabled);
      if (!n) return o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("status_no_sensor")}</span>`;
      if (n.state === "unavailable") return o`<span class="signal-pill state-unavailable">${this.deviceIcon(t)}${this.t("status_unavailable_sensor")}</span>`;
      if (n.state === "unknown") return o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("unknown_status")}</span>`;
      if (e === "climate") {
        const l = n.state === "off" ? this.t("off") : n.state === "unknown" ? this.t("unknown_status") : this.humanize(n.state), c = n.attributes.current_temperature, p = typeof c == "number" && Number.isFinite(c) ? ` · ${c}°${typeof n.attributes.temperature_unit == "string" ? n.attributes.temperature_unit : ""}` : "";
        return o`<span class="signal-pill ${n.state === "off" ? "state-off" : "state-on"}">${this.deviceIcon(t)}${l}${n.state !== "off" ? p : ""}</span>`;
      }
      if (e === "cover") {
        const l = { open: this.t("on"), closed: this.t("off"), opening: this.t("opening"), closing: this.t("closing") }[n.state] ?? n.state;
        return o`<span class="signal-pill ${n.state === "closed" ? "state-off" : "state-on"}">${this.deviceIcon(t)}${l}</span>`;
      }
      if (e === "lock") {
        const l = n.state === "locked";
        return !l && n.state !== "unlocked" ? o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("unknown_status")}</span>` : o`<span class="signal-pill ${l ? "state-off" : "state-on"}">${this.deviceIcon(t)}${l ? this.t("locked") : this.t("unlocked")}</span>`;
      }
      if (!["on", "off"].includes(n.state)) return o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("unknown_status")}</span>`;
      const i = n.state === "on", r = Number(n.attributes.brightness), s = e === "light" && i && Number.isFinite(r) ? ` · %${Math.round(r / 255 * 100)}` : "";
      return o`<span class="signal-pill ${i ? "state-on" : "state-off"}">${this.deviceIcon(t)}${i ? this.t("on") : this.t("off")}${s}</span>`;
    }
    if (e === "remote") {
      const n = t.activity, i = n?.last_event_at ? this.formatDate(n.last_event_at) : null, r = n?.event_type ? ` · ${this.humanize(n.event_type)}` : "";
      return o`${t.signals.connectivity ? this.renderConnectivity(t.signals.connectivity) : o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("live_connectivity_unavailable")}</span>`}${i || n?.event_type ? o`<span class="signal-pill">${u("remote")}${i ? `${this.t("last_press")} ${i}` : this.t("no_event_time")}${r}</span>` : d}${t.signals.battery ? this.renderBattery(t.signals.battery) : d}`;
    }
    if (e === "tv") {
      const n = t.entities.find((r) => r.domain === "media_player" && !r.disabled);
      if (!n) return o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("tv_status_unavailable")}</span>`;
      if (n.state === "unavailable") return o`<span class="signal-pill state-unavailable">${this.deviceIcon(t)}${this.t("tv_unavailable")}</span>`;
      if (n.state === "unknown") return o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("tv_status_unknown")}</span>`;
      const i = { on: this.t("on"), off: this.t("off"), playing: this.t("playing"), paused: this.t("paused"), idle: this.t("idle"), standby: this.t("standby"), buffering: this.t("buffering") }[n.state] ?? this.humanize(n.state);
      return o`<span class="signal-pill ${n.state === "off" || n.state === "standby" ? "state-off" : "state-on"}">${this.deviceIcon(t)}${i}</span>`;
    }
    return e === "button" ? o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("button_no_live_status")}</span>` : t.signals.motion || t.signals.occupancy ? this.renderMotion(t) : t.signals.battery ? this.renderBattery(t.signals.battery) : t.signals.connectivity?.meaning === "unavailable" ? o`<span class="signal-pill state-unavailable">${u("wifi")}${this.t("unavailable")}</span>` : t.signals.connectivity ? this.renderConnectivity(t.signals.connectivity) : o`<span class="signal-pill unknown">${this.deviceIcon(t)}${this.t("no_device_status_for_type")}</span>`;
  }
  async patch(t) {
    if (!(!this.api || !this.data)) {
      this.saving = !0;
      try {
        const e = await this.api.setPreferences(t);
        this.data = { ...this.data, preferences: e }, this.error = "", this.editing || await this.load();
      } catch (e) {
        this.error = `${this.t("settings_save_error")}: ${this.message(e)}`;
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
    if (!this.api || !this.canChangeSettings(t) || !["number", "select"].includes(t.domain)) return;
    if (t.domain === "number") {
      const i = Number(e), r = t.attributes, s = Number(r.min ?? 0), l = Number(r.max ?? 100), c = Number(r.step ?? 1);
      if (!Number.isFinite(i) || i < s || i > l || Number.isFinite(c) && c > 0 && Math.abs((i - s) / c - Math.round((i - s) / c)) > 1e-7) {
        this.error = `${t.name}: ${this.t("title_error_value")}${s}–${l}${this.t("range_middle")}${c}${this.t("step_suffix")}`;
        return;
      }
      e = i;
    }
    if (t.domain === "select") {
      const i = Array.isArray(t.attributes.options) ? t.attributes.options : [];
      if (typeof e != "string" || !i.includes(e)) {
        this.error = `${t.name}: ${this.t("select_valid_option")}`;
        return;
      }
    }
    const a = t.domain === "number" ? "set_value" : t.domain === "select" ? "select_option" : "turn_on", n = t.domain === "number" ? { value: Number(e) } : t.domain === "select" ? { option: String(e) } : {};
    this.savingEntity = t.entity_id;
    try {
      await this.api.callEntity(t.entity_id, a, n, this.settingsUnlocked), await this.load();
    } catch (i) {
      this.error = `“${t.name}”${this.t("device_error_prefix")}${this.message(i)}`;
    } finally {
      this.savingEntity = void 0;
    }
  }
  async toggleSwitch(t) {
    if (!(!this.api || !this.canChangeSettings(t) || t.domain !== "switch" || !["on", "off"].includes(t.state))) {
      this.savingEntity = t.entity_id;
      try {
        await this.api.callEntity(t.entity_id, t.state === "on" ? "turn_off" : "turn_on", void 0, this.settingsUnlocked), await this.load();
      } catch (e) {
        this.error = `“${t.name}”${this.t("device_error_prefix")}${this.message(e)}`;
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
        this.error = `${this.t("report_error_prefix")}${this.message(e)}`;
      }
  }
  groupDevices(t) {
    const e = /* @__PURE__ */ new Map();
    for (const a of t) {
      const n = this.groupName(a);
      e.set(n, [...e.get(n) ?? [], a]);
    }
    return [...e.entries()];
  }
  selectDevice(t) {
    this.selectedId !== t.id && (this.settingsUnlocked = !1), this.selectedId = t.id;
  }
  canChangeSettings(t) {
    return !!(this.api && this.data?.is_admin && this.data.capabilities.settings && this.settingsUnlocked && !this.savingEntity && !t.disabled && t.entity_category === "config" && ["number", "select", "switch"].includes(t.domain) && !this.stateUnavailable(t));
  }
  setSettingsUnlocked(t) {
    t && (!this.data?.is_admin || !this.data.capabilities.settings || this.savingEntity) || (this.settingsUnlocked = t);
  }
  renderSettingsGate() {
    return !this.data?.is_admin || !this.data.capabilities.settings ? d : o`<label class="control-safety ${this.settingsUnlocked ? "unlocked" : ""}"><input type="checkbox" aria-label=${this.t("allow_device_setting_changes")} .checked=${this.settingsUnlocked} @change=${(t) => this.setSettingsUnlocked(t.target.checked)}><span><strong>${this.settingsUnlocked ? this.t("device_settings_unlocked") : this.t("device_settings_locked")}</strong><small>${this.settingsUnlocked ? this.t("settings_unlocked_hint") : this.t("settings_locked_hint")}</small></span></label>`;
  }
  render() {
    if (this.loading && !this.data) return o`<div class="loading">${this.t("loading_devices")}</div>`;
    if (!this.data) return o`<main class="shell"><h1>${this.t("devices_and_care")}</h1>${this.error ? o`<div class="error" role="alert">${this.error}</div>` : d}<button class="button" @click=${() => this.load()}>${this.t("retry")}</button></main>`;
    const t = this.visibleDevices, e = t.find((c) => c.id === this.selectedId), a = this.data.preferences.layout, n = t.filter((c) => c.health === "offline" || c.health === "partial").length, i = t.filter((c) => c.health === "online").length, r = t.filter((c) => c.health === "expected_off").length, s = t.filter((c) => c.health === "unknown").length, l = t.filter((c) => {
      const p = c.signals.battery, m = p ? this.batteryNumber(p) : null;
      return p?.meaning === "low" || p?.unit?.trim() === "%" && m !== null && m < 20;
    }).length;
    return o`<main class="shell">
      <header class="top"><div><h1 class="brand-title"><img src=${Oe} alt="" aria-hidden="true">${this.t("devices_and_care")}</h1><p class="subtitle">${t.length}${this.t("monitoring_devices")}${this.data.monitoring_since ? `${this.t("monitoring_since_label")}${this.formatDate(this.data.monitoring_since)}` : this.t("monitoring_start_unavailable")}</p></div><div class="top-actions">
        ${this.data.is_admin ? o`<button class="button" @click=${() => {
      this.editing = !this.editing, this.editing || this.load();
    }}>${u(this.editing ? "close" : "edit")}<span class="button-label">${this.editing ? this.t("close_editor") : this.t("edit")}</span></button>` : d}
        <button class="button" @click=${() => this.report ? this.report = void 0 : void this.showReport()}>${u("report")}<span class="button-label">${this.report ? this.t("close_report") : this.t("reports")}</span></button>
      </div></header>
      ${this.error ? o`<div class="error" role="alert">${this.error}</div>` : d}
      <section class="summary" aria-label="${this.t("device_health_summary")}"><span class="summary-title">${this.t("overall_status")}</span><span class="metric good">${u("check")} <strong>${i}</strong> ${this.t("reachable")}</span><span class="metric ${n ? "warn" : ""}">${u("alert")} <strong>${n}</strong> ${this.t("issues")}</span><span class="metric"><strong>${s}</strong> ${this.t("unknown")}</span><span class="metric"><strong>${r}</strong> ${this.t("expected_off")}</span><span class="metric ${l ? "warn" : ""}">${u("battery")} <strong>${l}</strong> ${this.t("low_battery")}</span></section>
      ${this.renderSettingsGate()}
      ${this.report ? this.renderReport() : d}
      ${this.editing ? this.renderEditor(this.data.all_devices) : d}
      <div class="toolbar"><label class="search">${u("search")}<input aria-label="${this.t("search_devices")}" placeholder="${this.t("search_device_manufacturer_or_entity")}" .value=${this.query} @input=${(c) => this.query = c.target.value}></label>
        <select class="select" aria-label="${this.t("sort_by")}" .value=${this.data.preferences.sort} @change=${(c) => void this.patch({ sort: c.target.value })}><option value="name">${this.t("name")}</option><option value="health">${this.t("health")}</option><option value="area">${this.t("area")}</option></select>
        <div class="tabs" role="tablist" aria-label="${this.t("view")}"><button class=${a === "inventory" ? "active" : ""} role="tab" aria-selected=${a === "inventory"} @click=${() => void this.patch({ layout: "inventory" })}>${u("grid")} ${this.t("list")}</button><button class=${a === "rooms" ? "active" : ""} role="tab" aria-selected=${a === "rooms"} @click=${() => void this.patch({ layout: "rooms" })}>${u("room")} ${this.t("rooms")}</button></div>
      </div>
      ${t.length ? a === "inventory" ? this.renderInventory(t) : this.renderRooms(t) : o`<div class="empty">${this.t("no_devices_match_this_search_and_scope")}</div>`}
      ${e ? this.renderDrawer(e) : d}
    </main>`;
  }
  renderInventory(t) {
    const e = new Set(this.data.preferences.visible_columns);
    return o`<section class="inventory"><div class="table-scroll"><table><thead><tr><th>${this.t("device")}</th><th>${this.t("health_2")}</th>${e.has("area") ? o`<th>${this.t("area_2")}</th>` : d}${e.has("motion") ? o`<th>${this.t("status")}</th>` : d}${e.has("battery") ? o`<th>${this.t("battery")}</th>` : d}${e.has("connectivity") ? o`<th>${this.t("connectivity")}</th>` : d}${e.has("firmware") ? o`<th>${this.t("firmware")}</th>` : d}<th></th></tr></thead><tbody>
      ${t.map((a) => o`<tr class=${this.selectedId === a.id ? "selected" : ""} @click=${() => this.selectDevice(a)} tabindex="0" @keydown=${(n) => {
      (n.key === "Enter" || n.key === " ") && this.selectDevice(a);
    }}>
        <td><div class="device-name"><span class="device-glyph type-${this.deviceType(a)}">${this.deviceIcon(a)}</span><span><span class="name">${a.name}</span>${a.model ? o`<span class="sub">${a.model}</span>` : d}<span class="sub">${this.devicePlatformLine(a)}</span></span></div></td>
        <td data-mobile><span class="health-pill ${a.health}" title=${a.health_reason ? this.healthReasonText(a.health_reason) : this.healthLabel(a.health)}>${u(a.health === "online" ? "check" : "alert")}${this.healthText(a)}</span></td>
        ${e.has("area") ? o`<td>${this.areaName(a)}</td>` : d}
        ${e.has("motion") ? o`<td data-mobile>${this.statusText(a)}</td>` : d}
        ${e.has("battery") ? o`<td data-mobile>${this.renderDeviceBattery(a)}</td>` : d}
        ${e.has("connectivity") ? o`<td data-mobile>${this.renderConnectivity(a.signals.connectivity)}</td>` : d}
        ${e.has("firmware") ? o`<td data-mobile>${this.renderFirmwareSummary(a)}</td>` : d}
        <td>${u("chevron")}</td></tr>`)}
      </tbody></table></div><footer class="table-footer"><span>${t.length} ${this.t("device_count")}</span><span>${this.t("select_a_device_to_view_details_and_supp")}</span></footer></section>`;
  }
  renderRooms(t) {
    return o`<section class="room-grid">${this.groupDevices(t).map(([e, a]) => o`<article class="room"><button class="room-head" aria-expanded=${this.openGroups[e] !== !1} @click=${() => this.openGroups = { ...this.openGroups, [e]: this.openGroups[e] === !1 }}>${u("room")}<span class="room-title">${e}</span><small>${a.length} ${this.t("device_count")}</small>${u("down")}</button>${this.openGroups[e] === !1 ? d : o`<div class="room-body">${a.map((n) => this.renderDeviceCard(n))}</div>`}</article>`)}</section>`;
  }
  renderDeviceCard(t) {
    return o`<article class="device-card" role="button" tabindex="0" @click=${() => this.selectDevice(t)} @keydown=${(e) => {
      e.key === "Enter" && this.selectDevice(t);
    }}><div class="card-head"><span class="device-glyph type-${this.deviceType(t)}">${this.deviceIcon(t)}</span><span class="name">${t.name}</span><span class="health-pill ${t.health}" title=${t.health_reason ? this.healthReasonText(t.health_reason) : this.healthLabel(t.health)}>${this.healthText(t)}</span></div><p class="card-meta">${t.model ? o`<span>${t.model}</span>` : d}<span class="card-meta-secondary">${this.devicePlatformLine(t)}</span></p><div class="signals">${this.statusText(t)}</div></article>`;
  }
  renderMotion(t) {
    const e = t.signals.motion, a = t.signals.occupancy, n = [e && ["motion", e], a && ["occupancy", a]].filter(Boolean), i = n.filter(([r, s], l) => n.findIndex(([, c]) => c.entity_id === s.entity_id) === l);
    return i.length ? o`${i.map(([r, s]) => {
      const l = s.meaning === "active" ? "active" : s.meaning === "unavailable" ? "warning" : s.meaning === "expected_off" ? "expected" : s.meaning === "unknown" || s.meaning === "missing" ? "unknown" : "";
      return o`<span class="signal-pill ${l}" aria-label=${`${this.roleLabel(r)}: ${this.signalText(r, s)}`}>${u("motion")}${this.signalText(r, s)}</span>`;
    })}` : o`<span class="signal-pill unknown">${u("motion")}${this.t("no_data")}</span>`;
  }
  batteryNumber(t) {
    const e = (n) => typeof n == "number" && Number.isFinite(n) ? n : typeof n == "string" && n.trim() !== "" && Number.isFinite(Number(n)) ? Number(n) : null, a = e(t.state);
    return t.meaning === "unknown" && a === null ? null : e(t.value);
  }
  renderBattery(t) {
    if (!t || t.meaning === "missing") return o`<span class="signal-pill unknown">${u("battery")}${this.t("battery_data_unavailable")}</span>`;
    if (t.meaning === "unavailable" || t.state === "unavailable") return o`<span class="signal-pill warning">${u("battery")}${this.t("battery_unavailable")}</span>`;
    if (t.state === "unknown") return o`<span class="signal-pill unknown">${u("battery")}${this.t("battery_unknown")}</span>`;
    if (t.meaning === "low") return o`<span class="signal-pill low">${u("battery")}${this.t("battery_low")}</span>`;
    if (t.meaning === "ok") return o`<span class="signal-pill">${u("battery")}${this.t("battery_normal")}</span>`;
    if (t.meaning === "expected_off") return o`<span class="signal-pill expected">${u("battery")}${this.t("expected_off_title")}</span>`;
    const e = t.value, a = this.batteryNumber(t), n = a !== null && t.unit?.trim() === "%" && a < 20, i = a !== null ? `${a}${t.unit ? ` ${t.unit}` : ""}` : e === null ? t.state : `${e}${t.unit ? ` ${t.unit}` : ""}`;
    if (t.meaning === "unknown" && a === null) return o`<span class="signal-pill unknown">${u("battery")}${this.t("battery_value_unknown")}</span>`;
    const r = t.meaning === "unknown" && a === null ? "unknown" : "", s = t.meaning === "unknown" && a === null ? this.t("battery_unknown_suffix") : "";
    return o`<span class="signal-pill ${r} ${n ? "low" : ""}">${this.t("battery_label")} ${i}${s}</span>`;
  }
  renderDeviceBattery(t) {
    if (t.signals.battery) return this.renderBattery(t.signals.battery);
    const e = t.capabilities?.includes("battery") ?? t.entities.some((a) => a.device_class === "battery" || `${a.entity_id} ${a.name}`.toLocaleLowerCase().includes("battery"));
    return o`<span class="signal-pill unknown">${u("battery")}${e ? this.t("battery_data_unavailable") : this.t("no_battery_measurement")}</span>`;
  }
  renderConnectivity(t) {
    if (!t || t.meaning === "missing") return o``;
    const e = t.meaning === "unavailable" ? this.t("connectivity_unavailable") : t.meaning === "unknown" ? this.t("connectivity_unknown") : t.meaning === "active" ? this.t("connected") : t.meaning === "inactive" ? this.t("not_connected") : String(t.value ?? t.state);
    return o`<span class="signal-pill ${t.meaning === "unavailable" ? "warning" : t.meaning === "unknown" ? "unknown" : ""}">${u("wifi")}${e}</span>`;
  }
  firmwareState(t) {
    return t.state === "unavailable" ? { label: this.t("update_unavailable"), className: "warning" } : t.state === "unknown" ? { label: this.t("update_unknown"), className: "unknown" } : t.update_available === !0 || t.state === "on" ? { label: this.t("updates_available"), className: "warning" } : t.state === "off" && t.skipped_version ? { label: `${this.t("update_skipped")} · ${t.skipped_version}`, className: "unknown" } : t.state === "off" ? { label: this.t("up_to_date"), className: "active" } : { label: this.t("update_unknown"), className: "unknown" };
  }
  renderFirmwareSummary(t) {
    const e = t.firmware_updates ?? [];
    if (!e.length) return o`<span class="signal-pill unknown">${t.reported_sw_version ? `${this.t("version")} ${t.reported_sw_version} · ${this.t("firmware_freshness_unknown")}` : this.t("no_firmware_update_source")}</span>`;
    const a = e.map((s) => this.firmwareState(s)), n = a.find((s) => s.label === this.t("updates_available")) ?? a[0], i = e.find((s) => s.latest_version)?.latest_version, r = e.length > 1 ? ` · +${e.length - 1}` : "";
    return o`<span class="signal-pill ${n.className}">${n.label}${i && n.label === this.t("updates_available") ? ` · ${i}` : ""}${r}</span>`;
  }
  safeReleaseUrl(t) {
    if (!t) return null;
    try {
      const e = new URL(t);
      return e.protocol === "https:" || e.protocol === "http:" ? e.href : null;
    } catch {
      return null;
    }
  }
  renderFirmwareDetails(t) {
    const e = t.firmware_updates ?? [];
    return e.length ? o`<section class="section"><h3>${this.t("firmware_section_heading")}</h3>${e.map((a) => {
      const n = this.firmwareState(a), i = this.safeReleaseUrl(a.release_url);
      return o`<article class="firmware-item"><strong>${a.title || this.t("firmware_update_title")}</strong><small>${a.entity_id}</small><span class="signal-pill ${n.className}">${n.label}</span><div class="versions">${a.installed_version ? `${this.t("installed_version_prefix")}${a.installed_version}` : this.t("installed_version_unknown")}${a.latest_version ? `${this.t("latest_version_prefix")}${a.latest_version}` : ""}${a.skipped_version ? `${this.t("skipped_version_prefix")}${a.skipped_version}` : ""}</div>${a.release_summary ? o`<p>${a.release_summary}</p>` : d}${i ? o`<a href=${i} target="_blank" rel="noopener noreferrer">${this.t("open_version_notes")}</a>` : d}</article>`;
    })}</section>` : o`<section class="section"><h3>${this.t("firmware_state_title")}</h3>${t.reported_sw_version ? o`<div class="detail-row"><span>${this.t("ha_reported_software")}</span><span>${t.reported_sw_version}</span></div>` : d}<p>${this.t("no_ha_update_source_detail")}</p></section>`;
  }
  renderDrawer(t) {
    return o`<div class="drawer-backdrop" @click=${() => this.selectedId = void 0}></div><aside class="drawer" aria-label=${`${t.name} ${this.t("details")}`}><div class="drawer-head"><span class="device-glyph type-${this.deviceType(t)}">${this.deviceIcon(t)}</span><div><h2>${t.name}</h2>${t.model ? o`<div class="sub">${t.model}</div>` : d}<div class="sub">${this.devicePlatformLine(t)}</div></div><button class="button ghost close" aria-label="${this.t("close")}" @click=${() => this.selectedId = void 0}>${u("close")}</button></div>
      ${this.renderSettingsGate()}
      <section class="section"><h3>${this.t("health_2")}</h3><div class="detail-row"><span>${this.t("status")}</span><strong>${this.healthText(t)}</strong></div>${t.health_reason ? o`<div class="detail-row"><span>${this.t("description")}</span><span>${this.healthReasonText(t.health_reason)}</span></div>` : d}<div class="detail-row"><span>${this.t("area_2")}</span><span>${this.areaName(t)}</span></div><div class="detail-row"><span>${this.t("labels")}</span><span>${t.labels.length ? t.labels.join(", ") : "—"}</span></div>
      ${t.device_type === "remote" ? o`<div class="detail-row"><span>${this.t("remote_live_status_label")}</span><span>${t.signals.connectivity ? this.t("connectivity_label") : this.t("live_connectivity_unavailable")}</span></div>${t.activity?.event_type || t.activity?.last_event_at ? o`<div class="detail-row"><span>${this.t("last_press_activity")}</span><span>${t.activity.last_event_at ? this.formatDate(t.activity.last_event_at) : this.t("timestamp_unavailable")}${t.activity.event_type ? ` · ${this.humanize(t.activity.event_type)}` : ""}</span></div>` : d}` : d}
      ${t.signals.motion ? o`<div class="detail-row"><span>${this.t("motion")}</span>${this.renderMotion(t)}</div>` : d}${t.signals.occupancy && t.signals.occupancy.entity_id !== t.signals.motion?.entity_id ? o`<div class="detail-row"><span>${this.t("presence")}</span>${this.renderMotion({ ...t, signals: { ...t.signals, motion: null } })}</div>` : d}${t.signals.battery ? o`<div class="detail-row"><span>${this.t("battery")}</span>${this.renderBattery(t.signals.battery)}</div>` : d}</section>
      ${this.data?.is_admin && this.data.capabilities.settings ? this.renderDeviceSettings(t) : d}
      ${this.renderFirmwareDetails(t)}
      <section class="section"><h3>${this.t("entities")} (${t.entities.length})</h3>${t.entities.map((e) => o`<div class="entity-row"><div class="entity-title"><strong>${e.name}</strong><small>${e.entity_id}${e.disabled ? this.t("entity_disabled_suffix") : ""}</small></div><span class="sub">${e.state}</span></div>`)}</section></aside>`;
  }
  renderEditor(t) {
    const e = this.data.preferences;
    return o`<section class="settings-panel"><h2>${this.t("view_and_scope")}</h2><div class="settings-grid"><label class="field">${this.t("device_scope")}<select .value=${e.scope} @change=${(a) => this.changeScope(a.target.value)}><option value="all">${this.t("all_devices")}</option><option value="area">${this.t("area_2")}</option><option value="floor">${this.t("floor")}</option><option value="label">${this.t("label")}</option><option value="integration">${this.t("integration")}</option><option value="manual">${this.t("select_manually")}</option></select></label>${this.renderScopeValue(e)}<label class="field">${this.t("group_by")}<select .value=${e.group_by} @change=${(a) => this.editPreference("group_by", a.target.value)}><option value="area">${this.t("area")}</option><option value="floor">${this.t("group_by_floor")}</option><option value="integration">${this.t("integration_2")}</option><option value="none">${this.t("no_grouping")}</option></select></label><label class="field">${this.t("sort_by")}<select .value=${e.sort} @change=${(a) => this.editPreference("sort", a.target.value)}><option value="name">${this.t("name")}</option><option value="health">${this.t("health_3")}</option><option value="area">${this.t("area")}</option></select></label><label class="field">${this.t("default_layout")}<select .value=${e.layout} @change=${(a) => this.editPreference("layout", a.target.value)}><option value="inventory">${this.t("compact_inventory")}</option><option value="rooms">${this.t("room_cards")}</option></select></label></div>
      <label class="checkline"><input type="checkbox" .checked=${e.auto_include_new} ?disabled=${e.scope !== "manual"} @change=${(a) => this.editPreference("auto_include_new", a.target.checked)}> ${this.t("automatically_include_new_devices_manual")}</label>
      <div class="settings-grid"><label class="field">${this.t("history_retention_days")}<input type="number" min="1" max="365" step="1" .value=${String(e.retention_days)} @change=${(a) => this.editPreference("retention_days", Math.max(1, Math.min(365, Number(a.target.value))))}></label><label class="checkline"><input type="checkbox" .checked=${e.weekly_report_enabled} @change=${(a) => this.editPreference("weekly_report_enabled", a.target.checked)}> ${this.t("weekly_report_notification_monday_9_00_a")}</label></div>
      <div class="subhead">${this.t("visible_table_columns")}</div><div class="settings-grid">${[["area", "area_2"], ["motion", "status"], ["battery", "battery"], ["connectivity", "connectivity"], ["firmware", "firmware"]].map(([a, n]) => o`<label class="checkline"><input type="checkbox" .checked=${e.visible_columns.includes(a)} @change=${(i) => {
      const r = i.target.checked;
      this.editPreference("visible_columns", r ? [...e.visible_columns, a] : e.visible_columns.filter((s) => s !== a));
    }}>${this.t(n)}</label>`)}</div>
      <div class="subhead">${this.t("device_exclusions_and_manual_selection")} <span class="sub">${this.t("additional_scope_note")}</span></div><div class="settings-devices">${t.map((a) => {
      const n = e.excluded_device_ids.includes(a.id), i = e.included_device_ids === null ? !n : e.included_device_ids.includes(a.id);
      return o`<label class="settings-device"><input type="checkbox" .checked=${e.scope === "manual" ? i : !n} @change=${(r) => {
        const s = r.target.checked;
        if (e.scope === "manual") {
          const l = new Set(e.included_device_ids ?? this.data.all_devices.map((p) => p.id)), c = new Set(e.excluded_device_ids);
          s ? (l.add(a.id), c.delete(a.id)) : l.delete(a.id), this.editPreference("included_device_ids", [...l]), this.editPreference("excluded_device_ids", [...c]);
        } else {
          const l = new Set(e.excluded_device_ids);
          s ? l.delete(a.id) : l.add(a.id), this.editPreference("excluded_device_ids", [...l]);
        }
      }}><span>${a.name}</span><small>${this.groupName(a)}</small></label>`;
    })}</div>
      <div class="subhead">${this.t("signal_sources")}</div><div class="sources">${t.flatMap((a) => ["motion", "occupancy", "battery", "connectivity"].map((n) => {
      const i = e.source_overrides[a.id]?.[n] ?? "", r = a.entities.filter((s) => !s.disabled && (n === "motion" ? s.domain === "binary_sensor" && s.device_class === "motion" : n === "occupancy" ? s.domain === "binary_sensor" && ["occupancy", "presence"].includes(s.device_class ?? "") : n === "battery" ? s.device_class === "battery" || s.domain === "sensor" && ["%", "v", "mv"].includes((s.unit ?? "").toLocaleLowerCase()) && `${s.entity_id} ${s.name}`.toLocaleLowerCase().includes("battery") : s.domain === "binary_sensor" && s.device_class === "connectivity"));
      return r.length ? o`<label class="field">${a.name} · ${this.roleLabel(n)}<select .value=${i} @change=${(s) => {
        const l = { ...e.source_overrides, [a.id]: { motion: null, occupancy: null, battery: null, connectivity: null, ...e.source_overrides[a.id], [n]: s.target.value || null } };
        this.editPreference("source_overrides", l);
      }}><option value="">${this.t("automatic_source")}</option>${r.map((s) => o`<option value=${s.entity_id}>${s.name} (${s.entity_id})</option>`)}</select></label>` : d;
    }))}</div>
      <div class="subhead">${this.t("expected_off_rules")}</div>${e.expected_off_rules.map((a, n) => o`<div class="rule-row"><input class="plain-input" aria-label="${this.t("entity")}" .value=${a.entity_id} @change=${(i) => this.updateRule(n, "entity_id", i.target.value)}><input class="plain-input" aria-label="${this.t("expected_state")}" .value=${a.state} @change=${(i) => this.updateRule(n, "state", i.target.value)}><button class="button" aria-label="${this.t("delete_rule")}" @click=${() => this.editPreference("expected_off_rules", e.expected_off_rules.filter((i, r) => r !== n))}>${u("close")}</button></div>`)}
      <button class="button" @click=${() => this.editPreference("expected_off_rules", [...e.expected_off_rules, { id: crypto.randomUUID(), entity_id: "", state: "off" }])}>${this.t("add_rule")}</button>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="button" @click=${() => {
      this.editing = !1, this.load();
    }}>${this.t("cancel")}</button><button class="button primary" ?disabled=${this.saving} @click=${() => this.saveEditor()}>${this.saving ? this.t("saving") : this.t("save_changes")}</button></div></section>`;
  }
  changeScope(t) {
    this.settingsUnlocked = !1;
    const e = this.data.preferences;
    let a = e.included_device_ids;
    t === "manual" && e.scope !== "manual" && (a = this.visibleDevices.map((n) => n.id)), this.editPreference("scope", t), this.editPreference("scope_value", null), this.editPreference("included_device_ids", t === "manual" ? a ?? [] : null);
  }
  renderScopeValue(t) {
    const e = t.scope === "area" ? this.data.areas : t.scope === "floor" ? this.data.floors : t.scope === "label" ? this.data.labels : t.scope === "integration" ? [...new Set(this.data.all_devices.flatMap((a) => a.integrations?.length ? a.integrations : a.integration ? [a.integration] : []))].map((a) => ({ id: a, name: this.humanize(a) })) : [];
    return ["area", "floor", "label", "integration"].includes(t.scope) ? o`<label class="field">${this.t({ area: "area_2", floor: "floor", label: "label", integration: "integration" }[t.scope])}<select .value=${t.scope_value ?? ""} @change=${(a) => this.editPreference("scope_value", a.target.value || null)}><option value="">${this.t("select")}</option>${e.map((a) => o`<option value=${a.id}>${a.name}</option>`)}</select></label>` : d;
  }
  updateRule(t, e, a) {
    const n = [...this.data.preferences.expected_off_rules];
    n[t] = { ...n[t], [e]: a }, this.editPreference("expected_off_rules", n);
  }
  renderDeviceSettings(t) {
    if (!t) return d;
    const e = t.entities.filter((a) => !a.disabled && ["number", "select", "switch"].includes(a.domain) && a.entity_category === "config");
    return e.length ? o`<section class="settings-panel ${this.settingsUnlocked ? "" : "read-only"}"><h2>${this.t("supported_settings")}</h2>${this.error ? o`<div class="error" role="alert">${this.error}</div>` : d}<p class="sub">${this.t("expected_off_hint")}</p>${e.map((a) => o`<div class="entity-row"><div class="entity-title"><strong>${a.name}</strong><small>${a.entity_id}${a.entity_category ? ` · ${a.entity_category}` : ""}</small></div>${a.domain === "switch" ? o`<button class="button" ?disabled=${!this.canChangeSettings(a)} @click=${() => this.toggleSwitch(a)}>${this.stateUnavailable(a) ? a.state === "unavailable" ? this.t("state_unavailable") : this.t("state_unknown") : a.state === "on" ? this.t("state_on") : a.state === "off" ? this.t("state_off") : a.state}</button>` : a.domain === "select" ? this.renderSelect(a) : this.renderNumber(a)}</div>`)}</section>` : d;
  }
  stateUnavailable(t) {
    return ["unknown", "unavailable"].includes(t.state);
  }
  renderSelect(t) {
    const e = Array.isArray(t.attributes.options) ? t.attributes.options : [];
    return o`<select class="select" aria-label=${t.name} ?disabled=${!this.canChangeSettings(t)} .value=${this.stateUnavailable(t) ? "" : t.state} @change=${(a) => void this.changeSetting(t, a.target.value)}>${this.stateUnavailable(t) ? o`<option value="">${t.state === "unavailable" ? this.t("state_unavailable") : this.t("state_unknown")}</option>` : e.includes(t.state) ? d : o`<option value=${t.state}>${t.state}${this.t("option_not_valid")}</option>`}${e.map((a) => o`<option value=${a}>${a}</option>`)}</select>`;
  }
  renderNumber(t) {
    const e = t.attributes, a = Number(e.min ?? 0), n = Number(e.max ?? 100), i = Number(e.step ?? 1);
    return o`<input class="plain-input" type="number" aria-label=${t.name} .value=${this.stateUnavailable(t) ? "" : t.state} placeholder=${this.stateUnavailable(t) ? t.state === "unavailable" ? this.t("state_unavailable") : this.t("state_unknown") : ""} min=${a} max=${n} step=${i} ?disabled=${!this.canChangeSettings(t)} @change=${(r) => void this.changeSetting(t, Number(r.target.value))}>`;
  }
  renderReport() {
    const t = this.report, e = t.stats;
    return o`<section class="report-panel"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><h2 style="margin:0">${this.t("maintenance_report")}</h2><select class="select" .value=${this.reportWindow} @change=${(a) => {
      this.reportWindow = a.target.value, this.showReport();
    }}><option value="24h">${this.t("last_24_hours")}</option><option value="7d">${this.t("last_7_days")}</option></select><button class="button primary" style="margin-left:auto" @click=${() => this.showReport(!0)}>${this.t("generate_report")}</button></div>
      <div class="report-stats"><div class="stat"><strong>${this.formatDuration(e.device_outage_seconds)}</strong><span>${this.t("device_outage_total")}</span></div><div class="stat"><strong>${e.outage_starts}</strong><span>${this.t("outage_starts")}</span></div><div class="stat"><strong>${e.outage_intervals}</strong><span>${this.t("outage_intervals")}</span></div><div class="stat"><strong>${e.low_battery}</strong><span>${this.t("low_battery_3")}</span></div><div class="stat"><strong>${e.missing_data}</strong><span>${this.t("missing_data")}</span></div></div>
      ${t.ongoing.length ? o`<div class="subhead">${this.t("ongoing_outages")}</div>${t.ongoing.map((a) => o`<div class="report-event"><strong>${this.deviceName(a.device_id)}</strong><span>${this.t("started")} ${this.formatDate(a.start)}</span><span>${this.formatDuration(a.seconds)} · ${this.t("ongoing")}</span></div>`)}` : d}
      <div class="report-events">${t.events.filter((a) => !a.ongoing).slice(0, 8).map((a) => o`<div class="report-event"><strong>${this.deviceName(a.device_id)}</strong><span>${this.formatDate(a.start)}</span><span>${this.formatDuration(a.seconds)}</span></div>`)}</div>
      <p class="coverage">${t.coverage_since ? `${this.t("coverage_since_prefix")}${this.formatDate(t.coverage_since)}${this.t("coverage_since_suffix")}` : this.t("coverage_start_unknown")}${this.t("per_device_outage_note")}</p></section>`;
  }
  deviceName(t) {
    return this.data?.devices.find((e) => e.id === t)?.name ?? t;
  }
  devicePlatformLine(t) {
    const e = t.integrations?.length ? t.integrations : [t.integration].filter((a) => !!a);
    return [t.manufacturer, e.map((a) => this.humanize(a)).join(", ")].filter(Boolean).join(" · ") || this.t("manufacturer_integration_unavailable");
  }
  formatDate(t) {
    return Ze(t, this.uiLanguage, this.hass?.config?.time_zone);
  }
  formatDuration(t) {
    return We(t, this.uiLanguage);
  }
};
v.styles = ue`
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
    .control-safety { display:flex; align-items:center; gap:10px; border:1px solid var(--care-border); border-left:3px solid #a95000; border-radius:10px; padding:9px 12px; margin:-3px 0 13px; background:var(--card-background-color,#fff) }.control-safety.unlocked { border-left-color:var(--care-accent); background:color-mix(in srgb,var(--care-accent) 5%,var(--card-background-color,#fff)) }.control-safety input { width:18px; height:18px; accent-color:var(--care-accent); flex:none }.control-safety span { display:grid; gap:2px }.control-safety strong { font-size:12px }.control-safety small { color:var(--care-muted); font-size:11px }
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
    .settings-panel.read-only { opacity:.92 }.firmware-item { padding:10px 0; border-top:1px solid var(--care-border); display:grid; gap:5px; font-size:12px }.firmware-item:first-of-type { border-top:0 }.firmware-item .versions { color:var(--care-muted); overflow-wrap:anywhere }.firmware-item a { color:var(--care-accent-ink); text-decoration:underline }.device-glyph ha-icon { --mdc-icon-size:19px; width:19px; height:19px }
    @media (max-width:1100px) { .room-grid { grid-template-columns:repeat(2,minmax(0,1fr)); align-items:start } }
    @media (max-width:720px) { .shell { padding:14px 12px 26px }.top { align-items:center }.top-actions .button-label { display:none }.top-actions .button { padding:8px }.summary { gap:6px; padding:9px }.summary-title { width:100%; margin:0 0 2px }.metric { font-size:11px; padding:4px 6px }.toolbar { gap:6px }.search { min-width:100%; max-width:none }.tabs { margin-left:0; order:2 }.toolbar > .select { flex:1; min-width:110px }.room-grid { grid-template-columns:minmax(0,1fr) }.table-scroll { max-height:none; overflow:visible }.inventory { border:0; background:transparent; overflow:visible } table,tbody { display:block; min-width:0 } thead { display:none } tbody { display:grid; gap:8px } tbody tr { display:flex; flex-direction:column; border:1px solid var(--care-border); border-radius:10px; padding:10px; background:var(--card-background-color,#fff) } td { display:none; border:0; padding:4px 0 } td:first-child, td[data-mobile] { display:block } td:first-child { padding:0 0 6px }.table-footer { margin-top:8px; border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff) }.settings-grid { grid-template-columns:1fr 1fr }.report-stats { grid-template-columns:repeat(2,minmax(0,1fr)) }.report-stats .stat:first-child { grid-column:span 2 }.sources { grid-template-columns:1fr }.rule-row { grid-template-columns:1fr 1fr auto } }
    @media (max-width:520px) { .drawer { padding:15px }.drawer .entity-row { align-items:flex-start; flex-wrap:wrap }.drawer .entity-row > button,.drawer .entity-row > select,.drawer .entity-row > input { margin-left:auto; max-width:100%; min-width:150px } }
    @media (prefers-reduced-motion: no-preference) { .button, .device-card, tbody tr { transition:background-color .15s ease,border-color .15s ease } }
  `;
f([
  ce({ attribute: !1 })
], v.prototype, "hass", 2);
f([
  g()
], v.prototype, "data", 2);
f([
  g()
], v.prototype, "loading", 2);
f([
  g()
], v.prototype, "error", 2);
f([
  g()
], v.prototype, "query", 2);
f([
  g()
], v.prototype, "selectedId", 2);
f([
  g()
], v.prototype, "editing", 2);
f([
  g()
], v.prototype, "saving", 2);
f([
  g()
], v.prototype, "settingsUnlocked", 2);
f([
  g()
], v.prototype, "report", 2);
f([
  g()
], v.prototype, "reportWindow", 2);
f([
  g()
], v.prototype, "openGroups", 2);
f([
  g()
], v.prototype, "savingEntity", 2);
v = f([
  Me("device-care-panel")
], v);
export {
  v as DeviceCarePanel
};
