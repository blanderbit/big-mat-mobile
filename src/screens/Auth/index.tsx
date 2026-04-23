import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

import background1 from '@assets/images/background1.png';
import background2 from '@assets/images/background2.png';
import background3 from '@assets/images/background3.png';
import background4 from '@assets/images/background4.png';
import background5 from '@assets/images/background5.png';

export const Auth = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const { t } = useTranslation();
  const handleSetFooterHeight = (e: LayoutChangeEvent) => {
    setFooterHeight(e.nativeEvent.layout.height);
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={background1}
        style={[styles.background1, { marginTop: top + DEFAULT_SPACE }]}
      />

      <View
        style={styles.titleWrap}
      >
        <Text center semiBold color={colors.white} size={18}>
          {t('learnMathFun')}
        </Text>
      </View>

      <Image
        resizeMode="contain"
        source={background5}
        style={styles.background5}
      />

      <Image
        resizeMode="contain"
        source={background2}
        style={styles.background2}
      />

      <Image
        resizeMode="contain"
        source={background3}
        style={styles.background3}
      />

      <Image
        resizeMode="contain"
        source={background4}
        style={[styles.background4, { bottom: footerHeight - 250 }]}
      />

      <View
        style={[styles.footer, { paddingBottom: bottom + 32 }]}
        onLayout={handleSetFooterHeight}
      >
        <Button title={t('signIn')} onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  background1: {
    width: '100%',
    height: '70%',
  },
  titleWrap: {
    position: 'absolute',
    top: '37%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  background5: {
    position: 'absolute',
    top: -50,
    left: 0,
    width: 200,
  },
  background2: {
    position: 'absolute',
    top: '10%',
    right: 0,
    bottom: 0,
    width: 150,
  },
  background3: {
    position: 'absolute',
    top: '30%',
    right: 0,
    bottom: 0,
    width: 180,
  },
  background4: {
    position: 'absolute',
    left: 0,
    width: 250,
  },
  footer: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    backgroundColor: colors.white,
    padding: 32,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
