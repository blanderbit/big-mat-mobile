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

const buildSvgFallbackHtml = (uri: string) => {
  const escapedUri = uri
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;height:100%}#wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center}img{max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain}</style></head><body><div id="wrap"><img src="${escapedUri}" alt="" /></div></body></html>`;
};

const resolveContainerHeight = (height: number | `${number}%`) =>
  typeof height === 'number' ? height : DEFAULT_REMOTE_SVG_HEIGHT;

export const RemoteSvgImage = ({ uri, width, height }: Props) => {
  const [useWebViewFallback, setUseWebViewFallback] = useState(
    Platform.OS === 'android',
  );

  if (!uri) return null;

  if (useWebViewFallback) {
    return (
      <View style={[styles.container, { width, height: resolveContainerHeight(height) }]}>
        <WebView
          backgroundColor="transparent"
          containerHeight={resolveContainerHeight(height)}
          embedded
          html={buildSvgFallbackHtml(uri)}
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
    overflow: 'hidden',
  },
});
