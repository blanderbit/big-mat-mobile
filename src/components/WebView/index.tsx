import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import {
  WebView as RNWebView,
  WebViewMessageEvent,
} from 'react-native-webview';

import { DEFAULT_SPACE } from '@extra/constants';

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
  const [isMeasured, setIsMeasured] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isMeasured) return;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, isMeasured]);

  const pageBackground = backgroundColor ?? 'transparent';
  const hasTextColor = color != null && color !== '';

  const isFixedHeight = containerHeight != null;
  const hasBackground = backgroundColor != null && backgroundColor !== '';
  const paddingV = hasBackground ? DEFAULT_SPACE : 0;
  const fixedWebViewHeight =
    isFixedHeight && containerHeight != null
      ? Math.max(MIN_HEIGHT, containerHeight - paddingV * 2)
      : undefined;

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

 /* Make the very first content sit flush to top */
 body > :first-child {
   margin-top: 0 !important;
   padding-top: 0 !important;
 }

 body > :last-child {
   margin-bottom: 0 !important;
   padding-bottom: 0 !important;
 }

 /* Reset default top margins that browsers add to block elements */
 h1, h2, h3, h4, h5, h6,
 p,
 ul, ol,
 pre,
 blockquote,
 table {
   margin-top: 0;
 }

 /* Reset default bottom margins that browsers add to block elements */
 h1, h2, h3, h4, h5, h6,
 p,
 ul, ol,
 pre,
 blockquote,
 table {
   margin-bottom: 0;
 }


</style>
</head>
<body>${html}</body>
</html>`;

  const handleMessage = (event: WebViewMessageEvent) => {
    const next = Number.parseFloat(event.nativeEvent.data);
    if (!Number.isFinite(next) || next < MIN_HEIGHT) return;
    setHeight(prev => (Math.round(prev) === Math.round(next) ? prev : next));
    if (!isMeasured) setIsMeasured(true);
  };

  if (!autoHeight) {
    return (
      <View
        style={[
          styles.wrapper,
          borderRadius != null ? { borderRadius } : undefined,
          backgroundColor ? { backgroundColor } : undefined,
          hasBackground ? { paddingVertical: DEFAULT_SPACE } : undefined,
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
            fixedWebViewHeight != null
              ? { height: fixedWebViewHeight }
              : undefined,
          ]}
        />
      </View>
    );
  }

  const shouldEnableScroll = isFixedHeight;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        borderRadius != null ? { borderRadius } : undefined,
        backgroundColor ? { backgroundColor } : undefined,
        hasBackground ? { paddingVertical: DEFAULT_SPACE } : undefined,
        isFixedHeight ? { height: containerHeight } : undefined,
        { opacity: isFixedHeight ? 1 : fadeAnim },
      ]}
    >
      <RNWebView
        injectedJavaScriptForMainFrameOnly
        javaScriptEnabled
        injectedJavaScript={WEBVIEW_HEIGHT_BRIDGE_JS}
        nestedScrollEnabled={shouldEnableScroll} // ✅ Android fix
        originWhitelist={['*']}
        ref={webViewRef}
        scrollEnabled={shouldEnableScroll} // ✅ ключ
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={shouldEnableScroll}
        source={{ html: documentHtml }}
        style={[
          styles.webView,
          {
            height: isFixedHeight ? fixedWebViewHeight : height,
          },
          { backgroundColor: backgroundColor || 'transparent' },
        ]}
        onMessage={handleMessage}
      />
    </Animated.View>
  );
};

// TODO: add loading indicator

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: DEFAULT_SPACE,
  },
  webView: {
    width: '100%',
  },
  webViewMaxHeight: {
    height: MAX_HEIGHT,
  },
});
