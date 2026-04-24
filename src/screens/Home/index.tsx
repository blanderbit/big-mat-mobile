import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';
import { Trapezoid } from '@screens/Home/components/Trapezoid';

import { API } from '@API/index';
import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Topic } from '@extra/types';

import background6 from '@assets/images/background6.png';
import background7 from '@assets/images/background7.png';
import background8 from '@assets/images/background8.png';
import background9 from '@assets/images/background9.png';

const keyExtractor = (item: Topic) => String(item.id);

export const Home = () => {
  const { t } = useTranslation();
  const [topics, setTopics] = useState<Topic[]>([]);
  const { bottom } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const getTopics = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/v1/content/topics');
      setTopics(response.data.data.topics);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getTopics();
      })();
    }
  }, [isFocused]);

  const ListHeader = () => (
    <>
      <Image
        resizeMode="contain"
        source={background6}
        style={styles.background6}
      />

      <Text bold size={30}>
        {t('whatWillWeLearnToday')}
      </Text>

      <Text marginTop={DEFAULT_SPACE * 2} size={14}>
        {t(
          'allSectionsHereWillHelpYouMasterMathematicalGaps.OurTeamWorksDayAndNightSoThatTheyBecomeAvailableAsEarlyAsPossible',
        )}
      </Text>

      <Image
        resizeMode="contain"
        source={background7}
        style={styles.background7}
      />

      <View
        style={[
          styles.topicsListTopSpacer,
          topics.length > 0
            ? styles.topicsListTopSpacerWithTopics
            : styles.topicsListTopSpacerEmpty,
        ]}
      />
    </>
  );

  const ListFooter = () => (
    <>
      <Text center marginTop={DEFAULT_SPACE * 2}>
        {t('haveYouGotSomethingToAdd.WeAreOpenToYourQuestionsAndSuggestions')}
      </Text>

      <Button
        marginTop={DEFAULT_SPACE * 2}
        title={t('contactUs')}
        onPress={() => {}}
      />

      <View style={[styles.promoContainer, { marginBottom: bottom + 20 }]}>
        <Image
          resizeMode="contain"
          source={background8}
          style={styles.promoBackground8}
        />

        <View style={styles.promoTitleContainer}>
          <Text center semiBold color={colors.white} size={32}>
            {t('whenMathDoesNotScare.ButInsteadItIsFunAndInteresting')}
          </Text>
        </View>

        <View style={styles.promoBottom}>
          <Image
            resizeMode="contain"
            source={background9}
            style={styles.promoBackground9}
          />

          <View style={styles.promoInspire}>
            <Text color={colors.brightBeige} size={32}>
              {t('inspire')}
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderItem = ({ item, index }: { item: Topic; index: number }) => (
    <Pressable onPress={() => {}}>
      <Trapezoid {...item} isLast={index === topics.length - 1} />
    </Pressable>
  );

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={topics}
      keyExtractor={keyExtractor}
      ListFooterComponent={ListFooter}
      ListHeaderComponent={ListHeader}
      refreshing={isLoading}
      renderItem={renderItem}
      onRefresh={getTopics}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: DEFAULT_SPACE,
    paddingVertical: DEFAULT_SPACE,
  },
  background6: {
    width: 150,
    position: 'absolute',
    top: -150,
    right: -DEFAULT_SPACE,
  },
  background7: {
    width: '100%',
    position: 'absolute',
    top: -200,
    left: 0,
    zIndex: -1,
  },
  topicsListTopSpacer: {
    marginTop: 0,
  },
  topicsListTopSpacerWithTopics: {
    marginTop: DEFAULT_SPACE * 3,
  },
  topicsListTopSpacerEmpty: {
    marginTop: DEFAULT_SPACE * 2,
  },
  promoContainer: {
    backgroundColor: colors.brightPurple,
    borderRadius: 70,
    marginHorizontal: -DEFAULT_SPACE,
    paddingVertical: DEFAULT_SPACE * 2,
    marginTop: DEFAULT_SPACE * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBackground8: {
    width: 200,
    position: 'absolute',
    top: 0,
    right: -DEFAULT_SPACE,
    zIndex: 4,
  },
  promoTitleContainer: {
    zIndex: 3,
  },
  promoBottom: {
    marginTop: -60,
    zIndex: 2,
  },
  promoBackground9: {
    width: 250,
  },
  promoInspire: {
    position: 'absolute',
    top: 60,
    right: 30,
    transform: [{ rotate: '-2deg' }],
  },
});
