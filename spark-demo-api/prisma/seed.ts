import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function buildLongContent(locale: 'en-US' | 'zh-CN'): string {
  if (locale === 'zh-CN') {
  const sections = [
    `<h2>接下来会发生什么</h2>
<p>感谢你以真诚的态度参与这段旅程。当我们能够诚实地回应自己时，才能更好地根据你的需求定制疗愈计划。接下来，我们将从理解过去转向一种结构化的认知行为疗法（CBT）方法，重点关注你的想法、情绪和行为。</p>
<ul>
<li>探索自动化思维模式</li>
<li>理解想法与感受之间的相互作用</li>
<li>将注意力转向改变行动和反应方式</li>
</ul>`,
    `<h2>Spark 是你的自我发现伙伴</h2>
<p>我们深受你致力于自我提升和个人成长的承诺所鼓舞。接下来最具挑战性的部分，将是在整个体验过程中保持你的专注与坚持。请相信——这个计划由我们的专家团队精心设计，旨在帮助你实现目标。</p>
<p>在接下来的几周里，我们将一起探索过去的经历如何仍在塑造你当前的现实，并支持你走上疗愈与转化的道路。当你审视自己的思维习惯、感受和行为时，你也将培养增强韧性、拥抱新可能、促进内心平静的技能。</p>`,
    `<h2>疗愈需要时间与耐心</h2>
<p>创伤的影响往往比我们意识到的更为深远。它可能表现为焦虑、抑郁、人际关系困难，或是对自身价值的怀疑。重要的是要明白，这些反应都是正常的，是心灵在试图保护自己。通过系统化的学习和练习，你可以逐步重建内心的安全感。</p>
<p>每一次阅读、每一次反思、每一次小小的行动，都是在为你的康复添砖加瓦。不要急于求成，也不要因为暂时的反复而否定自己的进步。疗愈从来不是一条直线，而是螺旋上升的过程。</p>`,
    `<h2>认知行为疗法的核心原则</h2>
<p>CBT 认为，我们的想法、情绪和行为三者相互影响。一个消极的自动化思维可能引发强烈的负面情绪，进而导致回避或消极的行为，而这些行为又会强化原有的消极思维，形成恶性循环。</p>
<ol>
<li><strong>识别自动化思维</strong>：注意那些突然出现的、未经审视的想法。</li>
<li><strong>检验思维的真实性</strong>：这些想法有多少证据支持？有多少证据反对？</li>
<li><strong>重构更平衡的思维</strong>：尝试用更现实、更富有同情心的方式看待同一件事。</li>
<li><strong>采取与价值观一致的行动</strong>：即使情绪尚未完全好转，也可以迈出小小的一步。</li>
</ol>`,
    `<h2>自我关怀的重要性</h2>
<p>许多经历过创伤的人习惯于苛责自己，认为"我应该早就走出来了"或"别人都能做到，为什么我不行"。请停下来，想象你会如何安慰一位正在经历类似痛苦的好友——然后，将同样的温柔给予自己。</p>
<p>自我关怀不是自我放纵，而是承认痛苦的存在，并以善意回应。研究表明，自我关怀与更好的心理健康、更强的复原力以及更持久的行为改变密切相关。</p>`,
    `<h2>建立安全感</h2>
<p>在开始深入探索之前，我们需要先建立一个内在的安全基地。这可能包括：找到一个安静的角落、做几次深呼吸、感受双脚踩在地面上的踏实感，或者回忆一个让你感到被接纳的时刻。</p>
<p>如果在阅读过程中感到不适，请随时暂停。你可以点击关闭按钮，回到地图，稍后再继续。你的节奏，由你掌控。</p>`,
    `<h2>与身体重新连接</h2>
<p>创伤常常让我们与身体的感觉脱节。我们可能会忽视饥饿、疲劳或紧张的信号，或者相反，被身体的警觉反应所淹没。重新连接身体，是疗愈的重要一环。</p>
<p>尝试在每天固定的时间做一件简单的事：伸展身体、散步五分钟、喝一杯温水，或者只是静静地感受呼吸的起伏。这些微小的仪式，是在告诉你的身体：现在是安全的。</p>`,
    `<h2>关系与边界</h2>
<p>创伤往往发生在关系之中，因此疗愈也需要在关系中进行——首先是与自己的关系，然后是与他人的关系。学会设定健康的边界，并不意味着自私，而是对自己和他人负责。</p>
<p>你可以开始观察：哪些关系让你感到被尊重和支持？哪些互动让你感到耗竭？你不必一次性做出剧烈的改变，但你可以从一次温和的"不"开始。</p>`,
    `<h2>记录与反思</h2>
<p>许多来访者发现，记录自己的想法和感受有助于看清模式。你不需要写得完美，只需诚实地记录。今天有什么触动你？你注意到了哪些想法？你的身体有什么感觉？</p>
<p>随着时间的推移，这些记录会成为你成长的见证。当你感到沮丧时，翻阅过去的笔记，你可能会惊讶于自己已经走了多远。</p>`,
    `<h2>我们为你感到骄傲</h2>
<p>能够坐在这里，打开这个课程，本身就需要勇气。无论你的过去经历了什么，你选择向前看，这值得被认可。我们为你感到骄傲，也希望你为自己感到骄傲。</p>
<p>我为自己能够迈出这一步而感到骄傲。我值得被温柔对待，也值得拥有更平静、更充实的生活。这不是奢望，而是我应得的权利。</p>
<p>当你准备好时，请点击下方按钮完成本次课程。你的旅程，才刚刚开始。</p>`,
  ];
    return sections.join('\n');
  }

  const sections = [
    `<h2>What happens next</h2>
<p>Thank you for showing up with honesty — when you respond genuinely, we can better tailor your Plan to your needs. Moving forward, we will shift from understanding the past toward a structured Cognitive-Behavioral Therapy (CBT) approach that focuses on your thoughts, emotions, and behaviors.</p>
<ul>
<li>Exploring automatic thinking patterns</li>
<li>Looking at the interplay between thoughts and feelings</li>
<li>Turning focus toward changing actions and reactions</li>
</ul>`,
    `<h2>Spark is your self-discovery companion</h2>
<p>We are truly inspired by your commitment to self-improvement and personal development. The most demanding aspect moving forward will be sustaining your dedication across this entire experience. Be confident — this Plan has been developed by our expert team with the specific purpose of helping you achieve your goals.</p>
<p>Over the upcoming weeks, we will collaborate to explore how experiences from your past remain active in shaping your current reality, and we will support you through a transformative path toward healing. While you investigate your thinking habits, feelings, and actions, you will also be building skills that strengthen resilience, encourage openness to new possibilities, and promote inner peace.</p>`,
    `<h2>Healing takes time and patience</h2>
<p>The impact of trauma often runs deeper than we realize. It may show up as anxiety, depression, relationship difficulties, or doubts about your own worth. It is important to understand that these responses are normal — they are your mind's way of trying to protect you. Through systematic learning and practice, you can gradually rebuild an inner sense of safety.</p>
<p>Every reading, every reflection, every small action adds another brick to your recovery. Do not rush, and do not dismiss your progress because of temporary setbacks. Healing is never a straight line — it is a spiral that moves upward over time.</p>`,
    `<h2>Core principles of CBT</h2>
<p>CBT holds that our thoughts, emotions, and behaviors influence one another. A negative automatic thought can trigger intense emotions, which may lead to avoidance or unhelpful behaviors — and those behaviors, in turn, reinforce the original thought, creating a vicious cycle.</p>
<ol>
<li><strong>Identify automatic thoughts</strong>: Notice ideas that appear suddenly, without examination.</li>
<li><strong>Test the evidence</strong>: How much support do these thoughts have? What contradicts them?</li>
<li><strong>Reframe with balance</strong>: Try to view the same situation in a more realistic, compassionate way.</li>
<li><strong>Act in line with your values</strong>: Even when emotions have not fully shifted, you can still take a small step forward.</li>
</ol>`,
    `<h2>The importance of self-compassion</h2>
<p>Many people who have experienced trauma are used to being harsh with themselves, thinking "I should have moved on by now" or "Others can do it — why can't I?" Pause for a moment and imagine how you would comfort a close friend going through similar pain — then offer yourself that same kindness.</p>
<p>Self-compassion is not self-indulgence. It means acknowledging suffering and responding with care. Research links self-compassion to better mental health, stronger resilience, and more lasting behavior change.</p>`,
    `<h2>Building a sense of safety</h2>
<p>Before diving into deeper exploration, we need to establish an inner safe base. This might mean finding a quiet corner, taking a few deep breaths, feeling your feet on the ground, or recalling a moment when you felt accepted.</p>
<p>If you feel uncomfortable while reading, you can pause at any time. Tap the close button, return to the map, and continue later. Your pace is yours to set.</p>`,
    `<h2>Reconnecting with your body</h2>
<p>Trauma often disconnects us from bodily sensations. We may ignore signals of hunger, fatigue, or tension — or feel overwhelmed by alertness in the body. Reconnecting with your body is a vital part of healing.</p>
<p>Try one simple ritual at a regular time each day: stretch, walk for five minutes, drink a glass of water, or simply notice your breath. These small acts tell your body: you are safe now.</p>`,
    `<h2>Relationships and boundaries</h2>
<p>Because trauma frequently occurs within relationships, healing also happens in relationship — first with yourself, then with others. Learning to set healthy boundaries is not selfish; it is a form of care for yourself and others.</p>
<p>Start by observing: which relationships feel respectful and supportive? Which interactions leave you drained? You do not need drastic changes overnight — you can begin with one gentle "no."</p>`,
    `<h2>Journaling and reflection</h2>
<p>Many people find that writing down thoughts and feelings helps reveal patterns. Your notes do not need to be perfect — only honest. What touched you today? What thoughts did you notice? What did your body feel?</p>
<p>Over time, these records become evidence of growth. When you feel discouraged, look back and you may be surprised by how far you have come.</p>`,
    `<h2>We are proud of you, too</h2>
<p>Simply being here and opening this lesson takes courage. Whatever your past holds, choosing to move forward deserves recognition. We are proud of you — and we hope you can feel proud of yourself as well.</p>
<p><em>I am proud of myself for taking this step. I deserve kindness, and I deserve a calmer, fuller life. This is not a luxury — it is my right.</em></p>
<p>When you are ready, tap the button below to complete this session. Your journey is only beginning — and every step you take matters more than you know.</p>`,
  ];

  return sections.join('\n');
}

