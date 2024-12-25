declare global {
  namespace JSX {
    interface HtmlBodyTag {
      onAfterprint?: (event: Event) => void;
      onBeforeprint?: (event: Event) => void;
      onBeforeonload?: (event: Event) => void;
      onBlur?: (event: Event) => void;
      onError?: (event: Event) => void;
      onFocus?: (event: Event) => void;
      onHaschange?: (event: Event) => void;
      onLoad?: (event: Event) => void;
      onMessage?: (event: Event) => void;
      onOffline?: (event: Event) => void;
      onOnline?: (event: Event) => void;
      onPagehide?: (event: Event) => void;
      onPageshow?: (event: Event) => void;
      onPopstate?: (event: Event) => void;
      onRedo?: (event: Event) => void;
      onResize?: (event: Event) => void;
      onStorage?: (event: Event) => void;
      onUndo?: (event: Event) => void;
      onUnload?: (event: Event) => void;
    }
    interface HtmlTag {
      onContextmenu?: (event: Event) => void;
      onKeydown?: (event: Event) => void;
      onKeypress?: (event: Event) => void;
      onKeyup?: (event: Event) => void;
      onClick?: (event: Event) => void;
      onDblclick?: (event: Event) => void;
      onDrag?: (event: Event) => void;
      onDragend?: (event: Event) => void;
      onDragenter?: (event: Event) => void;
      onDragleave?: (event: Event) => void;
      onDragover?: (event: Event) => void;
      onDragstart?: (event: Event) => void;
      onDrop?: (event: Event) => void;
      onMousedown?: (event: Event) => void;
      onMousemove?: (event: Event) => void;
      onMouseout?: (event: Event) => void;
      onMouseover?: (event: Event) => void;
      onMouseup?: (event: Event) => void;
      onMousewheel?: (event: Event) => void;
      onScroll?: (event: Event) => void;
    }
    interface FormEvents {
      onBlur?: (event: Event) => void;
      onChange?: (event: Event) => void;
      onFocus?: (event: Event) => void;
      onFormchange?: (event: Event) => void;
      onForminput?: (event: Event) => void;
      onInput?: (event: Event) => void;
      onInvalid?: (event: Event) => void;
      onSelect?: (event: Event) => void;
      onSubmit?: (event: Event) => void;
    }
    interface HtmlInputTag extends FormEvents {}
    interface HtmlFieldSetTag extends FormEvents {}
    interface HtmlFormTag extends FormEvents {}
    interface MediaEvents {
      onAbort?: (event: Event) => void;
      onCanplay?: (event: Event) => void;
      onCanplaythrough?: (event: Event) => void;
      onDurationchange?: (event: Event) => void;
      onEmptied?: (event: Event) => void;
      onEnded?: (event: Event) => void;
      onError?: (event: Event) => void;
      onLoadeddata?: (event: Event) => void;
      onLoadedmetadata?: (event: Event) => void;
      onLoadstart?: (event: Event) => void;
      onPause?: (event: Event) => void;
      onPlay?: (event: Event) => void;
      onPlaying?: (event: Event) => void;
      onProgress?: (event: Event) => void;
      onRatechange?: (event: Event) => void;
      onReadystatechange?: (event: Event) => void;
      onSeeked?: (event: Event) => void;
      onSeeking?: (event: Event) => void;
      onStalled?: (event: Event) => void;
      onSuspend?: (event: Event) => void;
      onTimeupdate?: (event: Event) => void;
      onVolumechange?: (event: Event) => void;
      onWaiting?: (event: Event) => void;
    }
    interface HtmlAudioTag extends MediaEvents {}
    interface HtmlEmbedTag extends MediaEvents {}
    interface HtmlImageTag extends MediaEvents {}
    interface HtmlObjectTag extends MediaEvents {}
    interface HtmlVideoTag extends MediaEvents {}
  }
}
