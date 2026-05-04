import { WebView } from '@components/WebView';

type Props = {
  content: string;
};

export const SlideQuestion = ({ content }: Props) => <WebView html={content} />;
