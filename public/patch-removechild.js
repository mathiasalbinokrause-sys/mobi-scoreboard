(function(){
  // Patch seguro para parent.removeChild(child)
  try {
    if (!Node.prototype.__orig_removeChild && Node.prototype.removeChild) {
      Node.prototype.__orig_removeChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function(child){
        try{
          // se parent contém child, remove; se não, avisa e não quebra
          if (this && child && this.contains && this.contains(child)) {
            return this.__orig_removeChild(child);
          } else {
            console.warn('[patch-removechild] tentativa de remover nó que não é filho. Parent:', this, 'Child:', child);
            return null; // não lança erro
          }
        }catch(e){
          console.error('[patch-removechild] erro interno ao remover child:', e, {parent:this, child});
          return null;
        }
      };
    }
  } catch (err) {
    console.error('[patch-removechild] falha aplicando patch removeChild:', err);
  }

  // Patch seguro para node.remove()
  try {
    if (!Node.prototype.__orig_remove && Node.prototype.remove) {
      Node.prototype.__orig_remove = Node.prototype.remove;
      Node.prototype.remove = function(){
        try{
          if (this && this.parentNode && this.parentNode.contains && this.parentNode.contains(this)) {
            return this.__orig_remove();
          } else {
            console.warn('[patch-remove] tentativa de remover nó sem parent ou já removido:', this);
            return null;
          }
        }catch(e){
          console.error('[patch-remove] erro ao executar remove():', e, {node:this});
          return null;
        }
      };
    }
  } catch (err) {
    console.error('[patch-remove] falha aplicando patch remove():', err);
  }

  // Logs globais para capturar stack traces e ajudar debug
  window.addEventListener('error', function(ev){
    try {
      console.error('[GLOBAL ERROR CAPTURED]', ev.message, ev.filename, ev.lineno, ev.colno, ev.error && ev.error.stack);
    } catch(e) { console.error('[GLOBAL ERROR CAPTURED] falha ao logar', e); }
  });

  window.addEventListener('unhandledrejection', function(ev){
    try {
      console.error('[UNHANDLED REJECTION]', ev.reason);
    } catch(e) { console.error('[UNHANDLED REJECTION] falha ao logar', e); }
  });

  console.info('[patch-removechild] patch aplicado com sucesso.');
})();
