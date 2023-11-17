/*!
 * CSSRulePlugin 3.12.2
 * https://greensock.com
 * 
 * @license Copyright 2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

let e,t,s,l,r=()=>"undefined"!=typeof window,n=()=>e||r()&&(e=window.gsap)&&e.registerPlugin&&e,i=()=>(t||(o(),l||console.warn("Please gsap.registerPlugin(CSSPlugin, CSSRulePlugin)")),t),o=i=>{e=i||n(),r()&&(s=document),e&&(l=e.plugins.css,l&&(t=1))};const u={version:"3.12.2",name:"cssRule",init(e,t,r,n,o){if(!i()||void 0===e.cssText)return!1;let u=e._gsProxy=e._gsProxy||s.createElement("div");this.ss=e,this.style=u.style,u.style.cssText=e.cssText,l.prototype.init.call(this,u,t,r,n,o)},render(e,t){let s,l=t._pt,r=t.style,n=t.ss;for(;l;)l.r(e,l.d),l=l._next;for(s=r.length;--s>-1;)n[r[s]]=r[r[s]]},getRule(e){i();let t,l,r,n,o=s.all?"rules":"cssRules",u=s.styleSheets,c=u.length,g=":"===e.charAt(0);for(e=(g?"":",")+e.split("::").join(":").toLowerCase()+",",g&&(n=[]);c--;){try{if(l=u[c][o],!l)continue;t=l.length}catch(e){console.warn(e);continue}for(;--t>-1;)if(r=l[t],r.selectorText&&-1!==(","+r.selectorText.split("::").join(":").toLowerCase()+",").indexOf(e)){if(!g)return r.style;n.push(r.style)}}return n},register:o};n()&&e.registerPlugin(u);export default u;export{u as CSSRulePlugin};
