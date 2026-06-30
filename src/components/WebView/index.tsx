import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
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
  /** No extra horizontal padding — for tap_card and other tight layouts. */
  embedded?: boolean;
  /** Keep content visible when it exceeds the measured box (e.g. remote SVG on Android). */
  allowOverflow?: boolean;
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
  function measureEmbeddedRoot() {
    var root = document.getElementById('__rn_embed_root');
    if (!root) return 0;
    return Math.ceil(root.getBoundingClientRect().height);
  }
  function measure() {
    constrainWidth();
    var b = document.body;
    var e = document.documentElement;
    if (e) {
      e.style.height = 'auto';
      e.style.minHeight = '0';
    }
    if (b) {
      b.style.height = 'auto';
      b.style.minHeight = '0';
    }
    var embeddedRoot = document.getElementById('__rn_embed_root');
    var h = 0;
    if (embeddedRoot) {
      h = measureEmbeddedRoot();
    } else if (b) {
      var top = b.getBoundingClientRect().top;
      var nodes = b.children;
      var i = 0;
      for (; i < nodes.length; i++) {
        var r = nodes[i].getBoundingClientRect();
        h = Math.max(h, r.bottom - top);
      }
      if (h < 1) {
        var sh = Math.max(b.scrollHeight, b.offsetHeight);
        var vh = window.innerHeight || 0;
        h = vh > 0 && sh > vh * 1.15 ? measureEmbeddedRoot() || h : sh;
      }
    }
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

/** Tap-card: measure once via Range, no MutationObserver (avoids runaway height). */
const EMBEDDED_WEBVIEW_HEIGHT_JS = `
(function () {
  function measure() {
    var root = document.getElementById('__rn_embed_root');
    if (!root || !window.ReactNativeWebView) return;
    var nodes = root.querySelectorAll('*');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].style.minHeight = '0';
      nodes[i].style.maxHeight = 'none';
    }
    var range = document.createRange();
    range.selectNodeContents(root);
    var h = Math.ceil(range.getBoundingClientRect().height);
    if (h > 0) {
      window.ReactNativeWebView.postMessage(String(h));
    }
  }
  measure();
  setTimeout(measure, 50);
  setTimeout(measure, 150);
})();
true;
`;

const sanitizeEmbeddedHtml = (html: string) =>
  html
    .replace(/min-height\s*:\s*100vh/gi, 'min-height:0')
    .replace(/min-height\s*:\s*100%/gi, 'min-height:0')
    .replace(/height\s*:\s*100vh/gi, 'height:auto')
    .replace(/height\s*:\s*100%/gi, 'height:auto');

export const WebView = ({
  html,
  autoHeight = true,
  backgroundColor,
  borderRadius,
  color,
  containerHeight,
  embedded = false,
  allowOverflow = false,
}: Props) => {
  const webViewRef = useRef<RNWebView | null>(null);
  const [height, setHeight] = useState<number>(MIN_HEIGHT);
  const [isMeasured, setIsMeasured] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setHeight(MIN_HEIGHT);
    setIsMeasured(false);
    fadeAnim.setValue(0);
  }, [embedded, fadeAnim, html]);

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

  const bodyMarkup = embedded
    ? `<div id="__rn_embed_root">${sanitizeEmbeddedHtml(html)}</div>`
    : html;

  const documentHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
<style>
 #__rn_embed_root {
   display: block;
   width: 100%;
   min-height: 0 !important;
   height: auto !important;
   line-height: 0;
   font-size: 0;
 }
 #__rn_embed_root * {
   max-width: 100%;
 }
 #__rn_embed_root img {
   display: block;
   height: auto !important;
   vertical-align: top;
 }

 html, body {
   margin: 0;
   padding: 0;
   width: 100%;
   max-width: 100%;
   min-height: 0;
   height: auto;
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
<body>${bodyMarkup}</body>
</html>`;

  const handleMessage = (event: WebViewMessageEvent) => {
    const next = Number.parseFloat(event.nativeEvent.data);
    if (!Number.isFinite(next) || next < MIN_HEIGHT) return;
    const screenH = Dimensions.get('window').height;
    if (embedded && screenH > 0 && next > screenH * 0.85) {
      return;
    }
    setHeight(prev => (Math.round(prev) === Math.round(next) ? prev : next));
    if (!isMeasured) setIsMeasured(true);
  };

  if (!autoHeight) {
    return (
      <View
        style={[
          styles.wrapper,
          embedded ? styles.wrapperEmbedded : null,
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
        embedded ? styles.wrapperEmbedded : null,
        allowOverflow ? styles.wrapperAllowOverflow : null,
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
        injectedJavaScript={
          embedded ? EMBEDDED_WEBVIEW_HEIGHT_JS : WEBVIEW_HEIGHT_BRIDGE_JS
        }
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
  wrapperEmbedded: {
    paddingHorizontal: 0,
  },
  wrapperAllowOverflow: {
    overflow: 'visible',
  },
  webView: {
    width: '100%',
  },
  webViewMaxHeight: {
    height: MAX_HEIGHT,
  },
});
