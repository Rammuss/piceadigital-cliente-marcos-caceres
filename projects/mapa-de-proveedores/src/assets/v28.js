/* V28 — touch and pointer drag dismissal for map bottom sheets.
   Only the handle/header starts a drag, leaving content scrolling and clicks untouched. */
'use strict';
(() => {
  const mobile = () => window.matchMedia('(max-width: 680px)').matches;
  const isInteractive = el => Boolean(el?.closest?.('button,a,select,input,textarea,label,[role="button"]'));
  const bindSheet = (panelId, triggerSelectors, closeButtonId) => {
    const sheet=document.getElementById(panelId);
    const close=document.getElementById(closeButtonId);
    if(!sheet || !close) return;
    const triggers=triggerSelectors.map(s=>sheet.querySelector(s)).filter(Boolean);
    let drag=null;
    const reset=() => {
      drag=null;
      sheet.classList.remove('sheet-dragging');
      sheet.style.removeProperty('--sheet-drag-y');
    };
    triggers.forEach(trigger => {
      trigger.addEventListener('pointerdown',event => {
        if(!mobile() || !sheet.classList.contains('open') || isInteractive(event.target))return;
        if(event.pointerType==='mouse' && event.button!==0)return;
        drag={id:event.pointerId,startY:event.clientY,dy:0,startTime:performance.now()};
        sheet.classList.add('sheet-dragging');
        trigger.setPointerCapture?.(event.pointerId);
      });
      trigger.addEventListener('pointermove',event => {
        if(!drag || drag.id!==event.pointerId)return;
        drag.dy=Math.max(0,event.clientY-drag.startY);
        sheet.style.setProperty('--sheet-drag-y',Math.min(drag.dy,320).toFixed(1)+'px');
        if(event.cancelable)event.preventDefault();
      },{passive:false});
      const finish=event => {
        if(!drag || drag.id!==event.pointerId)return;
        const dy=drag.dy,elapsed=Math.max(1,performance.now()-drag.startTime);
        const dismiss=dy>92 || (dy>40 && dy/elapsed>.65);
        reset();
        if(dismiss)close.click();
      };
      trigger.addEventListener('pointerup',finish);
      trigger.addEventListener('pointercancel',reset);
      trigger.addEventListener('lostpointercapture',()=>{
        if(drag)reset();
      });
    });
    close.addEventListener('click',reset);
    window.addEventListener('resize',()=>{if(!mobile()) reset();},{passive:true});
  };
  bindSheet('locator-list-panel',['.list-sheet-handle','.locator-list-header'],'close-list');
  bindSheet('detail-pane',['.detail-handle-region','.detail-top'],'detail-close');
})();
