import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'en-US': {
    translation: {
      tabs: {
        today: 'Today',
        journey: 'Journey',
        explore: 'Explore',
        companion: 'Companion',
        profile: 'Profile',
      },
      placeholder: {
        today: 'Daily tasks coming soon',
        explore: 'Explore content coming soon',
        companion: 'AI companion coming soon',
        profile: 'Profile settings coming soon',
      },
      journey: {
        continue: 'Continue',
        start: 'Start',
        reading: 'Reading',
        practice: 'Practice',
        exploreTitle: "You'll explore:",
        scrollUp: 'Scroll up',
        scrollDown: 'Scroll down',
      },
      lesson: {
        startSession: 'Start session',
        completeSession: 'Complete session',
        sessionComplete: 'Session complete!',
        sessionCompleteDesc:
          'Great job completing this session. You are one step further in your goal.',
        rateExperience: 'Please rate your experience',
        continue: 'Continue',
        mins: '{{count}} mins',
        close: 'Close',
      },
      profile: {
        language: 'Language',
        english: 'English',
        chinese: '中文',
        stars: 'Stars',
      },
    },
  },
  'zh-CN': {
    translation: {
      tabs: {
        today: '今日',
        journey: '旅程',
        explore: '探索',
        companion: '陪伴',
        profile: '个人资料',
      },
      placeholder: {
        today: '每日任务即将上线',
        explore: '探索内容即将上线',
        companion: 'AI 陪伴即将上线',
        profile: '个人设置即将上线',
      },
      journey: {
        continue: '继续',
        start: '开始',
        reading: '阅读',
        practice: '练习',
        exploreTitle: '你将探索：',
        scrollUp: '向上滚动',
        scrollDown: '向下滚动',
      },
      lesson: {
        startSession: '开始课程',
        completeSession: '完成课程',
        sessionComplete: '课程完成！',
        sessionCompleteDesc: '恭喜你完成本次课程，你离目标又近了一步。',
        rateExperience: '请为本次体验评分',
        continue: '继续',
        mins: '{{count}} 分钟',
        close: '关闭',
      },
      profile: {
        language: '语言',
        english: 'English',
        chinese: '中文',
        stars: '星星',
      },
    },
  },
};

const initialLocale = 'zh-CN';

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: 'zh-CN',
  interpolation: { escapeValue: false },
});

export default i18n;
