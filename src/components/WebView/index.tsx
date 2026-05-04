import { useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  WebView as RNWebView,
  WebViewMessageEvent,
} from 'react-native-webview';

type Props = {
  html: string;
  autoHeight?: boolean;
  containerHeight?: number;
  backgroundColor?: string;
  color?: string;
  borderRadius?: number;
};

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 1;

const WEBVIEW_HEIGHT_BRIDGE_JS = `
(function () {
  function constrainWidth() {
    var nodes = document.querySelectorAll('img, video, iframe, table, pre, code, svg');
    var i = 0;
    for (; i < nodes.length; i++) {
      nodes[i].style.maxWidth = '100%';
      if (nodes[i].tagName !== 'IFRAME') {
        nodes[i].style.height = 'auto';
      }
    }
  }
  function measure() {
    constrainWidth();
    var b = document.body;
    var e = document.documentElement;
    var h = Math.max(
      b.scrollHeight, b.offsetHeight,
      e.clientHeight, e.scrollHeight, e.offsetHeight
    );
    if (window.ReactNativeWebView && h >= 0) {
      window.ReactNativeWebView.postMessage(String(Math.ceil(h)));
    }
  }
  function scheduleMeasure() {
    clearTimeout(window.__rnMeasureTimer);
    window.__rnMeasureTimer = setTimeout(measure, 32);
  }
  measure();
  setTimeout(measure, 0);
  window.addEventListener('load', measure);
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('orientationchange', scheduleMeasure);
  if (typeof MutationObserver !== 'undefined') {
    var obs = new MutationObserver(scheduleMeasure);
    if (document.body) {
      obs.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
    }
  }
})();
true;
`;

export const WebView = ({
  html,
  autoHeight = true,
  backgroundColor,
  borderRadius,
  color,
  containerHeight,
}: Props) => {
  const webViewRef = useRef<RNWebView | null>(null);
  const [height, setHeight] = useState<number>(MIN_HEIGHT);

  const pageBackground = backgroundColor ?? 'transparent';
  const hasTextColor = color != null && color !== '';

  const isFixedHeight = containerHeight != null;

  const documentHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
<style>
 html, body {
   margin: 0;
   padding: 0;
   width: 100%;
   max-width: 100%;
   overflow-x: hidden;
   background: ${pageBackground};
   ${hasTextColor ? `color: ${color};` : ''}
 }

 * {
   box-sizing: border-box;
   -webkit-text-size-adjust: 100%;
   word-break: break-word;
   overflow-wrap: anywhere;
 }

 img, video, iframe, svg, canvas {
   display: block;
   max-width: 100%;
   height: auto;
 }

 table {
   max-width: 100%;
   table-layout: fixed;
   word-break: break-word;
   overflow-wrap: anywhere;
 }

 th, td {
   word-break: break-word;
   overflow-wrap: anywhere;
 }

 pre, code {
   max-width: 100%;
   white-space: pre-wrap;
   word-break: break-word;
   overflow-wrap: anywhere;
 }

 body {
   overflow-y: ${autoHeight && !isFixedHeight ? 'hidden' : 'auto'};
 }

 p {
  margin: 0;
  padding: 0;
 }
</style>
</head>
<body>${html}</body>
</html>`;

  const handleMessage = (event: WebViewMessageEvent) => {
    const next = Number.parseFloat(event.nativeEvent.data);
    if (!Number.isFinite(next) || next < MIN_HEIGHT) return;
    setHeight(prev => (Math.round(prev) === Math.round(next) ? prev : next));
  };

  if (!autoHeight) {
    return (
      <View
        style={[
          styles.wrapper,
          borderRadius != null ? { borderRadius } : undefined,
          backgroundColor ? { backgroundColor } : undefined,
          containerHeight ? { height: containerHeight } : undefined,
        ]}
      >
        <RNWebView
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator
          originWhitelist={['*']}
          showsHorizontalScrollIndicator={false}
          source={{ html: documentHtml }}
          style={[
            styles.webView,
            styles.webViewMaxHeight,
            backgroundColor ? { backgroundColor } : undefined,
            containerHeight ? { height: containerHeight } : undefined,
          ]}
        />
      </View>
    );
  }

  const shouldEnableScroll = isFixedHeight;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        borderRadius != null ? { borderRadius } : undefined,
        backgroundColor ? { backgroundColor } : undefined,
        isFixedHeight ? { height: containerHeight } : undefined,
      ]}
    >
      <RNWebView
        injectedJavaScriptForMainFrameOnly
        javaScriptEnabled
        injectedJavaScript={WEBVIEW_HEIGHT_BRIDGE_JS}
        nestedScrollEnabled={shouldEnableScroll} // ✅ Android fix
        originWhitelist={['*']}
        overScrollMode={shouldEnableScroll ? 'auto' : 'never'} // ✅ Android fix
        ref={webViewRef}
        scrollEnabled={shouldEnableScroll} // ✅ ключ
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={shouldEnableScroll}
        source={{ html: documentHtml }}
        style={[
          styles.webView,
          {
            height: isFixedHeight ? containerHeight : height,
          },
          { backgroundColor: backgroundColor || 'transparent' },
        ]}
        onMessage={handleMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  webView: {
    width: '100%',
  },
  webViewMaxHeight: {
    height: MAX_HEIGHT,
  },
});
