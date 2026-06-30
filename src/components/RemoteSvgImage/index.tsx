import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { WebView } from '@components/WebView';

import { DEFAULT_REMOTE_SVG_HEIGHT } from '@extra/constants';

type Props = {
  uri: string;
  width: number | `${number}%`;
  height: number | `${number}%`;
};

const escapeSvgUri = (uri: string) =>
  uri
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Fragment for embedded WebView — avoids nested full HTML docs and img baseline clipping on Android. */
const buildSvgEmbeddedHtml = (uri: string, maxHeight?: number) => {
  const escapedUri = escapeSvgUri(uri);
  const maxHeightStyle =
    maxHeight != null ? `max-height:${maxHeight}px;` : '';

  return `<div style="width:100%;line-height:0;font-size:0"><img src="${escapedUri}" alt="" style="display:block;width:100%;height:auto;max-width:100%;${maxHeightStyle}object-fit:contain;vertical-align:top" /></div>`;
};

const resolveContainerHeight = (height: number | `${number}%`) =>
  typeof height === 'number' ? height : DEFAULT_REMOTE_SVG_HEIGHT;

export const RemoteSvgImage = ({ uri, width, height }: Props) => {
  const [useWebViewFallback, setUseWebViewFallback] = useState(false);
  const resolvedHeight = resolveContainerHeight(height);

  if (!uri) return null;

  if (useWebViewFallback) {
    return (
      <View
        style={[
          styles.container,
          { width, minHeight: resolvedHeight },
          Platform.OS === 'android' ? styles.containerAndroid : null,
        ]}
      >
        <WebView
          allowOverflow
          backgroundColor="transparent"
          embedded
          html={buildSvgEmbeddedHtml(uri, resolvedHeight)}
        />
      </View>
    );
  }

  return (
    <SvgUri
      height={height}
      uri={uri}
      width={width}
      onError={() => setUseWebViewFallback(true)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  containerAndroid: {
    paddingBottom: 2,
  },
});
