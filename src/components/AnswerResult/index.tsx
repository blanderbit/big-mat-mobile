import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { WebView } from '@components/WebView';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

export const AnswerResultScrollContext = createContext<(() => void) | null>(
  null,
);

type Props = {
  isCorrect: boolean;
  content: string; // HTML string;
  onPressNext: () => void;
  onClose: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  buttonText: string;
};

export const AnswerResult = ({
  isCorrect,
  content,
  onPressNext,
  onClose,
  disabled = false,
  isLoading = false,
  buttonText,
}: Props) => {
  const windowWidth = Dimensions.get('window').width;
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isClosing, setIsClosing] = useState(false);
  const scrollToEnd = useContext(AnswerResultScrollContext);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 9,
      tension: 70,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      scrollToEnd?.();
    }, 50);
    return () => clearTimeout(timer);
  }, [scrollToEnd, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  return (
    <>
      <Pressable
        disabled={isClosing || isLoading}
        style={styles.backdrop}
        onPress={handleClose}
      />

      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: isCorrect ? colors.green : colors.brightOrange,
            width: windowWidth,
            paddingBottom: bottom + DEFAULT_SPACE,
            opacity: slideAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <WebView html={content} />

        <Button
          disabled={disabled}
          isLoading={isLoading}
          title={
            isCorrect ? (buttonText ? buttonText : t('next')) : t('continue')
          }
          onPress={onPressNext}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  container: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: DEFAULT_SPACE,
    paddingTop: DEFAULT_SPACE * 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 2,
    gap: DEFAULT_SPACE,
  },
});
