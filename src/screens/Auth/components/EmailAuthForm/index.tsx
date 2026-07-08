import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { authApi, extractLocalAuthResponse, LocalAuthResponse } from '@API/auth';
import { showApiErrorToast } from '@API/extra/getApiErrorMessage';
import { Button } from '@components/Button';
import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';
import { TextField } from '@components/TextField';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { useUserStore } from '@stores/userStore';
import { ACCESS_TOKEN } from '@keychain/extra/constants';
import { keychain } from '@keychain/index';

import BackArrow from '@assets/images/backArrow.svg';

type AuthEmailMode = 'login' | 'register' | 'forgot' | 'reset';

type Props = {
  onClose: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailAuthForm = ({ onClose }: Props) => {
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const getUser = useUserStore(s => s.getUser);
  const getTotalScore = useUserStore(s => s.getTotalScore);

  const [mode, setMode] = useState<AuthEmailMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const resetLoginRegisterFields = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const switchMode = (nextMode: AuthEmailMode) => {
    const shouldResetForm =
      (mode === 'login' && nextMode === 'register') ||
      (mode === 'register' && nextMode === 'login');

    Keyboard.dismiss();

    if (shouldResetForm) {
      resetLoginRegisterFields();
    }

    setMode(nextMode);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleBack = () => {
    if (mode === 'login') {
      onClose();
      return;
    }

    if (mode === 'reset') {
      switchMode('forgot');
      setCode('');
      setNewPassword('');
      return;
    }

    switchMode('login');
  };

  const validateEmail = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      Toast.show({
        type: 'error',
        text1: t('invalidEmail'),
      });
      return null;
    }

    return trimmedEmail;
  };

  const completeAuth = async (
    token: string,
    userFromResponse?: LocalAuthResponse['user'],
  ) => {
    await keychain.setItem(ACCESS_TOKEN, token);

    if (userFromResponse) {
      useUserStore.setState({ user: userFromResponse });
      await getTotalScore();
      return;
    }

    await getUser();
  };

  const handleLogin = async () => {
    const trimmedEmail = validateEmail();
    if (!trimmedEmail) return;

    if (!password) {
      Toast.show({
        type: 'error',
        text1: t('enterPassword'),
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await authApi.login({
        email: trimmedEmail,
        password,
      });
      const authData = extractLocalAuthResponse(response);

      if (!authData?.token) {
        Toast.show({
          type: 'error',
          text1: t('somethingWentWrong'),
        });
        return;
      }

      await completeAuth(authData.token, authData.user);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const trimmedEmail = validateEmail();
    if (!trimmedEmail) return;

    if (!password || password.length < 6) {
      Toast.show({
        type: 'error',
        text1: t('passwordMinLength'),
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await authApi.register({
        email: trimmedEmail,
        password,
        name: name.trim() || undefined,
      });
      const authData = extractLocalAuthResponse(response);

      if (!authData?.token) {
        Toast.show({
          type: 'error',
          text1: t('somethingWentWrong'),
        });
        return;
      }

      await completeAuth(authData.token, authData.user);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = validateEmail();
    if (!trimmedEmail) return;

    try {
      setIsLoading(true);
      await authApi.forgotPassword({ email: trimmedEmail });
      Toast.show({
        type: 'success',
        text1: t('resetCodeSent'),
      });
      setMode('reset');
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const trimmedEmail = validateEmail();
    if (!trimmedEmail) return;

    if (code.trim().length !== 6) {
      Toast.show({
        type: 'error',
        text1: t('enterResetCode'),
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: t('passwordMinLength'),
      });
      return;
    }

    try {
      setIsLoading(true);
      await authApi.resetPassword({
        email: trimmedEmail,
        code: code.trim(),
        password: newPassword,
      });
      Toast.show({
        type: 'success',
        text1: t('passwordResetSuccess'),
      });
      setPassword(newPassword);
      setCode('');
      setNewPassword('');
      setMode('login');
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const titleByMode: Record<AuthEmailMode, string> = {
    login: t('emailLoginTitle'),
    register: t('emailRegisterTitle'),
    forgot: t('forgotPasswordTitle'),
    reset: t('resetPasswordTitle'),
  };

  const submitByMode: Record<AuthEmailMode, () => void> = {
    login: handleLogin,
    register: handleRegister,
    forgot: handleForgotPassword,
    reset: handleResetPassword,
  };

  const submitTitleByMode: Record<AuthEmailMode, string> = {
    login: t('signIn'),
    register: t('register'),
    forgot: t('sendCode'),
    reset: t('resetPassword'),
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          bounces={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: top + DEFAULT_SPACE,
              paddingBottom: bottom + 32,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backButton} onPress={handleBack}>
            <BackArrow height={16} width={16} />
          </Pressable>

          <Text bold marginBottom={24} size={24}>
            {titleByMode[mode]}
          </Text>

          <View style={styles.form}>
            <TextField
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.field}
              keyboardType="email-address"
              label={t('email')}
              placeholder={t('emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
            />

            {mode === 'register' && (
              <TextField
                autoCapitalize="words"
                containerStyle={styles.field}
                label={t('nameOptional')}
                placeholder={t('namePlaceholder')}
                value={name}
                onChangeText={setName}
              />
            )}

            {(mode === 'login' || mode === 'register') && (
              <TextField
                autoCapitalize="none"
                containerStyle={styles.field}
                label={t('password')}
                placeholder={t('passwordPlaceholder')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            )}

            {mode === 'reset' && (
              <>
                <TextField
                  containerStyle={styles.field}
                  keyboardType="number-pad"
                  label={t('resetCode')}
                  maxLength={6}
                  placeholder={t('resetCodePlaceholder')}
                  value={code}
                  onChangeText={setCode}
                />

                <TextField
                  autoCapitalize="none"
                  containerStyle={styles.field}
                  label={t('newPassword')}
                  placeholder={t('passwordPlaceholder')}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </>
            )}

            {mode === 'login' && (
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.forgotLink}
                onPress={() => switchMode('forgot')}
              >
                <Text color={colors.brightPurple} size={14}>
                  {t('forgotPassword')}
                </Text>
              </Pressable>
            )}

            <Button
              disabled={isLoading}
              isLoading={isLoading}
              marginTop={8}
              title={submitTitleByMode[mode]}
              onPress={submitByMode[mode]}
            />
          </View>

          {mode === 'login' && (
            <View style={styles.footerLink}>
              <Text size={14}>{t('noAccount')} </Text>
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => switchMode('register')}
              >
                <Text color={colors.brightPurple} size={14}>
                  {t('register')}
                </Text>
              </Pressable>
            </View>
          )}

          {mode === 'register' && (
            <View style={styles.footerLink}>
              <Text size={14}>{t('alreadyHaveAccount')} </Text>
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => switchMode('login')}
              >
                <Text color={colors.brightPurple} size={14}>
                  {t('signIn')}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brightBeige,
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
    marginBottom: 24,
  },
  form: {
    gap: DEFAULT_SPACE,
  },
  field: {
    marginBottom: 0,
  },
  forgotLink: {
    alignSelf: 'flex-end',
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },
});
