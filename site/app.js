'use strict';
const introFinished = new Promise(resolve => {
 const intro=document.querySelector('#site-intro');
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 let alreadySeen=false;
 try{alreadySeen=sessionStorage.getItem('siteIntroSeen')==='1';}catch{}
 if(!intro || preference.matches || alreadySeen){intro?.remove();resolve();return;}
 try{sessionStorage.setItem('siteIntroSeen','1');}catch{}
 const pageElements=[...document.body.children].filter(element=>element!==intro && !element.inert);
 pageElements.forEach(element=>element.inert=true);
 document.body.classList.add('intro-active');
 let finished=false;
 const finish=()=>{
  if(finished)return;
  finished=true;
  clearTimeout(timeout);
  const restoreFocus=intro.contains(document.activeElement);
  intro.remove();
  document.body.classList.remove('intro-active');
  pageElements.forEach(element=>element.inert=false);
  document.removeEventListener('keydown',onKey,true);
  preference.removeEventListener('change',onPreference);
  window.removeEventListener('pagehide',finish);
  if(restoreFocus)document.querySelector('.skip')?.focus({preventScroll:true});
  resolve();
 };
 const onKey=event=>{if(event.key==='Escape' || event.key==='Tab')finish();};
 const onPreference=()=>{if(preference.matches)finish();};
 const timeout=setTimeout(finish,5000);
 intro.addEventListener('click',finish);
 document.addEventListener('keydown',onKey,true);
 preference.addEventListener('change',onPreference);
 window.addEventListener('pagehide',finish);
});
const projectDetails = {
 p1: { role:'负责投标统筹、响应文件核查、厂家授权与商务推进，并跟进供货、验收和回款。', steps:['拆解评标办法与供货要求，核对 87 项安全防护条目。','准备真实性声明、制造商授权书、技术指标和分项报价，协调 CA 数字证书与线上操作。','识别低于成本审查要求，确定报价区间；中标后跟进合同、分批供货与安装验收。'], result:'项目中标，完成供货、验收与回款闭环。供货合同额为 220.39 万元，采购最高限价为 244.874 万元。' },
 p2: { role:'统筹 108 台交流桩采购投标及中标后的施工、安装、结算跟进。', steps:['制作、打印、封装标书，组织现场开标及澄清补正。','编制施工方案，按 CAD 图纸估算布线长度，推进立柱采购、设备安装与漏水影响点位的补装。','持续跟进催款、分笔回款及开票，处理质保金约定。'], result:'成功中标并推进安装交付，尾款已到账；质保金按约定待质保期满处理。' },
 p12: { role:'主动挖掘政务采购商机，负责采购需求对接、报名、标书准备与投标风险判断。', steps:['通过政务公众号发现 80kW 直流充电桩采购需求。','核查 3C 认证、厂家质保与项目要求，识别不满足条件的风险。','结合此前流标情况评估投入，决定首轮主动放弃。'], result:'在投标前识别关键资质风险，主动放弃首轮，规避无效投入。该项目不计入中标业绩。' },
 p4: { role:'负责存量设备故障诊断、替代方案推进及交付验收资料协调。', steps:['勘察 137 套存量充电桩，排查第三方平台失联和主控板协议兼容问题。','对比主控板更换与设备整体换新方案，推进平台迁移与替代设备选型。','跟进旧桩更换，编制施工、调试与竣工资料，组织多方会签。'], result:'完成问题定位与替代方案推进，形成建设与验收文档，协调七方会签。137 套为存量排查规模，不等同于全部更换数量。' },
 p5: { role:'负责项目方案、报价、合同执行，以及故障更换、平台上线与回款跟进。', steps:['沟通项目方案与报价，推进新合同签订、盖章寄送和旧合同作废。','协调故障设备更换、调试与平台上线。','跟进剩余款项及交付后的客户问题。'], result:'围绕 23 台充电桩推进从签约、交付到回款的业务闭环。' },
 p13: { role:'负责采购响应、现场勘查、安装调试协调与合同款项流程跟进。', steps:['准备供应商响应资料，完成现场勘查。','利用周末协调完成 10 台 7kW 设备安装、主电缆铺设与平台调试。','跟进合同、报价、质保金及尾款流程，输出旧桩安全隐患说明。'], result:'10 台设备利用周末完成安装调试，并推动旧桩规范拆除。' },
 p14: { role:'独立推进 5 台 7kW 交流桩的合同、现场协调与验收。', steps:['拟定安装服务合同、设备购销合同及工程报价单并完成用印。','执行绝缘与接地安全测试，协调布线、配电箱接电及设备上线。','完成平台测试，完善调试报告和设备验收记录。'], result:'独立推进 5 台交流桩的合同、现场协调与验收。' },
 p7: { role:'负责 100 台 120kW 直流双枪设备合同执行跟进，并重建充电设备报价模型。', steps:['跟进预付款与到货款节奏，落实质保与物联卡年限等商务条款。','以竞品报价单为基准，补齐缺价设备的公开价格调研。','汇总配件采购需求，对比供应商价格与质保年限，整理调价方法。'], result:'推进 100 台设备采购项目的商务条款执行，形成可复用的报价与调价方法。' },
 p16: { role:'独立搭建并运营企业淘宝店，承担商品内容、价格库存与咨询承接。', steps:['完成主图拍摄、详情页设计与文案，整理产品价格和库存。','上架 10 余款 AI 硬件产品，创建子账号承接移动端咨询。','同步上架充电桩安装服务、制作宣传物料，并结合小红书等渠道引流。'], result:'建立企业线上销售渠道，完成 10 余款 AI 硬件产品上架。' },
 p10: { role:'负责智慧养老陪伴产品的客户对接、场景方案、商务谈判与落地推进。', steps:['围绕养老机构和适老化需求，梳理智能机器人、毛绒与国潮创意产品形态。','按客户需求整理产品图册和解决方案，配置相关知识库、角色与话术。','通过产品演示、商务沟通与渠道拓展，推进合作签约。'], result:'完成养老场景产品方案、客户演示与商务沟通，并完成合作签约。', ai:'小智 AI：角色配置、知识库与话术调试。' },
 p11: { role:'负责墨本 MB-1 学习卡的教培客户对接、产品讲解、商务谈判和渠道拓展。', steps:['围绕墨水屏阅读、语音提问与 AI 对话整理产品演示。','对接教培机构，将产品功能转化为具体使用场景。','配合市场活动推进渠道沟通与合作。'], result:'面向教培机构开展产品讲解、客户对接与渠道拓展，并完成合作签约。', ai:'墨本 AI：AI 对话与生图产品能力的场景展示。' },
 p15: { role:'负责文旅讲解与陪伴智能体的场景定制、角色配置、知识库搭建和现场演示。', steps:['围绕乐山大佛、峨眉山、大足石刻、蒙溪河遗址、大唐贡茶院等场景整理讲解需求。','配置角色、搭建知识库，适配不同游客身份与对话方式。','在「AI+文旅」企业家研讨会等场合现场演示。'], result:'形成覆盖 5 个以上景区场景的智能体实践，并完成现场演示。', ai:'AI 智能体：角色配置、知识库搭建与对话调试。' }
};
const summaries = {
 botai:'负责充电设备销售与政企项目全流程，并从零切入 AI 智能体及智能硬件业务，推进场景定制、渠道建设和产品商业化。',
 changteng:'面向中小微企业销售 AI 获客软件，通过自主开发客户、远程产品演示与本地面谈推进签约。',
 hengwangda:'负责电话邀约、面销与培训，统筹招聘渠道、客源筛选、初谈方案及销售衔接。',
 fangjia:'独立完成设计构思、施工图、三维建模和客户提案，协调施工落地、材料确认与成本控制。'
};
const featured = [
 {id:'p15',no:'01',tag:'文旅 × AI 智能体',title:'让讲解，\n成为对话。',name:'文旅 AI 讲解与陪伴智能体',desc:'从景区知识到角色配置，为不同游客构建可对话的讲解与陪伴体验。',foot:'5+ 景区场景',style:''},
 {id:'p10',no:'02',tag:'养老 × 智能硬件',title:'让陪伴，\n更进一步。',name:'小智 AI · 智慧养老陪伴',desc:'面向养老与适老化场景，把产品能力转化为可演示、可沟通的解决方案。',foot:'养老场景方案 / 已签约',style:'cover-dark'},
 {id:'p11',no:'03',tag:'教育 × AI 产品',title:'让学习，\n有新可能。',name:'墨本 AI · 墨水屏学习卡',desc:'连接产品功能与教培机构需求，推进客户沟通、产品讲解和渠道拓展。',foot:'教培渠道拓展 / 已签约',style:'cover-light'}
];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const projectImages = {
 p15:{src:'./assets/project-tourism.webp',alt:'文旅场景场景示意：游客在传统庭院中使用智能讲解设备'},
 p10:{src:'./assets/project-xiaozhi.webp',alt:'智慧养老陪伴场景示意：长者与陪伴设备互动'},
 p11:{src:'./assets/project-moben.webp',alt:'墨本 AI 学习场景场景示意：墨水屏设备置于阅读桌面'}
};
// Keep content visible by default; animations are progressive enhancements.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileMotion = window.matchMedia('(max-width: 650px)');
const activeMotion = new Map();
const revealed = new WeakSet();
function animateEntry(element, duration=450, delay=0, distance=12){
 if(!element)return;
 activeMotion.get(element)?.cancel();
 if(motionPreference.matches || !element.animate)return;
 const offset=mobileMotion.matches ? Math.min(distance,6) : distance;
 const animation=element.animate([{opacity:0,translate:`0 ${offset}px`},{opacity:1,translate:'0 0'}],{duration,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
 activeMotion.set(element,animation);
 const cleanup=()=>{if(activeMotion.get(element)===animation)activeMotion.delete(element);};
 animation.onfinish=cleanup;
 animation.oncancel=cleanup;
}
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  revealObserver.unobserve(entry.target);
  if(revealed.has(entry.target))return;
  revealed.add(entry.target);
  animateEntry(entry.target,450,Number(entry.target.dataset.motionDelay)||0);
 });
},{threshold:0.08}) : null;
function observeEntries(selector, stagger=false){
 document.querySelectorAll(selector).forEach((element,index)=>{
  if(revealed.has(element))return;
  element.dataset.motionDelay=stagger ? Math.min(index*60,180) : 0;
  revealObserver?.observe(element);
 });
}
motionPreference.addEventListener('change',()=>{
 if(motionPreference.matches){activeMotion.forEach(animation=>animation.cancel());activeMotion.clear();}
});
document.addEventListener('focusin',event=>{
 // Keyboard users never wait for a focused control to become visible.
 activeMotion.forEach((animation,element)=>{if(element.contains(event.target))animation.cancel();});
});
introFinished.then(()=>{if(!location.hash || location.hash==='#top'){
 animateEntry(document.querySelector('.hero h1'),450);
 document.querySelectorAll('.hero-description,.hero .button').forEach(element=>animateEntry(element,450,80));
 animateEntry(document.querySelector('.identity'),450,160);
}});
observeEntries('.section-heading,.approach-intro,.about>div');
observeEntries('.method-grid article',true);
observeEntries('.tool-groups article',true);
let content;
const dialog = document.querySelector('#project-dialog');
let previousFocus;
let navigateToTools=false;
function openProject(id){
 const p=content.projects.find(project=>project.id===id), d=projectDetails[id];
 if(!p||!d)return;
 previousFocus=document.activeElement;
 document.querySelector('#dialog-content').innerHTML=`<p class="eyebrow">${escapeHTML(p.tag)}</p><h2 id="dialog-title">${escapeHTML(p.title)}</h2><p class="dialog-metric">${escapeHTML(p.metric)}</p><section class="detail-block"><h3>我的职责</h3><p>${escapeHTML(d.role)}</p></section><section class="detail-block"><h3>过程与行动</h3><ol>${d.steps.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ol></section><section class="detail-block"><h3>AI 与辅助工具</h3>${d.ai?`<p>${escapeHTML(d.ai)}</p>`:''}<p class="detail-note">共用辅助工具及用途见 <a href="#tools" data-tools-link>AI 工具箱</a>。</p></section><section class="detail-block"><h3>成果与进展</h3><p>${escapeHTML(d.result)}</p></section>`;
 const productSheet={p10:{file:'xiaozhi-terminal-sketch.svg',alt:'小智 AI 简笔示意：AI 模组可以连接毛绒玩具、口袋伴侣、挂脖玩具和桌面终端，并提供语音互动、情感陪伴与记忆训练。',note:'简笔示意基于公开生态资料；不代表单一官方型号。'},p11:{file:'moben-mb1-sketch.svg',alt:'墨本 MB-1 简笔示意：电子纸屏幕、四个实体按键与 Type-C 接口，支持阅读、按住语音提问、联网对话和回答呈现。',note:'简笔示意基于公开使用说明；不替代官方产品图。'}}[id];
 if(productSheet){document.querySelector('.dialog-metric').insertAdjacentHTML('afterend',`<figure class="product-sheet"><a href="./assets/${productSheet.file}" target="_blank" rel="noopener" aria-label="查看产品功能简笔图，新窗口打开"><img src="./assets/${productSheet.file}" alt="${productSheet.alt}" width="1200" height="760"></a><figcaption><span>${productSheet.note}</span><a href="./assets/${productSheet.file}" target="_blank" rel="noopener">查看大图 ↗</a></figcaption></figure>`);}
 dialog.showModal();dialog.scrollTop=0;document.querySelector('#close-dialog').focus();
 animateEntry(dialog,200,0,8);
}
function renderProjects(filter='all',animate=false){
 const items=content.projects.filter(p=>filter==='all'||p.category===filter);
 document.querySelector('#project-list').innerHTML=items.map(p=>`<article class="project-row"><span class="project-index">${String(content.projects.indexOf(p)+1).padStart(2,'0')}</span><div><h3>${escapeHTML(p.title)}</h3><p class="category">${escapeHTML(p.tag)}</p></div><p class="project-metric">${escapeHTML(p.metric)}</p><button class="text-button" data-project="${p.id}" aria-label="查看${escapeHTML(p.title)}详情">查看详情 <span aria-hidden="true">↗</span></button></article>`).join('');
 document.querySelector('#filter-status').textContent=`显示 ${items.length} 个项目`;
 if(animate)animateEntry(document.querySelector('#project-list'),180,0,0);
}
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{
 activeMotion.get(dialog)?.cancel();
 if(navigateToTools){
  navigateToTools=false;
  const heading=document.querySelector('#tools h2');
  heading.setAttribute('tabindex','-1');
  history.replaceState(null,'','#tools');
  heading.focus({preventScroll:true});
  heading.scrollIntoView({behavior:motionPreference.matches?'instant':'smooth',block:'start'});
 }else previousFocus?.focus();
});
dialog.addEventListener('click',event=>{
 if(event.target.closest('[data-tools-link]')){
  event.preventDefault();
  navigateToTools=true;
  dialog.close();
 }
});
document.addEventListener('click',event=>{const target=event.target.closest('[data-project]');if(target)openProject(target.dataset.project);});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});renderProjects(button.dataset.filter,true);}));
fetch('./content.json').then(response=>{if(!response.ok)throw new Error('内容加载失败');return response.json();}).then(data=>{
 content=data;
 document.querySelector('#featured-projects').innerHTML=featured.map(p=>`<article class="featured-card"><figure class="project-photo"><img src="${projectImages[p.id].src}" alt="${projectImages[p.id].alt}" width="1536" height="1024" loading="lazy" decoding="async"><figcaption>场景示意</figcaption></figure><div class="featured-body"><p class="photo-category">${p.no} / ${p.tag}</p><h3>${p.name}</h3><p>${p.desc}</p><button class="text-button" data-project="${p.id}" aria-label="查看${p.name}详情">${p.foot} <span aria-hidden="true">↗</span></button></div></article>`).join('');
 renderProjects();
 document.querySelector('#experience-list').innerHTML=content.experience.map(e=>`<article class="experience-item"><p class="experience-period">${escapeHTML(e.period)}</p><div><h3>${escapeHTML(e.company)}</h3><p class="experience-role">${escapeHTML(e.title)}</p><p class="experience-summary">${summaries[e.id]}</p><details><summary>展开完整职责</summary><div class="experience-groups">${e.groups.map(g=>`<h4>${escapeHTML(g.name)}</h4><ul>${g.bullets.map(b=>`<li>${escapeHTML(b)}</li>`).join('')}</ul>`).join('')}</div></details></div></article>`).join('');
 observeEntries('.featured-card',true);
 observeEntries('.experience-item',true);
}).catch(()=>{document.querySelector('#project-list').innerHTML='<p role="alert">项目内容暂时未能加载，请刷新页面重试。</p>';});