async function main() {
  await prisma.userLessonProgress.deleteMany();
  await prisma.lessonTranslation.deleteMany();
  await prisma.chapterTranslation.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.userProfile.deleteMany();

  const user = await prisma.userProfile.create({
    data: { id: 1, stars: 0, locale: 'zh-CN' },
  });

  const chapter1 = await prisma.chapter.create({
    data: { sortOrder: 1, slug: 'introduction' },
  });

  const chapter2 = await prisma.chapter.create({
    data: { sortOrder: 2, slug: 'thinking' },
  });

  const chapterData = [
    {
      chapter: chapter1,
      en: {
        title: 'Introduction',
        label: 'CHAPTER 1',
        description: 'Your first steps on the healing journey.',
        bullets: [
          'What truly brought you here',
          'The core unhelpful patterns holding you back',
          "How we'll work together to build a happier, fuller life",
        ],
      },
      zh: {
        title: '入门',
        label: '第 1 章',
        description: '疗愈之旅的第一步。',
        bullets: [
          '是什么真正把你带到这里',
          '阻碍你的核心不良模式',
          '我们将如何一起构建更快乐、更充实的生活',
        ],
      },
    },
    {
      chapter: chapter2,
      en: {
        title: 'Thinking',
        label: 'CHAPTER 2',
        description: 'Explore how thoughts shape your experience.',
        bullets: [
          'Automatic thoughts and triggers',
          'Thought-feeling connections',
          'Practical reframing techniques',
        ],
      },
      zh: {
        title: '思维',
        label: '第 2 章',
        description: '探索思维如何塑造你的体验。',
        bullets: [
          '自动化思维与触发因素',
          '思维与感受的联结',
          '实用的重构技巧',
        ],
      },
    },
  ];

  for (const item of chapterData) {
    for (const locale of ['en-US', 'zh-CN'] as const) {
      const t = locale === 'en-US' ? item.en : item.zh;
      await prisma.chapterTranslation.create({
        data: {
          chapterId: item.chapter.id,
          locale,
          title: t.title,
          label: t.label,
          description: t.description,
          bullets: JSON.stringify(t.bullets),
        },
      });
    }
  }

  const lessonsCh1 = [
    {
      sortOrder: 1,
      type: 'reading',
      en: {
        title: 'Welcome to your personalized journey of healing from trauma',
        subtitle: 'part 1/4',
      },
      zh: {
        title: '欢迎踏上你的个性化创伤疗愈之旅',
        subtitle: '第 1/4 部分',
      },
      longContent: true,
    },
    {
      sortOrder: 2,
      type: 'reading',
      en: {
        title: 'Understanding Childhood Trauma?',
        subtitle: 'Reading',
      },
      zh: {
        title: '理解童年创伤？',
        subtitle: '阅读',
      },
    },
    {
      sortOrder: 3,
      type: 'practice',
      en: { title: 'Grounding Exercise', subtitle: 'Practice' },
      zh: { title: '接地练习', subtitle: '练习' },
    },
    {
      sortOrder: 4,
      type: 'reading',
      en: { title: 'Building Your Safe Base', subtitle: 'part 4/4' },
      zh: { title: '建立你的安全基地', subtitle: '第 4/4 部分' },
    },
  ];

  const lessonsCh2 = [
  { sortOrder: 1, type: 'reading', en: { title: 'Automatic Thoughts', subtitle: 'Reading' }, zh: { title: '自动化思维', subtitle: '阅读' } },
  { sortOrder: 2, type: 'reading', en: { title: 'Thought Records', subtitle: 'Reading' }, zh: { title: '思维记录', subtitle: '阅读' } },
  { sortOrder: 3, type: 'practice', en: { title: 'Reframing Practice', subtitle: 'Practice' }, zh: { title: '重构练习', subtitle: '练习' } },
  ];

  const shortContent = (locale: 'en-US' | 'zh-CN', title: string) =>
    locale === 'en-US'
      ? `<p>This lesson introduces <strong>${title}</strong>. Continue reading to explore key concepts and practical steps for your healing journey.</p>`
      : `<p>本课程介绍<strong>${title}</strong>。继续阅读以探索疗愈之旅的关键概念与实践步骤。</p>`;

  const allLessons: { chapterId: number; sortOrder: number; type: string; en: { title: string; subtitle: string }; zh: { title: string; subtitle: string }; longContent?: boolean }[] = [
    ...lessonsCh1.map((l) => ({ ...l, chapterId: chapter1.id })),
    ...lessonsCh2.map((l) => ({ ...l, chapterId: chapter2.id })),
  ];

  let firstLessonId: number | null = null;

  for (const lesson of allLessons) {
    const created = await prisma.lesson.create({
      data: {
        chapterId: lesson.chapterId,
        sortOrder: lesson.sortOrder,
        type: lesson.type,
        durationMin: 3,
        starReward: 1,
      },
    });

    if (!firstLessonId) firstLessonId = created.id;

    for (const locale of ['en-US', 'zh-CN'] as const) {
      const t = locale === 'en-US' ? lesson.en : lesson.zh;
      const content = lesson.longContent
        ? buildLongContent(locale)
        : shortContent(locale, t.title);

      await prisma.lessonTranslation.create({
        data: {
          lessonId: created.id,
          locale,
          title: t.title,
          subtitle: t.subtitle,
          content,
        },
      });
    }

    const status =
      created.id === firstLessonId ? 'available' : 'locked';

    await prisma.userLessonProgress.create({
      data: {
        userId: user.id,
        lessonId: created.id,
        status,
      },
    });
  }

  const enContent = buildLongContent('en-US');
  console.log(`Seed complete. Lesson 1 EN content length: ${enContent.length} chars`);
  console.log(`Chapters: 2, Lessons: ${allLessons.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
